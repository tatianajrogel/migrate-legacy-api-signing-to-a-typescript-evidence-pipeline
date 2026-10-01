/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Implements the inbound request scheme as frozen on 2025-12-02 and live from
 * the 2025-12-09 rollout. The decision register (dossier/01) is the starting
 * point only; the session notes and appendices change it as follows:
 *
 * - Signed headers: every header except `authorization` (agreed 2025-12-02,
 *   all 5 partner sign-offs in by 2025-12-04, inside the 2025-12-05 deadline).
 * - Header values: spaces and tabs stripped from each end and inner runs
 *   collapsed to one space (2025-11-04 item, re-attributed to inbound signing
 *   by the 2025-11-11 correction). The 2025-11-25 lowercasing item failed its
 *   load test (2.6 ms at p99 against a 2 ms limit).
 * - Signed header name list: still joined with `;` (the 2025-11-25 `,` item
 *   was corrected away to the mesh signer on 2025-12-02).
 * - Query order: by name, then by value, raw bytes, nothing decoded (brought
 *   in line with BX-HMAC-SHA256 as it stood on 2025-11-11).
 * - Valueless query parameters: written with a trailing `=` (the bare-name
 *   trial was backed out at the freeze).
 * - Body hash: always SHA-256 of the body bytes, an absent body hashed as
 *   zero length (effective with SDK 3.2.1, GA 2025-12-01).
 * - String to sign: no trailing LF (decided at the freeze).
 * - Path: as received. Dot-segment collapsing waits for SDK 3.3 (GA
 *   2026-01-13); percent escapes are untouched because the proxy captures
 *   showed escapes pass through unchanged.
 * - Key id: matched exactly as sent (the case-insensitive change missed its
 *   2025-12-01 sign-off deadline).
 *
 * Keys: the legacy signer loads only gw-prod-01 and gw-prod-02 and keys its
 * HMAC with 32 bytes of each 33-byte file, i.e. with the trailing line ending
 * stripped. gw-prod-03 belongs to the export signer until the Q1 rotation.
 */

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";
const ACTIVE_ROSTER: ReadonlySet<string> = new Set(["gw-prod-01", "gw-prod-02"]);
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

function compareBytes(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

function loadKey(keyId: string): Buffer | null {
  if (!ACTIVE_ROSTER.has(keyId)) return null;
  let raw: Buffer;
  try {
    raw = readFileSync(`${KEY_DIR}/${keyId}.key`);
  } catch {
    return null;
  }
  let end = raw.length;
  if (end > 0 && raw[end - 1] === 0x0a) end--;
  if (end > 0 && raw[end - 1] === 0x0d) end--;
  return raw.subarray(0, end);
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
  pairs.sort((a, b) => compareBytes(a[0], b[0]) || compareBytes(a[1], b[1]));
  return pairs.map(([n, v]) => `${n}=${v}`).join("&");
}

function normaliseHeaderValue(value: string): string {
  return value.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ");
}

function canonicalRequest(rec: InputRecord, headers: Array<[string, string]>): string {
  const { path, query } = splitTarget(rec.target);

  const signed = headers
    .map(([n, v]): [string, string] => [n.toLowerCase(), normaliseHeaderValue(v)])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => compareBytes(a[0], b[0]));

  const bodyHash = createHash("sha256").update(rec.body ?? "", "utf8").digest("hex");

  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery(query),
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    bodyHash,
  ].join("\n");
}

function findHeader(headers: Array<[string, string]>, name: string): string | undefined {
  return headers.find(([n]) => n.toLowerCase() === name)?.[1];
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
  const headers = (rec.headers ?? []).map(
    ([n, v]): [string, string] => [String(n), String(v)],
  );
  const keyId = findHeader(headers, "x-gw-key-id") ?? "";
  const authorization = findHeader(headers, "authorization");
  const method = rec.method.toUpperCase();
  const { path } = splitTarget(rec.target);
  const canonical = canonicalRequest(rec, headers);
  const canonicalSha = createHash("sha256").update(canonical, "utf8").digest("hex");

  let signature = "";
  let reason: Reason | null = null;

  if (keyId === "") {
    reason = "missing-key-id";
  } else {
    const key = loadKey(keyId);
    if (key === null) {
      reason = "unknown-key-id";
    } else {
      signature = createHmac("sha256", key).update(canonical, "utf8").digest("hex");
      if (authorization !== undefined) {
        const prefix = `${SCHEME} keyId=${keyId}, signature=`;
        if (!authorization.startsWith(prefix)) {
          reason = "malformed-authorization";
        } else if (!signaturesEqual(authorization.slice(prefix.length).trim(), signature)) {
          reason = "signature-mismatch";
        }
      }
    }
  }

  const outcome = reason !== null
    ? "rejected"
    : authorization !== undefined ? "verified" : "signed";

  const evidence: Record<string, string | number> = {
    seq,
    key_id: keyId,
    method,
    path,
    outcome,
    signature,
    canonical_sha256: canonicalSha,
  };
  if (reason !== null) evidence.reason = reason;
  return JSON.stringify(evidence);
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out = records.map((rec, i) => `${processRecord(rec, i + 1)}\n`).join("");
  process.stdout.write(out);
}

main();
