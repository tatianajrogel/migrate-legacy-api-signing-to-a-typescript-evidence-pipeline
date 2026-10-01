# Verifier red-team, round 1 (2026-09-30)

Two of six hunters completed before the session limit (authorization, keys);
no refuter ran, so every finding below is the hunter's own claim. Each hunter
reproduced all 8 approved hashes with its own harness first, then ran each
departure over all 4 graded sets of both variants. Scripts and outputs are in
`runs/redteam/authorization/` and `runs/redteam/keys/`.

## Acted on: added to h3 (records 9 to 19)

All 11 under-grading findings whose expected outcome follows from the literal
text of instruction.md and matches the reference solution:

| Finding | Departure | Now expected |
|---|---|---|
| AUTH-01 | scheme token matched ignoring case | malformed-authorization |
| AUTH-02 | parameter names matched ignoring case | malformed-authorization |
| AUTH-03, K4 | keyId inside the header compared ignoring case | malformed-authorization |
| AUTH-04 | one or more spaces after the comma accepted | malformed-authorization |
| AUTH-05 | spaces around `=` and before the comma accepted | malformed-authorization |
| AUTH-06 | one or more spaces after the scheme accepted (base only; hard h2 already had it) | malformed-authorization |
| AUTH-07, AUTH-10 | signature parsed as a token, text after it ignored (or called malformed) | signature-mismatch |
| AUTH-08 | quoted-string signature unquoted | signature-mismatch |
| AUTH-09 | empty presented signature called malformed | signature-mismatch |
| K3 | key id resolved to a file path before the roster check (`../keys/gw-prod-01`) | unknown-key-id |
| K5 | roster id matched in any case (base only; hard h1 already had it) | unknown-key-id |

CI after the change: oracle 1, every mutant 0, on both variants.

## Not acted on: decisions for the task author

### Over-grading: the verifier requires something instruction.md never states

- **AUTH-17, JSON key order.** instruction.md lists "exactly these keys" but
  never says they are serialised in that order. An agent that puts `reason`
  after `outcome` passes the field-set test and fails every byte comparison.
  Every passing attempt so far used the listed order. Options: add "in this
  order" to the instruction (both variants), or compare parsed objects instead
  of bytes. Adding a sentence creates a third instruction wording for the base
  task; `analysis/diagnose.mjs` labels instructions by exact text, so it would
  need a known-versions list before any new runs.
- **K7, the key id header.** instruction.md never names `x-gw-key-id` nor says
  the header name is matched without regard to case. Both are in the starter
  code and in the dossier (GW-034), and the sample mixes `X-GW-Key-Id` and
  `x-gw-key-id`, so every attempt got it right. Still unstated in the spec.

### Ambiguity: instruction.md is silent and no graded set exercises it

The reference solution picks one reading in each case; a different reading
passes too. Grading any of these without a sentence in instruction.md would be
over-grading.

- **K1 / AUTH-16, whitespace around the key id value.** The reference trims it;
  the dossier register (GW-034) and the 2025-11-25 note say the value is used
  verbatim. So the reference contradicts the dossier on an input nothing
  exercises. Worth fixing in the reference (use verbatim) and stating.
- **K2, two `x-gw-key-id` headers.** Reference takes the first; a header map
  takes the last.
- **K6, an `x-gw-key-id` header with an empty value.** Reference: missing-key-id.
  Alternative: unknown-key-id.
- **AUTH-11, whitespace around the whole `Authorization` value.** Reference
  trims, then checks the prefix; the literal sentence ("starts with exactly")
  says malformed. The reference is the one departing from the text here.
- **AUTH-12, `authorization` header name in another case.** Reference matches
  names without regard to case; nothing states it for this header.
- **AUTH-13, two `Authorization` headers.** First wins (reference), last wins,
  or malformed.
- **AUTH-14, `Authorization` present with an empty value.** Reference: verify,
  so malformed. Alternative: treat as absent, sign.
- **AUTH-15, signature padded with non-ASCII whitespace.** `String.trim`
  strips it (reference); a spaces-and-tabs reading does not.
- **K8, key file line endings.** The 6 shipped files are 32 bytes plus one LF,
  so strip-all-trailing-CR-LF, strip-one-LF and trimEnd all agree.
- **K9, a roster id whose file is missing or unreadable.** Reference reports
  unknown-key-id; letting the error propagate is as plausible.

## Still to run

Four hunters never ran: output-format, canonical-edges, over-grading,
input-robustness. Plus the refute stage for everything above, the critic, and
a second round. Resume: `Workflow` with run id `wf_25bfe219-5bb` and the saved
script (`runs/workflows/verifier-red-team-wf_25bfe219-5bb.js`).
