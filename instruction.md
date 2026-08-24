We're finally retiring the old Perl request signer. The TypeScript replacement in
`/app/src/pipeline.ts` was started by someone who has since left the team, and it
doesn't work. It compiles fine and it writes evidence, but the gateway rejects
every signature it produces.

Here's what happened. They wrote it straight from
`/app/dossier/01-decision-register.md`. That register is append only, and it says
so at the top: entries are never edited, so when a decision gets reversed later
the old entry just sits there looking authoritative. The reversals live in the
meeting notes next to it in `/app/dossier/`. Nobody read past the register.

Finish the port.

## What it has to do

Read a JSON array of request records on stdin, handle each one in order, and
write newline delimited evidence JSON to stdout. One compact object per line,
every line ending in LF including the last one.

Each record gets signed or verified under GW-HMAC-SHA256, using the scheme as the
dossier finally landed on it. If a record carries an `Authorization` header,
verify it. If it doesn't, sign it.

Every evidence object has exactly these keys:

- `seq`, the 1-based position of the record in the input
- `key_id`, the key id from the request, or `""` when there isn't one
- `method`, the HTTP method uppercased
- `path`, the request target up to but not including the first `?`
- `outcome`, one of `signed`, `verified`, or `rejected`
- `signature`, the lowercase hex HMAC, or `""` when nothing was computed
- `canonical_sha256`, lowercase hex SHA-256 of the canonical request string
- `reason`, present only when `outcome` is `rejected`

The 4 rejection reasons are `missing-key-id`, `unknown-key-id`,
`signature-mismatch`, and `malformed-authorization`.

## Keys

Keys are in `/app/keys`. Not every file in there is on the active roster.
`/app/captures/` has an strace and an lsof pulled off the legacy signer in
production, and between them they settle which keys it actually used and how it
read them. A request naming a key that isn't on the roster gets rejected, never
signed.

Those captures also show signing is pure local computation. The replacement must
not touch the network, and must not reference any network client in its sources.

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
