// Works out, for each attempt, which form of each rule it implemented.
//
// The verifier answers one question per attempt: are the bytes right. This
// answers the next one: if not, which rules are wrong, and in what way.
//
// collect.sh has already run every attempt's own pipeline over the probe set
// and the graded sets. For each probe this looks up which settings of the
// rules in scheme.mjs reproduce the attempt's canonical hash, and intersects
// those across probes until each rule has one option left. The key rules are
// read off the signatures and outcomes. Whatever still differs between the
// attempt and a correct implementation of its own rule settings is reported as
// an outcome deviation: the attempt understood the scheme its own way AND
// departed from the output contract in instruction.md.
//
// As a check on the diagnosis itself, the settings it lands on are replayed
// over the graded request sets and compared with what the attempt produced
// there. "residual" counts the lines that the diagnosis does not explain.
//
// Last, exposure.mjs reads the trajectory for what the attempt had seen, and
// each wrong rule gets a cause: the text that settles it was never in front of
// the attempt, or it was and the attempt did not apply it.
//
// Usage: node analysis/diagnose.mjs <collected dir> [--json <file>] [--md <file>]

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { VARIANTS, buildProbes, loadKeyFiles } from "./build_probes.mjs";
import { cause, exposure, loadVariant, sawDeciding } from "./exposure.mjs";
import {
  CORRECT, KEY_RULES, RULES, canonical, everySetting, evidence, hmac, sha256,
} from "./scheme.mjs";

const FIELDS = ["seq", "key_id", "method", "path", "outcome", "signature", "canonical_sha256"];

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

function readLines(path) {
  if (!existsSync(path)) return null;
  const text = readFileSync(path, "utf8");
  if (text === "") return [];
  return text.replace(/\n$/, "").split("\n").map((line) => {
    try {
      return JSON.parse(line);
    } catch {
      return null;
    }
  });
}

const INSTRUCTIONS = {
  base: { shipped: "pointed", other: ["neutral", "base.neutral.md"] },
  hard: { shipped: "neutral", other: ["pointed", "hard.pointed.md"] },
  frontier: { shipped: "neutral", other: null },
};

function instructionLabel(variant, sent) {
  const same = (file) => existsSync(file) && readFileSync(file, "utf8").trim() === sent.trim();
  const { shipped, other } = INSTRUCTIONS[variant];
  if (same(join(VARIANTS[variant].task, "instruction.md"))) return shipped;
  if (other && same(join(VARIANTS.base.task, "analysis", "instructions", other[1]))) return other[0];
  return "first";
}

function shortModel(name) {
  const m = (name ?? "?").split("/").pop();
  return m.replace(/^claude-/, "").replace(/-\d{8}$/, "");
}

// For every probe, which rule settings give which canonical hash. Built once
// per variant and shared by all its attempts.
function buildIndex(probes) {
  const settings = everySetting();
  return probes.map(({ record }) => {
    const byHash = new Map();
    const byText = new Map();
    settings.forEach((s, i) => {
      const text = canonical(record, s);
      let hash = byText.get(text);
      if (hash === undefined) {
        hash = sha256(text);
        byText.set(text, hash);
        byHash.set(hash, { text, settings: [] });
      }
      byHash.get(hash).settings.push(i);
    });
    return { settings, byHash };
  });
}

