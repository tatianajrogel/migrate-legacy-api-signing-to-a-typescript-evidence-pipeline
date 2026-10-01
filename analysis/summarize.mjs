// Turns diagnose.mjs's per-attempt output into the tables the write-up uses:
// one row per condition (variant, instruction wording, model), then one row per
// rule that any attempt got wrong.
//
// Usage: node analysis/summarize.mjs <diagnosis.json> [--md <file>]

import { readFileSync, writeFileSync } from "node:fs";
import { CORRECT } from "./scheme.mjs";

const args = process.argv.slice(2);
if (!args[0]) {
  console.error("usage: node analysis/summarize.mjs <diagnosis.json> [--md <file>]");
  process.exit(2);
}
const rows = JSON.parse(readFileSync(args[0], "utf8")).filter((r) => r.reward !== null);

// A condition is the documents the agent was given plus how the instruction
// pointed at them. "first" is the base wording before its 2 rejection rules
// were spelled out, kept apart because those attempts could not have passed.
const conditionOf = (r) => {
  const instruction = r.instruction === "first"
    ? "first instruction (2 rejection rules unstated)"
    : `${r.instruction ?? "unknown"} instruction`;
  return `${r.variant} documents, ${instruction}`;
};
const groups = new Map();
for (const r of rows) {
  const key = `${conditionOf(r)}|${r.model}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(r);
}

const range = (values, digits = 0) => {
  const v = values.filter((x) => typeof x === "number");
  if (v.length === 0) return "?";
  const lo = Math.min(...v).toFixed(digits);
  const hi = Math.max(...v).toFixed(digits);
  return lo === hi ? lo : `${lo} to ${hi}`;
};
const mean = (values, digits = 2) => {
  const v = values.filter((x) => typeof x === "number");
  return v.length === 0 ? "?" : (v.reduce((a, b) => a + b, 0) / v.length).toFixed(digits);
};

const out = [];
// "Solved" is the score Harbor gave at the time. "Current verifier" is the
// score the same /app gets from the verifier as it stands, which gained the h3
// request set after an attempt passed with a wrong reading of the Authorization
// header. "Clean on probes" is stricter still: solved by the current verifier,
// and no departure from instruction.md on any probe either. The gap between the
// last 2 columns is what the graded request sets do not exercise.
const current = (r) => (r.reward_regraded === null ? r.reward : r.reward_regraded);
out.push("| Condition | Model | Solved (Harbor) | Solved (current verifier) | Solved and clean on probes | Agent time (min) | Tool calls | Cost per attempt (USD) | Session notes read | Appendices read |");
out.push("|---|---|---|---|---|---|---|---|---|---|");
for (const [key, list] of [...groups].sort()) {
  const [condition, model] = key.split("|");
  const solved = list.filter((r) => r.reward === 1).length;
  const solvedNow = list.filter((r) => current(r) === 1).length;
  const clean = list.filter(
    (r) => current(r) === 1 && r.status === "ok" && r.wrong.length === 0
      && r.deviations.length === 0 && r.unexplained.length === 0,
  ).length;
  out.push(
    `| ${condition} | ${model} | ${solved} of ${list.length} | ${solvedNow} of ${list.length} | ${clean} of ${list.length} | ${range(list.map((r) => r.agent_seconds / 60), 1)} | ${
      range(list.map((r) => r.tool_calls))} | ${mean(list.map((r) => r.cost_usd))} | ${
      range(list.map((r) => r.coverage?.notes))}% | ${range(list.map((r) => r.coverage?.appendices))}% |`,
  );
}

out.push("");
out.push("| Condition | Model | Rule | Attempts wrong | Form implemented | Why |");
out.push("|---|---|---|---|---|---|");
for (const [key, list] of [...groups].sort()) {
  const [condition, model] = key.split("|");
  const ok = list.filter((r) => r.status === "ok");
  for (const rule of Object.keys(CORRECT)) {
    const wrong = ok.filter((r) => r.rules[rule] !== CORRECT[rule]);
    if (wrong.length === 0) continue;
    const tally = (pick) => {
      const counts = new Map();
      for (const r of wrong) counts.set(pick(r), (counts.get(pick(r)) ?? 0) + 1);
      return [...counts].map(([k, n]) => `${k} (${n})`).join("<br>");
    };
    out.push(
      `| ${condition} | ${model} | ${rule} | ${wrong.length} of ${ok.length} | ${
        tally((r) => r.rules[rule])} | ${tally((r) => r.causes[rule] ?? "?")} |`,
    );
  }
}

// The 7 rules the starter gets wrong, each split by whether the attempt ever
// had the text that settles it in front of it. Reading is not the same as
// applying, and this is where the 2 come apart.
const GRADED = [
  "header_values", "query_order", "signed_headers", "body_hash",
  "trailing_newline", "key_bytes", "roster",
];
out.push("");
out.push("| Condition | Model | Rule | Saw the deciding text: right | Saw it: wrong | Never saw it: right | Never saw it: wrong |");
out.push("|---|---|---|---|---|---|---|");
for (const [key, list] of [...groups].sort()) {
  const [condition, model] = key.split("|");
  const ok = list.filter((r) => r.status === "ok" && r.saw_deciding);
  if (ok.length === 0) continue;
  const total = { sr: 0, sw: 0, nr: 0, nw: 0 };
  for (const rule of GRADED) {
    const cell = { sr: 0, sw: 0, nr: 0, nw: 0 };
    for (const r of ok) {
      const right = r.rules[rule] === CORRECT[rule];
      const slot = `${r.saw_deciding[rule] ? "s" : "n"}${right ? "r" : "w"}`;
      cell[slot] += 1;
      total[slot] += 1;
    }
    out.push(`| ${condition} | ${model} | ${rule} | ${cell.sr} | ${cell.sw} | ${cell.nr} | ${cell.nw} |`);
  }
  out.push(`| ${condition} | ${model} | all 7 | ${total.sr} | ${total.sw} | ${total.nr} | ${total.nw} |`);
}

out.push("");
out.push("| Condition | Model | Attempts with every rule right | ...of those, with an outcome deviation | Attempts not diagnosed |");
out.push("|---|---|---|---|---|");
for (const [key, list] of [...groups].sort()) {
  const [condition, model] = key.split("|");
  const ok = list.filter((r) => r.status === "ok");
  const rulesRight = ok.filter((r) => r.wrong.length === 0);
  out.push(
    `| ${condition} | ${model} | ${rulesRight.length} of ${list.length} | ${
      rulesRight.filter((r) => r.deviations.length > 0).length} | ${list.length - ok.length} |`,
  );
}

const md = out.join("\n") + "\n";
if (args.includes("--md")) writeFileSync(args[args.indexOf("--md") + 1], md);
process.stdout.write(md);
