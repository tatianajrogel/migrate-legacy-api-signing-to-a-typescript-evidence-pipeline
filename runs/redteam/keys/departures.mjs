// Lens "keys": departures in how the x-gw-key-id header and the key files are
// handled. Each departure is one switch in keyEvidence(); with every switch at
// its default the function reproduces the 8 approved hashes (checked first).
//
// Usage: node departures.mjs
import path from "node:path";
import { canonical, CORRECT, SCHEME, sha256, hmac, splitTarget, ROSTER } from "file:///C:/expert/migrate-legacy-api-signing-to-a-typescript-evidence-pipeline/analysis/scheme.mjs";
import { KEYS, runDeparture, compare, selfCheck, reference } from "./harness.mjs";

const DEFAULTS = {
  header_name_match: "any-case",       // | "exact-X-GW-Key-Id" | "exact-lowercase"
  key_id_value: "trimmed",             // | "verbatim"
  duplicate_header: "first",           // | "last"
  empty_value: "missing",              // | "present"
  key_lookup: "roster-then-file",      // | "resolve-path-then-roster"
  key_id_case: "exact",                // | "any-case"
  auth_key_id_case: "exact",           // | "any-case"
  key_bytes: "strip-all-trailing-crlf",// | "strip-one-lf" | "trimEnd" | "trim" | "verbatim"
  missing_roster_file: "unknown-key-id", // | "throw"
};

function findHeaders(rec, wanted, opts) {
  return rec.headers.filter(([n]) => {
    if (opts.header_name_match === "exact-X-GW-Key-Id") return n === "X-GW-Key-Id";
    if (opts.header_name_match === "exact-lowercase") return n === "x-gw-key-id";
    return n.toLowerCase() === wanted;
  });
}

function keyIdOf(rec, opts) {
  const hits = findHeaders(rec, "x-gw-key-id", opts);
  if (hits.length === 0) return { present: false, value: "" };
  const hit = opts.duplicate_header === "last" ? hits[hits.length - 1] : hits[0];
  const value = opts.key_id_value === "verbatim" ? hit[1] : hit[1].trim();
  return { present: true, value };
}

export function keyBytes(raw, option) {
  if (option === "verbatim") return raw;
  if (option === "strip-one-lf") return raw[raw.length - 1] === 0x0a ? raw.subarray(0, raw.length - 1) : raw;
  if (option === "trimEnd") return Buffer.from(raw.toString("utf8").trimEnd(), "utf8");
  if (option === "trim") return Buffer.from(raw.toString("utf8").trim(), "utf8");
  let end = raw.length;
  while (end > 0 && (raw[end - 1] === 0x0a || raw[end - 1] === 0x0d)) end--;
  return raw.subarray(0, end);
}

function resolveKey(keyId, opts, keyFiles) {
  let id = keyId;
  if (opts.key_id_case === "any-case") id = keyId.toLowerCase();
  if (opts.key_lookup === "resolve-path-then-roster") {
    // An agent that builds the file path first, then checks the resolved file
    // against the roster: readFileSync(path.resolve(KEY_DIR, `${keyId}.key`)).
    const resolved = path.posix.resolve("/app/keys", `${id}.key`);
    const dir = path.posix.dirname(resolved);
    const base = path.posix.basename(resolved);
    if (dir !== "/app/keys" || !base.endsWith(".key")) return null;
    id = base.slice(0, -4);
  }
  if (!ROSTER.includes(id)) return null;
  if (!keyFiles.has(id)) {
    if (opts.missing_roster_file === "throw") throw new Error(`ENOENT /app/keys/${id}.key`);
    return null;
  }
  return keyBytes(keyFiles.get(id), opts.key_bytes);
}

function authOf(rec) {
  const hit = rec.headers.find(([n]) => n.toLowerCase() === "authorization");
  return hit ? hit[1].trim() : null;
}