function diagnose(dir, variant, probes, index, keyFiles, graded, loaded) {
  const result = readJson(join(dir, "trial-result.json")) ?? {};
  const job = readJson(join(dir, "job-config.json")) ?? {};
  const trajectory = readJson(join(dir, "trajectory.json"));
  // The frontier variant was rebuilt once. An attempt against the first build
  // read a different dossier, so what it saw cannot be judged against this one.
  // Its tool calls are still counted; they do not depend on the text.
  const sentText = trajectory?.steps?.find((step) => step.source === "user")?.message;
  const otherBuild = variant === "frontier" && typeof sentText === "string" && instructionLabel(variant, sentText) === "first";
  const counted = trajectory === null ? null : exposure(trajectory, loaded);
  const exposed = otherBuild ? null : counted;
  const seconds = (span) =>
    span?.started_at && span?.finished_at
      ? Math.round((Date.parse(span.finished_at) - Date.parse(span.started_at)) / 1000)
      : null;
  // Which instruction the attempt was given, read from the first message of its
  // trajectory. "pointed" sends the agent to the meeting notes in so many
  // words, "neutral" only says what the rest of the dossier is; see
  // build_instructions.mjs. "first" is the base task's wording before the 2
  // rejection rules were spelled out.
  const sent = trajectory?.steps?.find((step) => step.source === "user")?.message;
  const instruction = typeof sent !== "string" ? null : instructionLabel(variant, sent);
  const out = {
    variant,
    instruction,
    trial: result.trial_name ?? dir.split(/[\\/]/).pop(),
    model: shortModel(job.agents?.[0]?.model_name),
    agent_version: result.agent_info?.version ?? null,
    reward: result.verifier_result?.rewards?.reward ?? null,
    reward_regraded: regraded(dir).reward,
    regrade_failed: regraded(dir).failed,
    exception: result.exception_info?.exception_type ?? null,
    status: "ok",
    agent_seconds: seconds(result.agent_execution),
    cost_usd: trajectory?.final_metrics?.total_cost_usd ?? null,
    steps: trajectory?.final_metrics?.total_steps ?? null,
    tool_calls: counted?.toolCalls ?? null,
    searches: counted?.searches ?? null,
    coverage: exposed?.coverage ?? null,
    notes_opened: exposed?.notesOpened ?? null,
    notes_total: loaded.notes,
    seen: exposed === null ? null : [...exposed.seen],
    rules: {},
    wrong: [],
    causes: {},
    unexplained: [],
    deviations: [],
    residual: {},
  };

  const build = existsSync(join(dir, "build.status"))
    ? readFileSync(join(dir, "build.status"), "utf8").trim()
    : "missing";
  if (build !== "0") {
    out.status = build === "missing" ? "not-collected" : "does-not-compile";
    return out;
  }
  const lines = readLines(join(dir, "probes.ndjson"));
  if (lines === null || lines.length !== probes.length || lines.some((l) => l === null)) {
    out.status = "probe-run-unusable";
    return out;
  }

  // Canonical rules: intersect, probe by probe, the options that fit.
  const candidates = Object.fromEntries(
    Object.entries(RULES).map(([rule, options]) => [rule, new Set(options)]),
  );
  const canonicalText = [];
  probes.forEach((probe, i) => {
    const hit = index[i].byHash.get(lines[i].canonical_sha256);
    if (hit === undefined) {
      out.unexplained.push(probe.id);
      canonicalText.push(null);
      return;
    }
    canonicalText.push(hit.text);
    for (const rule of Object.keys(RULES)) {
      const fits = new Set(hit.settings.map((s) => index[i].settings[s][rule]));
      for (const option of [...candidates[rule]]) {
        if (!fits.has(option)) candidates[rule].delete(option);
      }
    }
  });
  for (const [rule, left] of Object.entries(candidates)) {
    if (left.size === 0) out.rules[rule] = "inconsistent";
    else if (left.has(CORRECT[rule])) out.rules[rule] = CORRECT[rule];
    else out.rules[rule] = [...left][0];
  }

  // Key bytes: which reading of the key file reproduces the attempt's signature.
  // An attempt can also sign one string and report the hash of another: one
  // was seen signing the canonical text plus a line feed while hashing it
  // without. So each key reading is tried over the hashed text as it is, with a
  // line feed added and with one removed. What the signature was computed over
  // decides the trailing newline rule, since the signature is what a gateway
  // would check, and the mismatch is recorded as its own setting.
  const at = (id) => probes.findIndex((p) => p.id === id);
  const keyVotes = new Set();
  for (const [id, keyId] of [["globals", "gw-prod-01"], ["globals-second-key", "gw-prod-02"]]) {
    const i = at(id);
    if (canonicalText[i] === null) continue;
    const raw = keyFiles.get(keyId);
    const hashed = canonicalText[i];
    const readings = [["newline-stripped", raw.subarray(0, raw.length - 1)], ["verbatim", raw]];
    const texts = [["as-signed", hashed]];
    if (hashed.endsWith("\n")) texts.push(["with-lf", hashed.slice(0, -1)]);
    else texts.push(["without-lf", `${hashed}\n`]);
    let vote = "unknown";
    for (const [reading, key] of readings) {
      for (const [hashedText, signed] of texts) {
        if (lines[i].signature === hmac(key, signed)) vote = `${reading}|${hashedText}`;
      }
    }
    keyVotes.add(vote);
  }
  const [keyBytes, hashedText] = keyVotes.size === 1 ? [...keyVotes][0].split("|") : ["unknown"];
  out.rules.key_bytes = keyBytes;
  out.rules.hashed_text = hashedText ?? "unknown";
  if (hashedText === "without-lf") out.rules.trailing_newline = "lf";
  if (hashedText === "with-lf") out.rules.trailing_newline = "none";

  const outcomeOf = (id) => lines[at(id)];
  const rejectedAsUnknown = (l) => l.outcome === "rejected" && l.reason === "unknown-key-id";
  const accepted = (l) => l.outcome === "signed" || l.outcome === "verified";
  const offRoster = outcomeOf("off-roster-key");
  out.rules.roster = rejectedAsUnknown(offRoster)
    ? "from-captures"
    : accepted(offRoster) ? "every-file-in-directory" : "unknown";
  const upper = outcomeOf("key-id-uppercase");
  out.rules.key_id_match = rejectedAsUnknown(upper) ? "exact" : accepted(upper) ? "any-case" : "unknown";

  out.wrong = Object.entries(out.rules)
    .filter(([rule, option]) => option !== CORRECT[rule])
    .map(([rule, option]) => `${rule}=${option}`);
  if (exposed !== null) {
    out.saw_deciding = {};
    for (const [rule, option] of Object.entries(out.rules)) {
      out.saw_deciding[rule] = sawDeciding(rule, exposed.seen, loaded);
      const why = option === CORRECT[rule] ? null : cause(rule, option, exposed.seen, loaded);
      if (why !== null) out.causes[rule] = why;
    }
  }

  // Outcome deviations: the attempt against a correct implementation of the
  // attempt's own rule settings. Unknown settings fall back to the correct one.
  const own = { ...CORRECT };
  for (const [rule, option] of Object.entries(out.rules)) {
    const known = (RULES[rule] ?? KEY_RULES[rule]).includes(option);
    if (known) own[rule] = option;
  }
  // One line per probe that differs, leading with the outcome since that is
  // what the instruction pins down. A signature that is empty where it should
  // be filled, or the reverse, is called out even when the outcome also differs.
  const compare = (expected, actual, label, skipCanonical) => {
    if (actual === null || typeof actual !== "object") return [`${label}: line is not a JSON object`];
    const verdict = (ev) => (ev.reason === undefined ? ev.outcome : `${ev.outcome}/${ev.reason}`);
    const parts = [];
    const sameVerdict = verdict(expected) === verdict(actual);
    if (!sameVerdict) parts.push(`${verdict(actual)}, expected ${verdict(expected)}`);
    if (!skipCanonical) {
      const filled = (ev) => typeof ev.signature === "string" && ev.signature !== "";
      if (filled(expected) !== filled(actual)) {
        parts.push(filled(actual) ? "signature filled, expected empty" : "signature empty, expected filled");
      } else if (expected.signature !== actual.signature) {
        parts.push("signature differs");
      }
      if (expected.canonical_sha256 !== actual.canonical_sha256) parts.push("canonical hash differs");
    }
    for (const field of ["seq", "key_id", "method", "path"]) {
      if (expected[field] !== actual[field]) {
        parts.push(`${field} ${JSON.stringify(actual[field])}, expected ${JSON.stringify(expected[field])}`);
      }
    }
    if (sameVerdict && Object.keys(expected).join() !== Object.keys(actual).join()) {
      parts.push(`keys ${Object.keys(actual).join(",")}`);
    }
    return parts.length === 0 ? [] : [`${label}: ${parts.join("; ")}`];
  };
  probes.forEach((probe, i) => {
    const expected = evidence(probe.record, i + 1, own, keyFiles);
    out.deviations.push(...compare(expected, lines[i], probe.id, out.unexplained.includes(probe.id)));
  });

  // Replay over the graded sets.
  for (const [name, records] of Object.entries(graded)) {
    const got = readLines(join(dir, `${name}.ndjson`));
    if (got === null || got.length !== records.length) {
      out.residual[name] = "no-output";
      continue;
    }
    let differ = 0;
    records.forEach((rec, i) => {
      const want = JSON.stringify(evidence(rec, i + 1, own, keyFiles));
      if (want !== JSON.stringify(got[i])) differ += 1;
    });
    out.residual[name] = differ;
  }
  return out;
}

