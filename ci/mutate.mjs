// Gets exactly one rule wrong in the oracle sources under /solution/src.
//
// Each mutant is what an agent ships when it gets that one rule wrong and the
// rest right. The verifier has to reject every one of them, or the rule is not
// actually graded.
//
// The first 7 leave a register entry standing that the dossier changed. The
// next 9 apply to the hard variant: each one adopts a rule the dossier held for
// a while and then changed again, trialled and backed out, or declined. 2 more
// apply to the frontier variant only: one stops at an intermediate form of
// header values, the other applies a lowercasing whose condition was not met.
// The last 7 get the rules right and depart from the output contract.
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
  // GW-017 stopped at its 2025-11-18 form: values compared after decoding.
  "query-sort-decoded-value": [
    CANONICAL,
    "a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0,",
    "a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : decodeURIComponent(a[1]) < decodeURIComponent(b[1]) ? -1 : decodeURIComponent(a[1]) > decodeURIComponent(b[1]) ? 1 : 0,",
  ],
  // GW-023 stopped at its 2025-11-18 form: x-gw-* plus content-type.
  "sign-x-gw-plus-content-type": [
    CANONICAL,
    '.filter(([n]) => n !== "authorization")',
    '.filter(([n]) => n.startsWith("x-gw-") || n === "content-type")',
  ],
  // GW-009 stopped at its 2025-10-21 form: a missing body signs UNSIGNED, an
  // empty one is hashed. Takes an edit in each file, since the oracle folds the
  // 2 cases together before the canonical request is built.
  "absent-body-unsigned": [
    [PIPELINE, 'body: rec.body ?? "",', 'body: rec.body ?? "<absent>",'],
    [
      CANONICAL,
      "sha256Hex(req.body),",
      'req.body === "<absent>" ? "UNSIGNED" : sha256Hex(req.body),',
    ],
  ],
  // Proposed 2025-10-21, withdrawn 2025-11-04: percent escapes uppercased.
  "percent-escapes-uppercased": [
    CANONICAL,
    "    path,\n    canonicalQuery(query),",
    "    path.replace(/%[0-9a-f]{2}/gi, (m) => m.toUpperCase()),\n" +
      "    canonicalQuery(query.replace(/%[0-9a-f]{2}/gi, (m) => m.toUpperCase())),",
  ],
  // Trialled 2025-11-04, backed out at the freeze: a parameter with no "=" is
  // written bare.
  "valueless-parameter-bare": [
    CANONICAL,
    'return pairs.map(([n, v]) => `${n}=${v}`).join("&");',
    'const bare = new Set(rawQuery.split("&").filter((p) => !p.includes("=")));\n' +
      '  return pairs.map(([n, v]) => (v === "" && bare.has(n) ? n : `${n}=${v}`)).join("&");',
  ],
  // Proposed 2025-11-25, declined at the freeze: dot segments collapsed.
  "path-dot-segments-collapsed": [
    CANONICAL,
    "    path,\n    canonicalQuery(query),",
    '    path.replace(/\\/\\.(?=\\/|$)/g, ""),\n    canonicalQuery(query),',
  ],
  // Asked for 2025-11-25, declined at the freeze: key ids matched in any case.
  "key-id-any-case": [
    PIPELINE,
    'const keyId = headerValue(req.headers, "x-gw-key-id") ?? "";',
    'const keyId = (headerValue(req.headers, "x-gw-key-id") ?? "").toLowerCase();',
  ],
  // Asked for 2025-12-09, after the freeze, and declined.
  "forwarding-headers-unsigned": [
    CANONICAL,
    '.filter(([n]) => n !== "authorization")',
    '.filter(([n]) => !["authorization", "via", "x-forwarded-for"].includes(n))',
  ],
  // The webhook signer's rule, which is not this scheme's.
  "signed-names-comma-joined": [
    CANONICAL,
    'signed.map(([n]) => n).join(";")',
    'signed.map(([n]) => n).join(",")',
  ],

  // Frontier variant only. GW-041 stopped at its 2025-10-14 form: the ends of a
  // header value stripped, the inside left alone. The item that collapses the
  // inside was minuted under another signer and reassigned by a correction.
  "header-values-trimmed-only": [
    CANONICAL,
    "[n.toLowerCase(), foldHeaderValue(v)]",
    '[n.toLowerCase(), v.replace(/^[ \\t]+|[ \\t]+$/g, "")]',
  ],

  // Frontier variant only. Lowercasing after folding was agreed subject to a
  // load test with a limit at p99; the test passed at p95 and failed at p99.
  "header-values-lowercased": [
    CANONICAL,
    "[n.toLowerCase(), foldHeaderValue(v)]",
    "[n.toLowerCase(), foldHeaderValue(v).toLowerCase()]",
  ],

  // The mutants from here on get every signing rule right and depart from the
  // output contract in instruction.md instead. Each is something an agent
  // attempt was seen to ship.

  // The keyId inside the Authorization header is not checked against the
  // record's key id, so a header naming another key still verifies.
  "auth-key-id-unbound": [
    PIPELINE,
    "  const prefix = `${SCHEME} keyId=${keyId}, signature=`;",
    "  const prefix = (auth.match(/^GW-HMAC-SHA256 keyId=[^,]+, signature=/) ?? [`${SCHEME} keyId=${keyId}, signature=`])[0];",
  ],
  // The presented signature is compared without regard to case.
  "signature-case-insensitive": [
    PIPELINE,
    "const presented = auth.slice(prefix.length).trim();",
    "const presented = auth.slice(prefix.length).trim().toLowerCase();",
  ],
  // Whitespace around the presented signature is kept, so a padded one fails.
  "signature-not-trimmed": [
    PIPELINE,
    "const presented = auth.slice(prefix.length).trim();",
    "const presented = auth.slice(prefix.length);",
  ],
  // A presented signature that is not 64 hex digits is called malformed.
  "short-signature-malformed": [
    PIPELINE,
    "const presented = auth.slice(prefix.length).trim();",
    "const presented = auth.slice(prefix.length).trim();\n" +
      "  if (!/^[0-9a-f]{64}$/.test(presented)) {\n" +
      '    return { ...base, outcome: "rejected", signature, reason: "malformed-authorization" };\n' +
      "  }",
  ],
  // A rejected verification leaves the signature field empty.
  "rejected-signature-empty": [
    [PIPELINE, '      outcome: "rejected",\n      signature,\n      reason: "malformed-authorization",',
      '      outcome: "rejected",\n      reason: "malformed-authorization",'],
    [PIPELINE, ': { ...base, outcome: "rejected", signature, reason: "signature-mismatch" };',
      ': { ...base, outcome: "rejected", reason: "signature-mismatch" };'],
  ],
  // The space after the comma in the Authorization header is optional.
  "auth-loose-separator": [
    PIPELINE,
    "  const prefix = `${SCHEME} keyId=${keyId}, signature=`;",
    "  const tight = `${SCHEME} keyId=${keyId},signature=`;\n" +
      "  const prefix = auth.startsWith(tight) ? tight : `${SCHEME} keyId=${keyId}, signature=`;",
  ],
  // With no x-gw-key-id header, the key id is taken from the Authorization
  // header instead of the record being rejected as missing one.
  "key-id-from-authorization": [
    PIPELINE,
    'const keyId = headerValue(req.headers, "x-gw-key-id") ?? "";',
    'const keyId = headerValue(req.headers, "x-gw-key-id")\n' +
      '    ?? headerValue(req.headers, "authorization")?.match(/keyId=([^,]+),/)?.[1] ?? "";',
  ],
};

const name = process.argv[2];
const mutant = MUTANTS[name];
if (mutant === undefined) {
  console.error(`unknown mutant ${name}; known: ${Object.keys(MUTANTS).join(", ")}`);
  process.exit(2);
}

const edits = Array.isArray(mutant[0]) ? mutant : [mutant];
for (const [file, from, to] of edits) {
  const source = readFileSync(file, "utf8");
  // A mutant whose anchor text drifted would silently leave the oracle intact
  // and pass, so the anchor has to match exactly once.
  const hits = source.split(from).length - 1;
  if (hits !== 1) {
    console.error(`mutant ${name}: expected 1 match in ${file}, found ${hits}`);
    process.exit(2);
  }
  writeFileSync(file, source.replace(from, () => to));
}
