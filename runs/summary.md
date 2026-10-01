| Condition | Model | Solved (Harbor) | Solved (current verifier) | Solved and clean on probes | Agent time (min) | Tool calls | Cost per attempt (USD) | Session notes read | Appendices read |
|---|---|---|---|---|---|---|---|---|---|
| base documents, first instruction (2 rejection rules unstated) | opus-5-5 | 0 of 3 | 0 of 3 | 0 of 3 | 1.7 to 2.4 | 10 to 13 | 0.57 | 38 to 44% | 0 to 4% |
| base documents, neutral instruction | haiku-4-5 | 0 of 3 | 0 of 3 | 0 of 3 | 1.8 to 3.0 | 34 to 37 | 0.30 | 32 to 81% | 0 to 5% |
| base documents, pointed instruction | haiku-4-5 | 1 of 3 | 0 of 3 | 0 of 3 | 1.1 to 1.9 | 21 to 25 | 0.20 | 32 to 79% | 0% |
| base documents, pointed instruction | opus-5-5 | 3 of 3 | 3 of 3 | 3 of 3 | 1.5 to 1.8 | 12 to 14 | 0.46 | 31 to 33% | 1 to 13% |
| base documents, pointed instruction | sonnet-5-5 | 3 of 3 | 3 of 3 | 3 of 3 | 0.8 to 0.9 | 11 to 12 | 0.21 | 37 to 42% | 0 to 3% |
| hard documents, neutral instruction | haiku-4-5 | 0 of 3 | 0 of 3 | 0 of 3 | 2.0 to 3.2 | 24 to 34 | 0.26 | 14 to 32% | 0% |
| hard documents, neutral instruction | opus-5-5 | 3 of 3 | 3 of 3 | 3 of 3 | 1.8 to 2.2 | 16 to 18 | 0.81 | 99 to 100% | 0 to 5% |
| hard documents, neutral instruction | sonnet-5-5 | 3 of 3 | 3 of 3 | 3 of 3 | 0.7 to 0.9 | 6 to 9 | 0.22 | 29 to 56% | 0 to 8% |
| hard documents, pointed instruction | haiku-4-5 | 0 of 3 | 0 of 3 | 0 of 3 | 2.0 to 3.0 | 17 to 34 | 0.24 | 32 to 71% | 0% |

| Condition | Model | Rule | Attempts wrong | Form implemented | Why |
|---|---|---|---|---|---|
| base documents, neutral instruction | haiku-4-5 | header_values | 3 of 3 | raw (3) | left as the starter has it, never saw the deciding text (3) |
| base documents, neutral instruction | haiku-4-5 | query_order | 2 of 3 | name-only (2) | left as the starter has it, never saw the deciding text (2) |
| base documents, neutral instruction | haiku-4-5 | key_bytes | 1 of 3 | verbatim (1) | left as the starter has it, never saw the deciding text (1) |
| base documents, pointed instruction | haiku-4-5 | header_values | 1 of 3 | raw (1) | left as the starter has it, never saw the deciding text (1) |
| base documents, pointed instruction | haiku-4-5 | query_order | 1 of 3 | name-only (1) | left as the starter has it, never saw the deciding text (1) |
| base documents, pointed instruction | haiku-4-5 | key_bytes | 1 of 3 | verbatim (1) | left as the starter has it, never saw the deciding text (1) |
| base documents, pointed instruction | haiku-4-5 | roster | 2 of 3 | every-file-in-directory (2) | left as the starter has it, never saw the deciding text (2) |
| hard documents, neutral instruction | haiku-4-5 | header_values | 3 of 3 | raw (3) | left as the starter has it, never saw the deciding text (3) |
| hard documents, neutral instruction | haiku-4-5 | query_order | 3 of 3 | name-only (3) | left as the starter has it, never saw the deciding text (3) |
| hard documents, neutral instruction | haiku-4-5 | signed_headers | 2 of 3 | x-gw-only (2) | left as the starter has it, having seen the deciding text (1)<br>left as the starter has it, never saw the deciding text (1) |
| hard documents, neutral instruction | haiku-4-5 | body_hash | 1 of 3 | unsigned-when-empty-or-absent (1) | left as the starter has it, never saw the deciding text (1) |
| hard documents, neutral instruction | haiku-4-5 | trailing_newline | 2 of 3 | lf (2) | left as the starter has it, never saw the deciding text (1)<br>left as the starter has it, having seen the deciding text (1) |
| hard documents, neutral instruction | haiku-4-5 | key_bytes | 2 of 3 | verbatim (2) | left as the starter has it, having seen the deciding text (2) |
| hard documents, neutral instruction | haiku-4-5 | roster | 3 of 3 | every-file-in-directory (3) | left as the starter has it, having seen the deciding text (3) |
| hard documents, pointed instruction | haiku-4-5 | header_values | 2 of 3 | raw (2) | left as the starter has it, never saw the deciding text (2) |
| hard documents, pointed instruction | haiku-4-5 | query_order | 3 of 3 | name-only (3) | left as the starter has it, never saw the deciding text (3) |
| hard documents, pointed instruction | haiku-4-5 | signed_headers | 1 of 3 | x-gw-only (1) | left as the starter has it, having seen the deciding text (1) |
| hard documents, pointed instruction | haiku-4-5 | trailing_newline | 1 of 3 | lf (1) | left as the starter has it, having seen the deciding text (1) |
| hard documents, pointed instruction | haiku-4-5 | key_bytes | 1 of 3 | verbatim (1) | left as the starter has it, having seen the deciding text (1) |
| hard documents, pointed instruction | haiku-4-5 | hashed_text | 1 of 3 | without-lf (1) | ? (1) |

