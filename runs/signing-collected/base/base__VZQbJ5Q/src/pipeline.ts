/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * This is where the migration stalled. The legacy signer was a 900-line Perl
 * script; this port covers the plumbing but the canonicalisation was written
 * from the decision register alone, before anyone read the meeting notes.
 *
 * It runs. It produces evidence. The signatures do not match the gateway.
 */

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";

interface InputRecord {
  method: string;
  target: string;
  headers: Array<[string, string]>;
  body?: string;
}

// Active roster, per the legacy signer captures (strace/lsof): only these two
// keys were opened. gw-legacy-99 is deliberately absent. The key is the file's
// content without its trailing LF (the signature in the sample only verifies so).
const ROSTER = new Set(["gw-prod-01", "gw-prod-02"]);

function loadKey(keyId: string): Buffer | null {
  if (!ROSTER.has(keyId)) return null;
  try {
    return Buffer.from(readFileSync(`${KEY_DIR}/${keyId}.key`).toString("utf8").replace(/\r?\n$/, ""), "utf8");
  } catch {
    return null;
  }
}

const cmp = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);
const fold = (v: string): string =>
  v.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ");

function splitTarget(target: string): [string, string] {
  const q = target.indexOf("?");
  return q === -1 ? [target, ""] : [target.slice(0, q), target.slice(q + 1)];
}

function canonicalRequest(rec: InputRecord): string {
  const [path, query] = splitTarget(rec.target);

  const pairs: Array<[string, string]> = query === "" ? [] : query.split("&").map((p) => {
    const eq = p.indexOf("=");
    return (eq === -1 ? [p, ""] : [p.slice(0, eq), p.slice(eq + 1)]) as [string, string];
  });
  pairs.sort((a, b) => cmp(a[0], b[0]) || cmp(a[1], b[1]));
  const canonicalQuery = pairs.map(([n, v]) => `${n}=${v}`).join("&");

  const signed = rec.headers
    .map(([n, v]) => [n.toLowerCase(), fold(v)] as [string, string])
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

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out: string[] = [];

  records.forEach((rec, i) => {
    const headers = rec.headers ?? [];
    rec.headers = headers;
    const keyId = headers.find(([n]) => n.toLowerCase() === "x-gw-key-id")?.[1] ?? "";
    const auth = headers.find(([n]) => n.toLowerCase() === "authorization")?.[1];
    const canonical = canonicalRequest(rec);
    const key = keyId === "" ? null : loadKey(keyId);
    const signature = key === null
      ? ""
      : createHmac("sha256", key).update(canonical, "utf8").digest("hex");

    let outcome: "signed" | "verified" | "rejected" = auth === undefined ? "signed" : "verified";
    let reason: string | undefined;
    const prefix = `GW-HMAC-SHA256 keyId=${keyId}, signature=`;
    if (keyId === "") {
      reason = "missing-key-id";
    } else if (key === null) {
      reason = "unknown-key-id";
    } else if (auth !== undefined) {
      if (!auth.startsWith(prefix)) {
        reason = "malformed-authorization";
      } else {
        const presented = Buffer.from(auth.slice(prefix.length).trim(), "utf8");
        const expected = Buffer.from(signature, "utf8");
        if (presented.length !== expected.length || !timingSafeEqual(presented, expected)) {
          reason = "signature-mismatch";
        }
      }
    }
    if (reason !== undefined) outcome = "rejected";

    const ev: Record<string, unknown> = {
      seq: i + 1,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      path: splitTarget(rec.target)[0],
      outcome,
      signature,
      canonical_sha256: createHash("sha256").update(canonical, "utf8").digest("hex"),
    };
    if (reason !== undefined) ev.reason = reason;
    out.push(JSON.stringify(ev));
  });

  process.stdout.write(out.map((l) => `${l}\n`).join(""));
}

main();
