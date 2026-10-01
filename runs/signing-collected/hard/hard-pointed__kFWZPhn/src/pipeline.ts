/**
 * GW-HMAC-SHA256 evidence pipeline. Implements the gateway signing scheme as
 * it stood on 2025-12-09 rollout, including reversals from post-register meetings.
 */

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";
const ACTIVE_KEYS = new Set(["gw-prod-01", "gw-prod-02"]);

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
    const content = readFileSync(`${KEY_DIR}/${keyId}.key`, "utf8");
    return Buffer.from(content.replace(/\n$/, ""), "utf8");
  } catch {
    return null;
  }
}

function trimAndSqueeze(value: string): string {
  return value
    .replace(/^[ \t]+/, "")
    .replace(/[ \t]+$/, "")
    .replace(/[ \t]+/g, " ");
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
    .map(([n, v]) => [n.toLowerCase(), trimAndSqueeze(v)] as [string, string])
    .filter(([n]) => n.startsWith("x-gw-"))
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));

  const bodyBytes = rec.body ?? "";
  const bodyField = createHash("sha256").update(bodyBytes, "utf8").digest("hex");

  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery,
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    bodyField,
  ].join("\n");
}

function constantTimeCompare(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) {
    return false;
  }
  try {
    return timingSafeEqual(aBuffer, bBuffer);
  } catch {
    return false;
  }
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];

  records.forEach((rec, i) => {
    const target = rec.target;
    const qIndex = target.indexOf("?");
    const path = qIndex === -1 ? target : target.slice(0, qIndex);

    const keyIdHeader = rec.headers.find(
      ([n]) => n.toLowerCase() === "x-gw-key-id"
    );
    const keyId = keyIdHeader?.[1] ?? "";

    const authHeader = rec.headers.find(
      ([n]) => n.toLowerCase() === "authorization"
    );

    const canonical = canonicalRequest(rec);
    const canonicalSha256 = createHash("sha256")
      .update(canonical, "utf8")
      .digest("hex");

    let outcome: "signed" | "verified" | "rejected";
    let signature = "";
    let reason: string | undefined;

    if (authHeader) {
      if (!keyId) {
        outcome = "rejected";
        reason = "missing-key-id";
      } else if (!ACTIVE_KEYS.has(keyId)) {
        outcome = "rejected";
        reason = "unknown-key-id";
      } else {
        const key = loadKey(keyId)!;
        const expectedSig = createHmac("sha256", key)
          .update(canonical, "utf8")
          .digest("hex");
        signature = expectedSig;

        const authValue = authHeader[1];
        const expectedPrefix = `GW-HMAC-SHA256 keyId=${keyId}, signature=`;
        if (!authValue.startsWith(expectedPrefix)) {
          outcome = "rejected";
          reason = "malformed-authorization";
        } else {
          const presentedSig = authValue.slice(expectedPrefix.length).trim();
          if (constantTimeCompare(presentedSig, expectedSig)) {
            outcome = "verified";
          } else {
            outcome = "rejected";
            reason = "signature-mismatch";
            signature = expectedSig;
          }
        }
      }
    } else {
      if (!keyId) {
        outcome = "rejected";
        reason = "missing-key-id";
      } else if (!ACTIVE_KEYS.has(keyId)) {
        outcome = "rejected";
        reason = "unknown-key-id";
      } else {
        const key = loadKey(keyId)!;
        signature = createHmac("sha256", key)
          .update(canonical, "utf8")
          .digest("hex");
        outcome = "signed";
      }
    }

    const evidence: EvidenceRecord = {
      seq: i + 1,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      path,
      outcome,
      signature,
      canonical_sha256: canonicalSha256,
    };

    if (reason) {
      evidence.reason = reason;
    }

    process.stdout.write(`${JSON.stringify(evidence)}\n`);
  });
}

main();
