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
    const content = readFileSync(`${KEY_DIR}/${keyId}.key`, "utf8");
    const trimmed = content.endsWith("\n") ? content.slice(0, -1) : content;
    return Buffer.from(trimmed);
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

  const allHeaders = rec.headers
    .map(([n, v]) => [n.toLowerCase(), v] as [string, string])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));

  const body = rec.body ?? "";
  const bodyHash = createHash("sha256").update(body, "utf8").digest("hex");

  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery,
    allHeaders.map(([n, v]) => `${n}:${v}`).join("\n"),
    allHeaders.map(([n]) => n).join(";"),
    bodyHash,
  ].join("\n");
}

function parseAuthorizationHeader(
  header: string
): { keyId: string; signature: string } | null {
  if (!header.startsWith("GW-HMAC-SHA256 ")) {
    return null;
  }
  const rest = header.slice(15);
  const match = rest.match(/^keyId=([^,]+),\s*signature=(.*)$/);
  if (!match) {
    return null;
  }
  return { keyId: match[1], signature: match[2] };
}

function processRecord(rec: InputRecord, seq: number): Evidence {
  const keyId =
    rec.headers.find(([n]) => n.toLowerCase() === "x-gw-key-id")?.[1] ?? "";
  const canonical = canonicalRequest(rec);
  const canonicalSha256 = createHash("sha256")
    .update(canonical, "utf8")
    .digest("hex");

  const authHeader = rec.headers.find(
    ([n]) => n.toLowerCase() === "authorization"
  )?.[1];

  const evidence: Evidence = {
    seq,
    key_id: keyId,
    method: rec.method.toUpperCase(),
    path: rec.target.split("?")[0],
    outcome: "signed",
    signature: "",
    canonical_sha256: canonicalSha256,
  };

  if (!keyId && !authHeader) {
    evidence.outcome = "rejected";
    evidence.reason = "missing-key-id";
    return evidence;
  }

  if (keyId && !ACTIVE_KEYS.has(keyId)) {
    evidence.outcome = "rejected";
    evidence.reason = "unknown-key-id";
    return evidence;
  }

  let key: Buffer | null = null;
  if (keyId) {
    key = loadKey(keyId);
    if (!key) {
      evidence.outcome = "rejected";
      evidence.reason = "unknown-key-id";
      return evidence;
    }
    evidence.signature = createHmac("sha256", key)
      .update(canonical, "utf8")
      .digest("hex");
  }

  if (authHeader) {
    const parsed = parseAuthorizationHeader(authHeader);

    if (!parsed) {
      evidence.outcome = "rejected";
      evidence.reason = "malformed-authorization";
      return evidence;
    }

    if (!keyId) {
      evidence.outcome = "rejected";
      evidence.reason = "missing-key-id";
      return evidence;
    }

    if (!parsed.signature.match(/^[0-9a-fA-F]*$/)) {
      evidence.outcome = "rejected";
      evidence.reason = "signature-mismatch";
      return evidence;
    }

    const presentedSig = parsed.signature.toLowerCase();
    try {
      if (timingSafeEqual(Buffer.from(evidence.signature), Buffer.from(presentedSig))) {
        evidence.outcome = "verified";
      } else {
        evidence.outcome = "rejected";
        evidence.reason = "signature-mismatch";
      }
    } catch {
      evidence.outcome = "rejected";
      evidence.reason = "signature-mismatch";
    }

    return evidence;
  }

  evidence.outcome = "signed";
  return evidence;
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];

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
