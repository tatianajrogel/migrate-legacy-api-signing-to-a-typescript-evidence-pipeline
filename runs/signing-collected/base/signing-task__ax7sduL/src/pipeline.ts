/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Implements the scheme as the dossier finally landed on it: the decision
 * register in /app/dossier/01-decision-register.md, with the reversals recorded
 * in the meeting notes applied on top:
 *
 *   GW-041 -> 04-2025-11-04-gateway.md      header values are whitespace-folded
 *   GW-017 -> 05-2025-11-18-addendum.md     query sorts by name, then value
 *   GW-009 -> 07-2025-12-02-scheme-freeze   body hash is always SHA-256
 *   GW-023 -> 07-2025-12-02-scheme-freeze   every header except authorization
 *   GW-052 -> 07-2025-12-02-scheme-freeze   no trailing newline
 *
 * The key roster comes from /app/captures: the legacy signer opened only the
 * keys listed in ROSTER. Signing is pure local computation.
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
  body?: string;
}

type Reason =
  | "missing-key-id"
  | "unknown-key-id"
  | "malformed-authorization"
  | "signature-mismatch";

const keyCache = new Map<string, Buffer>();

// Key files hold the secret followed by a single LF, which is not key material.
function loadKey(keyId: string): Buffer {
  let key = keyCache.get(keyId);
  if (key === undefined) {
    const raw = readFileSync(`${KEY_DIR}/${keyId}.key`, "utf8");
    key = Buffer.from(raw.replace(/\r?\n$/, ""), "utf8");
    keyCache.set(keyId, key);
  }
  return key;
}

// Bytewise comparison of the UTF-8 encodings (GW-031, GW-017 reversal).
function byteCompare(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

// GW-041 reversal: trim spaces/tabs, collapse internal runs to one space.
function foldValue(v: string): string {
  return v.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ");
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

function canonicalRequest(rec: InputRecord): string {
  const { path, query } = splitTarget(rec.target);

  const signed = rec.headers
    .map(([n, v]): [string, string] => [n.toLowerCase(), foldValue(v)])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => byteCompare(a[0], b[0]));

  const bodyHash = createHash("sha256")
    .update(rec.body ?? "", "utf8")
    .digest("hex");

  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery(query),
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    bodyHash,
  ].join("\n");
}

function headerValue(rec: InputRecord, name: string): string | undefined {
  return rec.headers.find(([n]) => n.toLowerCase() === name)?.[1];
}

function signaturesEqual(presented: string, expected: string): boolean {
  const a = Buffer.from(presented, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

function evaluate(rec: InputRecord, seq: number): Record<string, unknown> {
  const keyId = headerValue(rec, "x-gw-key-id") ?? "";
  const canonical = canonicalRequest(rec);
  const evidence: Record<string, unknown> = {
    seq,
    key_id: keyId,
    method: rec.method.toUpperCase(),
    path: splitTarget(rec.target).path,
    outcome: "",
    signature: "",
    canonical_sha256: createHash("sha256").update(canonical, "utf8").digest("hex"),
  };
  const reject = (reason: Reason) => {
    evidence.outcome = "rejected";
    evidence.reason = reason;
    return evidence;
  };

  if (keyId === "") return reject("missing-key-id");
  if (!ROSTER.has(keyId)) return reject("unknown-key-id");

  const signature = createHmac("sha256", loadKey(keyId))
    .update(canonical, "utf8")
    .digest("hex");
  evidence.signature = signature;

  const auth = headerValue(rec, "authorization");
  if (auth === undefined) {
    evidence.outcome = "signed";
    return evidence;
  }

  const prefix = `${SCHEME} keyId=${keyId}, signature=`;
  if (!auth.startsWith(prefix)) return reject("malformed-authorization");
  if (!signaturesEqual(auth.slice(prefix.length).trim(), signature)) {
    return reject("signature-mismatch");
  }
  evidence.outcome = "verified";
  return evidence;
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out = records.map((rec, i) => `${JSON.stringify(evaluate(rec, i + 1))}\n`);
  process.stdout.write(out.join(""));
}

main();
