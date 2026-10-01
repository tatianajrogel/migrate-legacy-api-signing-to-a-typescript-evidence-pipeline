# Migrate Legacy API Signing to a TypeScript Evidence Pipeline

[![validate](https://github.com/tatianajrogel/migrate-legacy-api-signing-to-a-typescript-evidence-pipeline/actions/workflows/validate.yml/badge.svg)](https://github.com/tatianajrogel/migrate-legacy-api-signing-to-a-typescript-evidence-pipeline/actions/workflows/validate.yml)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.23075021.svg)](https://doi.org/10.5281/zenodo.23075021)

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
| Graded on | Byte-exact output, plus 3 hidden request sets re-run from the agent's own code |
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
- **Hidden request sets.** The rebuilt pipeline runs on 3 request sets the
  agent never saw, and all 3 have to match approved bytes. 2 of them exercise
  the signing rules. The third exercises the output contract in
  `instruction.md`, one sentence per record.
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
| 7 rule mutants | the oracle with exactly one rule reverted | 0 each |
| 7 contract mutants | the oracle with every rule right and one departure from the output contract | 0 each |

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

### The output contract was not graded either

The first 2 hidden sets were written to catch a wrong signing rule, and they
did. What they did not do was grade most of what `instruction.md` says about
the `Authorization` header. I found that out from an agent run: a Haiku 4.5
attempt scored a full reward while accepting a header whose `keyId` named a
different key than the record did, and while verifying an uppercase signature.
Both contradict the instruction, and neither is exercised by the sample or the
first 2 hidden sets.

So I wrote 7 more mutants that get every signing rule right and depart from the
output contract instead, each one something an attempt had actually shipped.
The verifier let 5 of the 7 through. The third hidden set, `h3`, turns one
sentence of `instruction.md` into one request each, and catches all 5. Under
the fixed verifier, that Haiku attempt scores 0.

| Departure from the contract | Caught by |
|---|---|
| `keyId` in the header not checked against the record's key id | h3 |
| presented signature compared without regard to case | h3 |
| whitespace around the presented signature kept | h3 |
| a short or non-hex signature called malformed, not a mismatch | h2, h3 |
| `signature` left empty on a rejected verification | sample bytes, h2 |
| the space after the comma made optional | h3 |
| key id taken from the `Authorization` header when the key header is absent | h3 |

`h3` is built by [`ci/build_contract_set.mjs`](ci/build_contract_set.mjs) from
a second implementation of the scheme, so the reference solution reproducing
its bytes in CI is itself a check.

Then I red-teamed the fixed verifier: agents each took one angle on the
contract and had to prove every claimed gap by running code over all the
graded sets. The 2 angles that completed (the `Authorization` header and key
handling) found 11 more departures from the same 2 sentences that still passed
everything, so `h3` grew from 8 records to 19:

- the scheme or the parameter names in another case, accepted
- the right key id in the wrong case inside the header, accepted
- extra whitespace after the scheme, after the comma, or around `=`, accepted
- text after the signature ignored, a quoted signature unquoted, an empty
  signature called malformed instead of a mismatch
- a key id with path characters resolved to a roster file and signed
- a roster id in upper case accepted, which only the hard variant's sets had
  been catching

The same pass also found places where the verifier is stricter than
`instruction.md`, or where neither says anything: the order of the keys in an
evidence object is enforced by the bytes but never stated, and nothing fixes
what a duplicate or whitespace-padded key id header means. Those are not graded
by `h3`, on purpose. Grading a behaviour the instruction does not state would
be the first version's mistake again.

## What happened when agents tried it

I ran Claude Code 2.1.286 under Harbor 0.22.0 with Claude Opus 5.5, Sonnet 5.5
and Haiku 4.5, 3 attempts per condition, 27 attempts on the base and hard
documents, and re-graded every one with the final verifier. The full tables,
including which rule each failed attempt got wrong and whether its trajectory
ever showed the text that settles it, are in [`paper/paper.md`](paper/paper.md).
The frontier variant further down came after the paper and has 12 more
attempts of its own.

| Documents | Instruction | Opus 5.5 | Sonnet 5.5 | Haiku 4.5 |
|---|---|---|---|---|
| base | first wording, 2 rejection rules unstated | 0 of 3 | | |
| base | points at the meeting notes | 3 of 3 | 3 of 3 | 0 of 3 |
| base | neutral | | | 0 of 3 |
| hard | neutral | 3 of 3 | 3 of 3 | 0 of 3 |
| hard | points at the meeting notes | | | 0 of 3 |

The first row and the Opus rows are the story of this section as it was first
written, and still hold:

| Version | Solved | Time per attempt | Turns |
|---|---|---|---|
| First version | 0 of 3 | 1.7 to 2.4 min | 11 to 14 |
| After the spec fix | 3 of 3 | 1.5 to 1.8 min | 13 to 15 |

**The first 0 of 3 was my fault, not the model's.** All 3 attempts got all 7
signing rules right: their canonical request hashes matched the reference on
every record in the sample and in both hidden sets. All 3 failed on the same 2
records, and both came down to rules my spec never stated. One was what
`signature` holds when a verification is rejected. The other was whether
`signature=deadbeef` is a malformed header or just a wrong signature. The agent
made sensible calls on both and the reference made different ones, so the bytes
could not match. I wrote both rules into `instruction.md`, checked the new
wording against the reference on all 15 graded records, and ran it again.

**How it beat the trap.** The 6 completed attempts all worked the same way:

- all 6 read the whole dossier with `cat` in their first few commands. About 75k
  tokens is easy for a model with a 1M token context
- 4 of 6 grepped it for reversal words like `revers` and `supersed`, which my
  meeting notes use as headings (`### GW-041 - SUPERSEDED`)
- all 6 dumped the key files byte by byte and spotted the trailing newline
- 4 of 6 computed the signature of the sample's already signed request by hand
  before writing any code, which checks most of the rule set in one go

**What that says about difficulty.** Once the spec is complete, this task is
easy for a current frontier agent. A harder version would need reversals that
don't announce themselves, filler that a regex can't strip, and a signed sample
that only exercises some of the rules so it can't work as an answer key.

## The hard variant

[`hard/`](hard/) is a second Harbor task built to answer that. The scheme is the
same one, byte for byte, and the reference solution is the same code. Only the
evidence is laid out differently, so any change in how agents score comes from
how the documents read and not from what they have to implement.

| | Base | Hard |
|---|---|---|
| Changed rules | under a heading with the entry id and `SUPERSEDED` | ordinary minutes, no entry ids, no words a search would look for |
| Rules that changed twice | none | 3 (query ordering, signed header set, empty bodies) |
| Changes raised and not adopted | none | 5 (escape case, bare parameters, dot segments, key id case, forwarding headers) |
| A second scheme in the same notes | no | yes, the webhook signer, which does the opposite on 3 of the 7 rules |
| Text around the decisions | boilerplate that says it is not about the scheme | generated text about headers, queries, keys and newlines |
| Captures | commented | raw |
| Key that is off the roster | `gw-legacy-99`, holding `retiredkeymaterial_do_not_use` | `gw-prod-03`, looks like the others |
| The signed sample record | has `Host`, so it checks 3 of the 7 rules | only `x-gw-*` headers, so it checks 2 |

That last row is the trap I like most. Fix the trailing newline and the key
length in the starter and the sample's signed record verifies, with 4 of the 5
changed rules still wrong.

The hard variant is graded against 23 mutants: the 14 above, plus 9 that each
adopt one rule the notes held for a while, trialled, or turned down.

| Rule adopted | Where the notes leave it | Caught by |
|---|---|---|
| values compared after percent-decoding | agreed 2025-11-18, dropped 2025-11-25 | hidden set h1 only |
| `x-gw-*` plus `content-type` signed | stopgap 2025-11-18, replaced at the freeze | sample bytes, both hidden sets |
| missing body signs `UNSIGNED` | agreed 2025-10-21, removed at the freeze | sample bytes, both hidden sets |
| percent escapes uppercased | proposed 2025-10-21, withdrawn 2025-11-04 | hidden set h1 only |
| valueless parameter written bare | trialled 2025-11-04, backed out at the freeze | both hidden sets |
| dot segments collapsed | proposed 2025-11-25, declined at the freeze | both hidden sets |
| key ids matched in any case | asked for 2025-11-25, declined at the freeze | hidden set h1 only |
| `via` and `x-forwarded-for` left unsigned | asked for 2025-12-09, after the freeze, declined | both hidden sets |
| signed names joined with a comma | the webhook signer's rule | sample bytes, both hidden sets, outcomes |

The dossier and the request sets are generated, so they can be rebuilt and
checked: [`hard/authoring/build_dossier.py`](hard/authoring/build_dossier.py)
holds every hand written passage next to the pools the rest is drawn from, and
[`hard/authoring/build_requests.mjs`](hard/authoring/build_requests.mjs) signs
the request sets with a second implementation written separately from the
reference solution. The oracle scoring 1 means the 2 agree.

## The frontier variant

Opus 5.5 and Sonnet 5.5 solved the hard variant in every attempt, and their
transcripts show how. Its decisions are written by hand and the text around
them is generated, so anything that tells the 2 apart finds the decisions. 2 of
the 3 Opus attempts replaced numbers and names with placeholders and counted
sentence shapes, and the third listed the filler patterns and filtered them
out. Sonnet listed the section headings and threw out the ones the filler kept
reusing. Either way what was left was the answer.

[`frontier/`](frontier/) is a third task built so that this stops working. The
scheme is still the same one, byte for byte, and the reference solution is the
hard variant's code. I built it after the paper was archived, so it is not in
the write-up. What I know about it is in this section and in `runs/`.

| | Hard | Frontier |
|---|---|---|
| Signers in the notes | 2: the one being migrated and a webhook signer | 5, each under 4 names, and only 1 is being migrated |
| How a decision is written | by hand, inside generated text | all 130 decision passages come out of one grammar, with the same lead-ins and the same headings for every signer |
| Session notes | 7, plus 8 appendices | 11, plus 8 appendices |
| Rules decided by pointing at another signer | none | query ordering is brought in line with the export signer's "as it stands today", and that rule had itself been copied from the mesh signer a fortnight earlier |
| Minutes that are wrong | none | folding of header values was minuted under the webhook signer and reassigned a week later; a comma separator was minuted under the migrated scheme and reassigned at the freeze |
| Decisions that hang on another document | none | 6: a sign-off register, a release calendar, a load test and a proxy capture say whether each one took effect |
| Signed sample records | 1, checking 2 rules | 2: one from the day before rollout that checks 2 rules, and one from 2025-11-20 that is genuine and has to be rejected |
| Captures | strace and lsof of the old signer | those 2 and an ltrace, plus captures of 2 other signers, one of which holds the off-roster key open |

The 6 decisions that hang on another document are where a careless reading
goes wrong in both directions. 2 took effect and 4 did not, and 3 of those 4
look as if they did:

| Agreed | Subject to | What the other document says | In force at rollout |
|---|---|---|---|
| sign every header except `authorization` | all 5 partners signing off by 2025-12-05 | all 5 signed by 2025-12-04 | yes |
| always hash the body | SDK 3.2.1 being out | generally available 2025-12-01 | yes |
| collapse dot segments | SDK 3.3 being out | release candidate 2025-12-05, generally available 2026-01-13 | no |
| match key ids in any case | all 5 partners signing off by 2025-12-01 | all 5 signed, the last one on 2025-12-03 | no |
| lowercase header values | the load test staying under 2 ms at p99 | 1.4 ms at p95, 2.6 ms at p99 | no |
| uppercase percent escapes | the proxy being seen to rewrite escapes | escapes pass through byte for byte | no |

So applying every conditional item is wrong, and ignoring every one is wrong
too.

The stale sample record is the other trap. It was signed on 2025-11-20 under
the rules in force that day, and the rollout note says there is no grace
period, so the right outcome is `signature-mismatch`. An attempt that sees a
signed record fail and keeps changing rules until it verifies ends up
rebuilding the November scheme, which is 4 rules away from the right one.

### Checking it before any graded attempt

[`frontier/authoring/build.mjs`](frontier/authoring/build.mjs) generates the
dossier, the captures and the sample from one table of events. It replays that
table and refuses to write anything unless the migrated scheme's state on
rollout day is exactly the reference solution's, every correction points at
one item, and every alignment the scheme leans on has one answer. It signs the
stale record with the state the same replay gives for 2025-11-20. CI reruns
the generator and fails if the committed files differ from what it writes.

The verifier is graded against 25 mutants: the hard variant's 23, one that
stops at the 2025-10-14 form of header values, and one that lowercases them.

Then I had model agents review it, all Opus 5.5: 2 blind solvers that saw only
what a benchmark agent sees, 2 fairness auditors with the answer key, and one
shortcut hunter. It was not ready. The tell from the hard variant was still
there: the migrated scheme's passages had hand written lead-ins, and a sentence
count picked out 13 of the 22 with no false positives. The 2 signed records
also gave away 2 rules they were supposed to leave open. I moved every signer
onto the same grammar, changed both records so they no longer do, and re-ran
the shortcut hunter's own scripts, which are in
[`runs/frontier-review/`](runs/frontier-review/). On the shipped build the same
count picks 5 passages, and 1 of them is the migrated scheme's. Searching for
the scheme's 4 names returns 38 passages, about 3% of the dossier, and those
read on their own give 7 of the 10 rules and fail every graded set.

[`review.json`](runs/frontier-review/review.json) in that folder is that review
as it came back, on the build before the fixes. The ltrace and the 3 conditions
that look met came later still, after the first graded attempts, so it never
saw them. A second review, again by Opus 5.5 agents, went over them before this
section was published. It found each condition settled by one decision and one
line in an appendix, with nothing else in the dossier restating or
contradicting it, and the key length shown by the ltrace and by nothing else.
What it found is in
[`review-before-publishing.json`](runs/frontier-review/review-before-publishing.json),
and the corrections it led to are already made.

One thing it found is still in the shipped dossier. The lead-in sentences come
from a stock pool, and the rollout note opens the declined request about
forwarding headers with "A request's `content-type` can be swapped in transit
without invalidating the signature", which is not true of the migrated scheme
on that day. The decisions still settle the rule, and no attempt ended on the
rule that sentence suggests. Fixing it means regenerating the dossier, and then
the stored attempts would no longer be attempts at the shipped files, so it is
written down here instead.

### What happened when agents tried it

12 attempts, 3 per cell, same harness and agent as above.

| Build | Opus 5.5 | Sonnet 5.5 |
|---|---|---|
| first | 3 of 3 | 0 of 3 |
| final | 3 of 3 | 2 of 3 |

**Part of the first 0 of 3 was mine again.** 2 of those Sonnet attempts used
the key file whole, newline included. Both blind solvers had told me the
captures could not settle that: the strace shows 33 bytes read and nothing
about what is handed to HMAC, so the only check was getting the fresh signed
record to verify. One attempt put its 2 failing signed records down to both
being old. The other worked out that the fresh record verifies once the newline
is stripped, and decided the record was the trap, because the strace showed all
33 bytes being read. It was doing what the instruction said, which was that the
strace and the lsof settle which keys the signer used and "how it read them".
They show how a key file is read, not what is handed to HMAC. I added an ltrace
of the same run, which shows a key length of 32, changed that sentence of the
instruction to match, and that rule has been right in every attempt since. One
of the 3 failed on nothing else.

The other first-build failure was the model's. 2 attempts ended on ordering
by name only, which is what the register says and what the starter does. Both
had the alignment sentence in their tool output, and one also had the support
ticket that states the result. Opus resolved the same chain in all 3 of its
attempts on that build.

Between the builds I also made 3 conditions look met when they are not. 2
requests that the first build declined outright became conditional, and the SDK
3.3 condition got a release candidate dated before rollout. On the final build
no attempt applied any of them. 5 of the 6 had all 3 in front of them, and the
failing Sonnet attempt never saw 2.

**The one failure on the final build was a search that was too narrow.** That
Sonnet attempt kept only paragraphs containing words like `agreed`, `decision`,
`effective` or `correction`. The item that widens the signed header set reads
"For inbound request signing: every header on the request is signed, whatever
its name, except `authorization`, provided all 5 partners have signed off on it
by 2025-12-05", which has none of them. It never reached the attempt, which
shipped the earlier rule and never read a line of the sign-off register. It was
also the fastest attempt in its cell, 1.0 minute and 11 tool calls.

**How Opus got through.** It made 15 to 25 tool calls over 2.4 to 3.7 minutes,
about $1.02 an attempt. In 2 of the 3 final-build attempts it did to this
dossier what it had done to the hard one, blanking numbers and names and
counting sentence shapes. Here that removes the filler and nothing else, so it
was left with the decisions of all 5 signers and read them. Between 11 and 34%
of the session notes' paragraphs reached its tool output whole, and from the
rest it saw extracted sentences or nothing. It then opened the release calendar
and the sign-off register and worked each chain through. 2 of the 3 also
rebuilt the November rules to confirm that the stale record verifies under
them, and rejected it anyway.

**What that says about difficulty.** This variant separates Sonnet 5.5 from
Opus 5.5, by one attempt out of 3 on the final build, and does not trouble
Opus. Making the decisions impossible to tell from the filler did not help,
because once the filler is gone every decision in the dossier fits in one
read. My guess is that a version Opus fails would need more decisions than it
can read in one go, or a rule that has to be measured from the captures and
cannot be read anywhere. 3 attempts per cell is also a small sample: these are
observations, not rates.

## Run it yourself

You need Docker.

```bash
# grade the oracle, a no-op agent, the starter and all 14 mutants
bash ci/validate.sh

# the same for the hard variant, with its 23 mutants
bash ci/validate.sh hard

# and for the frontier variant, with its 25
bash ci/validate.sh frontier

# rebuild the frontier dossier, captures and sample from the event table
node frontier/authoring/build.mjs
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
- `hard/`: the hard variant, a complete task with the same layout, plus `authoring/` with the generators for its dossier and request sets
- `frontier/`: the frontier variant, same layout again, plus `authoring/` with its generator, the answer key the generator writes, and the list of passages that bear on the migrated scheme
- `analysis/`: tools for reading agent attempts: probe requests that reveal which form of each rule an attempt implemented, a check of what its trajectory showed it, a re-grader, and the run matrix
- `paper/`: the write-up (`paper.md`, `paper.pdf`), its figures generated from `runs/` by `figures/build_figures.mjs`, and `build_paper.py` which builds the HTML and PDF
- `runs/`: every stored attempt (sources, trajectory, probe outputs, re-grade), the per-attempt diagnosis and the summary tables, the red-team scripts and notes, and the review of the frontier variant with the scripts that measured its shortcuts

## Cite

The write-up is [`paper/paper.pdf`](paper/paper.pdf), archived on Zenodo with
the code and every stored attempt.

> Rogel, T. (2026). *Validate the Benchmark Before Trusting the Score: Spec
> Gaps, Verifier Gaps and Presentation Hardening in an Evidence-Driven API
> Migration Task.* Zenodo. https://doi.org/10.5281/zenodo.23075022

```bibtex
@misc{rogel2026validate,
  author    = {Rogel, Tatiana},
  title     = {Validate the Benchmark Before Trusting the Score: Spec Gaps,
               Verifier Gaps and Presentation Hardening in an Evidence-Driven
               API Migration Task},
  year      = {2026},
  publisher = {Zenodo},
  doi       = {10.5281/zenodo.23075022},
  url       = {https://doi.org/10.5281/zenodo.23075022}
}
```

## License

[MIT](LICENSE)
