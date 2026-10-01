/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Implements the scheme as frozen on 2025-12-02 and live from 2025-12-09.
 * Signing is a pure local computation over the request and the key material.
 */

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";
const SCHEME = "GW-HMAC-SHA256";

// Keys the legacy signer actually opened (see captures/legacy-signer.*).
// gw-prod-03 is not part of this cutover.
const ROSTER = new Set(["gw-prod-01", "gw-prod-02"]);

interface InputRecord {
  method: string;
  target: string;
  headers: Array<[string, string]>;
  body?: string | null;
}

function loadKey(keyId: string): Buffer | null {
  if (!ROSTER.has(keyId)) return null;
  try {
    // Used whole, exactly as the legacy signer read it.
    return readFileSync(`${KEY_DIR}/${keyId}.key`);
  } catch {
    return null;
  }
}

function asciiLower(s: string): string {
  return s.replace(/[A-Z]/g, (c) => c.toLowerCase());
}

function cmpBytes(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

function splitTarget(target: string): { path: string; query: string } {
  const q = target.indexOf("?");
  return q === -1
    ? { path: target, query: "" }
    : { path: target.slice(0, q), query: target.slice(q + 1) };
}

function normaliseHeaderValue(v: string): string {
  return v.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ");
}

function sha256Hex(data: string): string {
  return createHash("sha256").update(data, "utf8").digest("hex");
}

function canonicalRequest(rec: InputRecord): string {
  const { path, query } = splitTarget(rec.target);

  const pairs = (query === "" ? [] : query.split("&"))
    .filter((p) => p !== "")
    .map((p) => {
      const eq = p.indexOf("=");
      return eq === -1 ? [p, ""] : [p.slice(0, eq), p.slice(eq + 1)];
    });
  pairs.sort((a, b) => cmpBytes(a[0], b[0]) || cmpBytes(a[1], b[1]));
  const canonicalQuery = pairs.map(([n, v]) => `${n}=${v}`).join("&");

  // Every header except authorization is signed.
  const signed = rec.headers
    .map(([n, v], i) => ({ n: asciiLower(n), v: normaliseHeaderValue(v), i }))
    .filter((h) => h.n !== "authorization")
    .sort((a, b) => cmpBytes(a.n, b.n) || a.i - b.i);

  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery,
    signed.map((h) => `${h.n}:${h.v}`).join("\n"),
    signed.map((h) => h.n).join(";"),
    sha256Hex(rec.body ?? ""),
  ].join("\n");
}

function headerValue(rec: InputRecord, name: string): string | undefined {
  return rec.headers.find(([n]) => asciiLower(n) === name)?.[1];
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out: string[] = [];

  records.forEach((rec, i) => {
    const keyId = headerValue(rec, "x-gw-key-id") ?? "";
    const canonical = canonicalRequest(rec);
    const canonicalSha = sha256Hex(canonical);
    const auth = headerValue(rec, "authorization");
    const key = keyId === "" ? null : loadKey(keyId);
    const signature = key === null
      ? ""
      : createHmac("sha256", key).update(canonical, "utf8").digest("hex");

    let outcome: "signed" | "verified" | "rejected" = "signed";
    let reason: string | undefined;

    if (keyId === "") {
      outcome = "rejected";
      reason = "missing-key-id";
    } else if (key === null) {
      outcome = "rejected";
      reason = "unknown-key-id";
    } else if (auth !== undefined) {
      const prefix = `${SCHEME} keyId=${keyId}, signature=`;
      if (!auth.startsWith(prefix)) {
        outcome = "rejected";
        reason = "malformed-authorization";
      } else {
        const presented = Buffer.from(auth.slice(prefix.length).trim(), "utf8");
        const expected = Buffer.from(signature, "utf8");
        if (
          presented.length === expected.length &&
          timingSafeEqual(presented, expected)
        ) {
          outcome = "verified";
        } else {
          outcome = "rejected";
          reason = "signature-mismatch";
        }
      }
    }

    const ev: Record<string, unknown> = {
      seq: i + 1,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      path: splitTarget(rec.target).path,
      outcome,
      signature,
      canonical_sha256: canonicalSha,
    };
    if (reason !== undefined) ev.reason = reason;
    out.push(JSON.stringify(ev));
  });

  process.stdout.write(out.map((l) => `${l}\n`).join(""));
}

main();
