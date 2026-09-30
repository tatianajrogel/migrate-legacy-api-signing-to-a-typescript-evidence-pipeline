# Migrate Legacy API Signing to a TypeScript Evidence Pipeline

[![validate](https://github.com/tatianajrogel/migrate-legacy-api-signing-to-a-typescript-evidence-pipeline/actions/workflows/validate.yml/badge.svg)](https://github.com/tatianajrogel/migrate-legacy-api-signing-to-a-typescript-evidence-pipeline/actions/workflows/validate.yml)

A Terminal-Bench style task for AI coding agents, in Harbor's task format with
a separate verifier container. I designed and built all of it: the scenario, the
document set the agent has to read, the starter code, the reference solution,
and the verifier.

The agent has to finish a TypeScript port of an old Perl request signer that
someone started and left half done. The port compiles, runs and writes evidence
that looks fine, and every signature in it is wrong. The bug isn't a typo. The
port was written straight from a decision log whose entries were later reversed
somewhere else.

## At a glance

| | |
|---|---|
| Category | Security, long context |
| Languages | TypeScript and Bash; the verifier is Python (pytest) |
| Agent gets | A starter pipeline that signs wrong, 16 dossier documents (about 75k tokens), strace and lsof captures from the old signer, 3 key files, 8 sample requests |
| Agent must produce | NDJSON evidence for the sample requests, built from its own TypeScript sources |
| Graded on | Byte-exact output, plus 2 hidden request sets re-run from the agent's own code |
| Format | Harbor task, `environment_mode = "separate"` |

## What the pipeline does

It reads a JSON array of HTTP request records from stdin, signs or verifies each
one under GW-HMAC-SHA256, and writes newline delimited evidence JSON to stdout,
one compact object per line. A record gets verified if it already carries an
`Authorization` header and signed if it doesn't. Every line has exactly `seq`,
`key_id`, `method`, `path`, `outcome`, `signature` and `canonical_sha256`, plus
`reason` when the outcome is `rejected`.

Spoilers from here on. If you want to try it cold, stop reading and open
[`instruction.md`](instruction.md).

## Why I built it

My day job is pulling facts out of long, messy documents and proving the
extraction is right, not just believable. The failure I see most is a system
that takes the first authoritative looking statement it finds, never checks
whether something later overrode it, and produces output that looks completely
fine until someone diffs it against a known good answer. This task is that
failure turned into a test.

## What makes it hard

`dossier/01-decision-register.md` reads like a spec. It is append only, and it
says at the top that it is not authoritative on its own. 5 of its entries were
reversed later in meeting notes spread through the rest of the dossier:

- header values are whitespace folded, not signed raw (GW-041)
- query parameters sort by name then value, not name alone (GW-017)
- every header except `authorization` is signed, not just `x-gw-*` (GW-023)
- empty bodies hash normally; the `UNSIGNED` sentinel is gone (GW-009)
- the canonical string has no trailing newline (GW-052)

Miss any one and every signature is wrong, even with the other 4 right.

2 more rules never appear in the prose. They only exist in the syscall captures
under `captures/`:

- The key file holds a trailing newline that is not part of the key. The strace
  shows a 33-byte file read whole, and only the 32 bytes before the newline
  reproduce the signature on the sample's already signed request.
- `gw-legacy-99.key` sits in the key directory but the old signer never opens
  it. The strace lists the directory and then opens only the 2 production keys,
  and the lsof holds only those 2. A request naming the legacy key has to be
  rejected, not signed.

## How it's graded

The verifier runs in its own container after the agent's is gone, and it does
not trust anything the agent left behind.

- **Rebuilds from source.** It recompiles the agent's TypeScript, so a hand
  written evidence file or a stale build gets nothing.
- **Hidden request sets.** The rebuilt pipeline runs on 2 request sets the
  agent never saw, and both have to match approved bytes.
- **Retired key made unreadable.** `gw-legacy-99.key` loses its permissions
  before one run, and that run still has to produce the approved bytes.
- **Unprivileged run.** Agent code runs as a user that owns nothing, and the
  reward file sits in a directory that user cannot write.
- **Determinism.** 2 runs over the same input must give identical bytes.
- **Outcomes.** Signing, a successful verification and all 4 rejection reasons
  each have to land on the right record.
- **No network clients.** The sources are scanned for network APIs, and one run
  happens with every proxy variable pointed at a closed port.

## Proof the tests work

[`ci/validate.sh`](ci/validate.sh) grades the task against itself on every push.
It builds both images, produces an `/app` for each case below, hands it to a
fresh verifier container the same way Harbor does, and checks the reward.

| Case | What it is | Reward |
|---|---|---|
| oracle | the reference solution | 1 |
| nop | the agent does nothing | 0 |
| starter | the shipped starter, built and run as is | 0 |
| 7 mutants | the oracle with exactly one rule reverted | 0 each |

Every mutant has to compile and run cleanly before it is graded, so a 0 means
the tests caught wrong output, not a build error. This is which tests catch
which mutant:

| Rule reverted | Caught by |
|---|---|
| header values signed raw (GW-041) | sample bytes, hidden set h1 |
| query sorted by name only (GW-017) | hidden sets h1 and h2 only |
| only `x-gw-*` headers signed (GW-023) | sample bytes, both hidden sets, outcomes |
| `UNSIGNED` sentinel for empty bodies (GW-009) | sample bytes, both hidden sets |
| trailing newline on the canonical string (GW-052) | sample bytes, both hidden sets, outcomes |
| key file used verbatim, newline included | sample bytes, both hidden sets, outcomes |
| every key file on disk treated as active | sample bytes, h1, retired key test, outcomes |

The query sort row is the one I learned the most from. The sample's only
repeated query name arrives with its values already in order (`a=1&a=10`), so
sorting by name alone reproduces the sample byte for byte. Only the hidden sets,
where values arrive out of order, catch it. Without them that rule would not be
graded at all.

## Run it yourself

You need Docker.

```bash
# grade the oracle, a no-op agent, the starter and all 7 mutants
bash ci/validate.sh
```

Under Harbor (tested with 0.22.0) the reference solution scores 1.0:

```bash
uv tool install harbor
harbor run -p . -a oracle
```

For a real attempt, swap `-a oracle` for an agent and a model, for example
`-a claude-code -m <model>`.

## Layout

- `instruction.md`: the brief the agent works from
- `task.toml`: Harbor manifest, with difficulty, solution and verification notes
- `environment/`: the agent image and app scaffold (starter, dossier, captures, keys, sample requests)
- `solution/`: reference solution (`solve.sh`, `src/canonical.ts`, `src/pipeline.ts`)
- `tests/`: verifier image, `test.sh`, `test_outputs.py` and the hidden request sets
- `ci/`: the self-grading script and the rule mutants

## License

[MIT](LICENSE)
