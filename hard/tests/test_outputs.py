"""Verifier for the gateway signing migration.

6 independent axes are graded:

1. The evidence file for the shipped requests matches the approved bytes.
2. Re-running the agent's own pipeline on held-out requests reproduces approved
   bytes. This is the anti-cheat axis: a hand-written evidence file cannot pass.
   h1 and h2 exercise the signing rules; h3 exercises the output contract in
   instruction.md, which the first 2 turned out not to grade.
3. The output is deterministic across repeated runs.
4. Only the 2 roster key files are opened; the inactive key is never read.
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
EXPECTED_PRIMARY = "4742b162386f85ebd6c5e195bbb4eb81882d8dbd9fea3e41285162b858d7d5b0"
EXPECTED_HOLDOUT = {
    "h1": "894907e217d0c6a84825fb9352915cd7c74e7c1c0ac32ae84bbd28381534305f",
    "h2": "31f418d63672e2a2bd3a040e0af104cfc411d564fca612a57383853d4dbcf7de",
    "h3": "db3beea078df245463a9f0a92838852829ce3b5e7b523041816429f198248e6a",
}

INACTIVE_KEY = "gw-prod-03.key"


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

    This is where the changed canonicalisation rules bite: any one of them left
    as the register has it changes the canonical string and every signature.
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
    The held-out sets also carry the inputs that tell a rule's final form from
    its intermediate one, and an adopted change from a proposal that was not:
    dot segments in the path, lowercase percent escapes, a parameter with no
    "=", values that sort differently once decoded, a missing body, forwarding
    headers, and a key id in the wrong case.
    """
    result = run_pipeline(built_entry, HOLDOUT / name / "requests.json")
    assert result.returncode == 0, (
        f"pipeline failed on held-out set {name}:\n{result.stderr.decode()}"
    )
    # h3 was added after an agent attempt scored a full reward while verifying
    # an Authorization header whose keyId named a different key than the record
    # did. Its records each turn one sentence of instruction.md into a request:
    # a padded signature verifies, a header naming another key is malformed, an
    # uppercase signature is a mismatch, a missing space after the comma is
    # malformed, a record with no key header is missing-key-id whatever the
    # Authorization header says, and an unknown key id is reported before a
    # malformed header is.
    # After a red-team of the verifier it gained 11 more: the scheme and the
    # parameter names in another case, the right key id in the wrong case,
    # whitespace around the separators, text after the signature, a quoted and
    # an empty signature, a key id with path characters, and a roster id in
    # upper case.
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
    """The pipeline reads only the roster keys, never the inactive one.

    The inactive key is made unreadable before the run. A pipeline that derives
    its roster from the captures never touches it and is unaffected; one that
    globs the key directory or trusts the key id blindly fails here.
    """
    inactive = KEYS / INACTIVE_KEY
    assert inactive.is_file(), f"{inactive} is missing from the environment"

    original_mode = inactive.stat().st_mode
    os.chmod(inactive, 0o000)
    try:
        result = run_pipeline(built_entry, REQUESTS)
        assert result.returncode == 0, (
            "pipeline failed while the inactive key was unreadable, which means it "
            f"tried to read it:\n{result.stderr.decode()}"
        )
        actual = sha256_bytes(result.stdout)
        assert actual == EXPECTED_PRIMARY, (
            "evidence changed when the inactive key was made unreadable, so the "
            "pipeline depends on a key that is off the approved roster"
        )
    finally:
        os.chmod(inactive, original_mode)


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
    # Call and import forms only: the bare word "fetch" in a comment is not a
    # network client, and a plain `from "http"` import is one.
    forbidden = re.compile(
        r"\bfetch\s*\(|\bnew\s+(XMLHttpRequest|WebSocket)\b|"
        r"['\"](node:)?(http|https|http2|net|dgram|tls)['\"]",
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


def test_inactive_key_is_never_signed():
    """A request naming the inactive key is rejected rather than signed.

    The captures show the legacy signer enumerating the key directory but
    opening only the 2 roster keys, so gw-prod-03 is off the roster even though
    its file is present on disk.
    """
    for line in EVIDENCE.read_text().splitlines():
        record = json.loads(line)
        if record["key_id"] == "gw-prod-03":
            assert record["outcome"] == "rejected", (
                "a request naming gw-prod-03 was signed; the captures place "
                "that key off the active roster"
            )
            assert record["signature"] == "", (
                "the inactive key produced a signature, so its material was read"
            )
            return
    pytest.fail("no evidence record references gw-prod-03")
