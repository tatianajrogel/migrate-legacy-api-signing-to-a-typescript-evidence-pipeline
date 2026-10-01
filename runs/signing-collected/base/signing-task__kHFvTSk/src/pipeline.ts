/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Implements the scheme as the dossier finally landed on it: the decision
 * register in /app/dossier/01-decision-register.md, with the reversals from the
 * meeting notes applied on top:
 *
 *   GW-041 (2025-11-04)  header values are whitespace-folded before signing
 *   GW-017 (2025-11-18)  query sorted by name, then value, bytewise
 *   GW-009 (2025-12-02)  body hash is always SHA-256, empty body included
 *   GW-023 (2025-12-02)  every header except `authorization` is signed
 *   GW-052 (2025-12-02)  no trailing newline on the canonical request
 *
 * Signing is pure local computation (GW-055): the only I/O is stdin, stdout
 * and the roster key files.
 */

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";

// Active roster, per the legacy signer captures (strace + lsof): only these
// key files were ever opened. Anything else in KEY_DIR is retired.
const ROSTER = ["gw-prod-01", "gw-prod-02"] as const;

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

function loadRoster(): Map<string, Buffer> {
  const keys = new Map<string, Buffer>();
  for (const id of ROSTER) {
    // The legacy signer reads the whole file; the trailing line ending is
    // not part of the key material.
    const raw = readFileSync(`${KEY_DIR}/${id}.key`, "latin1");
    keys.set(id, Buffer.from(raw.replace(/\r?\n$/, ""), "latin1"));
  }
  return keys;
}

// GW-031 / GW-017: compare as raw UTF-8 bytes, not UTF-16 code units.
function byteCompare(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

// GW-041 as superseded: trim spaces/tabs, collapse internal runs to one space.
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

function canonicalRequest(rec: InputRecord, path: string, query: string): string {
  const signed = (rec.headers ?? [])
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

function headerValues(rec: InputRecord, name: string): string[] {
  return (rec.headers ?? [])
    .filter(([n]) => n.toLowerCase() === name)
    .map(([, v]) => v);
}

function processRecord(
  rec: InputRecord,
  seq: number,
  keys: Map<string, Buffer>,
): Evidence {
  const { path, query } = splitTarget(rec.target);
  const canonical = canonicalRequest(rec, path, query);
  const keyId = headerValues(rec, "x-gw-key-id")[0] ?? "";
  const auth = headerValues(rec, "authorization");

  const ev: Evidence = {
    seq,
    key_id: keyId,
    method: rec.method.toUpperCase(),
    path,
    outcome: "signed",
    signature: "",
    canonical_sha256: createHash("sha256").update(canonical, "utf8").digest("hex"),
  };
  const reject = (reason: Reason, signature = ""): Evidence => ({
    ...ev,
    outcome: "rejected",
    signature,
    reason,
  });

  if (keyId === "") return reject("missing-key-id");
  const key = keys.get(keyId);
  if (key === undefined) return reject("unknown-key-id");

  let m: RegExpExecArray | null = null;
  if (auth.length > 0) {
    m = auth.length === 1 ? AUTH_RE.exec(auth[0]) : null;
    if (m === null) return reject("malformed-authorization");
  }

  const signature = createHmac("sha256", key).update(canonical, "utf8").digest("hex");
  if (m === null) return { ...ev, signature };

  // A keyId in the Authorization header that differs from x-gw-key-id can
  // never verify: the request is signed under the key it names.
  const ok = m[1] === keyId &&
    timingSafeEqual(Buffer.from(m[2], "utf8"), Buffer.from(signature, "utf8"));
  return ok
    ? { ...ev, outcome: "verified", signature }
    : reject("signature-mismatch", signature);
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const keys = loadRoster();
  const out = records.map((rec, i) => JSON.stringify(processRecord(rec, i + 1, keys)) + "\n");
  process.stdout.write(out.join(""));
}

main();
