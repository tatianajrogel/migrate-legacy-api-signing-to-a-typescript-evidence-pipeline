// Departures and alternative readings under the authorization lens, each run
// over all 8 graded sets (4 per variant). Prints a table and writes
// results.json next to this file.
import { writeFileSync } from "node:fs";
import {
  KEYS, SCHEME, runDeparture, withAuthStage, referenceAuthStage, reference, checkHarness,
} from "./harness.mjs";

const { ok } = checkHarness();
if (!ok) { console.error("harness does not reproduce the 8 hashes; stopping"); process.exit(1); }

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const ci = (word) => word.split("").map((c) => /[a-z]/i.test(c) ? `[${c.toLowerCase()}${c.toUpperCase()}]` : esc(c)).join("");

// Example record factory (base variant keys; gw-prod-01 is on both rosters).
const KEY = ["X-GW-Key-Id", "gw-prod-01"];
const HOST = ["Host", "redteam.example.net"];
const plain = (overrides = {}) => ({ method: "POST", target: "/rt/auth", headers: [KEY, HOST], body: "b", ...overrides });
const auth = (rec, value) => ({ ...rec, headers: [...rec.headers, ["Authorization", value]] });
const good = reference(plain(), 1, KEYS.base).signature;
const wellFormed = (sig) => `${SCHEME} keyId=gw-prod-01, signature=${sig}`;

// Each departure: id, kind guess, sentence, description, fn, example record.
const D = [];

// 1. Scheme token matched case-insensitively (RFC 7235 says auth-scheme is case-insensitive).
D.push({
  id: "scheme-case-insensitive",
  description: "the scheme token GW-HMAC-SHA256 is matched ignoring case",
  fn: withAuthStage((a, keyId, base) => {
    const re = new RegExp(`^${ci(SCHEME)} keyId=${esc(keyId)}, signature=`);
    const m = a.match(re);
    if (!m) return { ...base, outcome: "rejected", reason: "malformed-authorization" };
    return a.slice(m[0].length).trim() === base.signature ? { ...base, outcome: "verified" } : { ...base, outcome: "rejected", reason: "signature-mismatch" };
  }),
  example: auth(plain(), `gw-hmac-sha256 keyId=gw-prod-01, signature=${good}`),
});

// 2. Auth-param NAMES matched case-insensitively (keyid=, Signature=).
D.push({
  id: "param-names-case-insensitive",
  description: "the parameter names keyId and signature are matched ignoring case",
  fn: withAuthStage((a, keyId, base) => {
    const re = new RegExp(`^${esc(SCHEME)} ${ci("keyId")}=${esc(keyId)}, ${ci("signature")}=`);
    const m = a.match(re);
    if (!m) return { ...base, outcome: "rejected", reason: "malformed-authorization" };
    return a.slice(m[0].length).trim() === base.signature ? { ...base, outcome: "verified" } : { ...base, outcome: "rejected", reason: "signature-mismatch" };
  }),
  example: auth(plain(), `${SCHEME} keyid=gw-prod-01, Signature=${good}`),
});

// 3. keyId VALUE compared to the record key id ignoring case.
D.push({
  id: "keyid-value-case-insensitive",
  description: "the keyId inside the header is compared to the record key id ignoring case",
  fn: withAuthStage((a, keyId, base) => {
    const re = new RegExp(`^${esc(SCHEME)} keyId=${ci(keyId)}, signature=`);
    const m = a.match(re);
    if (!m) return { ...base, outcome: "rejected", reason: "malformed-authorization" };
    return a.slice(m[0].length).trim() === base.signature ? { ...base, outcome: "verified" } : { ...base, outcome: "rejected", reason: "signature-mismatch" };
  }),
  example: auth(plain(), `${SCHEME} keyId=GW-PROD-01, signature=${good}`),
});

// 4a. One OR MORE spaces/tabs after the comma (zero still malformed).
D.push({
  id: "comma-then-one-or-more-spaces",
  description: "after the comma, any run of 1+ spaces/tabs is accepted (zero is still malformed)",
  fn: withAuthStage((a, keyId, base) => {
    const re = new RegExp(`^${esc(SCHEME)} keyId=${esc(keyId)},[ \\t]+signature=`);
    const m = a.match(re);
    if (!m) return { ...base, outcome: "rejected", reason: "malformed-authorization" };
    return a.slice(m[0].length).trim() === base.signature ? { ...base, outcome: "verified" } : { ...base, outcome: "rejected", reason: "signature-mismatch" };
  }),
  example: auth(plain(), `${SCHEME} keyId=gw-prod-01,  signature=${good}`),
});

