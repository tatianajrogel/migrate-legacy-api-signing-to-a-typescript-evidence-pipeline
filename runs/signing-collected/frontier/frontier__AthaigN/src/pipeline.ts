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

// Active roster, per the legacy signer's strace/lsof: only these key files were opened.
const ROSTER = new Set(["gw-prod-01", "gw-prod-02"]);

function loadKey(keyId: string): Buffer | null {
  if (!ROSTER.has(keyId)) return null;
  try {
    // key file is used whole, line ending included
    return readFileSync(`${KEY_DIR}/${keyId}.key`);
  } catch {
    return null;
  }
}

const cmp = (a: string, b: string): number =>
  Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));

function headerValue(h: InputRecord["headers"], name: string): string | undefined {
  return h.find(([n]) => n.toLowerCase() === name)?.[1];
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
  pairs.sort((a, b) => cmp(a[0], b[0]));
  const canonicalQuery = pairs.map(([n, v]) => `${n}=${v}`).join("&");

  // every header except authorization; values trimmed of spaces/tabs at the
  // ends and inner runs of spaces/tabs collapsed to one space
  const signed = rec.headers
    .map(([n, v]) => [
      n.toLowerCase(),
      v.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " "),
    ] as [string, string])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => cmp(a[0], b[0]));

  const bodyField = createHash("sha256").update(rec.body ?? "", "utf8").digest("hex");

  // no trailing newline after the last field
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
    const keyId = headerValue(rec.headers, "x-gw-key-id") ?? "";
    const auth = headerValue(rec.headers, "authorization");
    const canonical = canonicalRequest(rec);
    const key = keyId === "" ? null : loadKey(keyId);
    const signature = key === null
      ? ""
      : createHmac("sha256", key).update(canonical, "utf8").digest("hex");
    const q = rec.target.indexOf("?");

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
        const ok = presented.length === expected.length &&
          timingSafeEqual(presented, expected);
        if (ok) outcome = "verified";
        else { outcome = "rejected"; reason = "signature-mismatch"; }
      }
    }

    const ev: Record<string, unknown> = {
      seq: i + 1,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      path: q === -1 ? rec.target : rec.target.slice(0, q),
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
