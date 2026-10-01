import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { evidence, CORRECT, RULES, KEY_RULES } from "../../../analysis/scheme.mjs";
const F = "../../../frontier/";
const K = F + "environment/app/keys/";
const keyFiles = new Map(readdirSync(K).filter(n=>n.endsWith(".key")).map(n=>[n.slice(0,-4), readFileSync(K+n)]));
const sets = { sample: F+"environment/app/requests/sample-requests.json", h1: F+"tests/holdout/h1/requests.json", h2: F+"tests/holdout/h2/requests.json", h3: F+"tests/holdout/h3/requests.json" };
const out = (file, opts) => JSON.parse(readFileSync(file,"utf8")).map((r,i)=>JSON.stringify(evidence(r,i+1,opts,keyFiles))+"\n").join("");
const sha = s => createHash("sha256").update(s).digest("hex");
const base = {};
for (const [n,f] of Object.entries(sets)) { base[n] = out(f, CORRECT); console.log(n, sha(base[n])); }
console.log(base.sample);
const all = { ...RULES, ...KEY_RULES };
for (const [rule, options] of Object.entries(all)) for (const o of options.slice(1)) {
  const opts = { ...CORRECT, [rule]: o };
  const diff = Object.entries(sets).map(([n,f]) => {
    const got = out(f, opts).split("\n"), want = base[n].split("\n");
    const lines = got.map((l,i)=> l!==want[i] ? i+1 : 0).filter(Boolean);
    return lines.length ? `${n}:[${lines}]` : null; }).filter(Boolean);
  console.log(rule.padEnd(20), o.padEnd(34), diff.join(" ") || "NOT DETECTED");
}
// record 6 oracle: which single-rule alternatives still verify sample record 6?
const s = JSON.parse(readFileSync(sets.sample,"utf8"));
for (const [rule, options] of Object.entries(all)) for (const o of options) {
  const ev = evidence(s[5], 6, { ...CORRECT, [rule]: o }, keyFiles);
  console.log("rec6", rule.padEnd(20), o.padEnd(34), ev.outcome);
}
