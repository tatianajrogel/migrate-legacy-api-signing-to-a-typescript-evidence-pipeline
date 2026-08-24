"""Verifier for the gateway signing migration.

6 independent axes are graded:

1. The evidence file for the shipped requests matches the approved bytes.
2. Re-running the agent's own pipeline on held-out requests reproduces approved
   bytes. This is the anti-cheat axis: a hand-written evidence file cannot pass.
3. The output is deterministic across repeated runs.
4. Only the 2 roster key files are opened; the retired key is never read.
5. No network access is attempted.
6. Verification outcomes are correct, including each documented rejection reason.

The pipeline is rebuilt from the agent's own TypeScript sources before any of the
re-run axes execute, so the graded behaviour is the agent's code, not a stale
build artifact it may have left behind.
"""

import hashlib
import json
import os
import re
import subprocess
from pathlib import Path

import pytest

APP = Path("/app")
SRC = APP / "src"
EVIDENCE = APP / "out" / "evidence.ndjson"
REQUESTS = APP / "requests" / "sample-requests.json"
KEYS = APP / "keys"
HOLDOUT = Path("/tests/holdout")

SANDBOX_UID = 12000
DROP_PRIVILEGES = [
    "setpriv",
    f"--reuid={SANDBOX_UID}",
    f"--regid={SANDBOX_UID}",
    "--clear-groups",
]

# SHA-256 of the evidence each input set must produce. Generated from solution/src.
EXPECTED_PRIMARY = "cf4c8c1e8d935d802838f6f3f5f39871b83cca554d65904319df14fe1f94e3a0"
EXPECTED_HOLDOUT = {
    "h1": "0a1332b46a3c8ff8b15f1f89f53d483e3c85185fbd00c28aba9454b3a0755420",
    "h2": "83089c61af1f0c911e5626f3f3d00dd21d045e364160a19d1defa850befafbb0",
}

RETIRED_KEY = "gw-legacy-99.key"


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


@pytest.fixture(scope="session")
def built_entry() -> Path:
    """Compiles the agent's TypeScript sources and returns the entry point.

    Rebuilding from source is what ties every later axis to the agent's own code
    rather than to whatever happened to be left in /app/out or /app/dist.
    """
    result = subprocess.run(
        ["tsc", "-p", "tsconfig.json"],
        cwd=APP,
        capture_output=True,
        text=True,
        timeout=300,
    )
    assert result.returncode == 0, (
        "the agent's TypeScript sources do not compile:\n"
        f"{result.stdout}\n{result.stderr}"
    )
    entry = APP / "dist" / "pipeline.js"
    assert entry.is_file(), f"{entry} was not produced by the build"
    return entry


def run_pipeline(entry: Path, request_file: Path, extra_env=None):
    """Runs the agent's compiled pipeline unprivileged with requests on stdin."""
    env = dict(os.environ)
    if extra_env:
        env.update(extra_env)
    with request_file.open("rb") as stdin:
        return subprocess.run(
            DROP_PRIVILEGES + ["node", str(entry)],
            stdin=stdin,
            capture_output=True,
            env=env,
            timeout=180,
        )


def test_evidence_file_exists():
    """The declared artifact was produced at the documented path."""
    assert EVIDENCE.is_file(), f"{EVIDENCE} was not created"


def test_evidence_is_valid_ndjson():
    """Every line parses as JSON and carries exactly the documented fields."""
    raw = EVIDENCE.read_bytes()
    assert raw.endswith(b"\n"), "evidence must end with a trailing newline"

    required = {
        "seq",
        "key_id",
        "method",
        "path",
        "outcome",
        "signature",
        "canonical_sha256",
    }
    for lineno, line in enumerate(raw.decode().splitlines(), start=1):
        record = json.loads(line)
        missing = required - set(record)
        assert not missing, f"line {lineno} is missing fields: {sorted(missing)}"
        extra = set(record) - required - {"reason"}
        assert not extra, f"line {lineno} carries unexpected fields: {sorted(extra)}"


def test_evidence_matches_approved_bytes():
    """The evidence is byte-identical to the approved output for the shipped inputs.

    This is where the superseded canonicalisation rules bite: any one of them
    left unreversed changes the canonical string and therefore every signature.
    """
    actual = sha256_bytes(EVIDENCE.read_bytes())
    assert actual == EXPECTED_PRIMARY, (
        "evidence.ndjson does not match the approved bytes\n"
        f"  expected sha256 {EXPECTED_PRIMARY}\n  actual   sha256 {actual}"
    )


@pytest.mark.parametrize("name", sorted(EXPECTED_HOLDOUT))
def test_holdout_reproduces_approved_bytes(built_entry, name):
    """Re-running the agent's pipeline on unseen requests reproduces approved bytes.

    This is the anti-cheat axis. Producing the shipped evidence once is cheap to
    fake; re-deriving correct signatures for requests the agent has never seen
    requires the canonicalisation and key-selection rules to actually be right.
    """
    result = run_pipeline(built_entry, HOLDOUT / name / "requests.json")
    assert result.returncode == 0, (
        f"pipeline failed on held-out set {name}:\n{result.stderr.decode()}"
    )
    actual = sha256_bytes(result.stdout)
    assert actual == EXPECTED_HOLDOUT[name], (
        f"held-out set {name} did not reproduce the approved bytes\n"
        f"  expected sha256 {EXPECTED_HOLDOUT[name]}\n  actual   sha256 {actual}"
    )


