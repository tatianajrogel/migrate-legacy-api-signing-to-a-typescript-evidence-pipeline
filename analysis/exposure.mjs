// What an attempt had in front of it, read from its trajectory.
//
// diagnose.mjs says which rules an attempt got wrong. This says whether the
// attempt ever saw the text that settles each of those rules, which separates
// 2 different failures: the passage was never retrieved, or it was retrieved
// and not applied.
//
// It works on tool output only, never on what the agent said about itself. A
// passage counts as seen when a distinctive phrase from it appears in the
// output of any tool call in the trajectory.

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { VARIANTS } from "./build_probes.mjs";

// role "decides": the passage or capture that fixes the rule's final form.
// role "introduces": a passage that puts forward a form which is not final.
const STRACE_KEY_READ = /abcdef\\n", 4096\) = 33/;
const KEY_DUMP = /0000040\s+\\n|00000020:?\s+0a/;
const ROSTER_CAPTURE = "/etc/gw/keys/gw-prod-02.key";

const EVIDENCE = {
  hard: [
    { id: "fold", rule: "header_values", role: "decides", needle: "squeeze every run of spaces and tabs" },
    { id: "order-decoded", rule: "query_order", role: "introduces", option: "name-then-decoded-value", needle: "asked that values be percent-decoded before they are compared" },
    { id: "order-final", rule: "query_order", role: "decides", needle: "The decode step is dropped" },
    { id: "headers-content-type", rule: "signed_headers", role: "introduces", option: "x-gw-plus-content-type", needle: "`content-type` joins the signed set now" },
    { id: "headers-final", rule: "signed_headers", role: "decides", needle: "The review did not accept a list" },
    { id: "headers-forwarding", rule: "signed_headers", role: "introduces", option: "all-but-forwarding", needle: "asked for those 2 names to be left out of the signed set" },
    { id: "body-absent", rule: "body_hash", role: "introduces", option: "unsigned-when-absent", needle: "a record with no body at all signs `UNSIGNED`" },
    { id: "body-final", rule: "body_hash", role: "decides", needle: "The token is gone" },
    { id: "newline-final", rule: "trailing_newline", role: "decides", needle: "nothing follows the sixth" },
    { id: "escapes-proposed", rule: "percent_escapes", role: "introduces", option: "uppercased", needle: "proposed uppercasing the hex digits of every percent escape" },
    { id: "escapes-withdrawn", rule: "percent_escapes", role: "decides", needle: "the proposal to uppercase escape hex before signing was withdrawn" },
    { id: "bare-trial", rule: "valueless_parameter", role: "introduces", option: "bare", needle: "Accepted as a trial for the SDK 3.2 window" },
    { id: "bare-backed-out", rule: "valueless_parameter", role: "decides", needle: "The valueless parameter trial from 2025-11-04 is backed out" },
    { id: "dots-proposed", rule: "path", role: "introduces", option: "dot-segments-resolved", needle: "proposed collapsing dot segments on our side before signing" },
    { id: "dots-declined", rule: "path", role: "decides", needle: "Dot segment collapsing (Globex, 2025-11-25): not adopted" },
    { id: "key-case-asked", rule: "key_id_match", role: "introduces", option: "any-case", needle: "asked for key ids to be matched without regard to case" },
    { id: "key-case-declined", rule: "key_id_match", role: "decides", needle: "Key ids without regard to case (Northwind, 2025-11-25): not adopted" },
    { id: "webhook-comma", rule: "names_join", role: "introduces", option: "comma", needle: "joins its signed header names with a comma" },
    { id: "webhook-key", rule: "key_bytes", role: "introduces", option: "verbatim", needle: "reads its key file whole, line ending included" },
    { id: "key-read-in-strace", rule: "key_bytes", role: "decides", needle: STRACE_KEY_READ, file: "captures" },
    { id: "key-file-dumped", rule: "key_bytes", role: "decides", needle: KEY_DUMP, file: null },
    { id: "roster-in-captures", rule: "roster", role: "decides", needle: ROSTER_CAPTURE, file: "captures" },
    { id: "roster-in-rollout-note", rule: "roster", role: "decides", needle: "is not part of this cutover" },
  ],
  base: [
    { id: "fold", rule: "header_values", role: "decides", needle: "Header values are now whitespace-folded before signing" },
    { id: "order-final", rule: "query_order", role: "decides", needle: "Canonical query ordering now sorts by NAME, then by VALUE" },
    { id: "headers-final", rule: "signed_headers", role: "decides", needle: "EVERY header present on the request is now signed" },
    { id: "body-final", rule: "body_hash", role: "decides", needle: "The body-hash field is ALWAYS the lowercase hex SHA-256" },
    { id: "newline-final", rule: "trailing_newline", role: "decides", needle: "joined by LF with NO trailing newline" },
    { id: "key-read-in-strace", rule: "key_bytes", role: "decides", needle: STRACE_KEY_READ, file: "captures" },
    { id: "key-file-dumped", rule: "key_bytes", role: "decides", needle: KEY_DUMP, file: null },
    { id: "roster-in-captures", rule: "roster", role: "decides", needle: ROSTER_CAPTURE, file: "captures" },
  ],
};

