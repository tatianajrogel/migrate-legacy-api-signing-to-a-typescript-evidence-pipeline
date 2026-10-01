/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Implements the signing scheme as finalized in the 2025-12-02 scheme-freeze
 * review and deployed 2025-12-09. Handles both signing (for requests without
 * Authorization headers) and verification (for requests carrying one).
 */

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";
const ACTIVE_KEYS = ["gw-prod-01", "gw-prod-02"];

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
  outcome: "signed" | "verified" | "rejected";
  signature: string;
  canonical_sha256: string;
  reason?: string;
}

function loadKey(keyId: string): Buffer | null {
  try {
    const keyData = readFileSync(`${KEY_DIR}/${keyId}.key`, "utf8").trim();
    return Buffer.from(keyData, "utf8");
  } catch {
    return null;
  }
}

function canonicalRequest(rec: InputRecord): string {
  const target = rec.target;
  const qIndex = target.indexOf("?");
  const path = qIndex === -1 ? target : target.slice(0, qIndex);
  const query = qIndex === -1 ? "" : target.slice(qIndex + 1);

  const pairs = query === "" ? [] : query.split("&").map((p) => {
    const eq = p.indexOf("=");
    return eq === -1 ? [p, ""] : [p.slice(0, eq), p.slice(eq + 1)];
  });
  pairs.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  const canonicalQuery = pairs.map(([n, v]) => `${n}=${v}`).join("&");

  // Sign ALL headers except Authorization (GW-023 superseded)
  const signed = rec.headers
    .map(([n, v]) => [n.toLowerCase(), v] as [string, string])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));

  // Body hash: SHA-256 of body bytes (empty string if no body) (GW-009 superseded)
  const body = rec.body ?? "";
  const bodyHash = createHash("sha256").update(body, "utf8").digest("hex");

  // Canonical request: 6 fields joined by LF, NO trailing newline (GW-052 superseded)
  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery,
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    bodyHash,
  ].join("\n");
}

function parseAuthorizationHeader(header: string): { keyId: string; signature: string } | null {
  const expected = "GW-HMAC-SHA256 keyId=";
  if (!header.startsWith(expected)) return null;

  const rest = header.slice(expected.length);
  const commaIdx = rest.indexOf(", signature=");
  if (commaIdx === -1) return null;

  const keyId = rest.slice(0, commaIdx);
  const signature = rest.slice(commaIdx + ", signature=".length);

  return { keyId, signature };
}

function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const evidence: Evidence[] = [];

  records.forEach((rec, i) => {
    const seq = i + 1;
    const keyIdHeader = rec.headers.find(([n]) => n.toLowerCase() === "x-gw-key-id");
    const keyId = keyIdHeader?.[1] ?? "";
    const authHeader = rec.headers.find(([n]) => n.toLowerCase() === "authorization")?.[1];

    const target = rec.target;
    const qIndex = target.indexOf("?");
    const path = qIndex === -1 ? target : target.slice(0, qIndex);

    const canonical = canonicalRequest(rec);
    const canonicalSha256 = createHash("sha256").update(canonical, "utf8").digest("hex");

    const result: Evidence = {
      seq,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      path,
      outcome: "signed",
      signature: "",
      canonical_sha256: canonicalSha256,
    };

    // Check if key exists
    const key = loadKey(keyId);

    if (authHeader) {
      // Request carries Authorization header: verify it
      if (!keyId) {
        result.outcome = "rejected";
        result.reason = "missing-key-id";
      } else if (!ACTIVE_KEYS.includes(keyId)) {
        result.outcome = "rejected";
        result.reason = "unknown-key-id";
        result.signature = "";
      } else {
        // Key exists, parse and verify authorization
        const auth = parseAuthorizationHeader(authHeader);
        if (!auth) {
          result.outcome = "rejected";
          result.reason = "malformed-authorization";
          result.signature = key ? createHmac("sha256", key).update(canonical, "utf8").digest("hex") : "";
        } else if (auth.keyId !== keyId) {
          result.outcome = "rejected";
          result.reason = "malformed-authorization";
          result.signature = key ? createHmac("sha256", key).update(canonical, "utf8").digest("hex") : "";
        } else {
          // Compute signature and compare
          if (!key) {
            result.outcome = "rejected";
            result.reason = "unknown-key-id";
            result.signature = "";
          } else {
            const computed = createHmac("sha256", key).update(canonical, "utf8").digest("hex");
            result.signature = computed;
            if (timingSafeCompare(computed, auth.signature.trim())) {
              result.outcome = "verified";
            } else {
              result.outcome = "rejected";
              result.reason = "signature-mismatch";
            }
          }
        }
      }
    } else {
      // Request has no Authorization header: sign it
      if (!keyId) {
        result.outcome = "rejected";
        result.reason = "missing-key-id";
        result.signature = "";
      } else if (!ACTIVE_KEYS.includes(keyId)) {
        result.outcome = "rejected";
        result.reason = "unknown-key-id";
        result.signature = "";
      } else if (!key) {
        result.outcome = "rejected";
        result.reason = "unknown-key-id";
        result.signature = "";
      } else {
        result.outcome = "signed";
        result.signature = createHmac("sha256", key).update(canonical, "utf8").digest("hex");
      }
    }

    evidence.push(result);
  });

  // Output newline-delimited JSON
  evidence.forEach((e) => {
    const output: Record<string, unknown> = {
      seq: e.seq,
      key_id: e.key_id,
      method: e.method,
      path: e.path,
      outcome: e.outcome,
      signature: e.signature,
      canonical_sha256: e.canonical_sha256,
    };
    if (e.reason) {
      output.reason = e.reason;
    }
    process.stdout.write(JSON.stringify(output) + "\n");
  });
}

main();
