/**
 * GW-HMAC-SHA256 evidence pipeline. Scheme per the meeting-note reversals (GW-009/017/023/041/052).
 *
 * This is where the migration stalled. The legacy signer was a 900-line Perl
 * script; this port covers the plumbing but the canonicalisation was written
 * from the decision register alone, before anyone read the meeting notes.
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

// Active roster per captures: the legacy signer opened only these two keys.
const ROSTER = new Set(["gw-prod-01", "gw-prod-02"]);
const SCHEME = "GW-HMAC-SHA256";

function loadKey(keyId: string): Buffer | null {
  if (!ROSTER.has(keyId)) return null;
  try {
    // The key files end in a newline that is not part of the secret.
    return Buffer.from(readFileSync(`${KEY_DIR}/${keyId}.key`, "utf8").replace(/[\r\n]+$/, ""), "utf8");
  } catch {
    return null;
  }
}

const cmp = (a: string, b: string): number =>
  Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));

const fold = (v: string): string =>
  v.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ");

function findHeader(rec: InputRecord, name: string): string | undefined {
  return rec.headers.find(([n]) => n.toLowerCase() === name)?.[1];
}

function canonicalRequest(rec: InputRecord): string {
  const target = rec.target;
  const qIndex = target.indexOf("?");
  const path = qIndex === -1 ? target : target.slice(0, qIndex);
  const query = qIndex === -1 ? "" : target.slice(qIndex + 1);

  const pairs: Array<[string, string]> = query === "" ? [] : query.split("&").map((p) => {
    const eq = p.indexOf("=");
    return (eq === -1 ? [p, ""] : [p.slice(0, eq), p.slice(eq + 1)]) as [string, string];
  });
  pairs.sort((a, b) => cmp(a[0], b[0]) || cmp(a[1], b[1]));
  const canonicalQuery = pairs.map(([n, v]) => `${n}=${v}`).join("&");

  const signed = rec.headers
    .map(([n, v]) => [n.toLowerCase(), fold(v)] as [string, string])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => cmp(a[0], b[0]));

  const body = rec.body ?? "";
  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery,
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    createHash("sha256").update(body, "utf8").digest("hex"),
  ].join("\n");
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out: string[] = [];

  records.forEach((rec, i) => {
    const keyId = findHeader(rec, "x-gw-key-id") ?? "";
    const canonical = canonicalRequest(rec);
    const key = keyId === "" ? null : loadKey(keyId);
    const signature = key === null
      ? ""
      : createHmac("sha256", key).update(canonical, "utf8").digest("hex");
    const auth = findHeader(rec, "authorization");
    const target = rec.target;
    const q = target.indexOf("?");

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

    const ev: Record<string, unknown> = {
      seq: i + 1,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      path: q === -1 ? target : target.slice(0, q),
      outcome,
      signature,
      canonical_sha256: createHash("sha256").update(canonical, "utf8").digest("hex"),
    };
    if (reason !== undefined) ev.reason = reason;
    out.push(JSON.stringify(ev));
  });

  process.stdout.write(out.map((l) => `${l}\n`).join(""));
}

main();
