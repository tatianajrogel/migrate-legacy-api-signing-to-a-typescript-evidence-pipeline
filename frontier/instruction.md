We're finally retiring the old Perl request signer. The TypeScript replacement in
`/app/src/pipeline.ts` was started by someone who has since left the team, and it
doesn't work. It compiles fine and it writes evidence, but the gateway rejects
every signature it produces.

They wrote it from `/app/dossier/01-decision-register.md`. The rest of
`/app/dossier/` is everything else the migration left behind: the notes from
each session between kickoff and rollout, and the appendices. The scheme went
live at the 2025-12-09 rollout, and what the gateway checks is the scheme as it
stood on that day.

Finish the port.

## What it has to do

Read a JSON array of request records on stdin, handle each one in order, and
write newline delimited evidence JSON to stdout. One compact object per line,
every line ending in LF including the last one.

Each record gets signed or verified under GW-HMAC-SHA256. If a record carries an
`Authorization` header, verify it. If it doesn't, sign it.

Every evidence object has exactly these keys, in this order:

- `seq`, the 1-based position of the record in the input
- `key_id`, the key id from the request, or `""` when there isn't one
- `method`, the HTTP method uppercased
- `path`, the request target up to but not including the first `?`
- `outcome`, one of `signed`, `verified`, or `rejected`
- `signature`, the lowercase hex HMAC of the record's canonical request. It is
  filled whenever the record names a key on the active roster, even if the record
  is then rejected, and is `""` only for `missing-key-id` and `unknown-key-id`
- `canonical_sha256`, lowercase hex SHA-256 of the canonical request string
- `reason`, present only when `outcome` is `rejected`

The 4 rejection reasons are `missing-key-id`, `unknown-key-id`,
`malformed-authorization`, and `signature-mismatch`, checked in that order. An
`Authorization` header is well formed when it starts with exactly
`GW-HMAC-SHA256 keyId=<the record's key id>, signature=`, and anything else is
`malformed-authorization`. Whatever follows `signature=` is the presented
signature, compared as is apart from surrounding whitespace, so a well formed
header carrying a wrong, short or non-hex signature is a `signature-mismatch`.

## Keys

Keys are in `/app/keys`. Not every file in there is on the active roster.
`/app/captures/` has traces pulled off the signers running on the production
host. The 3 captures of the legacy request signer settle between them which
keys it actually used and how it used them. A request naming a key that isn't
on the roster is an `unknown-key-id`, never signed.

Those captures also show that request signing is pure local computation. The
replacement must not touch the network, and must not reference any network
client in its sources.

## Build and run

CI drives this, so keep the entry points where they are. Sources stay under
`/app/src`, the build stays `tsc -p /app/tsconfig.json` producing
`/app/dist/pipeline.js`, and it runs as:

```
node /app/dist/pipeline.js < <requests.json> > <evidence.ndjson>
```

Same input, same bytes, every time. CI points it at request sets other than the
one shipped here, so don't special case anything to the sample.

## What to leave behind

Run it over `/app/requests/sample-requests.json` and put the result in
`/app/out/evidence.ndjson`.