// 4b. Whitespace tolerated around "=" and before the comma.
D.push({
  id: "whitespace-around-equals-and-before-comma",
  description: "optional whitespace around '=' and before the comma is accepted",
  fn: withAuthStage((a, keyId, base) => {
    const re = new RegExp(`^${esc(SCHEME)} keyId[ \\t]*=[ \\t]*${esc(keyId)}[ \\t]*, signature[ \\t]*=`);
    const m = a.match(re);
    if (!m) return { ...base, outcome: "rejected", reason: "malformed-authorization" };
    return a.slice(m[0].length).trim() === base.signature ? { ...base, outcome: "verified" } : { ...base, outcome: "rejected", reason: "signature-mismatch" };
  }),
  example: auth(plain(), `${SCHEME} keyId = gw-prod-01 , signature = ${good}`),
});

// 4c. One OR MORE spaces after the scheme token.
D.push({
  id: "scheme-then-one-or-more-spaces",
  description: "after the scheme token, any run of 1+ spaces is accepted",
  fn: withAuthStage((a, keyId, base) => {
    const re = new RegExp(`^${esc(SCHEME)} +keyId=${esc(keyId)}, signature=`);
    const m = a.match(re);
    if (!m) return { ...base, outcome: "rejected", reason: "malformed-authorization" };
    return a.slice(m[0].length).trim() === base.signature ? { ...base, outcome: "verified" } : { ...base, outcome: "rejected", reason: "signature-mismatch" };
  }),
  example: auth(plain(), `${SCHEME}  keyId=gw-prod-01, signature=${good}`),
});

// 5. Literal reading: the header VALUE is not trimmed before the prefix check,
//    so a leading space makes it malformed. (The reference trims the whole value.)
const rawLookup = (rec) => { const h = rec.headers.find(([n]) => n.toLowerCase() === "authorization"); return h ? h[1] : null; };
D.push({
  id: "leading-whitespace-is-malformed",
  description: "the header value is taken untrimmed, so a leading space before the scheme is malformed-authorization",
  fn: withAuthStage(referenceAuthStage, { lookupAuth: rawLookup }),
  example: auth(plain(), ` ${wellFormed(good)}`),
});

// 6. Header NAME matched case-sensitively ("Authorization" only).
D.push({
  id: "header-name-case-sensitive",
  description: "only a header literally named Authorization is seen; 'authorization' is treated as absent (record is signed)",
  fn: withAuthStage(referenceAuthStage, { lookupAuth: (rec) => { const h = rec.headers.find(([n]) => n === "Authorization"); return h ? h[1].trim() : null; } }),
  example: { ...plain(), headers: [KEY, HOST, ["authorization", wellFormed(good)]] },
});

// 7a. Duplicate Authorization headers: last one wins (reference: first).
const dupExample = { ...plain(), headers: [KEY, HOST, ["Authorization", wellFormed(good)], ["Authorization", "Bearer x"]] };
D.push({
  id: "duplicate-authorization-last-wins",
  description: "with 2 Authorization headers the last is verified (reference verifies the first)",
  fn: withAuthStage(referenceAuthStage, { lookupAuth: (rec) => { const hs = rec.headers.filter(([n]) => n.toLowerCase() === "authorization"); return hs.length ? hs[hs.length - 1][1].trim() : null; } }),
  example: dupExample,
});
// 7b. Duplicate Authorization headers: malformed.
D.push({
  id: "duplicate-authorization-malformed",
  description: "with 2 Authorization headers the record is malformed-authorization",
  fn: withAuthStage((a, keyId, base, rec) => {
    const n = rec.headers.filter(([h]) => h.toLowerCase() === "authorization").length;
    if (n > 1) return { ...base, outcome: "rejected", reason: "malformed-authorization" };
    return referenceAuthStage(a, keyId, base);
  }),
  example: dupExample,
});

// 8. Empty presented signature is malformed (reference: signature-mismatch).
D.push({
  id: "empty-signature-malformed",
  description: "nothing after signature= is malformed-authorization instead of signature-mismatch",
  fn: withAuthStage((a, keyId, base) => {
    const prefix = `${SCHEME} keyId=${keyId}, signature=`;
    if (!a.startsWith(prefix)) return { ...base, outcome: "rejected", reason: "malformed-authorization" };
    const p = a.slice(prefix.length).trim();
    if (p === "") return { ...base, outcome: "rejected", reason: "malformed-authorization" };
    return p === base.signature ? { ...base, outcome: "verified" } : { ...base, outcome: "rejected", reason: "signature-mismatch" };
  }),
  example: auth(plain(), wellFormed("")),
});