def test_output_is_deterministic(built_entry):
    """2 runs over the same inputs produce identical bytes."""
    first = run_pipeline(built_entry, REQUESTS)
    second = run_pipeline(built_entry, REQUESTS)
    assert first.returncode == 0 and second.returncode == 0, "pipeline failed"
    assert sha256_bytes(first.stdout) == sha256_bytes(second.stdout), (
        "pipeline output is not deterministic across runs"
    )


def test_only_approved_key_files_are_opened(built_entry):
    """The pipeline reads only the roster keys, never the retired one.

    The retired key is made unreadable before the run. A pipeline that derives
    its roster from the captures never touches it and is unaffected; one that
    globs the key directory or trusts the key id blindly fails here.
    """
    retired = KEYS / RETIRED_KEY
    assert retired.is_file(), f"{retired} is missing from the environment"

    original_mode = retired.stat().st_mode
    os.chmod(retired, 0o000)
    try:
        result = run_pipeline(built_entry, REQUESTS)
        assert result.returncode == 0, (
            "pipeline failed while the retired key was unreadable, which means it "
            f"tried to read it:\n{result.stderr.decode()}"
        )
        actual = sha256_bytes(result.stdout)
        assert actual == EXPECTED_PRIMARY, (
            "evidence changed when the retired key was made unreadable, so the "
            "pipeline depends on a key that is off the approved roster"
        )
    finally:
        os.chmod(retired, original_mode)


def test_no_network_access_is_attempted(built_entry):
    """The pipeline completes correctly with all outbound network redirected.

    Signing is a pure local computation. The run happens with every proxy
    variable pointed at a closed port; a pipeline that reaches out for anything
    stalls or errors instead of producing the approved bytes.
    """
    blocked = {
        "http_proxy": "http://127.0.0.1:9",
        "https_proxy": "http://127.0.0.1:9",
        "HTTP_PROXY": "http://127.0.0.1:9",
        "HTTPS_PROXY": "http://127.0.0.1:9",
    }
    result = run_pipeline(built_entry, REQUESTS, extra_env=blocked)
    assert result.returncode == 0, (
        f"pipeline failed with networking blocked:\n{result.stderr.decode()}"
    )
    assert sha256_bytes(result.stdout) == EXPECTED_PRIMARY, (
        "evidence changed with networking blocked, so the pipeline depends on "
        "network access"
    )


def test_sources_contain_no_network_calls():
    """No network client appears anywhere in the agent's TypeScript sources."""
    forbidden = re.compile(
        r"\b(fetch|XMLHttpRequest|WebSocket)\b|"
        r"node:(http|https|net|dgram|tls)\b|"
        r"require\(\s*['\"](http|https|net|dgram|tls)['\"]\s*\)",
    )
    for path in sorted(SRC.rglob("*.ts")):
        hit = forbidden.search(path.read_text())
        assert hit is None, (
            f"{path} references network functionality: {hit.group(0)!r}"
        )


def test_verification_outcomes_are_correct():
    """Each documented outcome and rejection reason appears on the right record.

    Signing, successful verification, and all 4 rejection reasons are
    exercised by the shipped request set.
    """
    records = [json.loads(line) for line in EVIDENCE.read_text().splitlines()]
    by_seq = {r["seq"]: r for r in records}
    assert len(by_seq) == 8, f"expected 8 evidence records, got {len(by_seq)}"

    expected = {
        1: ("signed", None),
        2: ("signed", None),
        3: ("signed", None),
        4: ("rejected", "unknown-key-id"),
        5: ("rejected", "missing-key-id"),
        6: ("verified", None),
        7: ("rejected", "signature-mismatch"),
        8: ("rejected", "malformed-authorization"),
    }
    for seq, (outcome, reason) in expected.items():
        record = by_seq[seq]
        assert record["outcome"] == outcome, (
            f"record {seq}: expected outcome {outcome!r}, got {record['outcome']!r}"
        )
        assert record.get("reason") == reason, (
            f"record {seq}: expected reason {reason!r}, got {record.get('reason')!r}"
        )


def test_retired_key_is_never_signed():
    """A request naming the retired key is rejected rather than signed.

    The captures show the legacy signer enumerating the key directory but
    opening only the 2 roster keys, so the retired key is off the roster even
    though it is present on disk.
    """
    for line in EVIDENCE.read_text().splitlines():
        record = json.loads(line)
        if record["key_id"] == "gw-legacy-99":
            assert record["outcome"] == "rejected", (
                "a request naming the retired key gw-legacy-99 was signed; the "
                "captures place that key off the approved roster"
            )
            assert record["signature"] == "", (
                "the retired key produced a signature, so its material was read"
            )
            return
    pytest.fail("no evidence record references the retired key gw-legacy-99")
