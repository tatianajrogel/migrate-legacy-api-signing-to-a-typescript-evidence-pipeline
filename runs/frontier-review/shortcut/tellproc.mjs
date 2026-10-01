// No correction is read. Items are kept or dropped on "does the passage contain a sentence that occurs once".
import { sections, schemesIn, ALIAS } from "./lib.mjs";
import { CORRECT } from "../../../analysis/scheme.mjs";
import { grade } from "./oracle.mjs";
const CL = [
  [/inside of the value is left as it is/, "header_values", "trimmed"], [/collapsed to a single space/, "header_values", "folded"],
  [/with nothing decoded/, "query_order", "name-then-value"], [/percent-decoded before it is compared/, "query_order", "name-then-decoded-value"],
  [/header family and `content-type` are signed/, "signed_headers", "x-gw-plus-content-type"], [/whatever its name, except `authorization`/, "signed_headers", "all-but-authorization"],
  [/no body at all puts the token/, "body_hash", "unsigned-when-absent"], [/always the lowercase hex SHA-256/, "body_hash", "always-sha256"],
  [/with nothing after it/, "trailing_newline", "none"], [/uppercased before signing/, "percent_escapes", "uppercased"],
  [/written with a trailing `=`/, "valueless_parameter", "trailing-equals"], [/written as the bare name/, "valueless_parameter", "bare"],
  [/dot segments in the path are collapsed/, "path", "dot-segments-resolved"], [/matched without regard to case/, "key_id_match", "any-case"],
  [/joined with `;`/, "names_join", "semicolon"], [/joined with `,`/, "names_join", "comma"],
];
const REG = { header_values: "raw", query_order: "name-only", signed_headers: "x-gw-only", body_hash: "unsigned-when-empty-or-absent", trailing_newline: "lf", percent_escapes: "as-received", valueless_parameter: "trailing-equals", path: "as-received", key_id_match: "exact", names_join: "semicolon" };
const frame = (t) => /^Correction to the minutes/.test(t) ? "correction" : /Not adopted\.|Declined\./.test(t) ? "decline" : /Parked until|Not decided\./.test(t) ? "propose" : /was withdrawn/.test(t) ? "withdraw" : /as a trial:/.test(t) ? "trial" : /is backed out/.test(t) ? "backout" : /, provided /.test(t) ? "conditional" : /effective with/.test(t) ? "later" : /in line with that of/.test(t) ? "align" : /Agreed: for|Decision for|and the room agreed/.test(t) ? "set" : "other";
const clause = (t) => { const c = CL.filter(([re]) => re.test(t)); return c.length ? c[c.length - 1].slice(1) : [null, null]; };
const PARTNERS = ["Globex", "Initech", "Umbrella", "Contoso", "Northwind"];
const allAliases = Object.values(ALIAS).flat().sort((a, b) => b.length - a.length);
const blank = (t) => { let x = t.replace(/[A-Z]\. [A-Z][a-z]+/g, "PERSON"); for (const p of PARTNERS) x = x.split(p).join("PARTNER"); for (const a of allAliases) x = x.replace(new RegExp(a, "gi"), "SIGNER"); return x.replace(/`x-(gw|wh|bx|ms|ad)-\*`/g, "`x-??-*`").replace(/`(UNSIGNED|EMPTY|NONE|NOBODY|BLANK)`/g, "`TOKEN`").replace(/\d+/g, "N"); };
const sentences = (t) => blank(t).split(/(?<=\.) (?=[A-Z`N])/);
const S = sections().filter((s) => /^(0[2-9]|1[0-2])-/.test(s.file));
const freq = new Map(); for (const s of S) for (const q of sentences(s.text)) freq.set(q, (freq.get(q) ?? 0) + 1);
const oneoff = (t) => sentences(t).filter((q) => freq.get(q) === 1 && !q.includes("SIGNER")).length;
const items = [];
for (const s of S) {
  const f = frame(s.text); if (f === "other" || f === "correction") continue;
  const gw = schemesIn(s.text).includes("GW"); const n = oneoff(s.text); const [rule, option] = clause(s.text);
  let keep = false, why = "";
  if (gw && f === "set" && n === 0) { why = "DROPPED: labelled for the migrated scheme, 'set' frame, no one-off sentence"; }
  else if (gw) { keep = true; why = "kept: names the migrated scheme"; }
  else if (n >= 2) { keep = true; why = "ADDED: labelled for another signer but has >=2 one-off sentences"; }
  if (gw || n >= 2) console.log(`${s.file.slice(3, 13)} ${f.padEnd(11)} oneoff=${n} ${String(rule).padEnd(19)} ${String(option).padEnd(24)} ${why}`);
  if (keep) items.push({ date: s.file.slice(3, 13), frame: f, rule, option });
}
items.sort((a, b) => (a.date < b.date ? -1 : 1));
const st = { ...REG };
for (const i of items) if (i.rule && ["set", "trial", "backout"].includes(i.frame)) st[i.rule] = i.option;
console.log("\nstate before conditionals:", JSON.stringify(st));
const wrong = Object.keys(REG).filter((r) => st[r] !== CORRECT[r]);
console.log("wrong:", wrong.map((r) => `${r}=${st[r]}`).join("; ") || "none");
st.signed_headers = "all-but-authorization";
console.log("after applying the one conditional whose appendix line reads '5 of 5':", JSON.stringify(grade({ ...CORRECT, ...st })));
