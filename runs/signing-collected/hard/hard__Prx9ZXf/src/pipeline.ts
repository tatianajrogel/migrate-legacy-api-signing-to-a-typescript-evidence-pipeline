/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Signs or verifies HTTP request records under GW-HMAC-SHA256.
 * Records with Authorization headers are verified, others are signed.
 */

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";

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
    return readFileSync(`${KEY_DIR}/${keyId}.key`);
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

  // All headers except Authorization (case-insensitive check)
  const signed = rec.headers
    .map(([n, v]) => [n.toLowerCase(), v] as [string, string])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));

  const body = rec.body ?? "";
  const bodyHash = createHash("sha256").update(body, "utf8").digest("hex");

  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery,
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    bodyHash,
  ].join("\n") + "\n";
}

function extractPath(target: string): string {
  const qIndex = target.indexOf("?");
  return qIndex === -1 ? target : target.slice(0, qIndex);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  try {
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

function parseAuthorizationHeader(value: string): { keyId: string; signature: string } | null {
  const trimmed = value.trim();
  const prefix = "GW-HMAC-SHA256 keyId=";
  if (!trimmed.startsWith(prefix)) return null;

  const rest = trimmed.slice(prefix.length);
  const commaIdx = rest.indexOf(",");
  if (commaIdx === -1) return null;

  const keyId = rest.slice(0, commaIdx);
  const sigPart = rest.slice(commaIdx + 1).trim();

  if (!sigPart.startsWith("signature=")) return null;

  const signature = sigPart.slice("signature=".length).trim();
  return { keyId, signature };
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out: Evidence[] = [];

  records.forEach((rec, i) => {
    const keyId =
      rec.headers.find(([n]) => n.toLowerCase() === "x-gw-key-id")?.[1] ?? "";
    const authHeader = rec.headers.find(([n]) => n.toLowerCase() === "authorization");
    const path = extractPath(rec.target);
    const canonical = canonicalRequest(rec);
    const canonicalSha256 = createHash("sha256").update(canonical).digest("hex");

    const evidence: Evidence = {
      seq: i + 1,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      path,
      outcome: "signed",
      signature: "",
      canonical_sha256: canonicalSha256,
    };

    // Load key once
    const key = keyId === "" ? null : loadKey(keyId);

    // Determine mode: verify if Authorization header present, else sign
    if (authHeader) {
      // Verification mode
      if (keyId === "") {
        evidence.outcome = "rejected";
        evidence.reason = "missing-key-id";
        evidence.signature = "";
      } else if (key === null) {
        evidence.outcome = "rejected";
        evidence.reason = "unknown-key-id";
        evidence.signature = "";
      } else {
        // Compute signature
        const computedSig = createHmac("sha256", key).update(canonical).digest("hex");
        evidence.signature = computedSig;

        // Parse authorization header
        const authValue = authHeader[1];
        const parsed = parseAuthorizationHeader(authValue);

        if (parsed === null) {
          evidence.outcome = "rejected";
          evidence.reason = "malformed-authorization";
        } else if (parsed.keyId !== keyId) {
          // Key ID mismatch is malformed
          evidence.outcome = "rejected";
          evidence.reason = "malformed-authorization";
        } else {
          // Compare signatures with constant-time comparison
          if (constantTimeEqual(computedSig, parsed.signature)) {
            evidence.outcome = "verified";
          } else {
            evidence.outcome = "rejected";
            evidence.reason = "signature-mismatch";
          }
        }
      }
    } else {
      // Signing mode
      if (keyId === "") {
        evidence.outcome = "rejected";
        evidence.reason = "missing-key-id";
        evidence.signature = "";
      } else if (key === null) {
        evidence.outcome = "rejected";
        evidence.reason = "unknown-key-id";
        evidence.signature = "";
      } else {
        evidence.signature = createHmac("sha256", key).update(canonical).digest("hex");
        evidence.outcome = "signed";
      }
    }

    out.push(evidence);
  });

  // Write NDJSON
  process.stdout.write(out.map((e) => JSON.stringify(e) + "\n").join(""));
}

main();
