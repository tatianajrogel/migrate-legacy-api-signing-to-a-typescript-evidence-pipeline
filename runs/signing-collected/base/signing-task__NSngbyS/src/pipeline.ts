/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Implements the scheme as finally agreed, i.e. the decision register in
 * /app/dossier/01-decision-register.md as amended by the meeting notes:
 *
 *   GW-009 -> 2025-12-02: body hash is always SHA-256 hex, even when empty.
 *   GW-017 -> 2025-11-18: query sorted by name, then value, bytewise.
 *   GW-023 -> 2025-12-02: every header is signed except `authorization`.
 *   GW-041 -> 2025-11-04: header values are whitespace-folded.
 *   GW-052 -> 2025-12-02: no trailing newline on the canonical request.
 *
 * Pure local computation over the request and the key material.
 */

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";

// Active roster, per captures/legacy-signer.{strace,lsof}: only these two key
// files are ever opened. gw-legacy-99.key is present on disk but retired.
const ACTIVE_ROSTER: readonly string[] = ["gw-prod-01", "gw-prod-02"];

const SCHEME = "GW-HMAC-SHA256";

interface InputRecord {
  method: string;
  target: string;
  headers: Array<[string, string]>;
  body?: string | null;
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

function loadRoster(): Map<string, Buffer> {
  const keys = new Map<string, Buffer>();
  for (const id of ACTIVE_ROSTER) {
    // The key is the file contents minus the trailing line terminator.
    const raw = readFileSync(`${KEY_DIR}/${id}.key`, "latin1").replace(/\r?\n$/, "");
    keys.set(id, Buffer.from(raw, "latin1"));
  }
  return keys;
}

function byteCompare(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

function foldWhitespace(v: string): string {
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
    .map(([n, v]): [string, string] => [n.toLowerCase(), foldWhitespace(v)])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => byteCompare(a[0], b[0]));

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

function findHeader(rec: InputRecord, name: string): string | undefined {
  return rec.headers.find(([n]) => n.toLowerCase() === name)?.[1];
}

function signaturesEqual(presented: string, expected: string): boolean {
  const a = Buffer.from(presented, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) {
    // Still burn a comparison so timing does not depend on where we bail out.
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

function process1(rec: InputRecord, seq: number, roster: Map<string, Buffer>): Evidence {
  const keyId = findHeader(rec, "x-gw-key-id") ?? "";
  const canonical = canonicalRequest(rec);
  const ev: Evidence = {
    seq,
    key_id: keyId,
    method: rec.method.toUpperCase(),
    path: splitTarget(rec.target).path,
    outcome: "signed",
    signature: "",
    canonical_sha256: createHash("sha256").update(canonical, "utf8").digest("hex"),
  };
  const reject = (reason: string): Evidence => ({ ...ev, outcome: "rejected", reason });

  if (keyId === "") return reject("missing-key-id");
  const key = roster.get(keyId);
  if (key === undefined) return reject("unknown-key-id");

  ev.signature = createHmac("sha256", key).update(canonical, "utf8").digest("hex");

  const auth = findHeader(rec, "authorization");
  if (auth === undefined) return ev;

  const prefix = `${SCHEME} keyId=${keyId}, signature=`;
  if (!auth.startsWith(prefix)) return reject("malformed-authorization");
  const presented = auth.slice(prefix.length).trim();
  if (!signaturesEqual(presented, ev.signature)) return reject("signature-mismatch");
  return { ...ev, outcome: "verified" };
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const roster = loadRoster();
  const out = records.map((rec, i) => JSON.stringify(process1(rec, i + 1, roster)) + "\n");
  process.stdout.write(out.join(""));
}

main();