function gradedSets(variant) {
  const task = VARIANTS[variant].task;
  const read = (...parts) => JSON.parse(readFileSync(join(task, ...parts), "utf8"));
  return {
    sample: read("environment", "app", "requests", "sample-requests.json"),
    h1: read("tests", "holdout", "h1", "requests.json"),
    h2: read("tests", "holdout", "h2", "requests.json"),
    h3: read("tests", "holdout", "h3", "requests.json"),
  };
}

// The score the current verifier gives the attempt's /app, written by
// collect.sh. Harbor's own score came from the verifier of the day, and the
// verifier has been fixed since.
function regraded(dir) {
  const file = join(dir, "regrade", "reward.txt");
  if (!existsSync(file)) return { reward: null, failed: null };
  const reward = Number(readFileSync(file, "utf8").trim());
  const ctrf = readJson(join(dir, "regrade", "ctrf.json"));
  const failed = ctrf === null
    ? null
    : (ctrf.results?.tests ?? [])
      .filter((t) => t.status !== "passed")
      .map((t) => t.name.split("::").pop().replace(/^test_/, ""));
  return { reward: Number.isNaN(reward) ? null : reward, failed };
}

function markdown(rows) {
  const head = "| Variant | Model | Trial | Reward (Harbor, then current verifier) | Dossier read | Rules wrong, and why | Outcome deviations | Unexplained probes | Residual (sample/h1/h2/h3) |";
  const rule = "|---|---|---|---|---|---|---|---|---|";
  const body = rows.map((r) => {
    const read = r.coverage === null
      ? "?"
      : `${r.coverage.notes}% of notes (${r.notes_opened.length} of ${r.notes_total} opened), ${r.coverage.appendices}% of appendices`;
    const reward = r.reward_regraded === null || r.reward_regraded === r.reward
      ? `${r.reward}`
      : `${r.reward} then ${r.reward_regraded}`;
    if (r.status !== "ok") {
      return `| ${r.variant} | ${r.model} | ${r.trial} | ${reward} | ${read} | ${r.status} | | | |`;
    }
    const residual = ["sample", "h1", "h2", "h3"].map((s) => r.residual[s]).join("/");
    const wrong = r.wrong.map((w) => {
      const why = r.causes[w.split("=")[0]];
      return why ? `${w}: ${why}` : w;
    });
    return `| ${r.variant} | ${r.model} | ${r.trial} | ${reward} | ${read} | ${wrong.join("<br>") || "none"} | ${
      r.deviations.join("<br>") || "none"} | ${r.unexplained.join(", ") || "none"} | ${residual} |`;
  });
  return [head, rule, ...body].join("\n") + "\n";
}

function main() {
  const args = process.argv.slice(2);
  const root = args[0];
  if (!root) {
    console.error("usage: node analysis/diagnose.mjs <collected dir> [--json <file>] [--md <file>]");
    process.exit(2);
  }
  const flag = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);

  const rows = [];
  for (const variant of Object.keys(VARIANTS)) {
    const base = join(root, variant);
    if (!existsSync(base)) continue;
    const probes = buildProbes(variant);
    const index = buildIndex(probes);
    const keyFiles = loadKeyFiles(variant);
    const graded = gradedSets(variant);
    const loaded = loadVariant(variant);
    for (const trial of readdirSync(base).sort()) {
      rows.push(diagnose(join(base, trial), variant, probes, index, keyFiles, graded, loaded));
    }
  }
  rows.sort((a, b) =>
    a.variant.localeCompare(b.variant) || a.model.localeCompare(b.model) || a.trial.localeCompare(b.trial));

  const md = markdown(rows);
  if (flag("--json")) writeFileSync(flag("--json"), JSON.stringify(rows, null, 2) + "\n");
  if (flag("--md")) writeFileSync(flag("--md"), md);
  process.stdout.write(md);
}

main();