| Condition | Model | Rule | Saw the deciding text: right | Saw it: wrong | Never saw it: right | Never saw it: wrong |
|---|---|---|---|---|---|---|
| base documents, first instruction (2 rejection rules unstated) | opus-5-5 | header_values | 3 | 0 | 0 | 0 |
| base documents, first instruction (2 rejection rules unstated) | opus-5-5 | query_order | 3 | 0 | 0 | 0 |
| base documents, first instruction (2 rejection rules unstated) | opus-5-5 | signed_headers | 3 | 0 | 0 | 0 |
| base documents, first instruction (2 rejection rules unstated) | opus-5-5 | body_hash | 3 | 0 | 0 | 0 |
| base documents, first instruction (2 rejection rules unstated) | opus-5-5 | trailing_newline | 3 | 0 | 0 | 0 |
| base documents, first instruction (2 rejection rules unstated) | opus-5-5 | key_bytes | 3 | 0 | 0 | 0 |
| base documents, first instruction (2 rejection rules unstated) | opus-5-5 | roster | 3 | 0 | 0 | 0 |
| base documents, first instruction (2 rejection rules unstated) | opus-5-5 | all 7 | 21 | 0 | 0 | 0 |
| base documents, neutral instruction | haiku-4-5 | header_values | 0 | 0 | 0 | 3 |
| base documents, neutral instruction | haiku-4-5 | query_order | 1 | 0 | 0 | 2 |
| base documents, neutral instruction | haiku-4-5 | signed_headers | 3 | 0 | 0 | 0 |
| base documents, neutral instruction | haiku-4-5 | body_hash | 3 | 0 | 0 | 0 |
| base documents, neutral instruction | haiku-4-5 | trailing_newline | 3 | 0 | 0 | 0 |
| base documents, neutral instruction | haiku-4-5 | key_bytes | 2 | 0 | 0 | 1 |
| base documents, neutral instruction | haiku-4-5 | roster | 3 | 0 | 0 | 0 |
| base documents, neutral instruction | haiku-4-5 | all 7 | 15 | 0 | 0 | 6 |
| base documents, pointed instruction | haiku-4-5 | header_values | 2 | 0 | 0 | 1 |
| base documents, pointed instruction | haiku-4-5 | query_order | 2 | 0 | 0 | 1 |
| base documents, pointed instruction | haiku-4-5 | signed_headers | 3 | 0 | 0 | 0 |
| base documents, pointed instruction | haiku-4-5 | body_hash | 3 | 0 | 0 | 0 |
| base documents, pointed instruction | haiku-4-5 | trailing_newline | 3 | 0 | 0 | 0 |
| base documents, pointed instruction | haiku-4-5 | key_bytes | 2 | 0 | 0 | 1 |
| base documents, pointed instruction | haiku-4-5 | roster | 1 | 0 | 0 | 2 |
| base documents, pointed instruction | haiku-4-5 | all 7 | 16 | 0 | 0 | 5 |
| base documents, pointed instruction | opus-5-5 | header_values | 3 | 0 | 0 | 0 |
| base documents, pointed instruction | opus-5-5 | query_order | 3 | 0 | 0 | 0 |
| base documents, pointed instruction | opus-5-5 | signed_headers | 3 | 0 | 0 | 0 |
| base documents, pointed instruction | opus-5-5 | body_hash | 3 | 0 | 0 | 0 |
| base documents, pointed instruction | opus-5-5 | trailing_newline | 3 | 0 | 0 | 0 |
| base documents, pointed instruction | opus-5-5 | key_bytes | 3 | 0 | 0 | 0 |
| base documents, pointed instruction | opus-5-5 | roster | 3 | 0 | 0 | 0 |
| base documents, pointed instruction | opus-5-5 | all 7 | 21 | 0 | 0 | 0 |
| base documents, pointed instruction | sonnet-5-5 | header_values | 3 | 0 | 0 | 0 |
| base documents, pointed instruction | sonnet-5-5 | query_order | 3 | 0 | 0 | 0 |
| base documents, pointed instruction | sonnet-5-5 | signed_headers | 3 | 0 | 0 | 0 |
| base documents, pointed instruction | sonnet-5-5 | body_hash | 3 | 0 | 0 | 0 |
| base documents, pointed instruction | sonnet-5-5 | trailing_newline | 3 | 0 | 0 | 0 |
| base documents, pointed instruction | sonnet-5-5 | key_bytes | 3 | 0 | 0 | 0 |
| base documents, pointed instruction | sonnet-5-5 | roster | 3 | 0 | 0 | 0 |
| base documents, pointed instruction | sonnet-5-5 | all 7 | 21 | 0 | 0 | 0 |
| hard documents, neutral instruction | haiku-4-5 | header_values | 0 | 0 | 0 | 3 |
| hard documents, neutral instruction | haiku-4-5 | query_order | 0 | 0 | 0 | 3 |
| hard documents, neutral instruction | haiku-4-5 | signed_headers | 1 | 1 | 0 | 1 |
| hard documents, neutral instruction | haiku-4-5 | body_hash | 2 | 0 | 0 | 1 |
| hard documents, neutral instruction | haiku-4-5 | trailing_newline | 1 | 1 | 0 | 1 |
| hard documents, neutral instruction | haiku-4-5 | key_bytes | 1 | 2 | 0 | 0 |
| hard documents, neutral instruction | haiku-4-5 | roster | 0 | 3 | 0 | 0 |
| hard documents, neutral instruction | haiku-4-5 | all 7 | 5 | 7 | 0 | 9 |
| hard documents, neutral instruction | opus-5-5 | header_values | 3 | 0 | 0 | 0 |
| hard documents, neutral instruction | opus-5-5 | query_order | 3 | 0 | 0 | 0 |
| hard documents, neutral instruction | opus-5-5 | signed_headers | 3 | 0 | 0 | 0 |
| hard documents, neutral instruction | opus-5-5 | body_hash | 3 | 0 | 0 | 0 |
| hard documents, neutral instruction | opus-5-5 | trailing_newline | 3 | 0 | 0 | 0 |
| hard documents, neutral instruction | opus-5-5 | key_bytes | 3 | 0 | 0 | 0 |
| hard documents, neutral instruction | opus-5-5 | roster | 3 | 0 | 0 | 0 |
| hard documents, neutral instruction | opus-5-5 | all 7 | 21 | 0 | 0 | 0 |
| hard documents, neutral instruction | sonnet-5-5 | header_values | 3 | 0 | 0 | 0 |
| hard documents, neutral instruction | sonnet-5-5 | query_order | 3 | 0 | 0 | 0 |
| hard documents, neutral instruction | sonnet-5-5 | signed_headers | 3 | 0 | 0 | 0 |
| hard documents, neutral instruction | sonnet-5-5 | body_hash | 3 | 0 | 0 | 0 |
| hard documents, neutral instruction | sonnet-5-5 | trailing_newline | 3 | 0 | 0 | 0 |
| hard documents, neutral instruction | sonnet-5-5 | key_bytes | 3 | 0 | 0 | 0 |
| hard documents, neutral instruction | sonnet-5-5 | roster | 3 | 0 | 0 | 0 |
| hard documents, neutral instruction | sonnet-5-5 | all 7 | 21 | 0 | 0 | 0 |
| hard documents, pointed instruction | haiku-4-5 | header_values | 1 | 0 | 0 | 2 |
| hard documents, pointed instruction | haiku-4-5 | query_order | 0 | 0 | 0 | 3 |
| hard documents, pointed instruction | haiku-4-5 | signed_headers | 2 | 1 | 0 | 0 |
| hard documents, pointed instruction | haiku-4-5 | body_hash | 3 | 0 | 0 | 0 |
| hard documents, pointed instruction | haiku-4-5 | trailing_newline | 2 | 1 | 0 | 0 |
| hard documents, pointed instruction | haiku-4-5 | key_bytes | 2 | 1 | 0 | 0 |
| hard documents, pointed instruction | haiku-4-5 | roster | 3 | 0 | 0 | 0 |
| hard documents, pointed instruction | haiku-4-5 | all 7 | 13 | 3 | 0 | 5 |

| Condition | Model | Attempts with every rule right | ...of those, with an outcome deviation | Attempts not diagnosed |
|---|---|---|---|---|
| base documents, first instruction (2 rejection rules unstated) | opus-5-5 | 3 of 3 | 3 | 0 |
| base documents, neutral instruction | haiku-4-5 | 0 of 3 | 0 | 0 |
| base documents, pointed instruction | haiku-4-5 | 1 of 3 | 1 | 0 |
| base documents, pointed instruction | opus-5-5 | 3 of 3 | 0 | 0 |
| base documents, pointed instruction | sonnet-5-5 | 3 of 3 | 0 | 0 |
| hard documents, neutral instruction | haiku-4-5 | 0 of 3 | 0 | 0 |
| hard documents, neutral instruction | opus-5-5 | 3 of 3 | 0 | 0 |
| hard documents, neutral instruction | sonnet-5-5 | 3 of 3 | 0 | 0 |
| hard documents, pointed instruction | haiku-4-5 | 0 of 3 | 0 | 0 |
