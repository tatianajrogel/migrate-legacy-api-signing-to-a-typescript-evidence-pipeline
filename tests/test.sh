#!/bin/bash
# Verifier entrypoint. Runs in the separate verifier container.
#
# Deliberately NOT `set -e`: a failing pytest must still reach the reward write.
set -uo pipefail

mkdir -p /logs/verifier
# The verifier executes agent-produced code, so keep the reward out of its reach.
chmod 700 /logs/verifier

# The unprivileged sandbox user must be able to read the agent's sources, the
# key material, and the request fixtures it is re-run against.
chmod -R a+rX /app 2>/dev/null || true

/venv/bin/python -m pytest --ctrf /logs/verifier/ctrf.json /tests/test_outputs.py -rA
rc=$?

if [ "$rc" -eq 0 ]; then
  echo 1 > /logs/verifier/reward.txt
else
  echo 0 > /logs/verifier/reward.txt
fi

exit 0
