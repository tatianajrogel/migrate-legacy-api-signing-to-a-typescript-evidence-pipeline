import { fileURLToPath } from "node:url";
import { evidence, canonical, CORRECT, RULES, KEY_RULES, everySetting } from "../../../analysis/scheme.mjs";
import fs from "node:fs";
const root=`${fileURLToPath(new URL("../../../frontier", import.meta.url)).replace(/\\/g, "/")}/environment/app/`;
const recs=JSON.parse(fs.readFileSync(root+"requests/sample-requests.json","utf8"));
const kf=new Map(); for(const f of fs.readdirSync(root+"keys")) kf.set(f.replace(/\.key$/,""),fs.readFileSync(root+"keys/"+f));
console.log(recs.length); recs.forEach((r,i)=>{ if(r.headers.some(h=>h[0].toLowerCase()==="authorization")) console.log(i+1, JSON.stringify(r)); });
const r6=recs[5];
console.log(JSON.stringify(canonical(r6)));
console.log(evidence(r6,6,CORRECT,kf));
console.log("comma:",evidence(r6,6,{...CORRECT,names_join:"comma"},kf));
let total=0, ok=0; const seen={};
for(const s of everySetting()) for(const kb of KEY_RULES.key_bytes){ total++; const o={...CORRECT,...s,key_bytes:kb}; const e=evidence(r6,6,o,kf); if(e.outcome==="verified"){ok++; for(const k of [...Object.keys(RULES),"key_bytes"]) {(seen[k]??=new Set()).add(o[k]);}}}
console.log(total, ok); for(const k in seen) console.log(k,[...seen[k]].join("|"));
// how many rules does record 6 distinguish
for(const [rule,opts] of Object.entries(RULES)) for(const o of opts.slice(1)) console.log(rule,o, canonical(r6,{...CORRECT,[rule]:o})===canonical(r6)?"same":"DIFF");
// Nov 25 state plausible: does record 7 tell too?
const r7=recs[6]; console.log(evidence(r7,7,CORRECT,kf)); 
