// Harness for the authorization lens. Reproduces the 8 approved hashes from
// analysis/scheme.mjs + the graded request sets, and runs departures over all
// 8 graded sets (4 per variant).
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { evidence, CORRECT, SCHEME, headerOf, canonical, sha256, hmac, ROSTER } from "file:///C:/expert/migrate-legacy-api-signing-to-a-typescript-evidence-pipeline/analysis/scheme.mjs";
import { loadKeyFiles } from "file:///C:/expert/migrate-legacy-api-signing-to-a-typescript-evidence-pipeline/analysis/build_probes.mjs";

export const ROOT = "C:/expert/migrate-legacy-api-signing-to-a-typescript-evidence-pipeline";

export const EXPECTED = {
  base: {
    sample: "cf4c8c1e8d935d802838f6f3f5f39871b83cca554d65904319df14fe1f94e3a0",
    h1: "0a1332b46a3c8ff8b15f1f89f53d483e3c85185fbd00c28aba9454b3a0755420",
    h2: "83089c61af1f0c911e5626f3f3d00dd21d045e364160a19d1defa850befafbb0",
    h3: "62b7ce36f02fbd8bd0f4552d7befbb6b12bda522c58106607ecdaa5ea1f2cbdf",
  },
  hard: {
    sample: "4742b162386f85ebd6c5e195bbb4eb81882d8dbd9fea3e41285162b858d7d5b0",
    h1: "894907e217d0c6a84825fb9352915cd7c74e7c1c0ac32ae84bbd28381534305f",
    h2: "31f418d63672e2a2bd3a040e0af104cfc411d564fca612a57383853d4dbcf7de",
    h3: "62b7ce36f02fbd8bd0f4552d7befbb6b12bda522c58106607ecdaa5ea1f2cbdf",
  },
};

function setPath(variant, name) {
  const base = variant === "hard" ? `${ROOT}/hard` : ROOT;
  return name === "sample"
    ? `${base}/environment/app/requests/sample-requests.json`
    : `${base}/tests/holdout/${name}/requests.json`;
}

export const KEYS = { base: loadKeyFiles("base"), hard: loadKeyFiles("hard") };

export function loadSet(variant, name) {
  return JSON.parse(readFileSync(setPath(variant, name), "utf8"));
}

export const sha256Bytes = (s) => createHash("sha256").update(s, "utf8").digest("hex");

export function render(records, fn, keyFiles) {
  return records.map((r, i) => JSON.stringify(fn(r, i + 1, keyFiles)) + "\n").join("");
}

export const reference = (rec, seq, keyFiles) => evidence(rec, seq, CORRECT, keyFiles);

// Verify the 8 hashes. Returns { ok, table }.
export function checkHarness() {
  const table = [];
  let ok = true;
  for (const variant of ["base", "hard"]) {
    for (const name of ["sample", "h1", "h2", "h3"]) {
      const got = sha256Bytes(render(loadSet(variant, name), reference, KEYS[variant]));
      const want = EXPECTED[variant][name];
      table.push({ variant, set: name, match: got === want, got });
      if (got !== want) ok = false;
    }
  }
  return { ok, table };
}

// Run a departure over all 8 sets. Returns per-set match, plus diff lines.
export function runDeparture(fn) {
  const out = {};
  for (const variant of ["base", "hard"]) {
    out[variant] = {};
    for (const name of ["sample", "h1", "h2", "h3"]) {
      const records = loadSet(variant, name);
      const got = render(records, fn, KEYS[variant]);
      const match = sha256Bytes(got) === EXPECTED[variant][name];
      const diffs = [];
      if (!match) {
        const expLines = render(records, reference, KEYS[variant]).split("\n");
        const gotLines = got.split("\n");
        expLines.forEach((l, i) => { if (l !== gotLines[i]) diffs.push({ seq: i + 1, expected: l, got: gotLines[i] }); });
      }
      out[variant][name] = { match, diffs };
    }
  }
  const survivesBase = Object.values(out.base).every((s) => s.match);
  const survivesHard = Object.values(out.hard).every((s) => s.match);
  return { sets: out, survivesBase, survivesHard };
}

// The reference evidence split so a departure can replace just the
// authorization stage. `authStage(rec, keyId, ev, keyFiles)` receives the
// record, the resolved key id, and the evidence object after the signature was
// filled (so ev.signature is the recomputed HMAC). It returns the final object.
export function withAuthStage(authStage, opts = {}) {
  const lookupAuth = opts.lookupAuth ?? ((rec) => headerOf(rec, "authorization"));
  return (rec, seq, keyFiles) => {
    const ev = evidence(rec, seq, CORRECT, keyFiles);
    // Only records that reached the authorization stage are re-decided.
    if (ev.outcome === "rejected" && (ev.reason === "missing-key-id" || ev.reason === "unknown-key-id")) return ev;
    const keyId = ev.key_id;
    const base = { seq: ev.seq, key_id: ev.key_id, method: ev.method, path: ev.path, outcome: "signed", signature: ev.signature, canonical_sha256: ev.canonical_sha256 };
    const auth = lookupAuth(rec);
    if (auth === null || auth === undefined) return base;
    return authStage(auth, keyId, base, rec);
  };
}

// The reference authorization stage, for comparison and as a template.
export function referenceAuthStage(auth, keyId, base) {
  const prefix = `${SCHEME} keyId=${keyId}, signature=`;
  if (!auth.startsWith(prefix)) return { ...base, outcome: "rejected", reason: "malformed-authorization" };
  return auth.slice(prefix.length).trim() === base.signature
    ? { ...base, outcome: "verified" }
    : { ...base, outcome: "rejected", reason: "signature-mismatch" };
}

export { evidence, CORRECT, SCHEME, headerOf, canonical, sha256, hmac, ROSTER };

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop())) {
  const { ok, table } = checkHarness();
  console.table(table);
  console.log(ok ? "HARNESS OK: all 8 hashes reproduced" : "HARNESS FAILED");
  // Sanity: withAuthStage(referenceAuthStage) must also reproduce everything.
  const r = runDeparture(withAuthStage(referenceAuthStage));
  console.log("withAuthStage(reference) survives base:", r.survivesBase, "hard:", r.survivesHard);
  process.exit(ok && r.survivesBase && r.survivesHard ? 0 : 1);
}
