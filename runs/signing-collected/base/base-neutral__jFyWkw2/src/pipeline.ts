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
  try {
    return readFileSync(`${KEY_DIR}/${keyId}.key`);
  } catch {
    return null;
  }
}

function timingSafeCompare(a: string, b: string): boolean {
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}


function processRecord(
  rec: InputRecord,
  seq: number,
): EvidenceRecord {
  const target = rec.target;
  const qIndex = target.indexOf("?");
  const path = qIndex === -1 ? target : target.slice(0, qIndex);
  const query = qIndex === -1 ? "" : target.slice(qIndex + 1);

  const pairs = query === "" ? [] : query.split("&").map((p) => {
    const eq = p.indexOf("=");
    return eq === -1 ? [p, ""] : [p.slice(0, eq), p.slice(eq + 1)];
  });
  pairs.sort((a, b) => {
    if (a[0] !== b[0]) {
      return a[0] < b[0] ? -1 : 1;
    }
    return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0;
  });
  const canonicalQuery = pairs.map(([n, v]) => `${n}=${v}`).join("&");

  const keyIdHeader = rec.headers.find(
    ([n]) => n.toLowerCase() === "x-gw-key-id",
  );
  const keyId = keyIdHeader?.[1] ?? "";

  const authHeader = rec.headers.find(
    ([n]) => n.toLowerCase() === "authorization",
  );

  const canonicalHeaders = rec.headers
    .map(([n, v]) => [n.toLowerCase(), v] as [string, string])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));

  const body = rec.body ?? "";
  const bodyHash = createHash("sha256").update(body, "utf8").digest("hex");

  const canonical = [
    rec.method.toUpperCase(),
    path,
    canonicalQuery,
    canonicalHeaders.map(([n, v]) => `${n}:${v}`).join("\n"),
    canonicalHeaders.map(([n]) => n).join(";"),
    bodyHash,
  ].join("\n");

  const canonicalSha256 = createHash("sha256").update(canonical, "utf8").digest("hex");

  if (!keyId) {
    return {
      seq,
      key_id: "",
      method: rec.method.toUpperCase(),
      path,
      outcome: "rejected",
      signature: "",
      canonical_sha256: canonicalSha256,
      reason: "missing-key-id",
    };
  }

  if (!ACTIVE_ROSTER.has(keyId)) {
    return {
      seq,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      path,
      outcome: "rejected",
      signature: "",
      canonical_sha256: canonicalSha256,
      reason: "unknown-key-id",
    };
  }

  const key = loadKey(keyId);
  if (!key) {
    return {
      seq,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      path,
      outcome: "rejected",
      signature: "",
      canonical_sha256: canonicalSha256,
      reason: "unknown-key-id",
    };
  }

  const signature = createHmac("sha256", key)
    .update(canonical, "utf8")
    .digest("hex");

  if (!authHeader) {
    return {
      seq,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      path,
      outcome: "signed",
      signature,
      canonical_sha256: canonicalSha256,
    };
  }

  const authValue = authHeader[1];
  const authMatch = authValue.match(
    /^GW-HMAC-SHA256 keyId=(.+?), signature=(.+)$/,
  );
  if (!authMatch) {
    return {
      seq,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      path,
      outcome: "rejected",
      signature,
      canonical_sha256: canonicalSha256,
      reason: "malformed-authorization",
    };
  }

  const presentedKeyId = authMatch[1];
  const presentedSignature = authMatch[2].trim();

  if (presentedKeyId !== keyId) {
    return {
      seq,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      path,
      outcome: "rejected",
      signature,
      canonical_sha256: canonicalSha256,
      reason: "malformed-authorization",
    };
  }

  const isValid = timingSafeCompare(signature, presentedSignature);
  return {
    seq,
    key_id: keyId,
    method: rec.method.toUpperCase(),
    path,
    outcome: isValid ? "verified" : "rejected",
    signature,
    canonical_sha256: canonicalSha256,
    ...(isValid ? {} : { reason: "signature-mismatch" }),
  };
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out: EvidenceRecord[] = [];

  records.forEach((rec, i) => {
    out.push(processRecord(rec, i + 1));
  });

  out.forEach((evidence) => {
    process.stdout.write(`${JSON.stringify(evidence)}\n`);
  });
}

main();
