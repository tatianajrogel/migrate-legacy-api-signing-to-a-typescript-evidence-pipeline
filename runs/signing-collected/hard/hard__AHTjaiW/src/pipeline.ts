/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Implements the scheme as frozen on 2025-12-02 and rolled out on 2025-12-09.
 * The decision register (dossier/01) is the starting point, but several of its
 * entries were reversed in later sessions; the register is never edited, so
 * the reversals only live in the session notes. Where this code departs from
 * the register, the session that changed it is cited.
 *
 * Signing is pure local computation over the record and the key material.
 */

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";

// Active roster. The legacy signer's strace/lsof (captures/) show it opening
// exactly these 2 key files. gw-prod-03 is present in the key directory but
// its activation is a separate change (rollout, 2025-12-09).
const ACTIVE_KEY_IDS: ReadonlySet<string> = new Set(["gw-prod-01", "gw-prod-02"]);

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

// The gateway signer drops the key file's line ending; only the webhook
// signer keeps it (2025-11-18, "Webhook key loading").
function loadKey(keyId: string): Buffer {
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

function splitTarget(target: string): { path: string; query: string } {
  const q = target.indexOf("?");
  return q === -1
    ? { path: target, query: "" }
    : { path: target.slice(0, q), query: target.slice(q + 1) };
}

// Sorted by name then value, plain byte order on the raw text, nothing
// decoded (2025-11-18, revised 2025-11-25). A parameter without `=` is
// written with a trailing `=` (bare-name trial backed out 2025-12-02).
function canonicalQuery(query: string): string {
  if (query === "") return "";
  const pairs = query.split("&").map((p): [string, string] => {
    const eq = p.indexOf("=");
    return eq === -1 ? [p, ""] : [p.slice(0, eq), p.slice(eq + 1)];
  });
  pairs.sort((a, b) => byteCompare(a[0], b[0]) || byteCompare(a[1], b[1]));
  return pairs.map(([n, v]) => `${n}=${v}`).join("&");
}

// Trim spaces and tabs at both ends, squeeze inner runs to one space
// (2025-11-04, "Proxy comparison rerun").
function normaliseHeaderValue(value: string): string {
  return value.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ");
}

function canonicalRequest(rec: InputRecord, path: string, query: string): string {
  // Every header except authorization is signed (2025-12-02, "Threat review
  // outcome"). Stable sort keeps repeated names in arrival order.
  const signed = (rec.headers ?? [])
    .map(([n, v]): [string, string] => [n.toLowerCase(), normaliseHeaderValue(v)])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => byteCompare(a[0], b[0]));

  // No UNSIGNED token: always the SHA-256 of the body, absent == empty
  // (2025-12-02, "Body hash").
  const bodyHash = createHash("sha256").update(rec.body ?? "", "utf8").digest("hex");

  // Nothing follows the sixth field (2025-12-02, "Design doc audit").
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

function processRecord(rec: InputRecord, seq: number): Record<string, unknown> {
  const { path, query } = splitTarget(rec.target);
  const canonical = canonicalRequest(rec, path, query);
  const keyId = findHeader(rec, "x-gw-key-id") ?? "";
  const authorization = findHeader(rec, "authorization");

  let signature = "";
  let reason: Reason | undefined;

  if (keyId === "") {
    reason = "missing-key-id";
  } else if (!ACTIVE_KEY_IDS.has(keyId)) {
    reason = "unknown-key-id";
  } else {
    signature = createHmac("sha256", loadKey(keyId)).update(canonical, "utf8").digest("hex");
    if (authorization !== undefined) {
      const prefix = `${SCHEME} keyId=${keyId}, signature=`;
      if (!authorization.startsWith(prefix)) {
        reason = "malformed-authorization";
      } else if (!signaturesEqual(authorization.slice(prefix.length).trim(), signature)) {
        reason = "signature-mismatch";
      }
    }
  }

  const evidence: Record<string, unknown> = {
    seq,
    key_id: keyId,
    method: rec.method.toUpperCase(),
    path,
    outcome: reason !== undefined ? "rejected" : authorization !== undefined ? "verified" : "signed",
    signature,
    canonical_sha256: createHash("sha256").update(canonical, "utf8").digest("hex"),
  };
  if (reason !== undefined) evidence.reason = reason;
  return evidence;
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out = records.map((rec, i) => `${JSON.stringify(processRecord(rec, i + 1))}\n`);
  process.stdout.write(out.join(""));
}

main();
