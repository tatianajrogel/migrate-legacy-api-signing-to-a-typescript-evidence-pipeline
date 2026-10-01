/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Scheme as it stood at the 2025-12-09 rollout (see dossier session notes,
 * which supersede the decision register where they differ). Pure local
 * computation: no network access.
 */

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";
// Active roster: the keys the legacy signer actually loaded (strace/lsof).
const ROSTER = new Set(["gw-prod-01", "gw-prod-02"]);
const SCHEME = "GW-HMAC-SHA256";

interface InputRecord {
  method: string;
  target: string;
  headers: Array<[string, string]>;
  body?: string | null;
}

function loadKey(keyId: string): Buffer | null {
  if (!ROSTER.has(keyId)) return null;
  try {
    // The legacy signer chomps the line ending off the key file.
    const raw = readFileSync(`${KEY_DIR}/${keyId}.key`);
    return Buffer.from(raw.toString("latin1").replace(/\r?\n$/, ""), "latin1");
  } catch {
    return null;
  }
}

const byteCmp = (a: string, b: string): number =>
  Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));

function normaliseValue(v: string): string {
  return v.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ");
}

function splitTarget(target: string): { path: string; query: string } {
  const q = target.indexOf("?");
  return q === -1
    ? { path: target, query: "" }
    : { path: target.slice(0, q), query: target.slice(q + 1) };
}

function canonicalRequest(rec: InputRecord): string {
  const { path, query } = splitTarget(rec.target);

  const pairs: Array<[string, string]> = query === "" ? [] : query.split("&").map((p) => {
    const eq = p.indexOf("=");
    return (eq === -1 ? [p, ""] : [p.slice(0, eq), p.slice(eq + 1)]) as [string, string];
  });
  pairs.sort((a, b) => byteCmp(a[0], b[0])); // stable: repeated names keep arrival order
  const canonicalQuery = pairs.map(([n, v]) => `${n}=${v}`).join("&");

  const signed = rec.headers
    .map(([n, v]) => [n.toLowerCase(), normaliseValue(v)] as [string, string])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => byteCmp(a[0], b[0]));

  const bodyHash = createHash("sha256").update(rec.body ?? "", "utf8").digest("hex");

  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery,
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    bodyHash,
  ].join("\n");
}

function header(rec: InputRecord, name: string): string | undefined {
  return rec.headers.find(([n]) => n.toLowerCase() === name)?.[1];
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out: string[] = [];

  records.forEach((rec, i) => {
    const keyId = header(rec, "x-gw-key-id") ?? "";
    const canonical = canonicalRequest(rec);
    const canonicalSha = createHash("sha256").update(canonical, "utf8").digest("hex");
    const key = keyId === "" ? null : loadKey(keyId);
    const signature = key === null
      ? ""
      : createHmac("sha256", key).update(canonical, "utf8").digest("hex");
    const auth = header(rec, "authorization");

    let outcome: "signed" | "verified" | "rejected";
    let reason: string | undefined;
    if (keyId === "") {
      outcome = "rejected"; reason = "missing-key-id";
    } else if (key === null) {
      outcome = "rejected"; reason = "unknown-key-id";
    } else if (auth === undefined) {
      outcome = "signed";
    } else {
      const prefix = `${SCHEME} keyId=${keyId}, signature=`;
      if (!auth.startsWith(prefix)) {
        outcome = "rejected"; reason = "malformed-authorization";
      } else {
        const presented = Buffer.from(auth.slice(prefix.length).trim(), "utf8");
        const expected = Buffer.from(signature, "utf8");
        const ok = presented.length === expected.length && timingSafeEqual(presented, expected);
        if (ok) outcome = "verified";
        else { outcome = "rejected"; reason = "signature-mismatch"; }
      }
    }

    const ev: Record<string, unknown> = {
      seq: i + 1,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      path: splitTarget(rec.target).path,
      outcome,
      signature,
      canonical_sha256: canonicalSha,
    };
    if (reason !== undefined) ev.reason = reason;
    out.push(JSON.stringify(ev));
  });

  process.stdout.write(out.map((l) => `${l}\n`).join(""));
}

main();
