// Writes the third held-out request set, h3, for both variants.
//
// h1 and h2 were written to catch a wrong signing rule. They turned out not to
// grade most of the output contract: an agent attempt scored a full reward
// while verifying a header whose keyId named a different key than the record
// did. `ci/validate.sh <variant> contract` then showed 5 of the 7 contract
// mutants in mutate.mjs scoring 1. Each record below is one sentence of
// instruction.md turned into a request that only a correct reading gets right.
//
// The signatures come from analysis/scheme.mjs, which was written separately
// from solution/src. The reference solution has to reproduce the approved bytes
// for this set in CI, so the 2 have to agree.
//
// The set is identical for both variants: it names only the 2 roster keys,
// which are the same files in each, and a key id that exists in neither.
//
// Usage: node ci/build_contract_set.mjs

import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { VARIANTS, loadKeyFiles } from "../analysis/build_probes.mjs";
import { CORRECT, SCHEME, canonical, evidence, hmac } from "../analysis/scheme.mjs";

const HOST = ["Host", "contract.example.net"];

function build(keyFiles) {
  const sign = (rec) => evidence(rec, 1, CORRECT, keyFiles).signature;
  const withAuth = (rec, value) => ({ ...rec, headers: [...rec.headers, ["Authorization", value]] });
  const keyOf = (rec) => rec.headers.find(([n]) => n.toLowerCase() === "x-gw-key-id")[1];
  const wellFormed = (rec, signature) =>
    withAuth(rec, `${SCHEME} keyId=${keyOf(rec)}, signature=${signature}`);

  const padded = {
    method: "PUT",
    target: "/v5/contract/padded?b=2&a=1",
    headers: [["X-GW-Key-Id", "gw-prod-02"], HOST, ["Content-Type", "application/json"]],
    body: '{"n":1}',
  };
  const otherKey = {
    method: "POST",
    target: "/v5/contract/other-key",
    headers: [["X-GW-Key-Id", "gw-prod-01"], HOST],
    body: "x",
  };
  const upper = { method: "GET", target: "/v5/contract/upper", headers: [["X-GW-Key-Id", "gw-prod-01"], HOST] };
  const comma = { method: "GET", target: "/v5/contract/comma", headers: [["X-GW-Key-Id", "gw-prod-02"], HOST] };
  const noKey = { method: "POST", target: "/v5/contract/no-key", headers: [HOST], body: "y" };
  const unknown = { method: "GET", target: "/v5/contract/unknown", headers: [["X-GW-Key-Id", "gw-prod-09"], HOST] };
  const plain = { method: "DELETE", target: "/v5/contract/plain", headers: [["X-GW-Key-Id", "gw-prod-01"], HOST] };

  // What a signer would produce for the record with no key header, if it took
  // the key id from the Authorization header instead.
  const key01 = keyFiles.get("gw-prod-01");
  const noKeySignature = hmac(key01.subarray(0, key01.length - 1), canonical(noKey, CORRECT));

  // Found by red-teaming the verifier after the first 8 records were in: each
  // of these departures reproduced every graded set while contradicting the
  // same 2 sentences of instruction.md.
  const plainOn = (target, keyId) => ({ method: "GET", target, headers: [["X-GW-Key-Id", keyId], HOST] });
  const schemeCase = plainOn("/v5/contract/scheme-case", "gw-prod-01");
  const paramCase = plainOn("/v5/contract/param-case", "gw-prod-02");
  const keyIdCase = plainOn("/v5/contract/keyid-case", "gw-prod-01");
  const twoSpaces = plainOn("/v5/contract/two-spaces", "gw-prod-02");
  const spacedEquals = plainOn("/v5/contract/spaced-equals", "gw-prod-01");
  const schemeSpaces = plainOn("/v5/contract/scheme-two-spaces", "gw-prod-01");
  const trailing = plainOn("/v5/contract/trailing-text", "gw-prod-02");
  const quoted = plainOn("/v5/contract/quoted", "gw-prod-01");
  const emptySig = plainOn("/v5/contract/empty-signature", "gw-prod-02");

  return [
    // "compared as is apart from surrounding whitespace": verifies.
    wellFormed(padded, `  ${sign(padded)}  `),
    // "keyId=<the record's key id>": a header naming another key is malformed,
    // even though its signature is right for the record's own key.
    withAuth(otherKey, `${SCHEME} keyId=gw-prod-02, signature=${sign(otherKey)}`),
    // "compared as is": the right digits in upper case are a mismatch.
    wellFormed(upper, sign(upper).toUpperCase()),
    // "starts with exactly": no space after the comma is malformed.
    withAuth(comma, `${SCHEME} keyId=gw-prod-02,signature=${sign(comma)}`),
    // The key id travels in x-gw-key-id. Without that header there is none,
    // whatever the Authorization header says.
    withAuth(noKey, `${SCHEME} keyId=gw-prod-01, signature=${noKeySignature}`),
    // "checked in that order": an unknown key id comes before a malformed header.
    withAuth(unknown, "Bearer t"),
    // A plain verification and a plain signing, so the set stands on its own.
    wellFormed(plain, sign(plain)),
    { method: "post", target: "/v5/contract/sign?z=1", headers: [["X-GW-Key-Id", "gw-prod-02"], HOST], body: "" },

    // "starts with exactly": the scheme token in another case is malformed.
    withAuth(schemeCase, `gw-hmac-sha256 keyId=gw-prod-01, signature=${sign(schemeCase)}`),
    // "starts with exactly": the parameter names in another case are malformed.
    withAuth(paramCase, `${SCHEME} keyid=gw-prod-02, Signature=${sign(paramCase)}`),
    // "keyId=<the record's key id>": the right key in the wrong case is malformed.
    withAuth(keyIdCase, `${SCHEME} keyId=GW-PROD-01, signature=${sign(keyIdCase)}`),
    // "starts with exactly": two spaces after the comma are malformed.
    withAuth(twoSpaces, `${SCHEME} keyId=gw-prod-02,  signature=${sign(twoSpaces)}`),
    // "starts with exactly": spaces around the equals signs are malformed.
    withAuth(spacedEquals, `${SCHEME} keyId = gw-prod-01 , signature = ${sign(spacedEquals)}`),
    // "starts with exactly": two spaces after the scheme are malformed. The
    // hard variant's h2 had this already; the base variant's did not.
    withAuth(schemeSpaces, `${SCHEME}  keyId=gw-prod-01, signature=${sign(schemeSpaces)}`),
    // "compared as is apart from surrounding whitespace": text after the
    // signature is part of the presented signature, so it is a mismatch.
    wellFormed(trailing, `${sign(trailing)}, nonce=17`),
    // "compared as is": a quoted signature is a different string, a mismatch.
    wellFormed(quoted, `"${sign(quoted)}"`),
    // "wrong, short or non-hex": the shortest presented signature there is.
    wellFormed(emptySig, ""),
    // "a key that isn't on the roster": an id that would resolve to a roster
    // file by path is still not a roster id.
    plainOn("/v5/contract/traversal", "../keys/gw-prod-01"),
    // The roster is matched exactly: a roster id in upper case is unknown. The
    // hard variant's h1 had this already; the base variant's did not.
    plainOn("/v5/contract/key-case", "GW-PROD-02"),
  ];
}

for (const variant of Object.keys(VARIANTS)) {
  const keyFiles = loadKeyFiles(variant);
  const records = build(keyFiles);
  const file = join(VARIANTS[variant].task, "tests", "holdout", "h3", "requests.json");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(records, null, 2) + "\n");
  const out = records.map((r, i) => JSON.stringify(evidence(r, i + 1, CORRECT, keyFiles)) + "\n").join("");
  console.log(`== ${variant}  h3 sha256 ${createHash("sha256").update(out).digest("hex")}`);
  if (variant === "base") {
    for (const line of out.trim().split("\n")) {
      const ev = JSON.parse(line);
      console.log(`   ${ev.seq} ${ev.method} ${ev.path}: ${ev.outcome}${ev.reason ? "/" + ev.reason : ""}, key_id ${JSON.stringify(ev.key_id)}, signature ${ev.signature === "" ? "empty" : "filled"}`);
    }
  }
}
