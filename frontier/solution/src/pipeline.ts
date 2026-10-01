/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Reads a JSON array of HTTP request records on stdin, signs or verifies each,
 * and writes one compact JSON evidence object per line to stdout.
 *
 * Opens exactly one file per distinct key id, under the approved key directory.
 * Performs no network access of any kind.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import { canonicalRequest, sha256Hex } from "./canonical.js";
import type { ParsedRequest } from "./canonical.js";

const KEY_DIR = "/app/keys";
const SCHEME = "GW-HMAC-SHA256";

/**
 * The active key roster, derived from the pre-migration captures rather than
 * from the key directory listing.
 *
 * The strace enumerates the directory with getdents64 but only ever calls
 * openat() on gw-prod-01.key and gw-prod-02.key, and the lsof holds exactly
 * those 2 as open FDs. gw-prod-03.key is present on disk and off the
 * roster: a request naming it is rejected, never signed. The export signer's
 * lsof does hold that file open; that is a different signer. The 2025-12-09
 * rollout note agrees, moving this scheme to it is a separate change.
 */
const APPROVED_KEY_IDS = new Set(["gw-prod-01", "gw-prod-02"]);

interface InputRecord {
  method: string;
  target: string;
  headers: Array<[string, string]>;
  body?: string;
}

interface Evidence {
  seq: number;
  key_id: string;
  method: string;
  path: string;
  outcome: string;
  signature: string;
  canonical_sha256: string;
  reason?: string;
}

const keyCache = new Map<string, Buffer | null>();

/**
 * Loads a key by id from the approved directory.
 *
 * The stored key is raw bytes with a single trailing newline that is NOT part of
 * the key material. No dossier entry says so for this signer: the notes on key
 * loading are all about the other 4 signers, and they do not agree with each
 * other. The strace shows each 33-byte file read whole, ending in "\n", and
 * only the 32-byte key without that newline reproduces the Authorization header
 * on the sample's verified record. The ltrace of the same run settles it:
 * HMAC_Init_ex is called with a key length of 32.
 */
function loadKey(keyId: string): Buffer | null {
  if (keyCache.has(keyId)) return keyCache.get(keyId) ?? null;
  let key: Buffer | null = null;
  if (APPROVED_KEY_IDS.has(keyId)) {
    try {
      const raw = readFileSync(`${KEY_DIR}/${keyId}.key`);
      let end = raw.length;
      while (end > 0 && (raw[end - 1] === 0x0a || raw[end - 1] === 0x0d)) end--;
      key = raw.subarray(0, end);
    } catch {
      key = null;
    }
  }
  keyCache.set(keyId, key);
  return key;
}

function headerValue(
  headers: Array<[string, string]>,
  name: string,
): string | null {
  for (const [n, v] of headers) {
    if (n.toLowerCase() === name) return v.trim();
  }
  return null;
}

function processRecord(rec: InputRecord, seq: number): Evidence {
  const req: ParsedRequest = {
    method: rec.method,
    target: rec.target,
    headers: rec.headers,
    body: rec.body ?? "",
  };

  const qIndex = req.target.indexOf("?");
  const path = qIndex === -1 ? req.target : req.target.slice(0, qIndex);
  const keyId = headerValue(req.headers, "x-gw-key-id") ?? "";
  const canonical = canonicalRequest(req);

  const base: Evidence = {
    seq,
    key_id: keyId,
    method: req.method.toUpperCase(),
    path,
    outcome: "signed",
    signature: "",
    canonical_sha256: sha256Hex(canonical),
  };

  if (keyId === "") {
    return { ...base, outcome: "rejected", reason: "missing-key-id" };
  }

  const key = loadKey(keyId);
  if (key === null) {
    return { ...base, outcome: "rejected", reason: "unknown-key-id" };
  }

  const signature = createHmac("sha256", key)
    .update(canonical, "utf8")
    .digest("hex");

  // An authorization header present means verify; absent means sign.
  const auth = headerValue(req.headers, "authorization");
  if (auth === null) {
    return { ...base, outcome: "signed", signature };
  }

  const prefix = `${SCHEME} keyId=${keyId}, signature=`;
  if (!auth.startsWith(prefix)) {
    return {
      ...base,
      outcome: "rejected",
      signature,
      reason: "malformed-authorization",
    };
  }
  const presented = auth.slice(prefix.length).trim();

  const a = Buffer.from(presented, "utf8");
  const b = Buffer.from(signature, "utf8");
  const ok = a.length === b.length && timingSafeEqual(a, b);

  return ok
    ? { ...base, outcome: "verified", signature }
    : { ...base, outcome: "rejected", signature, reason: "signature-mismatch" };
}

/**
 * Emits evidence fields in a fixed order so output bytes are reproducible.
 */
function emit(ev: Evidence): string {
  const ordered: Record<string, unknown> = {
    seq: ev.seq,
    key_id: ev.key_id,
    method: ev.method,
    path: ev.path,
    outcome: ev.outcome,
    signature: ev.signature,
    canonical_sha256: ev.canonical_sha256,
  };
  if (ev.reason !== undefined) ordered.reason = ev.reason;
  return JSON.stringify(ordered);
}

function main(): void {
  const input = readFileSync(0, "utf8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    process.stderr.write("input is not valid JSON\n");
    process.exit(2);
    return;
  }
  if (!Array.isArray(parsed)) {
    process.stderr.write("input is not a JSON array\n");
    process.exit(2);
    return;
  }
  const records = parsed as InputRecord[];

  const lines = records.map((rec, i) => emit(processRecord(rec, i + 1)));
  process.stdout.write(lines.map((l) => `${l}\n`).join(""));
}

main();
