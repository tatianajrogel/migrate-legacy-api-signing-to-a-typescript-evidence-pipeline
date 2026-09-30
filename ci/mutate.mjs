// Reverts exactly one rule in the oracle sources under /solution/src.
//
// Each mutant is what an agent ships when it gets that one rule wrong and the
// other six right. The verifier has to reject every one of them, or the rule it
// reverts is not actually graded.
//
// Usage (inside the agent image): node mutate.mjs <mutant>

import { readFileSync, writeFileSync } from "node:fs";

const CANONICAL = "/solution/src/canonical.ts";
const PIPELINE = "/solution/src/pipeline.ts";

const MUTANTS = {
  // GW-041 left standing: header values signed raw instead of folded.
  "header-values-raw": [
    CANONICAL,
    "[n.toLowerCase(), foldHeaderValue(v)]",
    "[n.toLowerCase(), v]",
  ],
  // GW-017 left standing: query sorted by name only.
  "query-sort-name-only": [
    CANONICAL,
    "a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0,",
    "a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0,",
  ],
  // GW-023 left standing: only the x-gw-* headers signed.
  "sign-x-gw-only": [
    CANONICAL,
    '.filter(([n]) => n !== "authorization")',
    '.filter(([n]) => n.startsWith("x-gw-"))',
  ],
  // GW-009 left standing: empty bodies sign the UNSIGNED sentinel.
  "unsigned-sentinel": [
    CANONICAL,
    "sha256Hex(req.body),",
    'req.body === "" ? "UNSIGNED" : sha256Hex(req.body),',
  ],
  // GW-052 left standing: canonical string ends with a newline.
  "canonical-trailing-newline": [
    CANONICAL,
    '  ].join("\\n");',
    '  ].join("\\n") + "\\n";',
  ],
  // Capture rule missed: key file used verbatim, newline included.
  "key-file-verbatim": [
    PIPELINE,
    "      while (end > 0 && (raw[end - 1] === 0x0a || raw[end - 1] === 0x0d)) end--;\n",
    "",
  ],
  // Capture rule missed: every key file on disk treated as active.
  "roster-from-directory": [
    PIPELINE,
    "if (APPROVED_KEY_IDS.has(keyId)) {",
    "if (keyId !== \"\") {",
  ],
};

const name = process.argv[2];
const mutant = MUTANTS[name];
if (mutant === undefined) {
  console.error(`unknown mutant ${name}; known: ${Object.keys(MUTANTS).join(", ")}`);
  process.exit(2);
}

const [file, from, to] = mutant;
const source = readFileSync(file, "utf8");
// A mutant whose anchor text drifted would silently leave the oracle intact
// and pass, so the anchor has to match exactly once.
const hits = source.split(from).length - 1;
if (hits !== 1) {
  console.error(`mutant ${name}: expected 1 match in ${file}, found ${hits}`);
  process.exit(2);
}
writeFileSync(file, source.replace(from, to));