// 9a. Auth-param parsing: the presented signature stops at the first comma or
//     whitespace, so trailing parameters are ignored.
D.push({
  id: "trailing-params-ignored",
  description: "the presented signature is the token up to the first ',' or whitespace; trailing text/params are ignored",
  fn: withAuthStage((a, keyId, base) => {
    const prefix = `${SCHEME} keyId=${keyId}, signature=`;
    if (!a.startsWith(prefix)) return { ...base, outcome: "rejected", reason: "malformed-authorization" };
    const p = a.slice(prefix.length).trim().split(/[,\s]/)[0];
    return p === base.signature ? { ...base, outcome: "verified" } : { ...base, outcome: "rejected", reason: "signature-mismatch" };
  }),
  example: auth(plain(), `${wellFormed(good)}, nonce=17`),
});
// 9b. Trailing text after the signature token is malformed.
D.push({
  id: "trailing-text-malformed",
  description: "a presented signature containing internal whitespace or a comma is malformed-authorization",
  fn: withAuthStage((a, keyId, base) => {
    const prefix = `${SCHEME} keyId=${keyId}, signature=`;
    if (!a.startsWith(prefix)) return { ...base, outcome: "rejected", reason: "malformed-authorization" };
    const p = a.slice(prefix.length).trim();
    if (/[,\s]/.test(p)) return { ...base, outcome: "rejected", reason: "malformed-authorization" };
    return p === base.signature ? { ...base, outcome: "verified" } : { ...base, outcome: "rejected", reason: "signature-mismatch" };
  }),
  example: auth(plain(), `${wellFormed(good)}, nonce=17`),
});

// 10. RFC 7235 quoted-string: signature="<hex>" accepted.
D.push({
  id: "quoted-signature-accepted",
  description: "a presented signature wrapped in double quotes is unquoted before comparison",
  fn: withAuthStage((a, keyId, base) => {
    const prefix = `${SCHEME} keyId=${keyId}, signature=`;
    if (!a.startsWith(prefix)) return { ...base, outcome: "rejected", reason: "malformed-authorization" };
    let p = a.slice(prefix.length).trim();
    const q = p.match(/^"(.*)"$/); if (q) p = q[1];
    return p === base.signature ? { ...base, outcome: "verified" } : { ...base, outcome: "rejected", reason: "signature-mismatch" };
  }),
  example: auth(plain(), wellFormed(`"${good}"`)),
});

// 11. An Authorization header whose value is empty/blank is treated as absent (signed).
D.push({
  id: "empty-authorization-value-as-absent",
  description: "an Authorization header with an empty or whitespace-only value is treated as no header (record is signed)",
  fn: withAuthStage(referenceAuthStage, { lookupAuth: (rec) => { const h = rec.headers.find(([n]) => n.toLowerCase() === "authorization"); if (!h) return null; const v = h[1].trim(); return v === "" ? null : v; } }),
  example: auth(plain(), ""),
});

// 12. Surrounding whitespace stripped is ASCII space/tab only (reference uses String.prototype.trim, which strips NBSP, CR, LF, FF ...).
D.push({
  id: "trim-ascii-space-tab-only",
  description: "only spaces and tabs count as surrounding whitespace of the presented signature; NBSP/CR/LF padding is a mismatch",
  fn: withAuthStage((a, keyId, base) => {
    const prefix = `${SCHEME} keyId=${keyId}, signature=`;
    if (!a.startsWith(prefix)) return { ...base, outcome: "rejected", reason: "malformed-authorization" };
    const p = a.slice(prefix.length).replace(/^[ \t]+|[ \t]+$/g, "");
    return p === base.signature ? { ...base, outcome: "verified" } : { ...base, outcome: "rejected", reason: "signature-mismatch" };
  }, { lookupAuth: rawLookup }),
  example: auth(plain(), wellFormed(` ${good} `)),
});

