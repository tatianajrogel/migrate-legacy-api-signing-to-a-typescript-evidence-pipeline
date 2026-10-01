#!/bin/bash
# Oracle solution.
#
# What was wrong with the shipped /app/src/pipeline.ts: it was written from the
# decision register, so it implements 5 rules that the meeting notes changed
# afterwards. Each one changes the canonical string and therefore the signature.
#
#   GW-041  header values signed raw       -> must be whitespace-folded
#           (2025-11-04 gateway sync)
#   GW-017  query sorted by name only      -> must sort by name, then value, on
#           the text as it arrives (2025-11-18 addendum, then the decoding it
#           added was dropped at the 2025-11-25 partner review)
#   GW-023  only x-gw-* headers signed     -> sign every header except
#           authorization (content-type added 2025-11-18, everything 2025-12-02)
#   GW-009  empty body signs "UNSIGNED"    -> always SHA-256 of the body bytes
#           (narrowed 2025-10-21, removed 2025-12-02)
#   GW-052  canonical string ends with LF  -> no trailing newline
#           (2025-12-02 scheme freeze)
#
# 5 more register entries were challenged in the notes and stand as written:
# uppercasing percent escapes (withdrawn), writing a valueless parameter bare
# (trialled, backed out), collapsing dot segments, matching key ids without
# regard to case, and leaving forwarding headers unsigned (none adopted). The
# notes on the webhook signer describe a different scheme and change nothing.
#
# 2 further defects, found by reconciling the captures rather than the dossier:
#
#   * The key file carries a trailing newline that is NOT key material. The
#     strace shows each 33-byte file read whole, ending in a newline, and only the
#     32-byte key without it verifies the sample's signed record. Reading the file
#     verbatim produces a wrong HMAC for every record.
#   * gw-prod-03.key sits in the key directory but never appears in an
#     openat() in the strace nor as an FD in the lsof. It is off the roster, so
#     a request naming it is rejected rather than signed.
#
# The evidence record also gained "path" and "canonical_sha256" fields, and the
# sign/verify split keyed on the presence of an Authorization header.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cp "$HERE/src/canonical.ts" /app/src/canonical.ts
cp "$HERE/src/pipeline.ts"  /app/src/pipeline.ts

cd /app
tsc -p tsconfig.json

mkdir -p /app/out
node /app/dist/pipeline.js < /app/requests/sample-requests.json > /app/out/evidence.ndjson

sha256sum /app/out/evidence.ndjson
