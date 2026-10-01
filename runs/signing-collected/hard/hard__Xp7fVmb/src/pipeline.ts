/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Implements the scheme as frozen on 2025-12-02 and rolled out on 2025-12-09.
 * The decision register (dossier/01) is the historical record only; these
 * later minuted changes supersede it:
 *
 * - 2025-11-04: header values are trimmed of spaces/tabs at each end and
 *   internal runs of spaces/tabs squeezed to one space (supersedes GW-041).
 * - 2025-11-25: query parameters sort by name, then value, plain byte order
 *   on the raw text; nothing is decoded (supersedes GW-017 and 2025-11-18).
 * - 2025-12-02: every header except `authorization` is signed (supersedes
 *   GW-023 and the 2025-11-18 content-type stopgap).
 * - 2025-12-02: the body field is always the SHA-256 hex of the body, absent
 *   body = zero length (supersedes GW-009 and 2025-10-21).
 * - 2025-12-02: nothing follows the sixth field (supersedes GW-052).
 * - 2025-12-02: valueless parameters keep the trailing `=` (2025-11-04 trial
 *   backed out); no dot-segment collapsing; key ids are case-sensitive.
 *
 * Key roster: the legacy signer's strace/lsof (captures/) show it opening
 * only gw-prod-01 and gw-prod-02. gw-prod-03 is on disk but its activation
 * is a separate change (rollout note, 2025-12-09). Key material is the file
 * contents with the trailing line ending removed; the webhook signer is the
 * one that keys on the whole file.
 */

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
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

interface Evidence {
  seq: number;
  key_id: string;
  method: string;
  path: string;
  outcome: "signed" | "verified" | "rejected";
  signature: string;
  canonical_sha256: string;
  reason?: string;
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

function normaliseValue(value: string): string {
  return value.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ");
}

function canonicalRequest(rec: InputRecord): string {
  const { path, query } = splitTarget(rec.target);

  // Array.prototype.sort is stable, so repeated names keep arrival order.
  const signed = (rec.headers ?? [])
    .map(([n, v]): [string, string] => [n.toLowerCase(), normaliseValue(v)])
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

function constantTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) {
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

function processRecord(rec: InputRecord, seq: number): Evidence {
  const keyId = findHeader(rec, "x-gw-key-id") ?? "";
  const canonical = canonicalRequest(rec);
  const ev: Evidence = {
    seq,
    key_id: keyId,
    method: rec.method.toUpperCase(),
    path: splitTarget(rec.target).path,
    outcome: "rejected",
    signature: "",
    canonical_sha256: createHash("sha256").update(canonical, "utf8").digest("hex"),
  };

  if (keyId === "") return { ...ev, reason: "missing-key-id" };
  const key = loadKey(keyId);
  if (key === null) return { ...ev, reason: "unknown-key-id" };

  ev.signature = createHmac("sha256", key).update(canonical, "utf8").digest("hex");

  const auth = findHeader(rec, "authorization");
  if (auth === undefined) return { ...ev, outcome: "signed" };

  const prefix = `${SCHEME} keyId=${keyId}, signature=`;
  if (!auth.startsWith(prefix)) return { ...ev, reason: "malformed-authorization" };

  const presented = auth.slice(prefix.length).trim();
  return constantTimeEqual(presented, ev.signature)
    ? { ...ev, outcome: "verified" }
    : { ...ev, reason: "signature-mismatch" };
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const lines = records.map((rec, i) => JSON.stringify(processRecord(rec, i + 1)));
  process.stdout.write(lines.map((l) => `${l}\n`).join(""));
}

main();
