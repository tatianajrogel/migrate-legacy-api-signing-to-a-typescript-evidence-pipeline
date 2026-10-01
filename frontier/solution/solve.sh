#!/bin/bash
# Oracle solution.
#
# What was wrong with the shipped /app/src/pipeline.ts: it was written from the
# decision register, so it implements 5 rules that the session notes changed
# afterwards, and 2 more that the legacy request signer's captures settle.
#
#   GW-041  header values signed raw       -> stripped at the ends and
#           collapsed inside (the collapsing was minuted under the webhook
#           signer on 2025-11-04 and corrected on 2025-11-11)
#   GW-017  query sorted by name only      -> name, then value, on the text as
#           it arrives (aligned on 2025-11-11 with the export signer, whose
#           rule that day was the mesh signer's of 2025-10-28; both changed
#           afterwards, which an alignment does not follow)
#   GW-023  only x-gw-* headers signed     -> every header except
#           authorization (agreed at the freeze subject to sign-off by all 5
#           partners, which the sign-off register dates by 2025-12-04)
#   GW-009  empty body signs "UNSIGNED"    -> always SHA-256 of the body bytes
#           (agreed 2025-11-25 effective with SDK 3.2.1, out on 2025-12-01)
#   GW-052  canonical string ends with LF  -> no trailing newline
#   key files carry a newline that is not key material (the strace shows 33
#           bytes read, the ltrace shows 32 handed to HMAC)
#   gw-prod-03.key is in the directory and off this signer's roster
#
# The register entries that were challenged and stand: percent escapes keep
# their case (the condition for uppercasing them was not met), a valueless
# parameter gets a trailing "=" (the trial was backed out), the path is signed
# as received (collapsing dot segments waits for SDK 3.3, whose release
# candidate came before rollout and whose general availability did not), key
# ids are matched exactly (all 5 partners signed off on matching in any case,
# one of them 2 days after the deadline), header values are not lowercased (the
# load test passed at p95 and failed at p99, where the limit was set), and the
# name list is joined with ";" (the comma minuted on 2025-11-25 was the mesh
# signer's).
#
# Sample record 7 is not a bug to fix. Its signature was made on 2025-11-20
# under the rules of that day, and the gateway has no grace period.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cp "$HERE/src/canonical.ts" /app/src/canonical.ts
cp "$HERE/src/pipeline.ts"  /app/src/pipeline.ts

cd /app
tsc -p tsconfig.json

mkdir -p /app/out
node /app/dist/pipeline.js < /app/requests/sample-requests.json > /app/out/evidence.ndjson

sha256sum /app/out/evidence.ndjson
