/**
 * Canonicalisation rules for the GW-HMAC-SHA256 scheme.
 *
 * Every rule here is the one in force at the 2025-12-09 rollout. The dossier
 * follows 5 signers; only inbound request signing is implemented here. The
 * comment on each rule says which session settled it. The signed header names
 * are joined with ";": the comma minuted for this scheme on 2025-11-25 was the
 * mesh signer's, corrected at the freeze.
 */

import { createHash } from "node:crypto";

export interface ParsedRequest {
  method: string;
  target: string;
  headers: Array<[string, string]>;
  body: string;
}

/**
 * Header values are whitespace-folded: leading/trailing stripped, and every
 * internal run of spaces/tabs collapsed to one space.
 *
 * Replaces GW-041 ("values are signed exactly as received"). Trimming the ends
 * went in on 2025-10-14 and collapsing the inside on 2025-11-04. That second
 * item was minuted under the webhook signer and corrected on 2025-11-11.
 * Lowercasing the folded value was agreed on 2025-11-25 subject to a load test
 * under 2 ms at p99. It measured 1.4 ms at p95 and 2.6 ms at p99, so it did
 * not go in.
 */
export function foldHeaderValue(value: string): string {
  return value.replace(/[ \t]+/g, " ").trim();
}

/**
 * Query parameters sort by name, then by value, both as raw byte comparisons on
 * the already-encoded text. Repeated names therefore keep a stable relative order.
 *
 * Replaces GW-017 ("sort by name only, preserve arrival order within a name").
 * No item states this rule for this scheme. On 2025-11-11 the ordering was
 * brought in line with the export signer's as it stood that day, and the
 * export signer's had been brought in line with the mesh signer's on
 * 2025-10-28, which was name then value on the text as it arrives. Both of
 * those signers moved to decoded values afterwards; an alignment copies the
 * rule of its day and does not follow. Nothing is decoded here.
 *
 * A parameter with no "=" is written with a trailing "=" (GW-019): writing it
 * bare was a trial from 2025-11-04, backed out at the freeze. Percent escapes
 * keep their case: uppercasing them was conditional on the proxy rewriting
 * them, and the captures of 2025-11-03 show it does not.
 */
export function canonicalQuery(rawQuery: string): string {
  if (rawQuery === "") return "";
  const pairs: Array<[string, string]> = [];
  for (const part of rawQuery.split("&")) {
    if (part === "") continue;
    const eq = part.indexOf("=");
    if (eq === -1) pairs.push([part, ""]);
    else pairs.push([part.slice(0, eq), part.slice(eq + 1)]);
  }
  pairs.sort((a, b) =>
    a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0,
  );
  return pairs.map(([n, v]) => `${n}=${v}`).join("&");
}

/**
 * The signed header set is every header present, lowercased, sorted, EXCEPT
 * `authorization` which is never signed (it carries the signature itself).
 *
 * Replaces GW-023 ("sign only the x-gw-* family"). content-type was added as a
 * stopgap on 2025-11-18. Everything except authorization was agreed at the
 * freeze on condition that all 5 partners signed off by 2025-12-05, and the
 * sign-off register dates the last of the 5 on 2025-12-04. Leaving out via
 * and x-forwarded-for was asked for after the freeze and declined.
 */
export function signedHeaders(
  headers: Array<[string, string]>,
): Array<[string, string]> {
  return headers
    .map(([n, v]) => [n.toLowerCase(), foldHeaderValue(v)] as [string, string])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
}

/**
 * The body hash is always SHA-256 over the body bytes. An absent or empty body
 * hashes the empty string; it does not use a sentinel.
 *
 * Replaces GW-009 ("empty bodies sign the literal token UNSIGNED"). The token
 * was narrowed to missing bodies on 2025-10-21. Its removal was agreed on
 * 2025-11-25, effective with SDK 3.2.1, which the release calendar puts on
 * 2025-12-01, before rollout.
 */
export function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

/**
 * The canonical request: 6 LF-joined fields, with NO trailing newline.
 *
 * Replaces GW-052 ("terminate the canonical string with a newline"), changed at
 * the freeze. The path is signed as it arrives (GW-013): collapsing dot
 * segments was agreed effective with SDK 3.3, which became generally available
 * after rollout.
 */
export function canonicalRequest(req: ParsedRequest): string {
  const qIndex = req.target.indexOf("?");
  const path = qIndex === -1 ? req.target : req.target.slice(0, qIndex);
  const query = qIndex === -1 ? "" : req.target.slice(qIndex + 1);

  const signed = signedHeaders(req.headers);
  const headerBlock = signed.map(([n, v]) => `${n}:${v}`).join("\n");
  const names = signed.map(([n]) => n).join(";");

  return [
    req.method.toUpperCase(),
    path,
    canonicalQuery(query),
    headerBlock,
    names,
    sha256Hex(req.body),
  ].join("\n");
}
