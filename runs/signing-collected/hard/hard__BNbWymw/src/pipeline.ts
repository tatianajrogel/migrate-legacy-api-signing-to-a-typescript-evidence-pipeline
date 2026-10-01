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
// Active roster: the keys the legacy signer actually loaded in production.
// gw-prod-03 is on disk but not yet activated.
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
    // The gateway signer chomps the key file's line ending.
    const raw = readFileSync(`${KEY_DIR}/${keyId}.key`).toString("latin1");
    return Buffer.from(raw.replace(/[\r\n]+$/, ""), "latin1");
  } catch {
    return null;
  }
}

const cmp = (a: string, b: string): number =>
  Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));

function splitTarget(target: string): [string, string] {
  const q = target.indexOf("?");
  return q === -1 ? [target, ""] : [target.slice(0, q), target.slice(q + 1)];
}

function normValue(v: string): string {
  return v.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ");
}

function canonicalRequest(rec: InputRecord): string {
  const [path, query] = splitTarget(rec.target);

  const pairs: Array<[string, string]> = query === "" ? [] : query.split("&").map((p) => {
    const eq = p.indexOf("=");
    return eq === -1 ? [p, ""] : [p.slice(0, eq), p.slice(eq + 1)];
  });
  pairs.sort((a, b) => cmp(a[0], b[0]) || cmp(a[1], b[1]));
  const canonicalQuery = pairs.map(([n, v]) => `${n}=${v}`).join("&");

  const signed = rec.headers
    .map(([n, v]) => [n.toLowerCase(), normValue(v)] as [string, string])
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

function header(rec: InputRecord, name: string): string | undefined {
  return rec.headers.find(([n]) => n.toLowerCase() === name)?.[1];
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out: string[] = [];

  records.forEach((rec, i) => {
    const keyId = header(rec, "x-gw-key-id") ?? "";
    const canonical = canonicalRequest(rec);
    const key = keyId === "" ? null : loadKey(keyId);
    const signature = key === null
      ? ""
      : createHmac("sha256", key).update(canonical, "utf8").digest("hex");

    const auth = header(rec, "authorization");
    let outcome: "signed" | "verified" | "rejected" = auth === undefined ? "signed" : "verified";
    let reason: string | undefined;
    if (keyId === "") {
      reason = "missing-key-id";
    } else if (key === null) {
      reason = "unknown-key-id";
    } else if (auth !== undefined) {
      const prefix = `GW-HMAC-SHA256 keyId=${keyId}, signature=`;
      if (!auth.startsWith(prefix)) {
        reason = "malformed-authorization";
      } else {
        const presented = Buffer.from(auth.slice(prefix.length).trim(), "utf8");
        const expected = Buffer.from(signature, "utf8");
        const ok = presented.length === expected.length && timingSafeEqual(presented, expected);
        if (!ok) reason = "signature-mismatch";
      }
    }
    if (reason !== undefined) outcome = "rejected";

    const evidence: Record<string, string | number> = {
      seq: i + 1,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      path: splitTarget(rec.target)[0],
      outcome,
      signature,
      canonical_sha256: createHash("sha256").update(canonical, "utf8").digest("hex"),
    };
    if (reason !== undefined) evidence.reason = reason;
    out.push(JSON.stringify(evidence));
  });

  process.stdout.write(out.map((l) => `${l}\n`).join(""));
}

main();
