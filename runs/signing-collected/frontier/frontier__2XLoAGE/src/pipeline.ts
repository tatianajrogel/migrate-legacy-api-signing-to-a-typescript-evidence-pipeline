/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Implements the inbound request signing scheme as frozen on 2025-12-02 and
 * live from the 2025-12-09 cutover. The decision register is the historical
 * record only; the session notes amend it. As of cutover:
 *
 * - Path and query are signed as received: no dot-segment collapsing (SDK 3.3
 *   is not GA until 2026-01-13) and no percent-escape rewriting (the proxy
 *   captures show escapes pass through byte for byte).
 * - Query parameters are ordered by name, then by value, byte for byte on the
 *   raw text (2025-11-11, in line with batch manifest signing as it then
 *   stood). A parameter with no `=` is written with a trailing `=` (the
 *   bare-name trial was backed out at the freeze).
 * - Every header except `authorization` is signed (2025-12-02, all 5 partner
 *   sign-offs in by 2025-12-04). Names are lowercased and sorted as bytes.
 * - Header values have spaces and tabs stripped from each end and every inner
 *   run of spaces and tabs collapsed to a single space (2025-11-04, corrected
 *   to GW on 2025-11-11).
 * - The signed header names are joined with `;` (the `,` item of 2025-11-25
 *   was corrected to the mesh signer).
 * - The body hash is always the hex SHA-256 of the body bytes; no body is a
 *   zero-length body (effective with SDK 3.2.1, GA 2025-12-01).
 * - The string to sign ends at the last character of the body hash, with no
 *   trailing LF (2025-12-02).
 * - Only gw-prod-01 and gw-prod-02 are on the roster; gw-prod-03 belongs to the
 *   export signer until the Q1 rotation. The key is the file's contents with
 *   its trailing line ending stripped (this is what reproduces partner
 *   signatures made under the frozen scheme).
 */

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";
const ROSTER: ReadonlySet<string> = new Set(["gw-prod-01", "gw-prod-02"]);
const SCHEME = "GW-HMAC-SHA256";

interface InputRecord {
  method: string;
  target: string;
  headers: Array<[string, string]>;
  body?: string | null;
}

type Reason =
  | "missing-key-id"
  | "unknown-key-id"
  | "malformed-authorization"
  | "signature-mismatch";

const keyCache = new Map<string, Buffer | null>();

function loadKey(keyId: string): Buffer | null {
  if (!ROSTER.has(keyId)) return null;
  if (!keyCache.has(keyId)) {
    let key: Buffer | null;
    try {
      const raw = readFileSync(`${KEY_DIR}/${keyId}.key`);
      let end = raw.length;
      if (end > 0 && raw[end - 1] === 0x0a) end--;
      if (end > 0 && raw[end - 1] === 0x0d) end--;
      key = raw.subarray(0, end);
    } catch {
      key = null;
    }
    keyCache.set(keyId, key);
  }
  return keyCache.get(keyId) ?? null;
}

function byteCompare(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
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

function normaliseHeaderValue(value: string): string {
  return value.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ");
}

function canonicalRequest(rec: InputRecord): string {
  const { path, query } = splitTarget(rec.target);

  const signed = rec.headers
    .map(([n, v]): [string, string] => [n.toLowerCase(), normaliseHeaderValue(v)])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => byteCompare(a[0], b[0]));

  const body = rec.body ?? "";
  const bodyHash = createHash("sha256").update(body, "utf8").digest("hex");

  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery(query),
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    bodyHash,
  ].join("\n");
}

function findHeader(rec: InputRecord, name: string): string | undefined {
  return rec.headers.find(([n]) => n.toLowerCase() === name)?.[1];
}

function signaturesEqual(presented: string, expected: string): boolean {
  const a = Buffer.from(presented, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

function evidence(rec: InputRecord, seq: number): string {
  const keyId = findHeader(rec, "x-gw-key-id") ?? "";
  const authorization = findHeader(rec, "authorization");
  const canonical = canonicalRequest(rec);
  const canonicalSha = createHash("sha256").update(canonical, "utf8").digest("hex");

  let signature = "";
  let reason: Reason | undefined;

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

  const outcome = reason !== undefined
    ? "rejected"
    : authorization !== undefined ? "verified" : "signed";

  const obj: Record<string, string | number> = {
    seq,
    key_id: keyId,
    method: rec.method.toUpperCase(),
    path: splitTarget(rec.target).path,
    outcome,
    signature,
    canonical_sha256: canonicalSha,
  };
  if (reason !== undefined) obj.reason = reason;
  return JSON.stringify(obj);
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out = records.map((rec, i) => `${evidence(rec, i + 1)}\n`).join("");
  process.stdout.write(out);
}

main();
