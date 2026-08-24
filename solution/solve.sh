#!/bin/bash
# Oracle solution.
#
# What was wrong with the shipped /app/src/pipeline.ts: it was written from the
# decision register alone, so it implements 5 rules that later meeting notes
# reversed. Each one changes the canonical string and therefore the signature.
#
#   GW-041  header values signed raw       -> must be whitespace-folded
#           (reversed 2025-11-04 gateway sync)
#   GW-017  query sorted by name only      -> must sort by name, then value
#           (reversed 2025-11-18 addendum)
#   GW-023  only x-gw-* headers signed     -> sign every header except
#           authorization (widened 2025-12-02 scheme-freeze review)
#   GW-009  empty body signs "UNSIGNED"    -> always SHA-256 of the body bytes
#           (reversed 2025-12-02 scheme-freeze review)
#   GW-052  canonical string ends with LF  -> no trailing newline
#           (corrected 2025-12-02 scheme-freeze review)
#
# 2 further defects, found by reconciling the captures rather than the dossier:
#
#   * The key file carries a trailing newline that is NOT key material. The
#     strace shows a 33-byte file yielding 32 bytes of key. Reading the file
#     verbatim produces a wrong HMAC for every record.
#   * gw-legacy-99.key sits in the key directory but never appears in an
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
