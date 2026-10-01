/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Implements the scheme as it stood at the 2025-12-09 rollout. The decision
 * register is the starting point, but several entries were superseded in the
 * session notes and those notes win:
 *
 *   - 2025-11-04: header values are trimmed of spaces/tabs at both ends and
 *     inner runs of spaces/tabs are squeezed to one space (supersedes GW-041).
 *   - 2025-11-25: query parameters sort by name, then by value, as raw bytes
 *     on the text as it appears in the target; nothing is decoded
 *     (supersedes GW-017 and the 2025-11-18 decode step).
 *   - 2025-12-02: every header except `authorization` is signed
 *     (supersedes GW-023 and the 2025-11-18 content-type stopgap).
 *   - 2025-12-02: the body field is always the SHA-256 of the body; a missing
 *     body is a zero-length body. The `UNSIGNED` token is gone (GW-009).
 *   - 2025-12-02: nothing follows the sixth field (supersedes GW-052).
 *   - 2025-12-02: the valueless parameter trial is backed out; `?flag` is
 *     written `flag=` (GW-019 stands).
 *
 * Keys: the legacy signer only ever loaded gw-prod-01 and gw-prod-02 (see
 * /app/captures). gw-prod-03 is cut but not activated. Each key file is read
 * whole and its trailing line ending is dropped; unlike the webhook signer,
 * the gateway signer does not key the HMAC with the newline.
 */

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";
const ACTIVE_ROSTER = ["gw-prod-01", "gw-prod-02"] as const;
const SCHEME = "GW-HMAC-SHA256";

interface InputRecord {
  method: string;
  target: string;
  headers: Array<[string, string]>;
  body?: string;
}

type Outcome = "signed" | "verified" | "rejected";
type Reason =
  | "missing-key-id"
  | "unknown-key-id"
  | "malformed-authorization"
  | "signature-mismatch";

function asciiLower(s: string): string {
  return s.replace(/[A-Z]/g, (c) => c.toLowerCase());
}

function asciiUpper(s: string): string {
  return s.replace(/[a-z]/g, (c) => c.toUpperCase());
}

function byteCompare(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

function loadRoster(): Map<string, Buffer> {
  const keys = new Map<string, Buffer>();
  for (const keyId of ACTIVE_ROSTER) {
    let raw: Buffer;
    try {
      raw = readFileSync(`${KEY_DIR}/${keyId}.key`);
    } catch {
      continue;
    }
    let end = raw.length;
    if (end > 0 && raw[end - 1] === 0x0a) end--;
    if (end > 0 && raw[end - 1] === 0x0d) end--;
    keys.set(keyId, raw.subarray(0, end));
  }
  return keys;
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

function normaliseValue(v: string): string {
  return v.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ");
}

function canonicalRequest(rec: InputRecord, path: string, query: string): string {
  const signed = rec.headers
    .map(([n, v]) => [asciiLower(n), normaliseValue(v)] as [string, string])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => byteCompare(a[0], b[0]));

  const bodyHash = createHash("sha256")
    .update(rec.body ?? "", "utf8")
    .digest("hex");

  return [
    asciiUpper(rec.method),
    path,
    canonicalQuery(query),
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    bodyHash,
  ].join("\n");
}

function findHeader(rec: InputRecord, name: string): string | undefined {
  return rec.headers.find(([n]) => asciiLower(n) === name)?.[1];
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

function processRecord(
  rec: InputRecord,
  seq: number,
  roster: Map<string, Buffer>,
): Record<string, string | number> {
  const keyId = findHeader(rec, "x-gw-key-id") ?? "";
  const authorization = findHeader(rec, "authorization");
  const { path, query } = splitTarget(rec.target);
  const canonical = canonicalRequest(rec, path, query);
  const canonicalSha = createHash("sha256").update(canonical, "utf8").digest("hex");

  const key = keyId === "" ? undefined : roster.get(keyId);
  const signature = key === undefined
    ? ""
    : createHmac("sha256", key).update(canonical, "utf8").digest("hex");

  let reason: Reason | undefined;
  if (keyId === "") {
    reason = "missing-key-id";
  } else if (key === undefined) {
    reason = "unknown-key-id";
  } else if (authorization !== undefined) {
    const prefix = `${SCHEME} keyId=${keyId}, signature=`;
    if (!authorization.startsWith(prefix)) {
      reason = "malformed-authorization";
    } else if (!signaturesEqual(authorization.slice(prefix.length).trim(), signature)) {
      reason = "signature-mismatch";
    }
  }
  const outcome: Outcome = reason !== undefined
    ? "rejected"
    : authorization === undefined ? "signed" : "verified";

  const evidence: Record<string, string | number> = {
    seq,
    key_id: keyId,
    method: asciiUpper(rec.method),
    path,
    outcome,
    signature,
    canonical_sha256: canonicalSha,
  };
  if (reason !== undefined) evidence.reason = reason;
  return evidence;
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const roster = loadRoster();
  const out = records.map((rec, i) =>
    `${JSON.stringify(processRecord(rec, i + 1, roster))}\n`,
  );
  process.stdout.write(out.join(""));
}

main();
