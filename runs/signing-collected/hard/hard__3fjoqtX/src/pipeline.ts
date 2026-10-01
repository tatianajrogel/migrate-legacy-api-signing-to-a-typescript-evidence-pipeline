/**
 * GW-HMAC-SHA256 evidence pipeline: signs or verifies each request record and
 * writes one evidence line per record. Scheme as frozen 2025-12-02.
 */

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";
// Active roster: the keys the legacy signer opened (strace/lsof). gw-prod-03
// is staged but not activated.
const ROSTER = new Set(["gw-prod-01", "gw-prod-02"]);
const SCHEME = "GW-HMAC-SHA256";

interface InputRecord {
  method: string;
  target: string;
  headers?: Array<[string, string]>;
  body?: string | null;
}

const cmp = (a: string, b: string): number =>
  Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));

function loadKey(keyId: string): Buffer | null {
  if (!ROSTER.has(keyId)) return null;
  try {
    // The gateway signer drops the line ending of the key file.
    const raw = readFileSync(`${KEY_DIR}/${keyId}.key`);
    let end = raw.length;
    if (end > 0 && raw[end - 1] === 0x0a) end--;
    return raw.subarray(0, end);
  } catch {
    return null;
  }
}

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

  const signed = (rec.headers ?? [])
    .map(([n, v]) => [
      n.toLowerCase(),
      v.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " "),
    ] as [string, string])
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

function headerValue(rec: InputRecord, name: string): string | undefined {
  return (rec.headers ?? []).find(([n]) => n.toLowerCase() === name)?.[1];
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out: string[] = [];

  records.forEach((rec, i) => {
    const keyId = headerValue(rec, "x-gw-key-id") ?? "";
    const canonical = canonicalRequest(rec);
    const key = keyId === "" ? null : loadKey(keyId);
    const signature = key === null
      ? ""
      : createHmac("sha256", key).update(canonical, "utf8").digest("hex");
    const auth = headerValue(rec, "authorization");

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