// 13. The record key id is not trimmed (reference trims x-gw-key-id). Affects keyId binding.
D.push({
  id: "record-key-id-untrimmed",
  description: "the x-gw-key-id value is used untrimmed, so ' gw-prod-01 ' is unknown-key-id and key_id carries the spaces",
  fn: (rec, seq, keyFiles) => {
    const h = rec.headers.find(([n]) => n.toLowerCase() === "x-gw-key-id");
    const raw = h ? h[1] : "";
    const ev = reference(rec, seq, keyFiles);
    if (raw === ev.key_id) return ev;
    // untrimmed id never matches the roster
    return { seq, key_id: raw, method: ev.method, path: ev.path, outcome: "rejected", signature: "", canonical_sha256: ev.canonical_sha256, reason: raw === "" ? "missing-key-id" : "unknown-key-id" };
  },
  example: auth({ ...plain(), headers: [["X-GW-Key-Id", " gw-prod-01 "], HOST] }, wellFormed(good)),
});

// 14. Output contract: reason emitted right after outcome (key order differs).
D.push({
  id: "reason-after-outcome-key-order",
  description: "the reason key is emitted immediately after outcome rather than last",
  fn: (rec, seq, keyFiles) => {
    const ev = reference(rec, seq, keyFiles);
    if (ev.reason === undefined) return ev;
    const { seq: s, key_id, method, path, outcome, signature, canonical_sha256, reason } = ev;
    return { seq: s, key_id, method, path, outcome, reason, signature, canonical_sha256 };
  },
  example: auth(plain(), "Bearer z"),
});

// Controls: check-order departures that h3 is documented to catch.
D.push({
  id: "CONTROL-malformed-before-unknown-key",
  description: "control: well-formedness checked before the roster, so an unknown key with a Bearer header is malformed",
  fn: (rec, seq, keyFiles) => {
    const ev = reference(rec, seq, keyFiles);
    if (ev.reason !== "unknown-key-id") return ev;
    const h = rec.headers.find(([n]) => n.toLowerCase() === "authorization");
    if (!h) return ev;
    const prefix = `${SCHEME} keyId=${ev.key_id}, signature=`;
    return h[1].trim().startsWith(prefix) ? ev : { ...ev, reason: "malformed-authorization" };
  },
  example: auth({ ...plain(), headers: [["X-GW-Key-Id", "gw-nope-00"], HOST] }, "Bearer t"),
});
D.push({
  id: "CONTROL-scheme-whitespace-run",
  description: "control: 1+ spaces after the scheme accepted (expected caught by hard h2 record 5 only)",
  fn: D.find((d) => d.id === "scheme-then-one-or-more-spaces").fn,
  example: auth(plain(), `${SCHEME}  keyId=gw-prod-01, signature=${good}`),
});

const results = [];
for (const d of D) {
  const r = runDeparture(d.fn);
  const expectedLine = JSON.stringify(reference(d.example, 1, KEYS.base));
  const departureLine = JSON.stringify(d.fn(d.example, 1, KEYS.base));
  const caughtBy = [];
  for (const v of ["base", "hard"]) for (const [s, x] of Object.entries(r.sets[v])) if (!x.match) caughtBy.push(`${v}/${s} seq ${x.diffs.map((q) => q.seq).join(",")}`);
  results.push({
    id: d.id, description: d.description,
    survivesBase: r.survivesBase, survivesHard: r.survivesHard, caughtBy,
    exampleChangesOutput: expectedLine !== departureLine,
    example: d.example, expectedLine, departureLine,
    diffs: Object.fromEntries(["base", "hard"].map((v) => [v, Object.fromEntries(Object.entries(r.sets[v]).filter(([, x]) => !x.match).map(([s, x]) => [s, x.diffs]))])),
  });
}

console.table(results.map((r) => ({ id: r.id, base: r.survivesBase, hard: r.survivesHard, exampleDiffers: r.exampleChangesOutput, caughtBy: r.caughtBy.join("; ") })));
for (const r of results) {
  console.log(`\n== ${r.id}: ${r.description}`);
  console.log("   example:   ", JSON.stringify(r.example));
  console.log("   expected:  ", r.expectedLine);
  console.log("   departure: ", r.departureLine);
  for (const v of ["base", "hard"]) for (const [s, diffs] of Object.entries(r.diffs[v])) for (const q of diffs) console.log(`   caught ${v}/${s} seq ${q.seq}:\n     exp ${q.expected}\n     got ${q.got}`);
}
writeFileSync(new URL("./results.json", import.meta.url), JSON.stringify(results, null, 2) + "\n");
console.log(`\n${results.length} departures run; results.json written`);
