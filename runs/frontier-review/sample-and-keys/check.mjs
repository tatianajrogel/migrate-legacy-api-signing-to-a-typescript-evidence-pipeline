import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { evidence, canonical, CORRECT, RULES, KEY_RULES, everySetting } from "../../../analysis/scheme.mjs";
const F = "../../../frontier/";
const keyFiles = new Map(["gw-prod-01","gw-prod-02","gw-prod-03"].map(k => [k, readFileSync(`${F}environment/app/keys/${k}.key`)]));
const sample = JSON.parse(readFileSync(`${F}environment/app/requests/sample-requests.json`, "utf8"));
const r6 = sample[5], r7 = sample[6];
const out = (r, s, o) => { const e = evidence(r, s, o, keyFiles); return e.reason ? e.outcome + "/" + e.reason : e.outcome; };
console.log("final: r6", out(r6,6,CORRECT), "r7", out(r7,7,CORRECT));
const NOV = { ...CORRECT, query_order:"name-then-decoded-value", signed_headers:"x-gw-plus-content-type", body_hash:"unsigned-when-absent", trailing_newline:"lf", valueless_parameter:"bare" };
console.log("nov20: r6", out(r6,6,NOV), "r7", out(r7,7,NOV));
console.log("r6 verbatim key:", out(r6,6,{...CORRECT,key_bytes:"verbatim"}), " r7 nov verbatim:", out(r7,7,{...NOV,key_bytes:"verbatim"}));
console.log("canonical r6:\n" + JSON.stringify(canonical(r6, CORRECT)));
console.log("canonical r7 final:\n" + JSON.stringify(canonical(r7, CORRECT)));
console.log("canonical r7 nov:\n" + JSON.stringify(canonical(r7, NOV)));
// sample sha
const sha = s => createHash("sha256").update(s).digest("hex");
console.log("sample sha", sha(sample.map((r,i)=>JSON.stringify(evidence(r,i+1,CORRECT,keyFiles))+"\n").join("")));
for (const h of ["h1","h2","h3"]) { const rs = JSON.parse(readFileSync(`${F}tests/holdout/${h}/requests.json`,"utf8")); console.log(h, sha(rs.map((r,i)=>JSON.stringify(evidence(r,i+1,CORRECT,keyFiles))+"\n").join(""))); }
// departures
const ALL = { ...RULES, key_bytes: KEY_RULES.key_bytes, key_id_match: KEY_RULES.key_id_match, roster: KEY_RULES.roster };
const deps = [];
for (const [rule, opts] of Object.entries(ALL)) for (const o of opts.slice(1)) deps.push([rule, o]);
let single = { both: [], r6only: [], r7only: [] }, dbl = { both: [], r6: 0, r7: [], n: 0 };
for (const [r, o] of deps) { const s = { ...CORRECT, [r]: o }; const a = out(r6,6,s)==="verified", b = out(r7,7,s)==="verified"; if (a&&b) single.both.push(`${r}=${o}`); else if (a) single.r6only.push(`${r}=${o}`); else if (b) single.r7only.push(`${r}=${o}`); }
console.log("single departures:", deps.length, JSON.stringify(single, null, 1));
for (let i=0;i<deps.length;i++) for (let j=i+1;j<deps.length;j++) { if (deps[i][0]===deps[j][0]) continue; dbl.n++; const s = { ...CORRECT, [deps[i][0]]: deps[i][1], [deps[j][0]]: deps[j][1] }; const a = out(r6,6,s)==="verified", b = out(r7,7,s)==="verified"; if (a&&b) dbl.both.push(s); if (a) dbl.r6++; if (b) dbl.r7.push(`${deps[i]}+${deps[j]}`); }
console.log("double departures:", dbl.n, "both:", dbl.both.length, "r6 verifies:", dbl.r6, "r7 verifies:", dbl.r7);
// exhaustive
let n=0, c6=0, c7=0, cb=0; const r7sets=[]; const r6vals = {};
for (const base of everySetting()) for (const kb of KEY_RULES.key_bytes) { const s = { ...CORRECT, ...base, key_bytes: kb }; n++; const a = out(r6,6,s)==="verified", b = out(r7,7,s)==="verified"; if (a) { c6++; for (const k of Object.keys(RULES).concat("key_bytes")) { (r6vals[k] ??= new Set()).add(s[k]); } } if (b) { c7++; r7sets.push(s); } if (a&&b) cb++; }
console.log("exhaustive", n, "r6 verifies", c6, "r7 verifies", c7, "both", cb);
console.log("values compatible with r6:", Object.fromEntries(Object.entries(r6vals).map(([k,v])=>[k,[...v]])));
const r7vals = {}; for (const s of r7sets) for (const k of Object.keys(RULES).concat("key_bytes")) (r7vals[k] ??= new Set()).add(s[k]);
console.log("values compatible with r7:", Object.fromEntries(Object.entries(r7vals).map(([k,v])=>[k,[...v]])));
// starter (register) scheme on r6
const REG = { ...CORRECT, header_values:"raw", query_order:"name-only", signed_headers:"x-gw-only", body_hash:"unsigned-when-empty-or-absent", trailing_newline:"lf", key_bytes:"verbatim" };
console.log("register+verbatim r6:", out(r6,6,REG), "; register, stripped key:", out(r6,6,{...REG,key_bytes:"newline-stripped"}), "; register, stripped, no lf:", out(r6,6,{...REG,key_bytes:"newline-stripped",trailing_newline:"none"}));
// r6/r7 with gw-prod-03 key? try each key file for each record
for (const [name, r, o] of [["r6",r6,CORRECT],["r7",r7,NOV]]) for (const k of keyFiles.keys()) { const kf = new Map(keyFiles); kf.set(r.headers[0][1], keyFiles.get(k)); console.log(name, "with key", k, out(r, 1, o, kf)); }
