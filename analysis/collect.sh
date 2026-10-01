#!/usr/bin/env bash
# Runs every attempt's own pipeline over the probe set and the graded sets, and
# keeps what it printed. diagnose.mjs reads the result.
#
# For each trial under the given Harbor jobs directories, the /app the agent
# left behind is copied into a fresh verifier container, rebuilt from its
# TypeScript sources and run the same way the verifier runs it: unprivileged,
# with the request set on stdin. The container has no network.
#
# Usage: analysis/collect.sh <base|hard|frontier> <out dir> <harbor jobs dir>...
#
# Writes <out dir>/<variant>/<trial>/ with the build status, one .ndjson per
# request set, the sources the attempt shipped, its trajectory, the trial's
# result.json and job config for the model name and reward, and under regrade/
# the reward the current verifier gives the same /app. A trial already
# collected by this version of the script is not run again.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

VARIANT="${1:?variant: base or hard}"
OUT="${2:?out dir}"
shift 2
case "$VARIANT" in
  base) TASK="$ROOT" ;;
  hard) TASK="$ROOT/hard" ;;
  frontier) TASK="$ROOT/frontier" ;;
  *) echo "unknown variant $VARIANT; known: base, hard, frontier" >&2; exit 2 ;;
esac

IMAGE="signing-task-verifier-$VARIANT"
docker build -q -t "$IMAGE" "$TASK/tests" >/dev/null

STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
mkdir -p "$STAGE/collect"
cp "$ROOT/analysis/probes/$VARIANT.requests.json" "$STAGE/collect/probes.json"
cp "$TASK/environment/app/requests/sample-requests.json" "$STAGE/collect/sample.json"
cp "$TASK/tests/holdout/h1/requests.json" "$STAGE/collect/h1.json"
cp "$TASK/tests/holdout/h2/requests.json" "$STAGE/collect/h2.json"
cp "$TASK/tests/holdout/h3/requests.json" "$STAGE/collect/h3.json"
cat >"$STAGE/collect/run.sh" <<'EOF'
#!/bin/bash
# Inside the verifier container. Never fails: every status goes to a file.
set -u
mkdir -p /out
chmod -R a+rX /app 2>/dev/null || true
cd /app
timeout 300 tsc -p tsconfig.json >/out/build.log 2>&1
echo $? >/out/build.status
for set in probes sample h1 h2 h3; do
  timeout 120 setpriv --reuid=12000 --regid=12000 --clear-groups \
    node /app/dist/pipeline.js <"/collect/$set.json" >"/out/$set.ndjson" 2>"/out/$set.err"
  echo $? >"/out/$set.status"
done
# The verifier as it stands now, over the same /app. Harbor scored the attempt
# with the verifier of its day; this is the score it gets from the current one.
mkdir -p /out/regrade
bash /tests/test.sh >/out/regrade/test-stdout.txt 2>&1 || true
cp /logs/verifier/reward.txt /logs/verifier/ctrf.json /out/regrade/ 2>/dev/null || true
exit 0
EOF

for jobs in "$@"; do
  for trial in "$jobs"/*/*__*/; do
    [ -d "$trial" ] || continue
    name="$(basename "$trial")"
    dest="$OUT/$VARIANT/$name"
    # A trial still running has no result.json yet. Leave it for the next call.
    [ -f "$trial/result.json" ] || continue

    mkdir -p "$dest/src"
    cp "$trial/result.json" "$dest/trial-result.json"
    cp "$(dirname "$trial")/config.json" "$dest/job-config.json"
    cp "$trial/agent/trajectory.json" "$dest/trajectory.json" 2>/dev/null || true
    cp -R "$trial/artifacts/app/src/." "$dest/src/" 2>/dev/null || true
    # Already collected by this version of the script, which also re-grades.
    [ -f "$dest/regrade/reward.txt" ] && continue
    if [ ! -d "$trial/artifacts/app" ]; then
      echo "  $name: no /app artifact, nothing to run"
      continue
    fi

    container="$(docker create --network none "$IMAGE" bash /collect/run.sh)"
    docker cp "$trial/artifacts/app/." "$container:/app" >/dev/null
    docker cp "$STAGE/collect" "$container:/collect" >/dev/null
    docker start -a "$container" >/dev/null 2>&1 || true
    docker cp "$container:/out/." "$dest/" >/dev/null 2>&1 || true
    docker rm "$container" >/dev/null
    echo "  $name: build $(cat "$dest/build.status" 2>/dev/null || echo missing)," \
      "probes exit $(cat "$dest/probes.status" 2>/dev/null || echo missing)"
  done
done
