import { readFileSync } from "node:fs";
import { sections, schemesIn, ALIAS, D } from "./lib.mjs";
import { CORRECT } from "../../../analysis/scheme.mjs";
import { grade } from "./oracle.mjs";
const CL = [
  [/inside of the value is left as it is/, "header_values", "trimmed"], [/collapsed to a single space/, "header_values", "folded"],
  [/with nothing decoded/, "query_order", "name-then-value"], [/percent-decoded before it is compared/, "query_order", "name-then-decoded-value"],
  [/header family and `content-type` are signed/, "signed_headers", "x-gw-plus-content-type"], [/whatever its name, except `authorization`/, "signed_headers", "all-but-authorization"],
  [/except `authorization`, `via` and `x-forwarded-for`/, "signed_headers", "all-but-forwarding"],
  [/no body at all puts the token/, "body_hash", "unsigned-when-absent"], [/always the lowercase hex SHA-256/, "body_hash", "always-sha256"],
  [/with nothing after it/, "trailing_newline", "none"], [/uppercased before signing/, "percent_escapes", "uppercased"],
  [/written with a trailing `=`/, "valueless_parameter", "trailing-equals"], [/written as the bare name/, "valueless_parameter", "bare"],
  [/dot segments in the path are collapsed/, "path", "dot-segments-resolved"], [/matched without regard to case/, "key_id_match", "any-case"],
  [/joined with `;`/, "names_join", "semicolon"], [/joined with `,`/, "names_join", "comma"],
];
const NP = { "treatment of header values": "header_values", "query parameter ordering": "query_order", "signed header set": "signed_headers", "body-hash field for requests with nothing to hash": "body_hash", "separator of the signed header name list": "names_join" };
const REG = { header_values: "raw", query_order: "name-only", signed_headers: "x-gw-only", body_hash: "unsigned-when-empty-or-absent", trailing_newline: "lf", percent_escapes: "as-received", valueless_parameter: "trailing-equals", path: "as-received", key_id_match: "exact", names_join: "semicolon" };
const frame = (t) => /^Correction to the minutes/.test(t) ? "correction" : /Not adopted\.|Declined\./.test(t) ? "decline" : /Parked until|Not decided\./.test(t) ? "propose" : /was withdrawn/.test(t) ? "withdraw" : /as a trial:/.test(t) ? "trial" : /is backed out/.test(t) ? "backout" : /, provided /.test(t) ? "conditional" : /effective with/.test(t) ? "later" : /in line with that of/.test(t) ? "align" : /Agreed: for|Decision for|and the room agreed/.test(t) ? "set" : "other";
const clause = (t) => { const c = CL.filter(([re]) => re.test(t)); return c.length ? c[c.length - 1].slice(1) : [null, null]; };
const all = sections();
const isGW = (s) => schemesIn(s.text).includes("GW");
const hits = all.filter((s) => !s.file.startsWith("01") && isGW(s));
const bytes = hits.reduce((n, s) => n + s.text.length, 0);
const total = all.reduce((n, s) => n + s.text.length, 0);
console.log(`alias grep: ${hits.length} passages, ${bytes} bytes of ${total} (${(100 * bytes / total).toFixed(1)}%)`);
let items = hits.filter((s) => /^(0[2-9]|1[0-2])-/.test(s.file)).map((s) => ({ date: s.file.slice(3, 13), frame: frame(s.text), rule: clause(s.text)[0], option: clause(s.text)[1], text: s.text }));
// corrections: one hop
for (const c of items.filter((i) => i.frame === "correction")) {
  const m = c.text.match(/minutes of (\S+): the item on the (.+) recorded there under (.+) was agreed for (.+), not for/);
  const [, of, np, wrong, right] = m; const rule = NP[np];
  const gwRight = ALIAS.GW.some((a) => a.toLowerCase() === right.toLowerCase());
  if (!gwRight) { const before = items.length; items = items.filter((i) => !(i.date === of && i.rule === rule && i.frame !== "correction")); console.log(`correction of ${of} (${rule}): removes ${before - items.length} item minuted under the migrated scheme`); }
  else {
    const wk = Object.keys(ALIAS).find((k) => ALIAS[k].some((a) => a.toLowerCase() === wrong.toLowerCase())); const cands = all.filter((s) => s.file.slice(3, 13) === of && schemesIn(s.text).includes(wk) && clause(s.text)[0] === rule && ["set","trial","conditional","later"].includes(frame(s.text)));
    console.log(`correction of ${of} (${rule}): ${cands.length} passage(s) in that note under "${wrong}" on that subject -> ${cands.map((s) => clause(s.text)[1])}`);
    for (const s of cands) items.push({ date: of, frame: frame(s.text), rule, option: clause(s.text)[1], text: s.text });
  }
}
items.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
const facts = hits.filter((s) => /^2[0-7]-/.test(s.file));
const run = (useAppendix) => {
  const st = { ...REG };
  for (const i of items) {
    if (!i.rule) continue;
    if (["set", "trial", "backout"].includes(i.frame)) st[i.rule] = i.option;
    if (i.frame === "conditional" && useAppendix) {
      const f = facts.find((s) => s.text.includes(`tabled ${i.date}`));
      const ok = f && /(\d+) of \1 partner sign-offs/.test(f.text);
      if (ok) st[i.rule] = i.option;
    }
    // "later": the freeze note says "Items tied to SDK 3.3 are not part of this cutover" -> never applied
  }
  return st;
};
for (const [name, useAppendix] of [["with the appendix lines the same grep returned (files 22, 23); file 20 never opened", true], ["session notes only, no appendix opened", false]]) {
  const st = run(useAppendix);
  const wrong = Object.keys(REG).filter((r) => st[r] !== CORRECT[r]);
  console.log(`\n${name}\n  rules right ${10 - wrong.length}/10; wrong: ${wrong.map((r) => `${r}=${st[r]}`).join("; ") || "none"}\n  graded sets: ${JSON.stringify(grade({ ...CORRECT, ...st }))}`);
}
console.log("\nfreeze note:", all.find((s) => s.heading === "Freeze").text);
