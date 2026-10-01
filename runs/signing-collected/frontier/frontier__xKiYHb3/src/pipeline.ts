/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Implements the inbound request scheme as frozen on 2025-12-02 and live from
 * the 2025-12-09 rollout. The decision register (dossier/01) is the starting
 * point, but several of its entries were superseded by later sessions:
 *
 * - Query ordering: by name, then by value, both compared byte by byte on the
 *   raw text (2025-11-11, brought in line with BX-HMAC-SHA256 as it stood that
 *   day). Replaces GW-017.
 * - Signed headers: every header except `authorization` (2025-12-02, partner
 *   sign-off complete 2025-12-04). Replaces GW-023.
 * - Header values: spaces and tabs stripped from both ends, inner runs
 *   collapsed to one space (2025-11-04, per the 2025-11-11 correction). The
 *   lowercasing proposal of 2025-11-25 failed its load test. Replaces GW-041.
 * - Body hash: always hex SHA-256 of the body, a missing body hashed as empty
 *   (2025-11-25, effective with SDK 3.2.1, GA 2025-12-01). Replaces GW-009.
 * - String to sign: no trailing LF after the last field (2025-12-02).
 *   Replaces GW-052.
 *
 * Unchanged from the register: path and escapes signed as received (the dot
 * segment change waits for SDK 3.3; the proxy does not rewrite escapes),
 * valueless parameters written `name=` (the bare name trial was backed out),
 * signed header names joined with `;`, key id matched exactly.
 *
 * Keys: only gw-prod-01 and gw-prod-02 are on the roster (gw-prod-03 belongs
 * to the export signer until the Q1 rotation). The legacy signer strips the
 * line ending from the key file: 33-byte files, 32-byte HMAC keys.
 */

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";
const ROSTER: readonly string[] = ["gw-prod-01", "gw-prod-02"];
const SCHEME = "GW-HMAC-SHA256";

interface InputRecord {
  method: string;
  target: string;
  headers?: Array<[string, string]>;
  body?: string | null;
}

type Reason =
  | "missing-key-id"
  | "unknown-key-id"
  | "malformed-authorization"
  | "signature-mismatch";

const keyCache = new Map<string, Buffer>();

function loadKey(keyId: string): Buffer | null {
  if (!ROSTER.includes(keyId)) return null;
  let key = keyCache.get(keyId);
  if (key === undefined) {
    const raw = readFileSync(`${KEY_DIR}/${keyId}.key`);
    let end = raw.length;
    if (end > 0 && raw[end - 1] === 0x0a) end--;
    if (end > 0 && raw[end - 1] === 0x0d) end--;
    key = raw.subarray(0, end);
    keyCache.set(keyId, key);
  }
  return key;
}

function byteCompare(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

function lowerAscii(s: string): string {
  return s.replace(/[A-Z]/g, (c) => c.toLowerCase());
}

function splitTarget(target: string): { path: string; query: string } {
  const q = target.indexOf("?");
  return q === -1
    ? { path: target, query: "" }
    : { path: target.slice(0, q), query: target.slice(q + 1) };
}

function canonicalQuery(query: string): string {
  if (query === "") return "";
  const pairs = query.split("&").map((p): [string, string] => {
    const eq = p.indexOf("=");
    return eq === -1 ? [p, ""] : [p.slice(0, eq), p.slice(eq + 1)];
  });
  pairs.sort((a, b) => byteCompare(a[0], b[0]) || byteCompare(a[1], b[1]));
  return pairs.map(([n, v]) => `${n}=${v}`).join("&");
}

function canonicalValue(v: string): string {
  return v.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ");
}

function canonicalRequest(rec: InputRecord, path: string, query: string): string {
  const signed = (rec.headers ?? [])
    .map(([n, v]): [string, string] => [lowerAscii(n), canonicalValue(String(v))])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => byteCompare(a[0], b[0]));

  const body = rec.body ?? "";

  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery(query),
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    createHash("sha256").update(body, "utf8").digest("hex"),
  ].join("\n");
}

function findHeader(rec: InputRecord, name: string): string | undefined {
  return (rec.headers ?? []).find(([n]) => lowerAscii(n) === name)?.[1];
}

function signaturesEqual(presented: string, expected: string): boolean {
  const a = Buffer.from(presented, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

function evidence(rec: InputRecord, seq: number): string {
  const keyId = findHeader(rec, "x-gw-key-id") ?? "";
  const { path, query } = splitTarget(rec.target);
  const canonical = canonicalRequest(rec, path, query);
  const auth = findHeader(rec, "authorization");

  let signature = "";
  let reason: Reason | undefined;

  const key = keyId === "" ? null : loadKey(keyId);
  if (keyId === "") {
    reason = "missing-key-id";
  } else if (key === null) {
    reason = "unknown-key-id";
  } else {
    signature = createHmac("sha256", key).update(canonical, "utf8").digest("hex");
    if (auth !== undefined) {
      const prefix = `${SCHEME} keyId=${keyId}, signature=`;
      if (!auth.startsWith(prefix)) {
        reason = "malformed-authorization";
      } else if (!signaturesEqual(auth.slice(prefix.length).trim(), signature)) {
        reason = "signature-mismatch";
      }
    }
  }

  const outcome = reason !== undefined
    ? "rejected"
    : auth !== undefined ? "verified" : "signed";

  return JSON.stringify({
    seq,
    key_id: keyId,
    method: rec.method.toUpperCase(),
    path,
    outcome,
    signature,
    canonical_sha256: createHash("sha256").update(canonical, "utf8").digest("hex"),
    ...(reason !== undefined ? { reason } : {}),
  });
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out = records.map((rec, i) => `${evidence(rec, i + 1)}\n`).join("");
  process.stdout.write(out);
}

main();
