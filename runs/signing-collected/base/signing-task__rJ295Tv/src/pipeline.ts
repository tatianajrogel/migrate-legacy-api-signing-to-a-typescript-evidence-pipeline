/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Implements the scheme as finally agreed in the dossier: the decision
 * register as amended by the meeting notes (GW-041 in 04, GW-017 in 05,
 * GW-009 / GW-023 / GW-052 in 07).
 *
 * Reads a JSON array of request records on stdin and writes one compact
 * evidence object per record to stdout as NDJSON. Records with an
 * Authorization header are verified; all others are signed (GW-049).
 * Pure local computation over the request and key material (GW-055).
 */

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";

// Active roster, per captures/legacy-signer.{strace,lsof}: only these key
// files were ever opened. Anything else in KEY_DIR (e.g. gw-legacy-99) is
// retired and must be rejected, never used (GW-038).
const ACTIVE_ROSTER: readonly string[] = ["gw-prod-01", "gw-prod-02"];

// GW-047: exactly `GW-HMAC-SHA256 keyId=<id>, signature=<hex>`.
const AUTH_RE = /^GW-HMAC-SHA256 keyId=([^\s,]+), signature=([0-9a-f]{64})$/;

interface InputRecord {
  method: string;
  target: string;
  headers?: Array<[string, string]>;
  body?: string | null;
}

type Reason =
  | "missing-key-id"
  | "unknown-key-id"
  | "signature-mismatch"
  | "malformed-authorization";

interface Evidence {
  seq: number;
  key_id: string;
  method: string;
  path: string;
  outcome: "signed" | "verified" | "rejected";
  signature: string;
  canonical_sha256: string;
  reason?: Reason;
}

const keyCache = new Map<string, Buffer>();

function loadKey(keyId: string): Buffer | null {
  if (!ACTIVE_ROSTER.includes(keyId)) return null;
  let key = keyCache.get(keyId);
  if (key === undefined) {
    const raw = readFileSync(`${KEY_DIR}/${keyId}.key`);
    // The legacy signer used the file contents minus the trailing line ending.
    let end = raw.length;
    if (end > 0 && raw[end - 1] === 0x0a) end--;
    if (end > 0 && raw[end - 1] === 0x0d) end--;
    key = raw.subarray(0, end);
    keyCache.set(keyId, key);
  }
  return key;
}

// Bytewise comparison of UTF-8 encodings (GW-031, GW-017 as amended).
function byteCompare(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

function splitTarget(target: string): { path: string; query: string } {
  const q = target.indexOf("?");
  return q === -1
    ? { path: target, query: "" }
    : { path: target.slice(0, q), query: target.slice(q + 1) };
}

// GW-015, GW-019, GW-017 as amended in 05: sort by name, then value, on the
// already-encoded text; no decoding.
function canonicalQuery(query: string): string {
  if (query === "") return "";
  const pairs = query.split("&").map((p): [string, string] => {
    const eq = p.indexOf("=");
    return eq === -1 ? [p, ""] : [p.slice(0, eq), p.slice(eq + 1)];
  });
  pairs.sort((a, b) => byteCompare(a[0], b[0]) || byteCompare(a[1], b[1]));
  return pairs.map(([n, v]) => `${n}=${v}`).join("&");
}

// GW-041 as amended in 04: trim spaces/tabs, collapse internal runs to one space.
function foldValue(v: string): string {
  return v.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ");
}

function canonicalRequest(rec: InputRecord, headers: Array<[string, string]>): string {
  const { path, query } = splitTarget(rec.target);

  // GW-023 as amended in 07: every header except authorization is signed.
  const signed = headers
    .map(([n, v]): [string, string] => [n.toLowerCase(), foldValue(v)])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => byteCompare(a[0], b[0]));

  // GW-009 as amended in 07: always the SHA-256 of the body bytes.
  const bodyHash = createHash("sha256").update(rec.body ?? "", "utf8").digest("hex");

  // GW-011; GW-052 as amended in 07: no trailing newline.
  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery(query),
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    bodyHash,
  ].join("\n");
}

function hmacHex(key: Buffer, canonical: string): string {
  return createHmac("sha256", key).update(canonical, "utf8").digest("hex");
}

function evaluate(rec: InputRecord, seq: number): Evidence {
  const headers = rec.headers ?? [];
  const keyId = headers.find(([n]) => n.toLowerCase() === "x-gw-key-id")?.[1] ?? "";
  const authHeaders = headers.filter(([n]) => n.toLowerCase() === "authorization");
  const canonical = canonicalRequest(rec, headers);

  const ev: Evidence = {
    seq,
    key_id: keyId,
    method: rec.method.toUpperCase(),
    path: splitTarget(rec.target).path,
    outcome: "rejected",
    signature: "",
    canonical_sha256: createHash("sha256").update(canonical, "utf8").digest("hex"),
  };
  const reject = (reason: Reason): Evidence => ({ ...ev, outcome: "rejected", reason });

  if (keyId === "") return reject("missing-key-id");
  const key = loadKey(keyId);
  if (key === null) return reject("unknown-key-id");

  if (authHeaders.length === 0) {
    return { ...ev, outcome: "signed", signature: hmacHex(key, canonical) };
  }

  // Verify. The Authorization header must be well formed, unique, and name
  // the same key as x-gw-key-id.
  const m = authHeaders.length === 1 ? AUTH_RE.exec(authHeaders[0][1]) : null;
  if (m === null || m[1] !== keyId) return reject("malformed-authorization");

  const expected = hmacHex(key, canonical);
  const ok = timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(m[2], "utf8"));
  return ok
    ? { ...ev, outcome: "verified", signature: expected }
    : { ...ev, outcome: "rejected", signature: expected, reason: "signature-mismatch" };
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out = records.map((rec, i) => `${JSON.stringify(evaluate(rec, i + 1))}\n`);
  process.stdout.write(out.join(""));
}

main();
