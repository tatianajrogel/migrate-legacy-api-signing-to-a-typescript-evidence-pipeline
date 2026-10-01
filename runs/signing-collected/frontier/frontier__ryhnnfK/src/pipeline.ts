/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Implements the inbound request signing scheme as frozen on 2025-12-02 and
 * checked by the gateway from the 2025-12-09 cutover. The decision register
 * (dossier/01) is only the starting point; later sessions changed it:
 *
 * - every header except `authorization` is signed (2025-12-02, all partners
 *   signed off by 2025-12-04);
 * - header values are trimmed of spaces/tabs and inner runs collapsed to one
 *   space (2025-11-04, corrected 2025-11-11; the 2025-11-25 lowercasing
 *   change failed its load test);
 * - query parameters sort by name then value, byte-wise on the raw text
 *   (aligned with BX-HMAC-SHA256 on 2025-11-11); valueless parameters keep a
 *   trailing `=` (trial backed out 2025-12-02);
 * - the body hash is always SHA-256 of the body, absent body = empty
 *   (2025-11-25, effective with SDK 3.2.1, GA 2025-12-01);
 * - the string to sign has no trailing LF (2025-12-02);
 * - path and percent escapes are signed as received; key ids match exactly.
 *
 * Keys: the legacy signer loads gw-prod-01 and gw-prod-02 only (gw-prod-03 is
 * the export signer's) and uses the key file with its line ending stripped
 * (32-byte HMAC key in the ltrace capture).
 *
 * Pure local computation: no network access.
 */

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
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

const keyCache = new Map<string, Buffer>();

function loadKey(keyId: string): Buffer | null {
  if (!ACTIVE_ROSTER.has(keyId)) return null;
  const cached = keyCache.get(keyId);
  if (cached !== undefined) return cached;
  let raw: Buffer;
  try {
    raw = readFileSync(`${KEY_DIR}/${keyId}.key`);
  } catch {
    return null;
  }
  let end = raw.length;
  if (end > 0 && raw[end - 1] === 0x0a) end--;
  if (end > 0 && raw[end - 1] === 0x0d) end--;
  const key = raw.subarray(0, end);
  keyCache.set(keyId, key);
  return key;
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
  // Array.prototype.sort is stable, so exact duplicates keep arrival order.
  pairs.sort((a, b) => byteCompare(a[0], b[0]) || byteCompare(a[1], b[1]));
  return pairs.map(([n, v]) => `${n}=${v}`).join("&");
}

function normaliseHeaderValue(v: string): string {
  return v.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ");
}

function canonicalRequest(rec: InputRecord): string {
  const { path, query } = splitTarget(rec.target);

  const signed = (rec.headers ?? [])
    .map(([n, v]) => [n.toLowerCase(), normaliseHeaderValue(v)] as [string, string])
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
  return (rec.headers ?? []).find(([n]) => n.toLowerCase() === name)?.[1];
}

function constantTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) {
    timingSafeEqual(bb, bb);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

function process1(rec: InputRecord, seq: number): string {
  const keyId = findHeader(rec, "x-gw-key-id") ?? "";
  const auth = findHeader(rec, "authorization");
  const canonical = canonicalRequest(rec);
  const canonicalSha = createHash("sha256").update(canonical, "utf8").digest("hex");

  let signature = "";
  let outcome: "signed" | "verified" | "rejected";
  let reason: string | undefined;

  const key = keyId === "" ? null : loadKey(keyId);
  if (keyId === "") {
    outcome = "rejected";
    reason = "missing-key-id";
  } else if (key === null) {
    outcome = "rejected";
    reason = "unknown-key-id";
  } else {
    signature = createHmac("sha256", key).update(canonical, "utf8").digest("hex");
    if (auth === undefined) {
      outcome = "signed";
    } else {
      const prefix = `${SCHEME} keyId=${keyId}, signature=`;
      if (!auth.startsWith(prefix)) {
        outcome = "rejected";
        reason = "malformed-authorization";
      } else if (!constantTimeEqual(auth.slice(prefix.length).trim(), signature)) {
        outcome = "rejected";
        reason = "signature-mismatch";
      } else {
        outcome = "verified";
      }
    }
  }

  const evidence: Record<string, string | number> = {
    seq,
    key_id: keyId,
    method: rec.method.toUpperCase(),
    path: splitTarget(rec.target).path,
    outcome,
    signature,
    canonical_sha256: canonicalSha,
  };
  if (reason !== undefined) evidence.reason = reason;
  return JSON.stringify(evidence);
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out = records.map((rec, i) => `${process1(rec, i + 1)}\n`).join("");
  process.stdout.write(out);
}

main();
