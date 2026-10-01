import { sections, schemesIn } from "./lib.mjs";
const S = sections();
const hits = S.filter((s) => !s.file.startsWith("01") && schemesIn(s.text).includes("GW"));
console.log("sections total", S.length, "GW-alias hits", hits.length);
for (const h of hits) console.log(`\n[${h.file}] ## ${h.heading} {${schemesIn(h.text)}}\n${h.text}`);
