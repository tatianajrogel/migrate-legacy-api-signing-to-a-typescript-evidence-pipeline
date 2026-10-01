/**
 * GW-HMAC-SHA256 evidence pipeline.
 *
 * Signs or verifies request records under GW-HMAC-SHA256. If a record carries
 * an Authorization header, it is verified. Otherwise, it is signed.
 *
 * The scheme was frozen on 2025-12-02 and went live at the 2025-12-09 rollout.
 * Reference: /app/dossier/01-decision-register.md
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
  outcome: string;
  signature: string;
  canonical_sha256: string;
  reason?: string;
}

function loadKey(keyId: string): Buffer | null {
  try {
    const data = readFileSync(`${KEY_DIR}/${keyId}.key`);
    return data.slice(0, -1);
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

  const signed = rec.headers
    .map(([n, v]) => [n.toLowerCase(), v] as [string, string])
    .filter(([n]) => n.startsWith("x-gw-"))
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));

  const bodyBytes = Buffer.from(rec.body ?? "", "utf8");
  const bodyHash = createHash("sha256").update(bodyBytes).digest("hex");

  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery,
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    bodyHash,
  ].join("\n");
}

function parseAuthorizationHeader(
  header: string,
  keyId: string
): { signature: string; valid: boolean } | null {
  const prefix = `GW-HMAC-SHA256 keyId=${keyId}, signature=`;
  if (!header.startsWith(prefix)) {
    return null;
  }
  const signature = header.slice(prefix.length).trim();
  const valid = /^[0-9a-f]+$/.test(signature) && signature.length === 64;
  return { signature, valid };
}

function getPath(target: string): string {
  const qIndex = target.indexOf("?");
  return qIndex === -1 ? target : target.slice(0, qIndex);
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out: Evidence[] = [];

  records.forEach((rec, i) => {
    const keyId =
      rec.headers.find(([n]) => n.toLowerCase() === "x-gw-key-id")?.[1] ?? "";
    const path = getPath(rec.target);
    const canonical = canonicalRequest(rec);
    const canonicalSha256 = createHash("sha256")
      .update(canonical)
      .digest("hex");

    const authHeader = rec.headers.find(
      ([n]) => n.toLowerCase() === "authorization"
    )?.[1];

    let outcome: string;
    let signature = "";
    let reason: string | undefined;

    if (authHeader) {
      if (!keyId) {
        outcome = "rejected";
        reason = "missing-key-id";
      } else {
        const key = loadKey(keyId);
        if (!key) {
          outcome = "rejected";
          reason = "unknown-key-id";
        } else {
          signature = createHmac("sha256", key)
            .update(canonical)
            .digest("hex");

          const parsed = parseAuthorizationHeader(authHeader, keyId);
          if (!parsed) {
            outcome = "rejected";
            reason = "malformed-authorization";
          } else if (!parsed.valid) {
            outcome = "rejected";
            reason = "malformed-authorization";
          } else {
            const presented = Buffer.from(parsed.signature, "hex");
            const computed = Buffer.from(signature, "hex");
            if (timingSafeEqual(presented, computed)) {
              outcome = "verified";
            } else {
              outcome = "rejected";
              reason = "signature-mismatch";
            }
          }
        }
      }
    } else {
      if (!keyId) {
        outcome = "rejected";
        reason = "missing-key-id";
      } else {
        const key = loadKey(keyId);
        if (!key) {
          outcome = "rejected";
          reason = "unknown-key-id";
        } else {
          signature = createHmac("sha256", key)
            .update(canonical)
            .digest("hex");
          outcome = "signed";
        }
      }
    }

    const evidence: Evidence = {
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

    out.push(evidence);
  });

  process.stdout.write(out.map((e) => `${JSON.stringify(e)}\n`).join(""));
}

main();
