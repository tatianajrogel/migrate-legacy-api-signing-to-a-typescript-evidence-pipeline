# Migrate Legacy API Signing to a TypeScript Evidence Pipeline

This task retires the old Perl request signer and finishes a TypeScript port that
someone started and then left half done. The starter code in `src/pipeline.ts`
compiles and writes evidence, but every signature it produces gets rejected by
the gateway. The bug isn't a typo, it's that the port was written straight from
`dossier/01-decision-register.md`, and that register is append only. It says so
right at the top. When a decision got reversed later, the old entry just sat
there looking authoritative, and the reversals live in meeting notes scattered
through about 75k tokens of other migration material instead.

## What the pipeline does

Reads a JSON array of HTTP request records from stdin, signs or verifies each
one under GW-HMAC-SHA256, and writes newline delimited evidence JSON to stdout.
One compact object per line, LF terminated, including the last line. A record
gets verified if it already carries an `Authorization` header, signed if it
doesn't.

Every evidence line has exactly these fields: `seq`, `key_id`, `method`, `path`,
`outcome`, `signature`, `canonical_sha256`, and `reason` (only present when
`outcome` is `rejected`).

## The actual trap

Five entries in the decision register got reversed by later meeting notes:

- header values go whitespace folded, not raw
- query params sort by name then value, not name alone
- the signed header set is everything except `authorization`, not just `x-gw-*`
- the `UNSIGNED` sentinel for empty bodies is gone, empty bodies hash normally
- no trailing newline on the canonical string

Miss any single one of those and every signature comes out wrong, even if the
other 4 are right. Two more rules never show up in the prose at all and only
exist in the strace and lsof captures under `captures/`: the key file on disk
carries a trailing newline that isn't part of the key, and `gw-legacy-99.key`
sits in the key directory but was never opened by the legacy signer, so it's off
the active roster. A request naming it should get rejected, not signed.

## Build and run

```
tsc -p tsconfig.json
node dist/pipeline.js < requests/sample-requests.json > out/evidence.ndjson
```

Sources stay under `src/`, the build target stays `dist/pipeline.js`. Same
input has to produce the same bytes every run. The pipeline must not touch the
network at all, the captures confirm the legacy signer was pure local
computation, and the sources get scanned for network clients as part of
verification.

## Layout

- `instruction.md`: the task brief an agent works from
- `task.toml`: TB3.0 manifest, difficulty and grading notes
- `solution/`: oracle solution (`solve.sh`, `src/pipeline.ts`, `src/canonical.ts`)
- `tests/`: verifier, runs in a separate container after the agent's is gone
- `environment/`: Dockerfile and app scaffold the agent starts from
