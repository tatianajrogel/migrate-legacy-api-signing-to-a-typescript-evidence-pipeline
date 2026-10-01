/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Implements the scheme as frozen on 2025-12-02 and live from the 2025-12-09
 * rollout. The decision register is the historical record only; the rules
 * below follow the session notes (with their corrections) and appendices:
 *
 * - canonical request: 6 fields joined by LF, nothing after the last field
 * - signed headers: every header except `authorization` (partner sign-off
 *   complete 2025-12-04), names lowercased, sorted bytewise, joined by `;`
 * - header values: spaces/tabs stripped at each end, inner runs collapsed to
 *   a single space
 * - query: sorted by name then value, bytewise on the raw text; a parameter
 *   with no `=` is written with a trailing `=`
 * - path and percent escapes signed as received
 * - body hash: always lowercase hex SHA-256, absent body = zero length body
 *   (SDK 3.2.1, GA 2025-12-01)
 * - keys: only gw-prod-01 and gw-prod-02 are on the roster; the trailing
 *   line ending of each key file is not part of the key
 *
 * Signing is a pure local computation over the request and the key material.
 */

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";
const ROSTER = ["gw-prod-01", "gw-prod-02"];
const SCHEME = "GW-HMAC-SHA256";

interface InputRecord {
  method: string;
  target: string;
  headers?: Array<[string, string]>;
  body?: string | null;
}

function loadRoster(): Map<string, Buffer> {
  const keys = new Map<string, Buffer>();
  for (const keyId of ROSTER) {
    // The legacy signer used the key material without its line ending.
    const raw = readFileSync(`${KEY_DIR}/${keyId}.key`, "latin1");
    keys.set(keyId, Buffer.from(raw.replace(/\r?\n$/, ""), "latin1"));
  }
  return keys;
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

  const signed = (rec.headers ?? [])
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
  return (rec.headers ?? []).find(([n]) => n.toLowerCase() === name)?.[1];
}

function signaturesEqual(presented: string, expected: string): boolean {
  const a = Buffer.from(presented, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const keys = loadRoster();
  let out = "";

  records.forEach((rec, i) => {
    const keyId = findHeader(rec, "x-gw-key-id") ?? "";
    const authorization = findHeader(rec, "authorization");
    const canonical = canonicalRequest(rec);
    const canonicalSha = createHash("sha256").update(canonical, "utf8").digest("hex");
    const key = keys.get(keyId);
    const signature = key === undefined
      ? ""
      : createHmac("sha256", key).update(canonical, "utf8").digest("hex");

    let outcome: "signed" | "verified" | "rejected";
    let reason: string | undefined;
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
    if (reason !== undefined) outcome = "rejected";
    else outcome = authorization === undefined ? "signed" : "verified";

    const evidence: Record<string, string | number> = {
      seq: i + 1,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      path: splitTarget(rec.target).path,
      outcome,
      signature,
      canonical_sha256: canonicalSha,
    };
    if (reason !== undefined) evidence.reason = reason;
    out += `${JSON.stringify(evidence)}\n`;
  });

  process.stdout.write(out);
}

main();
