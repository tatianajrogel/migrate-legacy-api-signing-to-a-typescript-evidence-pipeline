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

// Keys on the active roster for inbound request signing (gw-prod-03 belongs to
// the export signer; see captures/legacy-signer.lsof and the rotation runbook).
const ROSTER = new Set(["gw-prod-01", "gw-prod-02"]);

interface InputRecord {
  method: string;
  target: string;
  headers: Array<[string, string]>;
  body?: string;
}

function loadKey(keyId: string): Buffer | null {
  if (!ROSTER.has(keyId)) return null;
  try {
    // The legacy signer strips the line ending from the key file.
    const raw = readFileSync(`${KEY_DIR}/${keyId}.key`).toString("latin1");
    return Buffer.from(raw.replace(/\r?\n$/, ""), "latin1");
  } catch {
    return null;
  }
}

const cmp = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

function trimSpTab(v: string): string {
  return v.replace(/^[ \t]+|[ \t]+$/g, "");
}

function headerValue(v: string): string {
  return trimSpTab(v).replace(/[ \t]+/g, " ");
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
    .map(([n, v]) => [n.toLowerCase(), headerValue(v)] as [string, string])
    .filter(([n]) => n.startsWith("x-gw-") || n === "content-type")
    .sort((a, b) => cmp(a[0], b[0]));

  const bodyField = createHash("sha256").update(rec.body ?? "", "utf8").digest("hex");

  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery,
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    bodyField,
  ].join("\n");
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out: string[] = [];

  records.forEach((rec, i) => {
    const find = (name: string) =>
      rec.headers.find(([n]) => n.toLowerCase() === name)?.[1];
    const keyId = find("x-gw-key-id") ?? "";
    const auth = find("authorization");
    const canonical = canonicalRequest(rec);
    const key = loadKey(keyId);
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
