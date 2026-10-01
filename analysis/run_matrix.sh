#!/usr/bin/env bash
# Runs Claude Code on one condition of the task for each model given, under
# Harbor, a fixed number of attempts per model, one attempt at a time.
#
# Usage: CLAUDE_CODE_OAUTH_TOKEN=... analysis/run_matrix.sh <condition> <attempts> <jobs dir> <model>...
#
#   analysis/run_matrix.sh hard 3 ~/jobs/hard claude-haiku-4-5-20251001 claude-sonnet-5-5
#
# Conditions:
#
#   base           the base task as shipped (its instruction points at the notes)
#   base-neutral   base documents, instruction from analysis/instructions/base.neutral.md
#   hard           the hard task as shipped (its instruction is neutral)
#   hard-pointed   hard documents, instruction from analysis/instructions/hard.pointed.md
#
# The credential is read from the environment and is never written anywhere by
# this script. Pass it on stdin to the shell that calls this, not on a command
# line.
#
# Every condition is run from a copy in a folder named after it, so Harbor names
# the trials <condition>__XXXX and they cannot be mixed up afterwards. Keep one
# jobs dir per set of documents: collect.sh takes the documents as an argument.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

CONDITION="${1:?condition: base, base-neutral, hard or hard-pointed}"
ATTEMPTS="${2:?attempts per model}"
JOBS="${3:?harbor jobs dir}"
shift 3
[ "$#" -ge 1 ] || { echo "no models given" >&2; exit 2; }
[ -n "${CLAUDE_CODE_OAUTH_TOKEN:-}${ANTHROPIC_API_KEY:-}" ] \
  || { echo "set CLAUDE_CODE_OAUTH_TOKEN or ANTHROPIC_API_KEY in the environment" >&2; exit 2; }

case "$CONDITION" in
  base)         SOURCE="$ROOT";      INSTRUCTION="$ROOT/instruction.md" ;;
  base-neutral) SOURCE="$ROOT";      INSTRUCTION="$ROOT/analysis/instructions/base.neutral.md" ;;
  hard)         SOURCE="$ROOT/hard"; INSTRUCTION="$ROOT/hard/instruction.md" ;;
  hard-pointed) SOURCE="$ROOT/hard"; INSTRUCTION="$ROOT/analysis/instructions/hard.pointed.md" ;;
  *) echo "unknown condition $CONDITION" >&2; exit 2 ;;
esac

STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
TASK="$STAGE/$CONDITION"
mkdir -p "$TASK"
cp -R "$SOURCE/task.toml" "$SOURCE/environment" "$SOURCE/tests" "$SOURCE/solution" "$TASK/"
cp "$INSTRUCTION" "$TASK/instruction.md"

for model in "$@"; do
  echo "== $CONDITION, $model, $ATTEMPTS attempts"
  harbor run -p "$TASK" -a claude-code -m "anthropic/$model" -k "$ATTEMPTS" -n 1 -q -o "$JOBS"
done
