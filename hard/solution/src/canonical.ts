/**
 * Canonicalisation rules for the GW-HMAC-SHA256 scheme.
 *
 * Every rule here is the one in force when the scheme was frozen on 2025-12-02.
 * Where the dossier changed a rule more than once, or raised a change and did
 * not adopt it, the comment says which meeting settled it.
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
 * Replaces GW-041 ("values are signed exactly as received"), changed in the
 * 2025-11-04 gateway sync after the proxy was found to respace header values.
 */
export function foldHeaderValue(value: string): string {
  return value.replace(/[ \t]+/g, " ").trim();
}

/**
 * Query parameters sort by name, then by value, both as raw byte comparisons on
 * the already-encoded text. Repeated names therefore keep a stable relative order.
 *
 * Replaces GW-017 ("sort by name only, preserve arrival order within a name").
 * The 2025-11-18 addendum made it name then percent-decoded value, and the
 * 2025-11-25 partner review dropped the decoding. Nothing is decoded here.
 *
 * A parameter with no "=" is written with a trailing "=" (GW-019). Writing it
 * bare was trialled on 2025-11-04 and backed out at the freeze. Percent escapes
 * keep the case they arrived in; uppercasing them was proposed on 2025-10-21
 * and withdrawn on 2025-11-04.
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
 * Replaces GW-023 ("sign only the x-gw-* family"). The 2025-11-18 addendum added
 * content-type as a stopgap and the 2025-12-02 freeze widened it to everything.
 * Leaving out via and x-forwarded-for was asked for on 2025-12-09 and declined.
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
 * Replaces GW-009 ("empty bodies sign the literal token UNSIGNED"). The
 * 2025-10-21 note narrowed the token to records with no body at all, and the
 * 2025-12-02 freeze removed it: a missing body is a body of zero length.
 */
export function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

/**
 * The canonical request: 6 LF-joined fields, with NO trailing newline.
 *
 * Replaces GW-052 ("terminate the canonical string with a newline"), corrected
 * at the 2025-12-02 freeze; the trailing newline was a copy artefact. The path
 * is signed as it arrives (GW-013); collapsing dot segments was proposed on
 * 2025-11-25 and not adopted.
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
