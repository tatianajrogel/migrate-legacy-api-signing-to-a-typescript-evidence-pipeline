// Writes the probe request sets that diagnose.mjs reads an attempt's rules from.
//
// The graded request sets say whether an attempt is right. They do not say what
// it got wrong, because one record there exercises several rules at once. Each
// probe here exercises one rule and nothing else: only x-gw-* headers, no query
// and a plain body, unless the rule under test needs otherwise. So a probe's
// canonical hash depends on that one rule plus the 2 that touch every request
// (the trailing newline and how the header names are joined).
//
// The second half of the set holds the outcome cases from instruction.md. They
// are built so that the canonical rules cannot affect them either.
//
// One file per variant, because the key that sits in the directory and is off
// the roster has a different name in each.
//
// Usage: node analysis/build_probes.mjs

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CORRECT, SCHEME, evidence } from "./scheme.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export const VARIANTS = {
  base: { task: ROOT, offRoster: "gw-legacy-99" },
  hard: { task: join(ROOT, "hard"), offRoster: "gw-prod-03" },
};

export function loadKeyFiles(variant) {
  const dir = join(VARIANTS[variant].task, "environment", "app", "keys");
  const files = new Map();
  for (const name of readdirSync(dir)) {
    if (name.endsWith(".key")) files.set(name.slice(0, -4), readFileSync(join(dir, name)));
  }
  return files;
}

const KEY = ["X-GW-Key-Id", "gw-prod-01"];
const TRACE = ["X-GW-Trace", "t1"];
const ZEROS = "0".repeat(64);

function record(overrides = {}) {
  return { method: "POST", target: "/p/base", headers: [KEY, TRACE], body: "b", ...overrides };
}

export function buildProbes(variant) {
  const keyFiles = loadKeyFiles(variant);
  const validSignature = (rec) => evidence(rec, 1, CORRECT, keyFiles).signature;
  const auth = (rec, value) => ({ ...rec, headers: [...rec.headers, ["Authorization", value]] });
  const wellFormed = (rec, signature) =>
    auth(rec, `${SCHEME} keyId=gw-prod-01, signature=${signature}`);

  const plain = record({ target: "/p/verify" });
  const good = validSignature(plain);
  const withHost = record({ target: "/p/h", headers: [KEY, ["Host", "h.example"]] });

  // [id, the rule it isolates or null, the record]
  return [
    ["globals", null, record({ target: "/p/globals?x=1" })],
    ["globals-second-key", null, record({ headers: [["X-GW-Key-Id", "gw-prod-02"], TRACE] })],
    ["header-values", "header_values", record({ headers: [KEY, ["X-GW-Trace", "  a \t b  "]] })],
    ["query-order-escapes", "query_order", record({ target: "/p/q?q=z&q=%7e&q=a&b=1" })],
    ["query-order-case", "query_order", record({ target: "/p/q?q=b&q=B&q=a" })],
    ["signed-headers", "signed_headers", record({
      headers: [
        KEY,
        ["Host", "h.example"],
        ["Content-Type", "text/plain"],
        ["Via", "1.1 x"],
        ["X-Forwarded-For", "203.0.113.5"],
        ["Accept", "*/*"],
      ],
    })],
    ["signed-headers-with-authorization", "signed_headers",
      wellFormed(withHost, validSignature(withHost))],
    ["body-absent", "body_hash", record({ body: undefined })],
    ["body-empty", "body_hash", record({ body: "" })],
    ["percent-escapes", "percent_escapes", record({ target: "/p/a%2fb?x=%7e" })],
    ["valueless-parameter", "valueless_parameter", record({ target: "/p/v?flag" })],
    ["path-dots", "path", record({ target: "/p/./a/../b" })],

    // Register entries nothing in the dossier ever challenged.
    ["header-names", null, record({
      headers: [["X-GW-Trace", "t"], ["x-gw-key-id", "gw-prod-01"], ["X-GW-Alpha", "1"]],
    })],
    ["body-utf8", null, record({ body: "héllo ✓" })],
    ["method-case", null, record({ method: "post" })],

    // Key selection.
    ["off-roster-key", "roster", record({ headers: [["X-GW-Key-Id", VARIANTS[variant].offRoster], TRACE] })],
    ["key-id-uppercase", "key_id_match", record({ headers: [["X-GW-Key-Id", "GW-PROD-01"], TRACE] })],

    // Outcomes, as instruction.md states them.
    ["verify-valid", null, wellFormed(plain, good)],
    ["verify-valid-padded", null, wellFormed(plain, `  ${good}  `)],
    ["verify-wrong", null, wellFormed(plain, ZEROS)],
    ["verify-short", null, wellFormed(plain, "deadbeef")],
    ["verify-not-hex", null, wellFormed(plain, "not-a-signature")],
    ["verify-uppercase", null, wellFormed(plain, good.toUpperCase())],
    ["auth-other-scheme", null, auth(plain, "Bearer abc")],
    ["auth-key-id-differs", null, auth(plain, `${SCHEME} keyId=gw-prod-02, signature=${good}`)],
    ["auth-no-space-after-comma", null, auth(plain, `${SCHEME} keyId=gw-prod-01,signature=${good}`)],
    ["auth-missing-key-id", null, auth(record({ headers: [TRACE] }), `${SCHEME} keyId=gw-prod-01, signature=${ZEROS}`)],
    ["sign-missing-key-id", null, record({ headers: [TRACE] })],
    ["sign-unknown-key-id", null, record({ headers: [["X-GW-Key-Id", "gw-nope-00"], TRACE] })],
    ["verify-unknown-key-id", null, auth(record({ headers: [["X-GW-Key-Id", "gw-nope-00"], TRACE] }),
      `${SCHEME} keyId=gw-nope-00, signature=${ZEROS}`)],
  ].map(([id, rule, rec]) => ({ id, rule, record: rec }));
}

function main() {
  const out = join(ROOT, "analysis", "probes");
  mkdirSync(out, { recursive: true });
  for (const variant of Object.keys(VARIANTS)) {
    const probes = buildProbes(variant);
    writeFileSync(
      join(out, `${variant}.requests.json`),
      JSON.stringify(probes.map((p) => p.record), null, 2) + "\n",
    );
    writeFileSync(
      join(out, `${variant}.meta.json`),
      JSON.stringify(probes.map(({ id, rule }, i) => ({ seq: i + 1, id, rule })), null, 2) + "\n",
    );
    console.log(`${variant}: ${probes.length} probes`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
