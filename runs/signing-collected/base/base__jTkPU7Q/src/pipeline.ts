/**
 * GW-HMAC-SHA256 evidence pipeline. port of the legacy Perl signer.
 *
 * Scheme follows the decision register as amended by the meeting notes
 * (GW-009, GW-017, GW-023, GW-041, GW-052 are superseded there).
 */

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";
// Active roster, per the legacy signer captures (strace/lsof): gw-legacy-99 is
// present in the directory but never opened.
const ROSTER = ["gw-prod-01", "gw-prod-02"];
const SCHEME = "GW-HMAC-SHA256";

interface InputRecord {
  method: string;
  target: string;
  headers: Array<[string, string]>;
  body?: string;
}

// The key files are 33 bytes: 32 bytes of key material plus a trailing LF,
// which is not part of the key.
function loadKey(keyId: string): Buffer | null {
  if (!ROSTER.includes(keyId)) return null;
  try {
    return Buffer.from(readFileSync(`${KEY_DIR}/${keyId}.key`, "utf8").replace(/\r?\n$/, ""), "utf8");
  } catch {
    return null;
  }
}

function cmp(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

function foldValue(v: string): string {
  return v.replace(/^[ \t]+|[ \t]+$/g, "").replace(/[ \t]+/g, " ");
}

function splitTarget(target: string): [string, string] {
  const q = target.indexOf("?");
  return q === -1 ? [target, ""] : [target.slice(0, q), target.slice(q + 1)];
}

function canonicalRequest(rec: InputRecord): string {
  const [path, query] = splitTarget(rec.target);

  const pairs = query === "" ? [] : query.split("&").map((p): [string, string] => {
    const eq = p.indexOf("=");
    return eq === -1 ? [p, ""] : [p.slice(0, eq), p.slice(eq + 1)];
  });
  pairs.sort((a, b) => cmp(a[0], b[0]) || cmp(a[1], b[1]));
  const canonicalQuery = pairs.map(([n, v]) => `${n}=${v}`).join("&");

  const signed = rec.headers
    .map(([n, v]) => [n.toLowerCase(), foldValue(v)] as [string, string])
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

function headerValue(rec: InputRecord, name: string): string | undefined {
  return rec.headers.find(([n]) => n.toLowerCase() === name)?.[1];
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out: string[] = [];

  records.forEach((rec, i) => {
    const keyId = headerValue(rec, "x-gw-key-id") ?? "";
    const canonical = canonicalRequest(rec);
    const canonicalSha = createHash("sha256").update(canonical, "utf8").digest("hex");
    const key = keyId === "" ? null : loadKey(keyId);
    const signature = key === null
      ? ""
      : createHmac("sha256", key).update(canonical, "utf8").digest("hex");
    const auth = headerValue(rec, "authorization");

    let outcome: "signed" | "verified" | "rejected";
    let reason: string | undefined;
    if (keyId === "") {
      outcome = "rejected";
      reason = "missing-key-id";
    } else if (key === null) {
      outcome = "rejected";
      reason = "unknown-key-id";
    } else if (auth === undefined) {
      outcome = "signed";
    } else {
      const prefix = `${SCHEME} keyId=${keyId}, signature=`;
      if (!auth.startsWith(prefix)) {
        outcome = "rejected";
        reason = "malformed-authorization";
      } else {
        const presented = Buffer.from(auth.slice(prefix.length).trim(), "utf8");
        const expected = Buffer.from(signature, "utf8");
        const ok = presented.length === expected.length &&
          timingSafeEqual(presented, expected);
        outcome = ok ? "verified" : "rejected";
        if (!ok) reason = "signature-mismatch";
      }
    }

    const ev: Record<string, unknown> = {
      seq: i + 1,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      path: splitTarget(rec.target)[0],
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
