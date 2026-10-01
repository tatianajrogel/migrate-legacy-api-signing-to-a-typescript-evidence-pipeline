/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Implements the scheme as finally agreed in the dossier: the decision
 * register in /app/dossier/01-decision-register.md, as amended by the
 * meeting notes that supersede individual entries:
 *
 *   GW-041 -> 2025-11-04: header values are whitespace-folded.
 *   GW-017 -> 2025-11-18: query sorted by name, then value, bytewise.
 *   GW-009 -> 2025-12-02: body hash is always SHA-256 (no UNSIGNED).
 *   GW-023 -> 2025-12-02: every header except authorization is signed.
 *   GW-052 -> 2025-12-02: no trailing newline on the canonical request.
 *
 * Key roster and key handling follow the legacy signer captures in
 * /app/captures: only the active roster keys are ever opened, and signing
 * is pure local computation (GW-055).
 */

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";

// Active roster, per the legacy signer strace/lsof. Other files in KEY_DIR
// (e.g. gw-legacy-99.key) are retired and must never be opened.
const ROSTER: readonly string[] = ["gw-prod-01", "gw-prod-02"];

const AUTH_RE = /^GW-HMAC-SHA256 keyId=([^,\s]+), signature=([0-9a-f]{64})$/;

type Reason =
  | "missing-key-id"
  | "unknown-key-id"
  | "signature-mismatch"
  | "malformed-authorization";

interface InputRecord {
  method?: unknown;
  target?: unknown;
  headers?: unknown;
  body?: unknown;
}

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
  if (!ROSTER.includes(keyId)) return null;
  let key = keyCache.get(keyId);
  if (key === undefined) {
    const raw = readFileSync(`${KEY_DIR}/${keyId}.key`);
    // Key files carry a single trailing LF that is not part of the secret.
    let end = raw.length;
    if (end > 0 && raw[end - 1] === 0x0a) end--;
    if (end > 0 && raw[end - 1] === 0x0d) end--;
    key = raw.subarray(0, end);
    keyCache.set(keyId, key);
  }
  return key;
}

function asciiLower(s: string): string {
  return s.replace(/[A-Z]/g, (c) => c.toLowerCase());
}

function byteCompare(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

function foldValue(v: string): string {
  return v.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ");
}

function sha256Hex(data: string): string {
  return createHash("sha256").update(data, "utf8").digest("hex");
}

function normaliseHeaders(raw: unknown): Array<[string, string]> {
  if (!Array.isArray(raw)) return [];
  const out: Array<[string, string]> = [];
  for (const h of raw) {
    if (Array.isArray(h) && typeof h[0] === "string") {
      out.push([h[0], typeof h[1] === "string" ? h[1] : String(h[1] ?? "")]);
    }
  }
  return out;
}

function splitTarget(target: string): { path: string; query: string } {
  const q = target.indexOf("?");
  return q === -1
    ? { path: target, query: "" }
    : { path: target.slice(0, q), query: target.slice(q + 1) };
}

function canonicalQuery(query: string): string {
  if (query === "") return "";
  const pairs = query
    .split("&")
    .filter((p) => p !== "")
    .map((p): [string, string] => {
      const eq = p.indexOf("=");
      return eq === -1 ? [p, ""] : [p.slice(0, eq), p.slice(eq + 1)];
    });
  pairs.sort((a, b) => byteCompare(a[0], b[0]) || byteCompare(a[1], b[1]));
  return pairs.map(([n, v]) => `${n}=${v}`).join("&");
}

function canonicalRequest(
  method: string,
  path: string,
  query: string,
  headers: Array<[string, string]>,
  body: string,
): string {
  const signed = headers
    .map(([n, v]): [string, string] => [asciiLower(n), foldValue(v)])
    .filter(([n]) => n !== "authorization");
  // Array.prototype.sort is stable, so repeated names keep arrival order.
  signed.sort((a, b) => byteCompare(a[0], b[0]));

  return [
    method,
    path,
    canonicalQuery(query),
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    sha256Hex(body),
  ].join("\n");
}

function hmacHex(key: Buffer, canonical: string): string {
  return createHmac("sha256", key).update(canonical, "utf8").digest("hex");
}

function processRecord(rec: InputRecord, seq: number): Evidence {
  const method = (typeof rec.method === "string" ? rec.method : "").toUpperCase();
  const target = typeof rec.target === "string" ? rec.target : "";
  const body = typeof rec.body === "string" ? rec.body : "";
  const headers = normaliseHeaders(rec.headers);
  const { path, query } = splitTarget(target);

  const canonical = canonicalRequest(method, path, query, headers, body);
  const base = { seq, method, path, canonical_sha256: sha256Hex(canonical) };

  const headerKeyId =
    headers.find(([n]) => asciiLower(n) === "x-gw-key-id")?.[1] ?? "";
  const auths = headers.filter(([n]) => asciiLower(n) === "authorization");

  const reject = (keyId: string, reason: Reason, signature = ""): Evidence => ({
    seq,
    key_id: keyId,
    method,
    path,
    outcome: "rejected",
    signature,
    canonical_sha256: base.canonical_sha256,
    reason,
  });

  if (auths.length === 0) {
    if (headerKeyId === "") return reject("", "missing-key-id");
    const key = loadKey(headerKeyId);
    if (key === null) return reject(headerKeyId, "unknown-key-id");
    return {
      seq,
      key_id: headerKeyId,
      method,
      path,
      outcome: "signed",
      signature: hmacHex(key, canonical),
      canonical_sha256: base.canonical_sha256,
    };
  }

  const m = auths.length === 1 ? AUTH_RE.exec(auths[0][1]) : null;
  if (m === null) return reject(headerKeyId, "malformed-authorization");
  const [, authKeyId, presented] = m;
  // The key id in the Authorization header must agree with x-gw-key-id
  // when both are present; a disagreement is not a well-formed request.
  if (headerKeyId !== "" && headerKeyId !== authKeyId) {
    return reject(headerKeyId, "malformed-authorization");
  }
  const keyId = authKeyId;
  const key = loadKey(keyId);
  if (key === null) return reject(keyId, "unknown-key-id");

  const expected = hmacHex(key, canonical);
  const ok = timingSafeEqual(
    Buffer.from(expected, "utf8"),
    Buffer.from(presented, "utf8"),
  );
  if (!ok) return reject(keyId, "signature-mismatch", expected);
  return {
    seq,
    key_id: keyId,
    method,
    path,
    outcome: "verified",
    signature: expected,
    canonical_sha256: base.canonical_sha256,
  };
}

function main(): void {
  const input: unknown = JSON.parse(readFileSync(0, "utf8"));
  if (!Array.isArray(input)) {
    throw new Error("input must be a JSON array of request records");
  }
  const lines = input.map((rec, i) =>
    JSON.stringify(processRecord((rec ?? {}) as InputRecord, i + 1)),
  );
  process.stdout.write(lines.map((l) => `${l}\n`).join(""));
}

main();
