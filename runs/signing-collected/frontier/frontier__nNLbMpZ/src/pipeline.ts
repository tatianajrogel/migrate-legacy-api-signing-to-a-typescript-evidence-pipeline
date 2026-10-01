/**
 * GW-HMAC-SHA256 evidence pipeline (inbound request signing, as frozen for the
 * 2025-12-09 rollout).
 *
 * Scheme as it stood at rollout, where it differs from the decision register:
 *  - every header except `authorization` is signed (sign-offs landed by 2025-12-05)
 *  - header values: spaces/tabs trimmed from the ends, inner runs collapsed to one space
 *  - query ordered by name, then value, raw bytes, nothing decoded
 *  - body hash is always SHA-256 of the body bytes (SDK 3.2.1 GA 2025-12-01)
 *  - no trailing LF after the last field
 *  - key id matched exactly; percent escapes and path untouched
 *  - key file is used with its trailing line ending stripped (legacy signer capture)
 */

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";
// Keys the legacy request signer actually loaded (gw-prod-03 belongs to the export signer).
const ROSTER = new Set(["gw-prod-01", "gw-prod-02"]);
const SCHEME = "GW-HMAC-SHA256";

interface InputRecord {
  method: string;
  target: string;
  headers?: Array<[string, string]>;
  body?: string | null;
}

function loadKey(keyId: string): Buffer | null {
  if (!ROSTER.has(keyId)) return null;
  try {
    const raw = readFileSync(`${KEY_DIR}/${keyId}.key`);
    let end = raw.length;
    if (end > 0 && raw[end - 1] === 0x0a) end--;
    if (end > 0 && raw[end - 1] === 0x0d) end--;
    return raw.subarray(0, end);
  } catch {
    return null;
  }
}

const cmp = (a: string, b: string): number =>
  Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));

function splitTarget(target: string): { path: string; query: string } {
  const q = target.indexOf("?");
  return q === -1
    ? { path: target, query: "" }
    : { path: target.slice(0, q), query: target.slice(q + 1) };
}

function normaliseValue(v: string): string {
  return v.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ");
}

function canonicalRequest(rec: InputRecord): string {
  const { path, query } = splitTarget(rec.target);

  const pairs: Array<[string, string]> = query === "" ? [] : query.split("&").map((p) => {
    const eq = p.indexOf("=");
    return (eq === -1 ? [p, ""] : [p.slice(0, eq), p.slice(eq + 1)]) as [string, string];
  });
  pairs.sort((a, b) => cmp(a[0], b[0]) || cmp(a[1], b[1]));
  const canonicalQuery = pairs.map(([n, v]) => `${n}=${v}`).join("&");

  const signed = (rec.headers ?? [])
    .map(([n, v]) => [n.toLowerCase(), normaliseValue(v)] as [string, string])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => cmp(a[0], b[0]));

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
  return (rec.headers ?? []).find(([n]) => n.toLowerCase() === name)?.[1];
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  return ab.length === bb.length && timingSafeEqual(ab, bb);
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
      } else if (safeEqual(auth.slice(prefix.length).trim(), signature)) {
        outcome = "verified";
      } else {
        outcome = "rejected"; reason = "signature-mismatch";
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
