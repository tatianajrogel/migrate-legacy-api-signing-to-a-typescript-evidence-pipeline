/**
 * Canonicalisation rules for the GW-HMAC-SHA256 scheme.
 *
 * Every rule here is the FINAL one from the migration dossier. Where the dossier
 * records an earlier decision that was later reversed, the reversal is what is
 * implemented and the superseding note is cited in a comment.
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
 * Supersedes GW-041 ("values are signed exactly as received"), reversed in the
 * 2025-11-04 gateway sync after the proxy was found to re-indent folded headers.
 */
export function foldHeaderValue(value: string): string {
  return value.replace(/[ \t]+/g, " ").trim();
}

/**
 * Query parameters sort by name, then by value, both as raw byte comparisons on
 * the already-encoded text. Repeated names therefore keep a stable relative order.
 *
 * Supersedes GW-017 ("sort by name only, preserve arrival order within a name"),
 * reversed in the 2025-11-18 addendum because arrival order is not reproducible
 * behind the load balancer.
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
 * Supersedes GW-023 ("sign only the x-gw-* family"), widened in the 2025-12-02
 * review so content-type and host are covered.
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
 * Supersedes GW-009 ("empty bodies sign the literal token UNSIGNED"), dropped in
 * the 2025-12-02 review as a needless divergence from the AWS-style scheme.
 */
export function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

/**
 * The canonical request: 6 LF-joined fields, with NO trailing newline.
 *
 * Supersedes GW-052 ("terminate the canonical string with a newline"), corrected
 * in the 2025-12-02 review; the trailing newline was a transcription error.
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
