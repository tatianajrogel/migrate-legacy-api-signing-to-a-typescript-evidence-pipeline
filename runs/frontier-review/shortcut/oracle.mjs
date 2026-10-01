import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { evidence, canonical, CORRECT, RULES, KEY_RULES, everySetting, hmac } from "../../../analysis/scheme.mjs";
const R = fileURLToPath(new URL("../../../frontier", import.meta.url)).replace(/\\/g, "/");
const keyFiles = new Map(["gw-prod-01","gw-prod-02","gw-prod-03"].map((k) => [k, readFileSync(`${R}/environment/app/keys/${k}.key`)]));
const sample = JSON.parse(readFileSync(`${R}/environment/app/requests/sample-requests.json`, "utf8"));
const sets = { sample, h1: JSON.parse(readFileSync(`${R}/tests/holdout/h1/requests.json`,"utf8")), h2: JSON.parse(readFileSync(`${R}/tests/holdout/h2/requests.json`,"utf8")), h3: JSON.parse(readFileSync(`${R}/tests/holdout/h3/requests.json`,"utf8")) };
// The sample hash is read from what the generator wrote, so this grades the
// build that is shipped and not the one this script was first run on.
const EXP = { sample: readFileSync(`${R}/authoring/sample.sha256`, "utf8").trim().split(/\s+/)[0], h1: "894907e217d0c6a84825fb9352915cd7c74e7c1c0ac32ae84bbd28381534305f", h2: "31f418d63672e2a2bd3a040e0af104cfc411d564fca612a57383853d4dbcf7de", h3: "db3beea078df245463a9f0a92838852829ce3b5e7b523041816429f198248e6a" };
const out = (recs, o) => recs.map((r, i) => JSON.stringify(evidence(r, i + 1, o, keyFiles)) + "\n").join("");
const sha = (s) => createHash("sha256").update(s).digest("hex");
export const grade = (o) => Object.fromEntries(Object.keys(sets).map((k) => [k, sha(out(sets[k], o)) === EXP[k]]));
if (process.argv[1].endsWith("oracle.mjs")) {
  console.log("reference grades", grade(CORRECT));
  // oracle: which settings reproduce the presented signature of record 6 and 7
  for (const idx of [5, 6]) {
    const rec = sample[idx];
    const auth = rec.headers.find(([n]) => n === "Authorization")[1];
    const sig = auth.split("signature=")[1];
    const keyId = rec.headers[0][1];
    const hits = [];
    for (const s of everySetting()) for (const kb of ["newline-stripped", "verbatim"]) {
      const raw = keyFiles.get(keyId);
      const key = kb === "verbatim" ? raw : raw.subarray(0, raw.length - 1);
      if (hmac(key, canonical(rec, s)) === sig) hits.push({ ...s, key_bytes: kb });
    }
    console.log(`record ${idx + 1}: ${hits.length} of ${everySetting().length * 2} settings reproduce the presented signature`);
    const pinned = {};
    for (const rule of [...Object.keys(RULES), "key_bytes"]) pinned[rule] = [...new Set(hits.map((h) => h[rule]))];
    for (const [k, v] of Object.entries(pinned)) console.log(`   ${k}: ${v.length === 1 ? "PINNED -> " + v[0] : "free (" + v.join(" | ") + ")"}`);
  }
  // sensitivity of the graded sets: single-rule deviations from CORRECT that still pass everything
  for (const [rule, options] of Object.entries({ ...RULES, ...KEY_RULES })) for (const opt of options.slice(1)) {
    const g = grade({ ...CORRECT, [rule]: opt });
    console.log(`deviation ${rule}=${opt}:`, Object.entries(g).map(([k, v]) => `${k}:${v ? "PASS" : "fail"}`).join(" "));
  }
}
