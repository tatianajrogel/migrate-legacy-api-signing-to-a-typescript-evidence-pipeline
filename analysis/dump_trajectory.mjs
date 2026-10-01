// Prints a Harbor trajectory.json as a readable transcript: each assistant
// message, each tool call with its arguments, and the start of each tool
// result. For reading an attempt end to end without loading the raw JSON.
//
// Usage: node analysis/dump_trajectory.mjs <trajectory.json> [--max-output N] [--steps A-B] [--full]
//
//   --max-output N   characters of each tool result to show (default 700)
//   --steps A-B      only steps A to B inclusive
//   --full           show whole tool results (same as a very large --max-output)

import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
if (!file) {
  console.error("usage: node analysis/dump_trajectory.mjs <trajectory.json> [--max-output N] [--steps A-B] [--full]");
  process.exit(2);
}
const flag = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
let maxOutput = Number(flag("--max-output") ?? 700);
if (args.includes("--full")) maxOutput = Infinity;
const range = flag("--steps");
const [from, to] = range ? range.split("-").map(Number) : [1, Infinity];

const t = JSON.parse(readFileSync(file, "utf8"));
const agent = t.agent ?? {};
console.log(`# ${file}`);
console.log(`# agent ${agent.name} ${agent.version ?? ""}, model ${agent.model_name ?? "?"}, steps ${t.steps?.length ?? 0}`);
const fm = t.final_metrics ?? {};
console.log(`# tokens in ${fm.total_prompt_tokens ?? "?"} out ${fm.total_completion_tokens ?? "?"}, cost ${fm.total_cost_usd ?? "?"}`);

const clip = (s, n) => {
  if (typeof s !== "string") s = JSON.stringify(s);
  if (s.length <= n) return s;
  return `${s.slice(0, n)} ... [${s.length - n} more chars]`;
};

let callNo = 0;
for (const step of t.steps ?? []) {
  const id = step.step_id;
  if (id < from || id > to) continue;
  const results = new Map();
  for (const r of step.observation?.results ?? []) results.set(r.source_call_id, r);
  if (step.source === "user") {
    console.log(`\n[step ${id}] USER:\n${clip(step.message, 1500)}`);
    continue;
  }
  if (step.message) console.log(`\n[step ${id}] ASSISTANT:\n${clip(step.message, 2000)}`);
  for (const call of step.tool_calls ?? []) {
    callNo += 1;
    const a = call.arguments ?? {};
    let summary;
    if (call.function_name === "Bash") summary = a.command;
    else if (call.function_name === "Read") summary = `${a.file_path}${a.offset || a.limit ? ` [offset=${a.offset ?? ""} limit=${a.limit ?? ""}]` : ""}`;
    else if (call.function_name === "Grep") summary = `${a.pattern} in ${a.path ?? "."}${a.glob ? ` glob=${a.glob}` : ""}`;
    else if (call.function_name === "Write") summary = `${a.file_path} (${(a.content ?? "").length} chars)\n${clip(a.content ?? "", 1200)}`;
    else if (call.function_name === "Edit") summary = `${a.file_path}\n--- old\n${clip(a.old_string ?? "", 500)}\n--- new\n${clip(a.new_string ?? "", 900)}`;
    else summary = JSON.stringify(a);
    console.log(`\n[step ${id}] CALL ${callNo} ${call.function_name}: ${clip(summary, 2500)}`);
    const r = results.get(call.tool_call_id);
    if (r) {
      const err = r.extra?.tool_result_is_error ? " (ERROR)" : "";
      console.log(`[step ${id}] RESULT ${callNo}${err} (${(r.content ?? "").length} chars):\n${clip(r.content ?? "", maxOutput)}`);
    }
  }
}
