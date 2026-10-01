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
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));

  const body = rec.body ?? "";
  const bodyField = createHash("sha256").update(body, "utf8").digest("hex");

  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery,
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    bodyField,
  ].join("\n");
}

function parseAuthorizationHeader(
  header: string,
  keyId: string
): { parsedKeyId: string; signature: string } | null {
  const prefix = "GW-HMAC-SHA256 keyId=";
  if (!header.startsWith(prefix)) {
    return null;
  }

  const after = header.slice(prefix.length);
  const commaIdx = after.indexOf(", signature=");
  if (commaIdx === -1) {
    return null;
  }

  const parsedKeyId = after.slice(0, commaIdx);
  const signature = after.slice(commaIdx + ", signature=".length).trim();

  if (parsedKeyId !== keyId) {
    return null;
  }

  return { parsedKeyId, signature };
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out: EvidenceRecord[] = [];

  records.forEach((rec, i) => {
    const qIndex = rec.target.indexOf("?");
    const path = qIndex === -1 ? rec.target : rec.target.slice(0, qIndex);

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

    const evidence: EvidenceRecord = {
      seq: i + 1,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      path,
      outcome: "signed",
      signature: "",
      canonical_sha256: canonicalSha256,
    };

    if (authHeader) {
      if (!keyId) {
        evidence.outcome = "rejected";
        evidence.reason = "missing-key-id";
      } else {
        const key = loadKey(keyId);
        if (!key) {
          evidence.outcome = "rejected";
          evidence.reason = "unknown-key-id";
        } else {
          const parsed = parseAuthorizationHeader(authHeader[1], keyId);
          if (!parsed) {
            evidence.outcome = "rejected";
            evidence.reason = "malformed-authorization";
            evidence.signature = createHmac("sha256", key)
              .update(canonical, "utf8")
              .digest("hex");
          } else {
            evidence.signature = createHmac("sha256", key)
              .update(canonical, "utf8")
              .digest("hex");

            const presented = Buffer.from(parsed.signature, "hex");
            const computed = Buffer.from(evidence.signature, "hex");

            if (presented.length !== computed.length) {
              evidence.outcome = "rejected";
              evidence.reason = "signature-mismatch";
            } else {
              try {
                if (timingSafeEqual(presented, computed)) {
                  evidence.outcome = "verified";
                } else {
                  evidence.outcome = "rejected";
                  evidence.reason = "signature-mismatch";
                }
              } catch {
                evidence.outcome = "rejected";
                evidence.reason = "signature-mismatch";
              }
            }
          }
        }
      }
    } else {
      if (!keyId) {
        evidence.outcome = "rejected";
        evidence.reason = "missing-key-id";
      } else {
        const key = loadKey(keyId);
        if (!key) {
          evidence.outcome = "rejected";
          evidence.reason = "unknown-key-id";
        } else {
          evidence.signature = createHmac("sha256", key)
            .update(canonical, "utf8")
            .digest("hex");
          evidence.outcome = "signed";
        }
      }
    }

    out.push(evidence);
  });

  out.forEach((evidence) => {
    process.stdout.write(JSON.stringify(evidence) + "\n");
  });
}

main();
