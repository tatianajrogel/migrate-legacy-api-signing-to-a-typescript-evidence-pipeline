/**
 * GW-HMAC-SHA256 evidence pipeline. Signs/verifies per the scheme as of the 2025-12-09 rollout.
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
// Active roster: the keys the legacy signer opened (strace/lsof). gw-prod-03 is not active yet.
const ROSTER = new Set(["gw-prod-01", "gw-prod-02"]);
const STRIP_KEY_NEWLINE = true;

interface InputRecord {
  method: string;
  target: string;
  headers: Array<[string, string]>;
  body?: string;
}

function loadKey(keyId: string): Buffer | null {
  if (!ROSTER.has(keyId)) return null;
  try {
    const raw = readFileSync(`${KEY_DIR}/${keyId}.key`);
    return STRIP_KEY_NEWLINE ? Buffer.from(raw.toString("utf8").replace(/\n+$/, ""), "utf8") : raw;
  } catch {
    return null;
  }
}

const cmp = (a: string, b: string): number => Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));

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
    .map(([n, v]) => [n.toLowerCase(), v.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ")] as [string, string])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => cmp(a[0], b[0]));

  const bodyHash = createHash("sha256").update(rec.body ?? "", "utf8").digest("hex");

  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery,
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    bodyHash,
  ].join("\n");
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out: string[] = [];

  records.forEach((rec, i) => {
    const headers = rec.headers ?? [];
    rec.headers = headers;
    const keyId = headers.find(([n]) => n.toLowerCase() === "x-gw-key-id")?.[1] ?? "";
    const auth = headers.find(([n]) => n.toLowerCase() === "authorization")?.[1];
    const canonical = canonicalRequest(rec);
    const key = keyId === "" ? null : loadKey(keyId);
    const signature = key === null
      ? ""
      : createHmac("sha256", key).update(canonical, "utf8").digest("hex");

    let outcome: string;
    let reason: string | undefined;
    if (keyId === "") {
      outcome = "rejected"; reason = "missing-key-id";
    } else if (key === null) {
      outcome = "rejected"; reason = "unknown-key-id";
    } else if (auth === undefined) {
      outcome = "signed";
    } else {
      const prefix = `GW-HMAC-SHA256 keyId=${keyId}, signature=`;
      if (!auth.startsWith(prefix)) {
        outcome = "rejected"; reason = "malformed-authorization";
      } else {
        const presented = Buffer.from(auth.slice(prefix.length).trim(), "utf8");
        const expected = Buffer.from(signature, "utf8");
        if (presented.length === expected.length && timingSafeEqual(presented, expected)) {
          outcome = "verified";
        } else {
          outcome = "rejected"; reason = "signature-mismatch";
        }
      }
    }

    const ev: Record<string, unknown> = {
      seq: i + 1,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      path: rec.target.split("?")[0],
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