export function keyEvidence(rec, seq, variant, overrides = {}, keyFiles = KEYS[variant]) {
  const opts = { ...DEFAULTS, ...overrides };
  const { present, value: keyId } = keyIdOf(rec, opts);
  const text = canonical(rec, CORRECT);
  const ev = {
    seq,
    key_id: keyId,
    method: rec.method.toUpperCase(),
    path: splitTarget(rec.target)[0],
    outcome: "signed",
    signature: "",
    canonical_sha256: sha256(text),
  };
  const missing = opts.empty_value === "present" ? !present : keyId === "";
  if (missing) return { ...ev, outcome: "rejected", reason: "missing-key-id" };
  const key = resolveKey(keyId, opts, keyFiles);
  if (key === null) return { ...ev, outcome: "rejected", reason: "unknown-key-id" };
  ev.signature = hmac(key, text);
  const auth = authOf(rec);
  if (auth === null) return ev;
  const prefix = `${SCHEME} keyId=${keyId}, signature=`;
  let wellFormed = auth.startsWith(prefix);
  if (opts.auth_key_id_case === "any-case") {
    const m = /^GW-HMAC-SHA256 keyId=([^,]*), signature=/.exec(auth);
    wellFormed = m !== null && m[1].toLowerCase() === keyId.toLowerCase();
  }
  if (!wellFormed) return { ...ev, outcome: "rejected", reason: "malformed-authorization" };
  const presented = opts.auth_key_id_case === "any-case"
    ? auth.replace(/^GW-HMAC-SHA256 keyId=[^,]*, signature=/, "").trim()
    : auth.slice(prefix.length).trim();
  return presented === ev.signature
    ? { ...ev, outcome: "verified" }
    : { ...ev, outcome: "rejected", reason: "signature-mismatch" };
}

const dep = (overrides) => (rec, seq, variant) => keyEvidence(rec, seq, variant, overrides);
const H = (id, extra = []) => ({ method: "POST", target: "/k/t?b=2&a=1", headers: [["X-GW-Key-Id", id], ["Host", "k.example"], ...extra], body: "{}" });

const results = {};

if (!selfCheck()) { console.log("harness broken"); process.exit(1); }
results.sanity = runDeparture("D0 keyEvidence with defaults (sanity)", dep({}));

// D1: header NAME matched case-sensitively. instruction.md never names the
// header or says how its name is matched; the dossier (GW-034) does.
results.D1a = runDeparture("D1a header name matched exactly 'X-GW-Key-Id'", dep({ header_name_match: "exact-X-GW-Key-Id" }));
results.D1b = runDeparture("D1b header name matched exactly 'x-gw-key-id'", dep({ header_name_match: "exact-lowercase" }));
compare("D1a", { method: "GET", target: "/v2/health", headers: [["x-gw-key-id", "gw-prod-02"], ["host", "gw.example.com"]] }, dep({ header_name_match: "exact-X-GW-Key-Id" }), ["base"]);

// D2: key id value used verbatim (as GW-034 says) instead of trimmed (as the
// reference does).
results.D2 = runDeparture("D2 key id value verbatim, not trimmed", dep({ key_id_value: "verbatim" }));
compare("D2-spaces", H(" gw-prod-01 "), dep({ key_id_value: "verbatim" }));
compare("D2-tab-newline", H("gw-prod-01\t\n"), dep({ key_id_value: "verbatim" }), ["base"]);
compare("D2-verify", H(" gw-prod-01", [["Authorization", `${SCHEME} keyId= gw-prod-01, signature=x`]]), dep({ key_id_value: "verbatim" }), ["base"]);

// D3: duplicate x-gw-key-id headers, last one wins (an Object.fromEntries /
// Map built from the header list does this).
results.D3 = runDeparture("D3 duplicate x-gw-key-id: last wins", dep({ duplicate_header: "last" }));
compare("D3", { method: "POST", target: "/k/dup", headers: [["X-GW-Key-Id", "gw-prod-01"], ["Host", "k.example"], ["x-gw-key-id", "gw-prod-02"]], body: "{}" }, dep({ duplicate_header: "last" }));
compare("D3-unknown-then-roster", { method: "POST", target: "/k/dup", headers: [["X-GW-Key-Id", "gw-nope-00"], ["X-GW-Key-Id", "gw-prod-01"]], body: "{}" }, dep({ duplicate_header: "last" }), ["base"]);

// D4: header present with an empty (or whitespace-only) value counts as a key
// id that was given, so unknown-key-id rather than missing-key-id.
results.D4 = runDeparture("D4 empty x-gw-key-id value counts as present (unknown-key-id)", dep({ empty_value: "present" }));
compare("D4-empty", H(""), dep({ empty_value: "present" }));
compare("D4-spaces", H("   "), dep({ empty_value: "present" }), ["base"]);
compare("D4-spaces-verbatim", H("   "), dep({ empty_value: "present", key_id_value: "verbatim" }), ["base"]);

