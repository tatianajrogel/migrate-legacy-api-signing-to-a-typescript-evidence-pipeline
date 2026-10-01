import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { sections, schemesIn, ALIAS } from "./lib.mjs";
const manifest = JSON.parse(readFileSync(`${fileURLToPath(new URL("../../../frontier", import.meta.url)).replace(/\\/g, "/")}/authoring/manifest.json`, "utf8"));
// Manifest items that bear on the migrated scheme without being its own
// passages: the other signers' query-ordering items its alignment leans on, and
// the mesh signer's separator item that was minuted under its name. The ids are
// those of the shipped build; the check below fails if the manifest moves on.
const NOT_GW = new Set(["query_order-2025-10-14-set", "query_order-2025-11-04-set", "query_order-2025-10-28-align", "query_order-2025-11-25-set", "names_join-2025-11-25-set"]);
for (const id of NOT_GW) if (!manifest.some((m) => m.id === id)) throw new Error(`NOT_GW names ${id}, which is not in the manifest`);
const S = sections().filter((s) => /^(0[2-9]|1[0-2])-/.test(s.file));
const frame = (t) => /^Correction to the minutes/.test(t) ? "correction" : /Not adopted\.|Declined\./.test(t) ? "decline" : /Parked until|Not decided\./.test(t) ? "propose" : /was withdrawn/.test(t) ? "withdraw" : /as a trial:/.test(t) ? "trial" : /is backed out/.test(t) ? "backout" : /is confirmed:/.test(t) ? "confirm" : /, provided /.test(t) ? "conditional" : /effective with/.test(t) ? "later" : /in line with that of/.test(t) ? "align" : /Agreed: for|Decision for|and the room agreed/.test(t) ? "set" : "other";
const PARTNERS = ["Globex", "Initech", "Umbrella", "Contoso", "Northwind"];
const allAliases = Object.values(ALIAS).flat().sort((a, b) => b.length - a.length);
function blank(t) {
  let x = t.replace(/[A-Z]\. [A-Z][a-z]+/g, "PERSON");
  for (const p of PARTNERS) x = x.split(p).join("PARTNER");
  for (const a of allAliases) x = x.replace(new RegExp(a.replace(/[-]/g, "\-"), "gi"), "SIGNER");
  x = x.replace(/`x-(gw|wh|bx|ms|ad)-\*`/g, "`x-??-*`").replace(/`(UNSIGNED|EMPTY|NONE|NOBODY|BLANK)`/g, "`TOKEN`");
  return x.replace(/\d+/g, "N");
}
const sentences = (t) => blank(t).split(/(?<=\.) (?=[A-Z`N])/);
const freq = new Map();
for (const s of S) for (const q of sentences(s.text)) freq.set(q, (freq.get(q) ?? 0) + 1);
const dec = S.filter((s) => frame(s.text) !== "other" && schemesIn(s.text).length > 0);
const rows = dec.map((s) => {
  const m = manifest.find((x) => s.text.startsWith(x.needle) || s.text.includes(x.needle));
  const trueGW = !!m && !NOT_GW.has(m.id);
  const shownGW = schemesIn(s.text).includes("GW");
  const sen = sentences(s.text);
  // a sentence is "one-off" when its blanked form occurs once in all 11 notes and it is not the sentence carrying the signer name
  const oneoff = sen.filter((q) => freq.get(q) === 1 && !q.includes("SIGNER")).length;
  return { file: s.file.slice(0, 2), frame: frame(s.text), trueGW, shownGW, id: m?.id ?? "", len: s.text.length, nsent: sen.length, oneoff, people: (s.text.match(/[A-Z]\. [A-Z][a-z]+/g) ?? []).length, ticks: (s.text.match(/`/g) ?? []).length / 2, off: s.off, heading: s.heading, text: s.text };
});
const g = (f) => rows.filter(f);
const stat = (xs, k) => { const v = xs.map((r) => r[k]).sort((a, b) => a - b); return `n=${v.length} min=${v[0]} median=${v[Math.floor(v.length / 2)]} mean=${(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1)} max=${v[v.length - 1]}`; };
console.log("decision passages in the 11 notes:", rows.length, " truly the migrated scheme's:", g((r) => r.trueGW).length, " shown under a GW alias:", g((r) => r.shownGW).length);
for (const k of ["len", "nsent", "oneoff", "people", "ticks", "off"]) {
  console.log(`\n${k}\n  migrated scheme : ${stat(g((r) => r.trueGW), k)}\n  other signers   : ${stat(g((r) => !r.trueGW), k)}`);
}
// non-correction, non-follow-up frames only (frames that carry a lead)
const LEAD = new Set(["set", "propose", "trial", "decline", "conditional", "later", "align"]);
const led = g((r) => LEAD.has(r.frame));
console.log("\n--- classifier: 'has >=1 one-off sentence' among lead-bearing frames ---");
const tp = led.filter((r) => r.trueGW && r.oneoff >= 1).length, fn = led.filter((r) => r.trueGW && r.oneoff < 1).length, fp = led.filter((r) => !r.trueGW && r.oneoff >= 1).length, tn = led.filter((r) => !r.trueGW && r.oneoff < 1).length;
console.log({ tp, fn, fp, tn });
console.log("\nlead-bearing passages with >=1 one-off sentence:");
for (const r of led.filter((r) => r.oneoff >= 1)) console.log(`  [${r.file}] ${r.frame.padEnd(11)} trueGW=${r.trueGW} shownGW=${r.shownGW} oneoff=${r.oneoff} len=${r.len} :: ${r.text.slice(0, 90)}`);
console.log("\ntrue migrated-scheme lead-bearing passages with NO one-off sentence:");
for (const r of led.filter((r) => r.trueGW && r.oneoff < 1)) console.log(`  [${r.file}] ${r.frame} ${r.id} len=${r.len}`);
console.log("\nthe 4 crossed items:");
for (const r of rows.filter((r) => ["header_values-2025-11-04-set", "body_hash-2025-11-11-set", "names_join-2025-11-25-set", "query_order-2025-10-28-set"].includes(r.id))) console.log(`  ${r.id}: trueGW=${r.trueGW} shownGW=${r.shownGW} oneoff=${r.oneoff} len=${r.len} nsent=${r.nsent}`);
// length threshold
for (const th of [300, 330, 360, 400]) { const a = led.filter((r) => r.len >= th); console.log(`len>=${th}: ${a.filter((r) => r.trueGW).length} migrated / ${a.filter((r) => !r.trueGW).length} other  (of ${led.filter((r) => r.trueGW).length} / ${led.filter((r) => !r.trueGW).length})`); }
// frames by scheme
const fr = {}; for (const r of rows) { const k = r.trueGW ? "GW" : "other"; fr[r.frame] ??= { GW: 0, other: 0 }; fr[r.frame][k]++; } console.log("\nframes", fr);
console.log("\n=== threshold table on one-off sentences, ALL 125 decision passages ===");
for (const th of [1, 2, 3]) console.log(`oneoff>=${th}: migrated ${rows.filter((r) => r.trueGW && r.oneoff >= th).length}/${rows.filter((r) => r.trueGW).length}, other ${rows.filter((r) => !r.trueGW && r.oneoff >= th).length}/${rows.filter((r) => !r.trueGW).length}`);
console.log("migrated-scheme passages by frame and oneoff:"); for (const r of rows.filter((r) => r.trueGW)) console.log(`  ${r.id.padEnd(40)} oneoff=${r.oneoff} len=${r.len}`);
console.log("corrections in all notes:"); for (const r of rows.filter((r) => r.frame === "correction")) console.log("  ", r.file, r.text.slice(0, 200));
console.log("aligns in all notes:"); for (const r of rows.filter((r) => r.frame === "align")) console.log("  ", r.file, r.text.slice(-200));
