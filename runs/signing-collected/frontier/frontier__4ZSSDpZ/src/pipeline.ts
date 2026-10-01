/**
 * GW-HMAC-SHA256 evidence pipeline. INCOMPLETE PORT.
 *
 * This is where the migration stalled. The legacy signer was a 900-line Perl
 * script; this port covers the plumbing and takes its canonicalisation from
 * the decision register.
 *
 * It runs. It produces evidence. The signatures do not match the gateway.
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

// Active roster: the keys the legacy request signer actually loads on the
// production host (captures/legacy-signer.strace). gw-prod-03 belongs to the
// export signer and is not eligible for request signing.
const ROSTER = new Set(["gw-prod-01", "gw-prod-02"]);

const SCHEME = "GW-HMAC-SHA256";

function loadKey(keyId: string): Buffer | null {
  if (!ROSTER.has(keyId)) return null;
  try {
    // The legacy signer hands HMAC the key without its line ending.
    return Buffer.from(
      readFileSync(`${KEY_DIR}/${keyId}.key`, "utf8").replace(/\r?\n$/, ""),
      "utf8",
    );
  } catch {
    return null;
  }
}

const byteCmp = (a: string, b: string): number =>
  Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));

function canonicalRequest(rec: InputRecord): string {
  const target = rec.target;
  const qIndex = target.indexOf("?");
  const path = qIndex === -1 ? target : target.slice(0, qIndex);
  const query = qIndex === -1 ? "" : target.slice(qIndex + 1);

  // Sorted by name, then by value, raw bytes, nothing decoded.
  const pairs: Array<[string, string]> = query === "" ? [] : query.split("&").map((p) => {
    const eq = p.indexOf("=");
    return (eq === -1 ? [p, ""] : [p.slice(0, eq), p.slice(eq + 1)]) as [string, string];
  });
  pairs.sort((a, b) => byteCmp(a[0], b[0]) || byteCmp(a[1], b[1]));
  const canonicalQuery = pairs.map(([n, v]) => `${n}=${v}`).join("&");

  // Every header except authorization; values stripped of spaces/tabs at the
  // ends and inner runs of spaces/tabs collapsed to one space.
  const signed = rec.headers
    .map(([n, v]) => [
      n.toLowerCase(),
      v.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " "),
    ] as [string, string])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => byteCmp(a[0], b[0]));

  const bodyField = createHash("sha256").update(rec.body ?? "", "utf8").digest("hex");

  // No trailing newline after the last field.
  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery,
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    bodyField,
  ].join("\n");
}

function headerValue(rec: InputRecord, name: string): string | undefined {
  return rec.headers.find(([n]) => n.toLowerCase() === name)?.[1];
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out: string[] = [];

  records.forEach((rec, i) => {
    const keyId = headerValue(rec, "x-gw-key-id") ?? "";
    const method = rec.method.toUpperCase();
    const q = rec.target.indexOf("?");
    const path = q === -1 ? rec.target : rec.target.slice(0, q);
    const canonical = canonicalRequest(rec);
    const canonicalSha = createHash("sha256").update(canonical, "utf8").digest("hex");
    const auth = headerValue(rec, "authorization");
    const key = keyId === "" ? null : loadKey(keyId);
    const signature = key === null
      ? ""
      : createHmac("sha256", key).update(canonical, "utf8").digest("hex");

    let outcome: "signed" | "verified" | "rejected" = auth === undefined ? "signed" : "verified";
    let reason: string | undefined;
    if (keyId === "") {
      reason = "missing-key-id";
    } else if (key === null) {
      reason = "unknown-key-id";
    } else if (auth !== undefined) {
      const prefix = `${SCHEME} keyId=${keyId}, signature=`;
      if (!auth.startsWith(prefix)) {
        reason = "malformed-authorization";
      } else {
        const presented = Buffer.from(auth.slice(prefix.length).trim(), "utf8");
        const expected = Buffer.from(signature, "utf8");
        if (presented.length !== expected.length || !timingSafeEqual(presented, expected)) {
          reason = "signature-mismatch";
        }
      }
    }
    if (reason !== undefined) outcome = "rejected";

    const ev: Record<string, string | number> = {
      seq: i + 1,
      key_id: keyId,
      method,
      path,
      outcome,
      signature,
      canonical_sha256: canonicalSha,
    };
    if (reason !== undefined) ev.reason = reason;
    out.push(JSON.stringify(ev));
  });

  process.stdout.write(out.map((l) => `${l}\n`).join(""));
}

main();
