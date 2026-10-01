/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Implements the scheme as finally agreed, i.e. the decision register with the
 * reversals recorded in the meeting notes applied:
 *
 *   GW-041 -> 2025-11-04 gateway sync: header values are whitespace-folded.
 *   GW-017 -> 2025-11-18 addendum: query sorted by name, then value, bytewise.
 *   GW-009 -> 2025-12-02 scheme freeze: body hash is always SHA-256 of the body.
 *   GW-023 -> 2025-12-02 scheme freeze: every header except authorization signed.
 *   GW-052 -> 2025-12-02 scheme freeze: no trailing LF on the canonical request.
 *
 * Key roster and key handling follow the legacy signer captures in
 * /app/captures: only gw-prod-01 and gw-prod-02 are opened, and the key is the
 * file content without its trailing line terminator. Pure local computation.
 */

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";
const ACTIVE_ROSTER: readonly string[] = ["gw-prod-01", "gw-prod-02"];
const SCHEME = "GW-HMAC-SHA256";

interface InputRecord {
  method: string;
  target: string;
  headers?: Array<[string, string]>;
  body?: string;
}

type Reason =
  | "missing-key-id"
  | "unknown-key-id"
  | "malformed-authorization"
  | "signature-mismatch";

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
    const raw = readFileSync(`${KEY_DIR}/${keyId}.key`, "latin1");
    key = Buffer.from(raw.replace(/\r?\n$/, ""), "latin1");
    keyCache.set(keyId, key);
  }
  return key;
}

function byteCompare(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

function foldWhitespace(value: string): string {
  return value.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ");
}

function splitTarget(target: string): { path: string; query: string } {
  const qIndex = target.indexOf("?");
  return qIndex === -1
    ? { path: target, query: "" }
    : { path: target.slice(0, qIndex), query: target.slice(qIndex + 1) };
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

  const signed = (rec.headers ?? [])
    .map(([n, v]) => [n.toLowerCase(), foldWhitespace(v)] as [string, string])
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

function findHeader(rec: InputRecord, name: string): string | undefined {
  return (rec.headers ?? []).find(([n]) => n.toLowerCase() === name)?.[1];
}

function signaturesEqual(presented: string, expected: string): boolean {
  const a = Buffer.from(presented, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

function processRecord(rec: InputRecord, seq: number): Evidence {
  const keyId = findHeader(rec, "x-gw-key-id") ?? "";
  const canonical = canonicalRequest(rec);
  const evidence: Evidence = {
    seq,
    key_id: keyId,
    method: rec.method.toUpperCase(),
    path: splitTarget(rec.target).path,
    outcome: "signed",
    signature: "",
    canonical_sha256: createHash("sha256").update(canonical, "utf8").digest("hex"),
  };
  const reject = (reason: Reason): Evidence => ({ ...evidence, outcome: "rejected", reason });

  if (keyId === "") return reject("missing-key-id");
  const key = loadKey(keyId);
  if (key === null) return reject("unknown-key-id");

  evidence.signature = createHmac("sha256", key).update(canonical, "utf8").digest("hex");

  const authorization = findHeader(rec, "authorization");
  if (authorization === undefined) return evidence;

  const prefix = `${SCHEME} keyId=${keyId}, signature=`;
  if (!authorization.startsWith(prefix)) return reject("malformed-authorization");
  const presented = authorization.slice(prefix.length).trim();
  if (!signaturesEqual(presented, evidence.signature)) return reject("signature-mismatch");
  return { ...evidence, outcome: "verified" };
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out = records.map((rec, i) => `${JSON.stringify(processRecord(rec, i + 1))}\n`);
  process.stdout.write(out.join(""));
}

main();
