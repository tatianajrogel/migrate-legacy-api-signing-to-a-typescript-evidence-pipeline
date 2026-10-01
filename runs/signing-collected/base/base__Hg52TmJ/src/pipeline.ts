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

function foldHeaderValue(value: string): string {
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
  pairs.sort((a, b) => {
    const nameCmp = a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
    if (nameCmp !== 0) return nameCmp;
    return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0;
  });
  const canonicalQuery = pairs.map(([n, v]) => `${n}=${v}`).join("&");

  const signed = rec.headers
    .map(([n, v]) => {
      const lower = n.toLowerCase();
      if (lower === "authorization") return null;
      return [lower, foldHeaderValue(v)] as [string, string];
    })
    .filter((x): x is [string, string] => x !== null)
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
  ].join("\n");
}

function getAuthorizationHeader(rec: InputRecord): string | null {
  return rec.headers.find(([n]) => n.toLowerCase() === "authorization")?.[1] ?? null;
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out: EvidenceRecord[] = [];

  records.forEach((rec, i) => {
    const keyId =
      rec.headers.find(([n]) => n.toLowerCase() === "x-gw-key-id")?.[1] ?? "";
    const canonical = canonicalRequest(rec);
    const canonicalSha256 = createHash("sha256").update(canonical, "utf8").digest("hex");
    const authHeader = getAuthorizationHeader(rec);

    let outcome: "signed" | "verified" | "rejected" = "signed";
    let signature = "";
    let reason: string | undefined;

    const key = loadKey(keyId);

    if (authHeader) {
      if (!keyId) {
        outcome = "rejected";
        reason = "missing-key-id";
      } else if (!key) {
        outcome = "rejected";
        reason = "unknown-key-id";
      } else {
        signature = createHmac("sha256", key).update(canonical, "utf8").digest("hex");
        const authMatch = authHeader.match(
          /^GW-HMAC-SHA256 keyId=([^,]+), signature=(.+)$/
        );
        if (!authMatch) {
          outcome = "rejected";
          reason = "malformed-authorization";
        } else {
          const [, extractedKeyId, presentedSig] = authMatch;
          if (extractedKeyId !== keyId) {
            outcome = "rejected";
            reason = "malformed-authorization";
          } else {
            const trimmedPresented = presentedSig.trim();
            try {
              const presentedBuf = Buffer.from(trimmedPresented, "hex");
              const computedBuf = Buffer.from(signature, "hex");
              if (presentedBuf.length === computedBuf.length &&
                  timingSafeEqual(presentedBuf, computedBuf)) {
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
    } else {
      if (!keyId) {
        outcome = "rejected";
        reason = "missing-key-id";
      } else if (!key) {
        outcome = "rejected";
        reason = "unknown-key-id";
      } else {
        signature = createHmac("sha256", key).update(canonical, "utf8").digest("hex");
        outcome = "signed";
      }
    }

    const target = rec.target;
    const qIndex = target.indexOf("?");
    const path = qIndex === -1 ? target : target.slice(0, qIndex);

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

  process.stdout.write(out.map((e) => JSON.stringify(e) + "\n").join(""));
}

main();
