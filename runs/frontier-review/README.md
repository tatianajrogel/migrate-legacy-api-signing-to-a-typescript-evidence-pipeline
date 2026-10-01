# Reviews of the frontier variant

Both reviews here were done by model agents (Opus 5.5), not by people.

- `review.json` is the review before any graded attempt: 2 blind solvers that
  saw only what a benchmark agent sees, 2 fairness auditors with the answer
  key, and 1 shortcut hunter. It is kept as it came back, so it describes the
  build as it was then, before the fixes it led to. Its counts and quotes do
  not match the shipped dossier. Only one refuter verdict was stored, and the
  key that said which finding it belongs to was lost.
- `shortcut/` holds the shortcut hunter's scripts. They only read and print.
  Their paths were made relative, and the list in `tells.mjs` of passages that
  are not the migrated scheme's own was brought in line with the shipped build,
  so they can be run again from that folder: `node l3.mjs`, `node tells.mjs`,
  `node oracle.mjs`, `node lastwins.mjs`, `node grep1.mjs`.
- `solver-1/`, `solver2/`, `chains/`, `sample-and-keys/` and `sk1-refute/` are
  scratch files those agents left.
- `review-before-publishing.json` is the review of the commits that added this
  variant to the repository: 4 lenses, on the README's account of the
  first-build and final-build attempts, its description of the variant, and
  the task's own documents. Each finding carries what was done about it. One
  is not fixed: a stock lead-in in the rollout note that contradicts the
  answer, which the repository README lists as a known flaw.
