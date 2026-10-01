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
  if (!ACTIVE_KEYS.has(keyId)) return null;
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

  const signed = rec.headers
    .map(([n, v]) => [n.toLowerCase(), v] as [string, string])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));

  const body = rec.body ?? "";
  const bodyHash = createHash("sha256").update(body, "utf8").digest("hex");

  const canonical = [
    rec.method.toUpperCase(),
    path,
    canonicalQuery,
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    bodyHash,
  ].join("\n");

  return canonical;
}

function getAuthHeader(rec: InputRecord): string | null {
  for (const [n, v] of rec.headers) {
    if (n.toLowerCase() === "authorization") return v;
  }
  return null;
}

function getKeyId(rec: InputRecord): string {
  for (const [n, v] of rec.headers) {
    if (n.toLowerCase() === "x-gw-key-id") return v;
  }
  return "";
}

function getPath(rec: InputRecord): string {
  const target = rec.target;
  const qIndex = target.indexOf("?");
  return qIndex === -1 ? target : target.slice(0, qIndex);
}

function processRecord(rec: InputRecord, seq: number): EvidenceRecord {
  const keyId = getKeyId(rec);
  const canonical = canonicalRequest(rec);
  const canonicalWithNewline = canonical + "\n";
  const canonicalSha = createHash("sha256").update(canonical, "utf8").digest("hex");
  const path = getPath(rec);
  const authHeader = getAuthHeader(rec);

  const evidence: EvidenceRecord = {
    seq,
    key_id: keyId,
    method: rec.method.toUpperCase(),
    path,
    outcome: "signed",
    signature: "",
    canonical_sha256: canonicalSha,
  };

  if (!keyId) {
    evidence.outcome = "rejected";
    evidence.reason = "missing-key-id";
    return evidence;
  }

  const key = loadKey(keyId);
  if (!key) {
    evidence.outcome = "rejected";
    evidence.reason = "unknown-key-id";
    return evidence;
  }

  const hmac = createHmac("sha256", key).update(canonicalWithNewline, "utf8").digest("hex");
  evidence.signature = hmac;

  if (!authHeader) {
    evidence.outcome = "signed";
    return evidence;
  }

  const authMatch = authHeader.match(
    /^GW-HMAC-SHA256 keyId=([^,]+), signature=([^\s]+)\s*$/
  );
  if (!authMatch) {
    evidence.outcome = "rejected";
    evidence.reason = "malformed-authorization";
    return evidence;
  }

  const [, authKeyId, presentedSig] = authMatch;
  if (authKeyId !== keyId) {
    evidence.outcome = "rejected";
    evidence.reason = "malformed-authorization";
    return evidence;
  }

  try {
    const presentedBuf = Buffer.from(presentedSig, "hex");
    const hmacBuf = Buffer.from(hmac, "hex");
    if (presentedBuf.length !== hmacBuf.length || !timingSafeEqual(presentedBuf, hmacBuf)) {
      evidence.outcome = "rejected";
      evidence.reason = "signature-mismatch";
      return evidence;
    }
  } catch {
    evidence.outcome = "rejected";
    evidence.reason = "signature-mismatch";
    return evidence;
  }

  evidence.outcome = "verified";
  return evidence;
}

function main(): void {
  const input = readFileSync(0, "utf8");
  const records = JSON.parse(input) as InputRecord[];

  records.forEach((rec, i) => {
    const evidence = processRecord(rec, i + 1);
    const output: Record<string, unknown> = {
      seq: evidence.seq,
      key_id: evidence.key_id,
      method: evidence.method,
      path: evidence.path,
      outcome: evidence.outcome,
      signature: evidence.signature,
      canonical_sha256: evidence.canonical_sha256,
    };
    if (evidence.reason) {
      output.reason = evidence.reason;
    }
    process.stdout.write(JSON.stringify(output) + "\n");
  });
}

main();