// How much of a paragraph has to appear in tool output for it to count as read.
const OPENING = 200;

// What the shipped starter does for each rule it gets wrong. An attempt that
// still does the same has left the rule alone, whatever else it read.
const STARTER = {
  header_values: "raw",
  query_order: "name-only",
  signed_headers: "x-gw-only",
  body_hash: "unsigned-when-empty-or-absent",
  trailing_newline: "lf",
  key_bytes: "verbatim",
  roster: "every-file-in-directory",
};

const has = (text, needle) => (needle instanceof RegExp ? needle.test(text) : text.includes(needle));

function readTree(dir) {
  return readdirSync(dir).sort().map((name) => [name, readFileSync(join(dir, name), "utf8")]);
}

// Loads what the variant ships, and refuses to go on if a phrase above is not
// in it. A phrase that drifted would report "never seen" for every attempt.
export function loadVariant(variant) {
  const app = join(VARIANTS[variant].task, "environment", "app");
  const dossier = readTree(join(app, "dossier"));
  const captures = readTree(join(app, "captures"));
  const shipped = { dossier: dossier.map(([, t]) => t).join("\n"), captures: captures.map(([, t]) => t).join("\n") };
  for (const item of EVIDENCE[variant]) {
    if (item.file === null) continue;
    if (!has(shipped[item.file ?? "dossier"], item.needle)) {
      throw new Error(`${variant}: evidence phrase for ${item.id} is not in the shipped ${item.file ?? "dossier"}`);
    }
  }
  // One entry per paragraph, keyed by its opening, for the coverage count. The
  // generated paragraphs draw on shared sentence pools, so an opening that
  // occurs anywhere else in the dossier is dropped: seeing it would not show
  // which file the attempt had read.
  const count = (needle) => shipped.dossier.split(needle).length - 1;
  const paragraphs = dossier.map(([name, text]) => ({
    name,
    group: name.startsWith("01-") ? "register" : name.startsWith("0") ? "notes" : "appendices",
    openings: text
      .split("\n")
      .filter((line) => line.length > 90 && !line.startsWith("#"))
      .map((line) => line.slice(0, OPENING))
      .filter((opening) => count(opening) === 1),
  }));
  return { items: EVIDENCE[variant], paragraphs };
}

export function toolOutput(trajectory) {
  const parts = [];
  for (const step of trajectory.steps ?? []) {
    for (const result of step.observation?.results ?? []) {
      if (typeof result.content === "string") parts.push(result.content);
    }
  }
  return parts.join("\n");
}

export function exposure(trajectory, loaded) {
  const text = toolOutput(trajectory);
  const seen = new Set(loaded.items.filter((item) => has(text, item.needle)).map((item) => item.id));

  const coverage = {};
  for (const group of ["register", "notes", "appendices"]) {
    let total = 0;
    let hit = 0;
    for (const file of loaded.paragraphs.filter((p) => p.group === group)) {
      total += file.openings.length;
      hit += file.openings.filter((opening) => text.includes(opening)).length;
    }
    coverage[group] = total === 0 ? null : Math.round((100 * hit) / total);
  }
  const notesOpened = loaded.paragraphs
    .filter((p) => p.group === "notes" && p.openings.some((opening) => text.includes(opening)))
    .map((p) => p.name.slice(0, 2));

  let toolCalls = 0;
  let searches = 0;
  for (const step of trajectory.steps ?? []) {
    for (const call of step.tool_calls ?? []) {
      toolCalls += 1;
      const command = call.arguments?.command ?? "";
      if (call.function_name === "Grep" || /\b(grep|rg)\b/.test(command)) searches += 1;
    }
  }
  return { seen, coverage, notesOpened, toolCalls, searches };
}

// Whether the text that settles a rule was ever in front of the attempt. Null
// when the variant has no such text for the rule, which is the case for the
// rules the base dossier never challenges.
export function sawDeciding(rule, seen, loaded) {
  const deciding = loaded.items.filter((item) => item.rule === rule && item.role === "decides");
  return deciding.length === 0 ? null : deciding.some((item) => seen.has(item.id));
}

// Why a rule came out wrong, given what the attempt had seen.
export function cause(rule, option, seen, loaded) {
  const items = loaded.items.filter((item) => item.rule === rule);
  // Nothing in this variant's dossier or captures speaks to the rule, so there
  // is no text the attempt could have seen or missed.
  if (items.length === 0) return null;
  const decided = items.some((item) => item.role === "decides" && seen.has(item.id));
  if (STARTER[rule] === option) {
    return decided
      ? "left as the starter has it, having seen the deciding text"
      : "left as the starter has it, never saw the deciding text";
  }
  const intro = items.find((item) => item.role === "introduces" && item.option === option);
  if (intro && seen.has(intro.id)) {
    return decided ? "saw the later decision, kept the earlier one" : "stopped at the earlier decision";
  }
  return decided
    ? "saw the deciding text, did something else"
    : "never saw the deciding text, did something else";
}