// D5: path built from the key id first, roster checked on the resolved file.
results.D5 = runDeparture("D5 resolve /app/keys/<id>.key then check basename against roster", dep({ key_lookup: "resolve-path-then-roster" }));
compare("D5-dotdot", H("../keys/gw-prod-01"), dep({ key_lookup: "resolve-path-then-roster" }));
compare("D5-dot", H("./gw-prod-02"), dep({ key_lookup: "resolve-path-then-roster" }), ["base"]);
compare("D5-abs", H("/app/keys/gw-prod-01"), dep({ key_lookup: "resolve-path-then-roster" }), ["base"]);

// D6: roster key id matched in any case (ci mutant key-id-any-case; listed as a
// hard-variant mutant). Checked here per variant.
results.D6 = runDeparture("D6 key id matched in any case (lowercased)", dep({ key_id_case: "any-case" }));
compare("D6", H("GW-PROD-01"), dep({ key_id_case: "any-case" }));

// D7: key file line endings. The real files are 32 bytes + LF so every reader
// agrees on them; shown on synthetic contents below.
for (const kb of ["strip-one-lf", "trimEnd", "trim", "verbatim"]) {
  results[`D7-${kb}`] = runDeparture(`D7 key bytes: ${kb}`, dep({ key_bytes: kb }));
}
console.log("\n   [D7] key bytes each reader yields on synthetic key file contents (hex):");
const K32 = "k1secretmaterial0123456789abcdef";
for (const [label, content] of [["LF", K32 + "\n"], ["CRLF", K32 + "\r\n"], ["none", K32], ["LFLF", K32 + "\n\n"], ["leading-space+LF", " " + K32 + "\n"]]) {
  const raw = Buffer.from(content, "latin1");
  const row = ["strip-all-trailing-crlf", "strip-one-lf", "trimEnd", "trim", "verbatim"].map((o) => `${o}=${keyBytes(raw, o).length}B`).join(" ");
  console.log(`   [D7] file ${label.padEnd(17)} ${row}`);
}

// D8: a roster key whose file is missing or unreadable. Reference: unknown-key-id.
results.D8 = runDeparture("D8 missing roster key file throws", dep({ missing_roster_file: "throw" }));
{
  const noP02 = new Map(KEYS.base); noP02.delete("gw-prod-02");
  const rec = H("gw-prod-02");
  const ref = JSON.stringify(reference(rec, 1, "base"));
  let unk, thr;
  try { unk = JSON.stringify(keyEvidence(rec, 1, "base", {}, noP02)); } catch (e) { unk = "THROWS " + e.message; }
  try { thr = JSON.stringify(keyEvidence(rec, 1, "base", { missing_roster_file: "throw" }, noP02)); } catch (e) { thr = "THROWS " + e.message; }
  console.log(`   [D8] gw-prod-02.key present:            ${ref}`);
  console.log(`   [D8] gw-prod-02.key missing, reference: ${unk}`);
  console.log(`   [D8] gw-prod-02.key missing, departure: ${thr}`);
}

// D9: keyId inside the Authorization header compared to the record's key id
// without regard to case.
results.D9 = runDeparture("D9 Authorization keyId compared to record key id in any case", dep({ auth_key_id_case: "any-case" }));
{
  const sig = reference(H("gw-prod-01"), 1, "base").signature;
  compare("D9", H("gw-prod-01", [["Authorization", `${SCHEME} keyId=GW-PROD-01, signature=${sig}`]]), dep({ auth_key_id_case: "any-case" }), ["base"]);
}

// D10: combined: verbatim value + any-case (an agent that normalises nothing
// but lowercases for lookup) is just D2+D6; skip. Instead: header name matched
// after trimming it (" X-GW-Key-Id ").
results.D10 = runDeparture("D10 header name trimmed before matching", (rec, seq, variant) =>
  keyEvidence({ ...rec, headers: rec.headers.map(([n, v]) => [n.trim(), v]) }, seq, variant));
compare("D10", { method: "POST", target: "/k/n", headers: [[" X-GW-Key-Id ", "gw-prod-01"], ["Host", "k.example"]], body: "{}" }, (rec, seq, variant) =>
  keyEvidence({ ...rec, headers: rec.headers.map(([n, v]) => [n.trim(), v]) }, seq, variant), ["base"]);

console.log("\n== summary");
for (const [k, v] of Object.entries(results)) console.log(`   ${k.padEnd(22)} ${v.survives ? "SURVIVES" : "caught  "} ${Object.entries(v.perSet).filter(([, s]) => s === "DIFF").map(([n]) => n).join(",")}`);
