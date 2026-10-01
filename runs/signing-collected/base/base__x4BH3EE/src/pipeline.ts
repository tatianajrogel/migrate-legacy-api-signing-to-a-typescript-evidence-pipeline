import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";
const EMPTY_SHA256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
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
    const raw = readFileSync(`${KEY_DIR}/${keyId}.key`);
    return raw.slice(0, -1);
  } catch {
    return null;
  }
}

function foldWhitespace(value: string): string {
  return value
    .replace(/^[\s\t]+/, "")
    .replace(/[\s\t]+$/, "")
    .replace(/[\s\t]+/g, " ");
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
  pairs.sort((a, b) => {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    if (a[1] < b[1]) return -1;
    if (a[1] > b[1]) return 1;
    return 0;
  });
  const canonicalQuery = pairs.map(([n, v]) => `${n}=${v}`).join("&");

  const signed = rec.headers
    .map(([n, v]) => {
      const lowerName = n.toLowerCase();
      const foldedValue = foldWhitespace(v);
      return [lowerName, foldedValue] as [string, string];
    })
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));

  const body = rec.body ?? "";
  const bodyField = body === ""
    ? EMPTY_SHA256
    : createHash("sha256").update(body, "utf8").digest("hex");

  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery,
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    bodyField,
  ].join("\n");
}

function parseAuthorizationHeader(value: string): { keyId: string; signature: string } | null {
  const match = value.match(/^GW-HMAC-SHA256 keyId=([^,]+), signature=(.+)$/);
  if (!match) return null;
  return { keyId: match[1], signature: match[2].trim() };
}

function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  try {
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out: EvidenceRecord[] = [];

  records.forEach((rec, i) => {
    const keyId =
      rec.headers.find(([n]) => n.toLowerCase() === "x-gw-key-id")?.[1] ?? "";
    const authHeader = rec.headers.find(
      ([n]) => n.toLowerCase() === "authorization"
    )?.[1];
    const qIndex = rec.target.indexOf("?");
    const path = qIndex === -1 ? rec.target : rec.target.slice(0, qIndex);
    const canonical = canonicalRequest(rec);
    const canonicalSha256 = createHash("sha256").update(canonical, "utf8").digest("hex");

    let signature = "";
    let outcome: "signed" | "verified" | "rejected" = "signed";
    let reason: string | undefined;

    if (!keyId) {
      outcome = "rejected";
      reason = "missing-key-id";
    } else {
      const key = loadKey(keyId);
      if (key === null) {
        outcome = "rejected";
        reason = "unknown-key-id";
      } else {
        signature = createHmac("sha256", key).update(canonical, "utf8").digest("hex");

        if (authHeader) {
          const parsed = parseAuthorizationHeader(authHeader);
          if (!parsed) {
            outcome = "rejected";
            reason = "malformed-authorization";
          } else if (!constantTimeCompare(signature, parsed.signature)) {
            outcome = "rejected";
            reason = "signature-mismatch";
          } else {
            outcome = "verified";
          }
        }
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

    out.push(evidence);
  });

  for (const record of out) {
    process.stdout.write(JSON.stringify(record) + "\n");
  }
}

main();
