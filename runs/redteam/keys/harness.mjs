// Red-team harness, lens "keys". Reproduces the 8 approved hashes from
// analysis/scheme.mjs and offers runDeparture() to run an alternative
// evidence function over all 4 graded sets of both variants.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { evidence, CORRECT } from "file:///C:/expert/migrate-legacy-api-signing-to-a-typescript-evidence-pipeline/analysis/scheme.mjs";
import { loadKeyFiles, VARIANTS } from "file:///C:/expert/migrate-legacy-api-signing-to-a-typescript-evidence-pipeline/analysis/build_probes.mjs";

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

export const sha256hex = (b) => createHash("sha256").update(b).digest("hex");

export function setPath(variant, name) {
  const task = VARIANTS[variant].task;
  return name === "sample"
    ? `${task}/environment/app/requests/sample-requests.json`
    : `${task}/tests/holdout/${name}/requests.json`;
}

export function loadSet(variant, name) {
  return JSON.parse(readFileSync(setPath(variant, name), "utf8"));
}

export const KEYS = { base: loadKeyFiles("base"), hard: loadKeyFiles("hard") };

export function reference(rec, seq, variant) {
  return evidence(rec, seq, CORRECT, KEYS[variant]);
}

// fn(rec, seq, variant) -> evidence object (or throws)
export function bytesOf(records, fn, variant) {
  return records.map((r, i) => JSON.stringify(fn(r, i + 1, variant)) + "\n").join("");
}

export function selfCheck() {
  let ok = true;
  for (const variant of ["base", "hard"]) {
    for (const name of ["sample", "h1", "h2", "h3"]) {
      const got = sha256hex(bytesOf(loadSet(variant, name), reference, variant));
      const want = EXPECTED[variant][name];
      const pass = got === want;
      ok &&= pass;
      console.log(`[harness] ${variant}/${name}: ${pass ? "OK  " : "FAIL"} ${got}`);
    }
  }
  return ok;
}

// Runs fn over all 8 graded sets; returns {survives, perSet}
export function runDeparture(label, fn) {
  const perSet = {};
  let survives = true;
  for (const variant of ["base", "hard"]) {
    for (const name of ["sample", "h1", "h2", "h3"]) {
      let got;
      try {
        got = sha256hex(bytesOf(loadSet(variant, name), fn, variant));
      } catch (e) {
        got = `THROWS: ${e.message}`;
      }
      const pass = got === EXPECTED[variant][name];
      perSet[`${variant}/${name}`] = pass ? "same" : "DIFF";
      survives &&= pass;
    }
  }
  console.log(`\n== ${label}: ${survives ? "SURVIVES all 8 graded sets" : "caught"}`);
  console.log("   " + Object.entries(perSet).map(([k, v]) => `${k}=${v}`).join(" "));
  return { survives, perSet };
}

// Prints reference vs departure on one example record, in both variants.
export function compare(label, rec, fn, variants = ["base", "hard"]) {
  for (const variant of variants) {
    let ref, dep;
    try { ref = JSON.stringify(reference(rec, 1, variant)); } catch (e) { ref = `THROWS: ${e.message}`; }
    try { dep = JSON.stringify(fn(rec, 1, variant)); } catch (e) { dep = `THROWS: ${e.message}`; }
    console.log(`   [${label}/${variant}] request:   ${JSON.stringify(rec)}`);
    console.log(`   [${label}/${variant}] expected:  ${ref}`);
    console.log(`   [${label}/${variant}] departure: ${dep}`);
    console.log(`   [${label}/${variant}] differs:   ${ref !== dep}`);
  }
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop())) {
  const ok = selfCheck();
  console.log(ok ? "[harness] all 8 hashes reproduced" : "[harness] MISMATCH");
  process.exit(ok ? 0 : 1);
}
