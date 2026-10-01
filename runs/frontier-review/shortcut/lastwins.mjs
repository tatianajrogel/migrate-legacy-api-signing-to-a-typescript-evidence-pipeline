import { sections, schemesIn } from "./lib.mjs";
import { CORRECT } from "../../../analysis/scheme.mjs";
import { grade } from "./oracle.mjs";
// rule clause -> [rule, option]; these are the literal clauses, each found by reading any one passage
const CLAUSES = [
  [/exactly as received, byte for byte/, "header_values", "raw"],
  [/inside of the value is left as it is/, "header_values", "trimmed"],
  [/collapsed to a single space/, "header_values", "folded"],
  [/stripped and collapsed and then lowercased/, "header_values", "folded-lower(n/a)"],
  [/ordered by name only/, "query_order", "name-only"],
  [/with nothing decoded/, "query_order", "name-then-value"],
  [/percent-decoded before it is compared/, "query_order", "name-then-decoded-value"],
  [/only the `x-gw-\*` header family is signed/, "signed_headers", "x-gw-only"],
  [/`x-gw-\*` header family and `content-type` are signed/, "signed_headers", "x-gw-plus-content-type"],
  [/`host`, `content-type` and the `x-gw-\*`/, "signed_headers", "x-gw-plus-content-type-and-host"],
  [/whatever its name, except `authorization`/, "signed_headers", "all-but-authorization"],
  [/except `authorization`, `via` and `x-forwarded-for`/, "signed_headers", "all-but-forwarding"],
  [/body is empty or absent puts the token/, "body_hash", "unsigned-when-empty-or-absent"],
  [/no body at all puts the token/, "body_hash", "unsigned-when-absent"],
  [/always the lowercase hex SHA-256/, "body_hash", "always-sha256"],
  [/ends with a line feed after the last field/, "trailing_newline", "lf"],
  [/with nothing after it/, "trailing_newline", "none"],
  [/signed in the case they arrive in/, "percent_escapes", "as-received"],
  [/uppercased before signing/, "percent_escapes", "uppercased"],
  [/written with a trailing `=`/, "valueless_parameter", "trailing-equals"],
  [/written as the bare name/, "valueless_parameter", "bare"],
  [/no normalisation of any kind/, "path", "as-received"],
  [/dot segments in the path are collapsed/, "path", "dot-segments-resolved"],
  [/matched exactly as sent/, "key_id_match", "exact"],
  [/matched without regard to case/, "key_id_match", "any-case"],
  [/joined with `;`/, "names_join", "semicolon"],
  [/joined with `,`/, "names_join", "comma"],
];
const REGISTER = { header_values: "raw", query_order: "name-only", signed_headers: "x-gw-only", body_hash: "unsigned-when-empty-or-absent", trailing_newline: "lf", percent_escapes: "as-received", valueless_parameter: "trailing-equals", path: "as-received", key_id_match: "exact", names_join: "semicolon" };
const frame = (t) => /^Correction to the minutes/.test(t) ? "correction" : /Not adopted\.|Declined\./.test(t) ? "decline" : /Parked until|Not decided\./.test(t) ? "propose" : /was withdrawn/.test(t) ? "withdraw" : /as a trial:/.test(t) ? "trial" : /is backed out/.test(t) ? "backout" : /is confirmed:/.test(t) ? "confirm" : /, provided /.test(t) ? "conditional" : /effective with/.test(t) ? "later" : /in line with that of/.test(t) ? "align" : /Agreed: for|Decision for|and the room agreed/.test(t) ? "set" : "other";
const S = sections();
const minutes = S.filter((s) => /^(0[2-9]|1[0-2])-/.test(s.file) && schemesIn(s.text).includes("GW") && !["Scope"].includes(s.heading));
const items = minutes.map((s) => {
  const c = CLAUSES.filter(([re]) => re.test(s.text)).map(([, r, o]) => [r, o]);
  // last matching clause that is most specific
  return { date: s.file.slice(3, 13), frame: frame(s.text), rule: c.length ? c[c.length - 1][0] : null, option: c.length ? c[c.length - 1][1] : null, text: s.text };
});
console.log("GW-alias passages in the 11 session notes:", items.length);
for (const i of items) console.log(`  ${i.date} ${i.frame.padEnd(11)} ${String(i.rule).padEnd(20)} ${i.option}`);
const levels = {
  "L0 last rule clause that names the scheme wins (no frame reading)": (its) => { const st = { ...REGISTER }; for (const i of its) if (i.rule) st[i.rule] = i.option; return st; },
  "L1 last ADOPTED item wins: set/trial/backout/conditional/later all count, decline/propose/withdraw/correction/align skipped": (its) => { const st = { ...REGISTER }; for (const i of its) if (i.rule && ["set", "trial", "backout", "confirm", "conditional", "later"].includes(i.frame)) st[i.rule] = i.option; return st; },
  "L2 = L1 but conditional and later items are never applied ('what is in place now stays')": (its) => { const st = { ...REGISTER }; for (const i of its) if (i.rule && ["set", "trial", "backout", "confirm"].includes(i.frame)) st[i.rule] = i.option; return st; },
};
for (const [name, fn] of Object.entries(levels)) {
  const st = fn(items);
  const wrong = Object.keys(REGISTER).filter((r) => st[r] !== CORRECT[r]);
  const opts = { ...CORRECT };
  for (const r of Object.keys(REGISTER)) opts[r] = st[r];
  let g = "n/a (state has an option the scheme module cannot run)";
  try { if (!Object.values(st).some((v) => v.includes("n/a"))) g = JSON.stringify(grade(opts)); } catch (e) { g = String(e); }
  console.log(`\n${name}\n  rules right ${10 - wrong.length}/10; wrong: ${wrong.map((r) => `${r}=${st[r]} (want ${CORRECT[r]})`).join("; ") || "none"}\n  graded sets: ${g}`);
}
