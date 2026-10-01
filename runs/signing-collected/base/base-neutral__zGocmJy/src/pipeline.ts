/**
 * GW-HMAC-SHA256 evidence pipeline. Fixed port.
 *
 * Properly implements GW-HMAC-SHA256 signing and verification per the scheme
 * as frozen on 2025-12-02 (effective 2025-12-09 rollout).
 */

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";
const ACTIVE_ROSTER = new Set(["gw-prod-01", "gw-prod-02"]);

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
  if (!ACTIVE_ROSTER.has(keyId)) {
    return null;
  }
  try {
    const data = readFileSync(`${KEY_DIR}/${keyId}.key`);
    return data.slice(0, -1); // strip trailing newline
  } catch {
    return null;
  }
}

function canonicalRequest(rec: InputRecord): string {
  const target = rec.target;
  const qIndex = target.indexOf("?");
  const path = qIndex === -1 ? target : target.slice(0, qIndex);
  const query = qIndex === -1 ? "" : target.slice(qIndex + 1);

  // Canonicalise query: sort by parameter name, preserve order for repeated names
  const pairs = query === "" ? [] : query.split("&").map((p) => {
    const eq = p.indexOf("=");
    return eq === -1 ? [p, ""] : [p.slice(0, eq), p.slice(eq + 1)];
  });
  pairs.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  const canonicalQuery = pairs.map(([n, v]) => `${n}=${v}`).join("&");

  // Sign all headers except authorization, lowercased and sorted
  const signed = rec.headers
    .map(([n, v]) => [n.toLowerCase(), v] as [string, string])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));

  // Body hash: always SHA-256 of body bytes (empty string if absent)
  const body = rec.body ?? "";
  const bodyHash = createHash("sha256").update(body, "utf8").digest("hex");

  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery,
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    bodyHash,
  ].join("\n");
}

function constantTimeEqual(a: string, b: string): boolean {
  const aBytes = Buffer.from(a, "hex");
  const bBytes = Buffer.from(b, "hex");
  if (aBytes.length !== bBytes.length) return false;
  return timingSafeEqual(aBytes, bBytes);
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out: EvidenceRecord[] = [];

  records.forEach((rec, i) => {
    const keyIdHeader = rec.headers.find(
      ([n]) => n.toLowerCase() === "x-gw-key-id"
    );
    const keyId = keyIdHeader?.[1] ?? "";
    const canonical = canonicalRequest(rec);
    const canonicalSha256 = createHash("sha256").update(canonical).digest("hex");
    const path = rec.target.split("?")[0];

    const evidence: EvidenceRecord = {
      seq: i + 1,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      path,
      outcome: "signed",
      signature: "",
      canonical_sha256: canonicalSha256,
    };

    const authHeader = rec.headers.find(
      ([n]) => n.toLowerCase() === "authorization"
    );

    if (authHeader) {
      // Verification mode
      if (!keyId) {
        evidence.outcome = "rejected";
        evidence.reason = "missing-key-id";
        out.push(evidence);
        return;
      }

      const key = loadKey(keyId);
      if (!key) {
        evidence.outcome = "rejected";
        evidence.reason = "unknown-key-id";
        out.push(evidence);
        return;
      }

      const authValue = authHeader[1];
      const prefix = `GW-HMAC-SHA256 keyId=${keyId}, signature=`;
      if (!authValue.startsWith(prefix)) {
        evidence.outcome = "rejected";
        evidence.reason = "malformed-authorization";
        out.push(evidence);
        return;
      }

      const presentedSig = authValue.slice(prefix.length).trim();
      const expectedSig = createHmac("sha256", key)
        .update(canonical)
        .digest("hex");

      evidence.signature = expectedSig;

      if (presentedSig.length !== 64 || !/^[0-9a-f]*$/.test(presentedSig)) {
        evidence.outcome = "rejected";
        evidence.reason = "signature-mismatch";
        out.push(evidence);
        return;
      }

      try {
        if (!constantTimeEqual(presentedSig, expectedSig)) {
          evidence.outcome = "rejected";
          evidence.reason = "signature-mismatch";
          out.push(evidence);
          return;
        }
      } catch {
        evidence.outcome = "rejected";
        evidence.reason = "signature-mismatch";
        out.push(evidence);
        return;
      }

      evidence.outcome = "verified";
      out.push(evidence);
    } else {
      // Signing mode
      if (!keyId) {
        evidence.outcome = "rejected";
        evidence.reason = "missing-key-id";
        out.push(evidence);
        return;
      }

      const key = loadKey(keyId);
      if (!key) {
        evidence.outcome = "rejected";
        evidence.reason = "unknown-key-id";
        out.push(evidence);
        return;
      }

      evidence.signature = createHmac("sha256", key)
        .update(canonical)
        .digest("hex");
      evidence.outcome = "signed";
      out.push(evidence);
    }
  });

  process.stdout.write(
    out.map((e) => JSON.stringify(e) + "\n").join("")
  );
}

main();
