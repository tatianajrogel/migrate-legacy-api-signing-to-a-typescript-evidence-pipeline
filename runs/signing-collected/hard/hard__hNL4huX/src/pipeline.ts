/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Signs or verifies requests under the GW-HMAC-SHA256 scheme, as defined in
 * the decision register. Emits evidence as newline-delimited JSON.
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

interface EvidenceRecord {
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

function getPath(target: string): string {
  const qIndex = target.indexOf("?");
  return qIndex === -1 ? target : target.slice(0, qIndex);
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

  const signed = rec.headers
    .map(([n, v]) => [n.toLowerCase(), v] as [string, string])
    .filter(([n]) => n.startsWith("x-gw-"))
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));

  const body = rec.body ?? "";
  const bodyField = body === ""
    ? "UNSIGNED"
    : createHash("sha256").update(body, "utf8").digest("hex");

  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery,
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    bodyField,
  ].join("\n") + "\n";
}

function parseAuthHeader(header: string): { keyId: string; signature: string } | null {
  const match = header.match(/^GW-HMAC-SHA256 keyId=([^,]+), signature=(.+)$/);
  return match ? { keyId: match[1], signature: match[2].trim() } : null;
}

function isHexString(s: string): boolean {
  return /^[0-9a-fA-F]*$/.test(s);
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const evidence: EvidenceRecord[] = [];

  records.forEach((rec, i) => {
    const keyId =
      rec.headers.find(([n]) => n.toLowerCase() === "x-gw-key-id")?.[1] ?? "";
    const authHeader = rec.headers.find(([n]) => n.toLowerCase() === "authorization")?.[1];

    const canonical = canonicalRequest(rec);
    const canonical_sha256 = createHash("sha256").update(canonical, "utf8").digest("hex");
    const path = getPath(rec.target);
    const method = rec.method.toUpperCase();

    let outcome: "signed" | "verified" | "rejected";
    let signature = "";
    let reason: string | undefined;

    if (authHeader) {
      // Verification mode
      const parsed = parseAuthHeader(authHeader);
      if (!parsed) {
        outcome = "rejected";
        reason = "malformed-authorization";
        if (keyId) {
          const key = loadKey(keyId);
          if (key) {
            signature = createHmac("sha256", key).update(canonical, "utf8").digest("hex");
          }
        }
      } else {
        // Check if keyId from Authorization matches x-gw-key-id
        if (parsed.keyId !== keyId) {
          outcome = "rejected";
          reason = "malformed-authorization";
          if (keyId) {
            const key = loadKey(keyId);
            if (key) {
              signature = createHmac("sha256", key).update(canonical, "utf8").digest("hex");
            }
          }
        } else {
          // keyIds match, proceed with verification
          if (!keyId) {
            outcome = "rejected";
            reason = "missing-key-id";
          } else {
            const key = loadKey(keyId);
            if (!key) {
              outcome = "rejected";
              reason = "unknown-key-id";
            } else {
              signature = createHmac("sha256", key).update(canonical, "utf8").digest("hex");

              // Verify signature with constant-time comparison
              const presentedSig = parsed.signature;
              if (!isHexString(presentedSig) || presentedSig.length !== signature.length) {
                outcome = "rejected";
                reason = "signature-mismatch";
              } else {
                try {
                  const presentedBuf = Buffer.from(presentedSig, "hex");
                  const expectedBuf = Buffer.from(signature, "hex");
                  if (timingSafeEqual(presentedBuf, expectedBuf)) {
                    outcome = "verified";
                  } else {
                    outcome = "rejected";
                    reason = "signature-mismatch";
                  }
                } catch {
                  outcome = "rejected";
                  reason = "signature-mismatch";
                }
              }
            }
          }
        }
      }
    } else {
      // Signing mode
      if (!keyId) {
        outcome = "rejected";
        reason = "missing-key-id";
      } else {
        const key = loadKey(keyId);
        if (!key) {
          outcome = "rejected";
          reason = "unknown-key-id";
        } else {
          signature = createHmac("sha256", key).update(canonical, "utf8").digest("hex");
          outcome = "signed";
        }
      }
    }

    const ev: EvidenceRecord = {
      seq: i + 1,
      key_id: keyId,
      method,
      path,
      outcome,
      signature,
      canonical_sha256,
    };

    if (reason) {
      ev.reason = reason;
    }

    evidence.push(ev);
  });

  const output = evidence.map((ev) => JSON.stringify(ev)).join("\n") + "\n";
  process.stdout.write(output);
}

main();
