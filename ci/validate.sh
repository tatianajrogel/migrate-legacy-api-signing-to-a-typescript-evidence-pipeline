#!/usr/bin/env bash
# Grades the task against itself, the way the real harness would.
#
# Builds the agent image and the separate verifier image, then produces an /app
# for each case below, copies it into a fresh verifier container (the same
# hand-off as environment_mode = "separate") and reads the reward it writes.
#
#   oracle        solution/solve.sh as shipped             reward must be 1
#   nop           /app untouched, agent did nothing         reward must be 0
#   starter       the shipped starter built and run as-is   reward must be 0
#   mutant:<x>    oracle with exactly one rule wrong        reward must be 0
#
# Usage: ci/validate.sh [base|hard]
#
# With no argument it grades the base task at the repository root. With "hard"
# it grades the variant under hard/.
#
# Both get the 7 rule mutants and the 7 contract mutants, which get every rule
# right and depart from the output contract in instruction.md instead. The hard
# variant adds 9 more that each adopt a rule the dossier trialled, changed again
# or declined.
#
# Exits non-zero if any case gets the wrong reward.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

VARIANT="${1:-base}"
case "$VARIANT" in
  base) TASK="$ROOT" ;;
  hard) TASK="$ROOT/hard" ;;
  *) echo "unknown variant $VARIANT; known: base, hard" >&2; exit 2 ;;
esac

ENV_IMAGE="signing-task-env-$VARIANT"
VERIFIER_IMAGE="signing-task-verifier-$VARIANT"

MUTANTS=(
  header-values-raw
  query-sort-name-only
  sign-x-gw-only
  unsigned-sentinel
  canonical-trailing-newline
  key-file-verbatim
  roster-from-directory
)
if [ "$VARIANT" = hard ]; then
  MUTANTS+=(
    query-sort-decoded-value
    sign-x-gw-plus-content-type
    absent-body-unsigned
    percent-escapes-uppercased
    valueless-parameter-bare
    path-dot-segments-collapsed
    key-id-any-case
    forwarding-headers-unsigned
    signed-names-comma-joined
  )
fi
MUTANTS+=(
  auth-key-id-unbound
  signature-case-insensitive
  signature-not-trimmed
  short-signature-malformed
  rejected-signature-empty
  auth-loose-separator
  key-id-from-authorization
)

echo "building images..."
docker build -q -t "$ENV_IMAGE" "$TASK/environment" >/dev/null
docker build -q -t "$VERIFIER_IMAGE" "$TASK/tests" >/dev/null

# Runs a prep command in a fresh agent container, then grades what it left in /app.
grade() {
  local case_name="$1" prep="$2"
  local dir="$WORK/$case_name"
  mkdir -p "$dir"

  local agent
  agent="$(docker create "$ENV_IMAGE" bash -c "$prep")"
  docker cp "$TASK/solution" "$agent:/solution"
  docker cp "$ROOT/ci" "$agent:/ci"
  # A mutant that fails to compile would score 0 for the wrong reason, so the
  # prep step itself has to succeed for the reward to mean anything.
  if docker start -a "$agent" >"$dir/agent.log" 2>&1; then
    echo ran >"$dir/agent.status"
  else
    echo broke >"$dir/agent.status"
  fi
  docker cp "$agent:/app" "$dir/app"
  docker rm "$agent" >/dev/null

  local verifier
  verifier="$(docker create "$VERIFIER_IMAGE" bash /tests/test.sh)"
  docker cp "$dir/app/." "$verifier:/app"
  docker start -a "$verifier" >"$dir/verifier.log" 2>&1 || true
  docker cp "$verifier:/logs/verifier/reward.txt" "$dir/reward.txt" 2>/dev/null \
    || echo "missing" >"$dir/reward.txt"
  docker rm "$verifier" >/dev/null

  tr -d '[:space:]' <"$dir/reward.txt"
}

failures=0
check() {
  local case_name="$1" want="$2" prep="$3"
  local got status caught
  got="$(grade "$case_name" "$prep")"
  status="$(cat "$WORK/$case_name/agent.status")"
  caught="$(grep -o 'FAILED [^ ]*' "$WORK/$case_name/verifier.log" \
    | sed 's/.*:://' | sort -u | tr '\n' ' ' || true)"
  if [ "$status" != ran ]; then
    printf '  FAIL  %-36s agent step did not complete\n' "$case_name"
    sed 's/^/        | /' "$WORK/$case_name/agent.log" | tail -n 25
    failures=$((failures + 1))
  elif [ "$got" = "$want" ]; then
    printf '  ok    %-36s reward %s  %s\n' "$case_name" "$got" "${caught:+caught by: $caught}"
  else
    printf '  FAIL  %-36s reward %s, expected %s\n' "$case_name" "$got" "$want"
    sed 's/^/        | /' "$WORK/$case_name/verifier.log" | tail -n 25
    failures=$((failures + 1))
  fi
}

echo "grading..."
check oracle 1 "bash /solution/solve.sh"
check nop 0 "true"
check starter 0 "cd /app && tsc -p tsconfig.json && mkdir -p out \
  && node dist/pipeline.js < requests/sample-requests.json > out/evidence.ndjson"
for m in "${MUTANTS[@]}"; do
  check "mutant:$m" 0 "node /ci/mutate.mjs $m && bash /solution/solve.sh"
done

if [ "$failures" -ne 0 ]; then
  echo "$failures case(s) got the wrong reward"
  exit 1
fi
echo "all cases graded as expected"
