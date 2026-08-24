/**
 * GW-HMAC-SHA256 evidence pipeline. INCOMPLETE PORT.
 *
 * This is where the migration stalled. The legacy signer was a 900-line Perl
 * script; this port covers the plumbing but the canonicalisation was written
 * from the decision register alone, before anyone read the meeting notes.
 *
 * It runs. It produces evidence. The signatures do not match the gateway.
 */

import { createHmac, createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const KEY_DIR = "/app/keys";

interface InputRecord {
  method: string;
  target: string;
  headers: Array<[string, string]>;
  body?: string;
}

function loadKey(keyId: string): Buffer | null {
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
    .filter(([n]) => n.startsWith("x-gw-"))
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));

  const body = rec.body ?? "";
  const bodyField = body === ""
    ? "UNSIGNED"
    : createHash("sha256").update(body, "utf8").digest("hex");

  return [
    rec.method.toUpperCase(),
    path,
    canonicalQuery,
    signed.map(([n, v]) => `${n}:${v}`).join("\n"),
    signed.map(([n]) => n).join(";"),
    bodyField,
  ].join("\n") + "\n";
}

function main(): void {
  const records = JSON.parse(readFileSync(0, "utf8")) as InputRecord[];
  const out: string[] = [];

  records.forEach((rec, i) => {
    const keyId =
      rec.headers.find(([n]) => n.toLowerCase() === "x-gw-key-id")?.[1] ?? "";
    const canonical = canonicalRequest(rec);
    const key = loadKey(keyId);
    const signature = key === null
      ? ""
      : createHmac("sha256", key).update(canonical, "utf8").digest("hex");

    out.push(JSON.stringify({
      seq: i + 1,
      key_id: keyId,
      method: rec.method.toUpperCase(),
      outcome: key === null ? "rejected" : "signed",
      signature,
    }));
  });

  process.stdout.write(out.map((l) => `${l}\n`).join(""));
}

main();
