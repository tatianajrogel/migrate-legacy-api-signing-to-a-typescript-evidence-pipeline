/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Implements the inbound request scheme as frozen on 2025-12-02 and checked by
 * the gateway from the 2025-12-09 cutover. The decision register is the
 * starting point, but several entries were changed by later sessions:
 *
 * - Header values: spaces and tabs stripped from both ends, inner runs of
 *   spaces and tabs collapsed to one space (2025-10-14, 2025-11-04 as corrected
 *   on 2025-11-11).
 * - Signed headers: every header except `authorization` (2025-12-02, all 5
 *   partner sign-offs in by 2025-12-04).
 * - Query ordering: by name, then by value, both as raw bytes of the target
 *   text (2025-11-11, aligned with export manifest signing as it stood then).
 * - Body hash: always the SHA-256 of the body, a missing body hashed as empty
 *   (2025-11-25, effective with SDK 3.2.1, GA 2025-12-01).
 * - String to sign: no trailing line feed (2025-12-02).
 *
 * Unchanged from the register: valueless parameters get a trailing `=` (the
 * 2025-11-04 trial was backed out), `;` name list separator, the path is signed
 * as received, percent escapes are left in the case they arrive in, and the key
 * id is matched exactly.
 *
 * Keys: the legacy signer loads only gw-prod-01 and gw-prod-02, and the line
 * ending is not part of the key. gw-prod-03 belongs to the export signer until
 * the first quarter rotation.
 *
 * Pure local computation: no network access.
 */

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";
const ACTIVE_ROSTER: readonly string[] = ["gw-prod-01", "gw-prod-02"];
const SCHEME = "GW-HMAC-SHA256";

interface InputRecord {
  method: string;
  target: string;
  headers?: Array<[string, string]>;
  body?: string | null;
}

type Outcome = "signed" | "verified" | "rejected";
type Reason =
  | "missing-key-id"
  | "unknown-key-id"
  | "malformed-authorization"
  | "signature-mismatch";

const keyCache = new Map<string, Buffer>();

function loadKey(keyId: string): Buffer | null {
  if (!ACTIVE_ROSTER.includes(keyId)) return null;
  const cached = keyCache.get(keyId);
  if (cached !== undefined) return cached;
  let raw: Buffer;
  try {
    raw = readFileSync(`${KEY_DIR}/${keyId}.key`);
  } catch {
    return null;
  }
  let end = raw.length;
  if (end > 0 && raw[end - 1] === 0x0a) {
    end--;
    if (end > 0 && raw[end - 1] === 0x0d) end--;
  }
  const key = raw.subarray(0, end);
  keyCache.set(keyId, key);
  return key;
}

function byteCompare(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

function sha256Hex(data: string): string {
  return createHash("sha256").update(data, "utf8").digest("hex");
}

function splitTarget(target: string): { path: string; query: string } {
  const q = target.indexOf("?");
  return q === -1
    ? { path: target, query: "" }
    : { path: target.slice(0, q), query: target.slice(q + 1) };
}

function canonicalQuery(query: string): string {
  if (query === "") return "";
  const pairs = query.split("&").map((p, i) => {
    const eq = p.indexOf("=");
    const name = eq === -1 ? p : p.slice(0, eq);
    const value = eq === -1 ? "" : p.slice(eq + 1);
    return { name, value, i };
  });
  pairs.sort(
    (a, b) =>
      byteCompare(a.name, b.name) || byteCompare(a.value, b.value) || a.i - b.i,
  );
  return pairs.map(({ name, value }) => `${name}=${value}`).join("&");
}

function normaliseHeaderValue(value: string): string {
  return value.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ");
}

function canonicalRequest(rec: InputRecord, method: string, path: string): string {
  const { query } = splitTarget(rec.target);

  const signed = (rec.headers ?? [])
    .map(([n, v], i) => ({ name: n.toLowerCase(), value: v, i }))
    .filter(({ name }) => name !== "authorization")
    .sort((a, b) => byteCompare(a.name, b.name) || a.i - b.i);

  return [
    method,
    path,
    canonicalQuery(query),
    signed.map(({ name, value }) => `${name}:${normaliseHeaderValue(value)}`).join("\n"),
    signed.map(({ name }) => name).join(";"),
    sha256Hex(rec.body ?? ""),
  ].join("\n");
}

function findHeader(rec: InputRecord, name: string): string | undefined {
  return (rec.headers ?? []).find(([n]) => n.toLowerCase() === name)?.[1];
}

function signaturesEqual(presented: string, expected: string): boolean {
  const a = Buffer.from(presented, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) {
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

function processRecord(rec: InputRecord, seq: number): string {
  const keyId = findHeader(rec, "x-gw-key-id") ?? "";
  const method = rec.method.toUpperCase();
  const { path } = splitTarget(rec.target);
  const canonical = canonicalRequest(rec, method, path);
  const authorization = findHeader(rec, "authorization");

  let signature = "";
  let outcome: Outcome;
  let reason: Reason | undefined;

  const key = keyId === "" ? null : loadKey(keyId);
  if (key !== null) {
    signature = createHmac("sha256", key).update(canonical, "utf8").digest("hex");
  }

  if (keyId === "") {
    reason = "missing-key-id";
  } else if (key === null) {
    reason = "unknown-key-id";
  } else if (authorization !== undefined) {
    const prefix = `${SCHEME} keyId=${keyId}, signature=`;
    if (!authorization.startsWith(prefix)) {
      reason = "malformed-authorization";
    } else if (!signaturesEqual(authorization.slice(prefix.length).trim(), signature)) {
      reason = "signature-mismatch";
    }
  }

  if (reason !== undefined) outcome = "rejected";
  else outcome = authorization !== undefined ? "verified" : "signed";

  const evidence: Record<string, string | number> = {
    seq,
    key_id: keyId,
    method,
    path,
    outcome,
    signature,
    canonical_sha256: sha256Hex(canonical),
  };
  if (reason !== undefined) evidence.reason = reason;
  return JSON.stringify(evidence);
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out = records.map((rec, i) => `${processRecord(rec, i + 1)}\n`).join("");
  process.stdout.write(out);
}

main();
