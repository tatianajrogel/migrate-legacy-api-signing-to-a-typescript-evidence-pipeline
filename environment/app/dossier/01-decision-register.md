# Gateway Signing Migration - Decision Register

Status: living document. Entries are appended in decision order and are
NEVER edited in place. Where a later meeting reverses an entry, the
reversal is recorded in that meeting's note and the entry below is left
standing as the historical record.

> Reading guidance: this register alone is not sufficient to implement the
> scheme. Cross-check every entry against the meeting notes in this
> directory before relying on it.

## GW-002

The signing scheme identifier is the literal string `GW-HMAC-SHA256`. It appears in the Authorization header and nowhere in the canonical request.

_Recorded by S. Varga (identity)._

## GW-004

Signatures are HMAC-SHA256, rendered as LOWERCASE hexadecimal. Base64 was considered and rejected: too many partners mangled the padding.

_Recorded by A. Nakamura (identity)._

## GW-009

Requests with an empty or absent body sign the literal token `UNSIGNED` in the body-hash field, matching the behaviour of the 2019 signer.

_Recorded by L. Fontaine (fraud-ops)._

## GW-011

The canonical request has exactly 6 fields, joined by LF, in this order: HTTP method (uppercased); path; canonical query; canonical header block; signed header name list; body hash.

_Recorded by L. Fontaine (billing)._

## GW-013

The path is the request target up to but not including the first `?`. It is signed as received, without normalisation: no dot-segment collapsing, no re-encoding.

_Recorded by J. Delacroix (identity)._

## GW-015

The canonical query is the request target after the first `?`. If there is no `?`, the canonical query is the empty string.

_Recorded by L. Fontaine (edge-platform)._

## GW-017

Canonical query ordering sorts parameters by name only. Where a name repeats, the parameters keep the order in which they arrived.

_Recorded by T. Bergstrom (billing)._

## GW-019

Query parameters are joined `name=value`, pairs separated by `&`. A parameter with no `=` is treated as having an empty value and is still written with a trailing `=`.

_Recorded by K. Mwangi (edge-platform)._

## GW-023

Only the `x-gw-*` header family is signed. Everything else is excluded to keep the signed set small.

_Recorded by L. Fontaine (sre-core)._

## GW-025

Header names are lowercased for both the canonical header block and the signed header name list.

_Recorded by J. Delacroix (identity)._

## GW-027

The canonical header block writes one header per line as `name:value`, lines joined by LF, sorted by name. There is no trailing LF after the final header line.

_Recorded by P. Oyelaran (edge-platform)._

## GW-029

The signed header name list is the lowercased names in the same sorted order, joined by `;`.

_Recorded by R. Okonkwo (edge-platform)._

## GW-031

Header names are compared and sorted as raw bytes after lowercasing. No locale-aware collation.

_Recorded by D. Achterberg (edge-platform)._

## GW-034

The key id travels in the `x-gw-key-id` request header. Its value is matched case-insensitively on the header NAME; the value itself is used verbatim.

_Recorded by T. Bergstrom (partner-integrations)._

## GW-038

A key id that does not resolve to an approved key file is a hard rejection. The pipeline never falls back to a default key.

_Recorded by T. Bergstrom (edge-platform)._

## GW-041

Header values are signed exactly as received, byte for byte, including any leading or trailing whitespace.

_Recorded by D. Achterberg (partner-integrations)._

## GW-044

Verification compares the presented signature against the recomputed one in constant time.

_Recorded by L. Fontaine (fraud-ops)._

## GW-047

The Authorization header format is exactly `GW-HMAC-SHA256 keyId=<id>, signature=<hex>` - one space after the scheme, one comma and one space between the parameters.

_Recorded by D. Achterberg (partner-integrations)._

## GW-049

A request carrying an Authorization header is verified. A request without one is signed. There is no explicit mode flag.

_Recorded by P. Oyelaran (partner-integrations)._

## GW-052

The canonical request string is terminated with a trailing newline before the HMAC is computed.

_Recorded by J. Delacroix (fraud-ops)._

## GW-055

The pipeline never performs network access. Signing is a pure local computation over the request and the key material.

_Recorded by A. Nakamura (edge-platform)._

## GW-058

Evidence is emitted as newline-delimited JSON: one compact object per input record, in input order, each line terminated by LF including the last.

_Recorded by T. Bergstrom (identity)._
