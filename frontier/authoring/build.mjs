// Builds everything the frontier variant ships that is not code: the dossier,
// the captures, the sample request set, and the evidence manifest the analysis
// tools read.
//
// The scheme the agent has to end up with is the base task's, byte for byte.
// What changes is what the documents demand of the reader.
//
// In the hard variant the real decisions were written by hand and everything
// around them was generated, and agents told the 2 apart in a few commands:
// generated sentences collapse into templates, hand-written headings occur
// once. Here every decision, real or not, comes out of the same grammar. The
// dossier follows 5 signers through the same 11 sessions. One of them is the
// scheme being migrated. The other 4 are decided on in the same words, under
// the same headings, in the same meetings, and often decide the opposite.
//
// On top of that, the real scheme's history needs more than one document:
//
//   - a change that only says "in line with the export signer", so the rule
//     itself is in the export signer's history
//   - a change agreed on condition of something recorded in an appendix
//   - a change agreed "effective with SDK 3.3", which shipped after rollout
//   - minutes that recorded an item under the wrong signer and were corrected
//     at a later session, in both directions
//   - a signed record in the sample that is genuine and stale: it was signed
//     on 2025-11-20 under the rules in force that day, so it must be rejected
//
// Everything is derived from one table of events. The state of any signer on
// any day is computed by replaying that table, and this script refuses to
// write anything unless the migrated scheme's state on rollout day is exactly
// the reference solution's. The stale record is signed with the state the same
// replay gives for its own date.
//
// Usage: node frontier/authoring/build.mjs

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CORRECT, SCHEME, evidence } from "../../analysis/scheme.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTIER = join(HERE, "..");
const ROOT = join(FRONTIER, "..");
const APP = join(FRONTIER, "environment", "app");
const DOSSIER = join(APP, "dossier");

const ROLLOUT = "2025-12-09";
const STALE = "2025-11-20";
const FRESH = "2025-12-08";

// ---------------------------------------------------------------------------
// Randomness, fixed.
// ---------------------------------------------------------------------------

function rngFrom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = rngFrom(20251209);
const pick = (xs) => xs[Math.floor(rand() * xs.length)];
const int = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const shuffle = (xs) => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const upperFirst = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);

// ---------------------------------------------------------------------------
// The cast.
// ---------------------------------------------------------------------------

const MEETINGS = [
  { id: "02", date: "2025-09-30", slug: "kickoff", title: "migration kickoff" },
  { id: "03", date: "2025-10-07", slug: "scope", title: "scope review" },
  { id: "04", date: "2025-10-14", slug: "sync", title: "signing sync" },
  { id: "05", date: "2025-10-21", slug: "canonicalisation", title: "canonicalisation note" },
  { id: "06", date: "2025-10-28", slug: "sync", title: "signing sync" },
  { id: "07", date: "2025-11-04", slug: "gateway", title: "gateway sync" },
  { id: "08", date: "2025-11-11", slug: "sync", title: "signing sync" },
  { id: "09", date: "2025-11-18", slug: "addendum", title: "addendum" },
  { id: "10", date: "2025-11-25", slug: "partner", title: "partner review" },
  { id: "11", date: "2025-12-02", slug: "scheme-freeze", title: "scheme freeze" },
  { id: "12", date: "2025-12-09", slug: "rollout", title: "rollout" },
];
const DATES = MEETINGS.map((m) => m.date);

const PEOPLE = [
  "A. Nakamura", "M. Lindqvist", "K. Mwangi", "R. Okonkwo", "D. Achterberg",
  "J. Delacroix", "S. Varga", "L. Fontaine", "T. Bergstrom", "P. Oyelaran",
];
const PARTNERS = ["Globex", "Initech", "Umbrella", "Contoso", "Northwind"];
const SERVICES = [
  "orders", "catalog", "payouts", "ledger", "disputes", "settlement",
  "refunds", "onboarding", "reconciliation", "webhooks",
];
const TEAMS = [
  "edge-platform", "identity", "billing", "fraud-ops", "sre-core",
  "partner-integrations", "payments-api", "data-plane",
];
const HOSTS = ["gw-edge-01", "gw-edge-02", "gw-edge-03", "gw-edge-04"];

// The 5 signers. Only GW is being migrated. Every alias is listed in the
// kickoff note, so a reader can always tell which signer a passage is about.
const SCHEMES = {
  GW: { formal: "GW-HMAC-SHA256", aliases: ["inbound request signing", "the gateway request scheme", "partner request signing", "GW-HMAC-SHA256"], prefix: "x-gw-", token: "UNSIGNED", what: "requests partners send to the gateway" },
  WH: { formal: "WH-HMAC-SHA256", aliases: ["outbound webhook signing", "the webhook signer", "callback signing", "WH-HMAC-SHA256"], prefix: "x-wh-", token: "EMPTY", what: "webhook deliveries we send to partners" },
  BX: { formal: "BX-HMAC-SHA256", aliases: ["export manifest signing", "the export signer", "batch manifest signing", "BX-HMAC-SHA256"], prefix: "x-bx-", token: "NONE", what: "the manifest requests of the nightly settlement export" },
  MS: { formal: "MS-HMAC-SHA256", aliases: ["service mesh signing", "the mesh signer", "internal service signing", "MS-HMAC-SHA256"], prefix: "x-ms-", token: "NOBODY", what: "calls between our own services" },
  AD: { formal: "AD-HMAC-SHA256", aliases: ["admin API signing", "the admin signer", "ops tooling signing", "AD-HMAC-SHA256"], prefix: "x-ad-", token: "BLANK", what: "requests from ops tooling to the admin API" },
};
const DECOYS = ["WH", "BX", "MS", "AD"];

// Every rule dimension, the forms it can take, and how each form is stated.
// A statement is a full clause, so it reads the same after "Agreed: for X,",
// "asked that for X" and "From now".
const DIMS = {
  header_values: {
    rule: "header_values",
    np: "treatment of header values",
    topics: ["Header values", "Header value spacing"],
    leads: [
      "{partner}'s client pads some header values and the 2 sides end up hashing different bytes.",
      "{person} compared what clients send with what arrives, and the spacing of header values differs between the 2.",
      "Header value spacing came up again from {partner}.",
      "{partner} reported mismatches on requests whose header values carry runs of spaces.",
      "{person} reran the comparison between what clients send and what arrives. Any value a client wraps or pads comes out of the fronting proxy with different spacing inside as well as at the ends.",
    ],
    values: {
      raw: () => "header values go into the header block exactly as received, byte for byte",
      trimmed: () => "spaces and tabs are stripped from each end of every header value and the inside of the value is left as it is",
      folded: () => "spaces and tabs are stripped from each end of every header value and every run of spaces and tabs inside it is collapsed to a single space",
      "folded-lower": () => "header values are stripped and collapsed and then lowercased",
    },
  },
  query_order: {
    rule: "query_order",
    np: "query parameter ordering",
    topics: ["Query ordering", "Repeated query names"],
    leads: [
      "{partner} reported intermittent mismatches on requests that repeat a parameter name.",
      "{person} traced a batch of failures to the order of repeated query parameters.",
      "Ordering of repeated parameters was raised by {partner}.",
      "{person} traced the intermittent mismatches on the nightly export to repeated parameter names. Past the load balancer the order of repeated parameters is no longer the order the client sent.",
      "3 client libraries were run against the current ordering and they disagree with each other on requests that repeat a name.",
    ],
    values: {
      "name-only": () => "query parameters are ordered by name only, and parameters that share a name keep the order they arrived in",
      "name-then-value": () => "query parameters are ordered by name and then by value, both compared byte by byte on the text exactly as it appears in the target, with nothing decoded",
      "name-then-decoded-value": () => "query parameters are ordered by name and then by value, with each value percent-decoded before it is compared",
    },
  },
  signed_headers: {
    rule: "signed_headers",
    np: "signed header set",
    topics: ["Signed header set", "Which headers are signed"],
    leads: [
      "{person} raised that a header outside the signed set can be changed in transit without anyone noticing.",
      "{partner} asked which headers a signature actually covers.",
      "The signed set came up while preparing the threat review.",
      "{person} previewed the December threat review. A request's `content-type` can be swapped in transit without invalidating the signature.",
      "The threat review did not accept a list of protected headers. Any header left outside the signed set is a header an intermediary can change.",
    ],
    values: {
      "prefix-only": (s) => `only the \`${s.prefix}*\` header family is signed`,
      "prefix-ct": (s) => `the \`${s.prefix}*\` header family and \`content-type\` are signed, and nothing else`,
      "fixed-list": (s) => `\`host\`, \`content-type\` and the \`${s.prefix}*\` family are signed, and nothing else`,
      "all-but-auth": () => "every header on the request is signed, whatever its name, except `authorization`",
      "all-but-forwarding": () => "every header is signed except `authorization`, `via` and `x-forwarded-for`",
    },
  },
  body_hash: {
    rule: "body_hash",
    np: "body-hash field for requests with nothing to hash",
    topics: ["Body hash", "Empty bodies"],
    leads: [
      "{partner} hit failures on requests that carry no body.",
      "{person} asked what the body-hash field holds when there is nothing to hash.",
      "Empty bodies came up again from {partner}.",
      "{person} asked what counts as an empty body. The old signer could not tell a missing body from a zero length one; the new record format can.",
      "Debugging around the empty-body token has cost more than the token ever saved.",
    ],
    values: {
      "sentinel-both": (s) => `a request whose body is empty or absent puts the token \`${s.token}\` in the body-hash field`,
      "sentinel-absent": (s) => `a request with no body at all puts the token \`${s.token}\` in the body-hash field, and a body of zero length is hashed like any other body`,
      always: () => "the body-hash field is always the lowercase hex SHA-256 of the body bytes, and a request with no body is treated as a body of zero length",
    },
  },
  terminator: {
    rule: "trailing_newline",
    np: "end of the string to sign",
    topics: ["String terminator", "End of the string to sign"],
    leads: [
      "{person} compared the design doc line by line with what the signer hands to HMAC.",
      "{partner} asked whether the string to sign ends with a line break.",
      "The last byte of the string to sign was questioned by {person}.",
      "{person} found that the line break shown after the last field in the design doc was an artefact of how the example had been pasted.",
      "{partner}'s implementation and ours disagree on the last byte of the string to sign.",
    ],
    values: {
      lf: () => "the string to sign ends with a line feed after the last field",
      none: () => "the string to sign ends at the last character of the last field, with nothing after it",
    },
  },
  escapes: {
    rule: "percent_escapes",
    np: "case of percent escapes",
    topics: ["Escapes in the target", "Percent escapes"],
    leads: [
      "{partner}'s SDK emits lowercase percent escapes.",
      "{person} asked whether percent escapes survive the fronting proxy unchanged.",
      "Escape case was raised by {partner}.",
      "{person} raised that 2 client libraries emit lowercase percent escapes and the fronting proxy might be rewriting them.",
      "{partner} reported failures on targets that carry percent escapes.",
    ],
    values: {
      "as-received": () => "percent escapes in the path and the query are signed in the case they arrive in",
      uppercased: () => "the hex digits of every percent escape in the path and the query are uppercased before signing",
    },
  },
  valueless: {
    rule: "valueless_parameter",
    np: "form of query parameters that have no value",
    topics: ["Valueless parameters", "Parameters with no value"],
    leads: [
      "{partner}'s client writes a parameter that has no value as the bare name.",
      "{person} raised parameters that arrive without an equals sign.",
      "Flags in the query string came up from {partner}.",
      "{partner}'s client writes `?flag` where ours writes `?flag=`, and the 2 sides sign different strings.",
      "{person} asked what the canonical query does with a name that has no value.",
    ],
    values: {
      "trailing-equals": () => "a query parameter with no `=` is written with a trailing `=`",
      bare: () => "a query parameter with no `=` is written as the bare name, with no `=`",
    },
  },
  path: {
    rule: "path",
    np: "path handling",
    topics: ["Path handling", "Dot segments"],
    leads: [
      "{partner}'s router emits targets with dot segments in them.",
      "{person} raised paths that contain `/./`.",
      "Path tidying by intermediaries was raised by {partner}.",
      "{partner}'s router emits targets such as `/v2/./orders` and their signatures fail whenever something in between tidies the path.",
      "Older client libraries cannot collapse dot segments, which {person} raised as a constraint.",
    ],
    values: {
      "as-received": () => "the path is signed exactly as it arrives, with no normalisation of any kind",
      "dots-collapsed": () => "dot segments in the path are collapsed before signing",
    },
  },
  key_id_match: {
    rule: "key_id_match",
    np: "key id matching",
    topics: ["Key ids", "Key id matching"],
    leads: [
      "{partner}'s integration upper-cases every header value it controls, key ids included.",
      "{person} raised key ids that arrive in the wrong case.",
      "Case of key ids came up from {partner}.",
      "{partner}'s requests are rejected as unknown because their key ids arrive in upper case.",
      "{person} asked whether a key id is compared as text or folded first.",
    ],
    values: {
      exact: () => "the key id is matched exactly as sent",
      "any-case": () => "the key id is matched without regard to case",
    },
  },
  names_join: {
    rule: "names_join",
    np: "separator of the signed header name list",
    topics: ["Name list separator", "Signed name list"],
    leads: [
      "{person} would like the SDKs to share the code that builds the signed name list.",
      "{partner} asked how the signed header names are separated.",
      "The name list separator was raised by {person}.",
      "{person} raised that the client libraries build the signed name list in 2 different ways.",
      "{partner} hit a mismatch that came down to the separator in the signed name list.",
    ],
    values: {
      semicolon: () => "the signed header names are joined with `;`",
      comma: () => "the signed header names are joined with `,`",
    },
  },
  // The migrated scheme's key loading is settled by the captures, not by any
  // document. The other signers' is minuted like everything else.
  key_loading: {
    rule: "key_bytes",
    np: "loading of the key file",
    topics: ["Key loading", "Key files"],
    leads: [
      "{person} asked how the signer reads its key file.",
      "Key file handling came up during the rotation rehearsal.",
      "{partner} asked whether a line ending in a key file matters.",
      "{person} found 2 code paths that read the key file differently.",
      "The rotation rehearsal turned up a key file written with a different line ending.",
    ],
    values: {
      whole: () => "the key file is used whole, line ending included",
      stripped: () => "the line ending is stripped from the key file before the key is used",
    },
  },
};

// What the decision register says for the migrated scheme. It is the starter.
const GW_REGISTER = {
  header_values: "raw", query_order: "name-only", signed_headers: "prefix-only",
  body_hash: "sentinel-both", terminator: "lf", escapes: "as-received",
  valueless: "trailing-equals", path: "as-received", key_id_match: "exact",
  names_join: "semicolon",
};

// What the reference solution implements, in this script's vocabulary.
const GW_FINAL = {
  header_values: "folded", query_order: "name-then-value", signed_headers: "all-but-auth",
  body_hash: "always", terminator: "none", escapes: "as-received",
  valueless: "trailing-equals", path: "as-received", key_id_match: "exact",
  names_join: "semicolon",
};

// This script's vocabulary to the switch names in analysis/scheme.mjs.
const TO_OPTION = {
  header_values: { raw: "raw", trimmed: "trimmed", folded: "folded", "folded-lower": "folded-lowercased" },
  query_order: { "name-only": "name-only", "name-then-value": "name-then-value", "name-then-decoded-value": "name-then-decoded-value" },
  signed_headers: { "prefix-only": "x-gw-only", "prefix-ct": "x-gw-plus-content-type", "all-but-auth": "all-but-authorization", "all-but-forwarding": "all-but-forwarding" },
  body_hash: { "sentinel-both": "unsigned-when-empty-or-absent", "sentinel-absent": "unsigned-when-absent", always: "always-sha256" },
  terminator: { lf: "lf", none: "none" },
  escapes: { "as-received": "as-received", uppercased: "uppercased" },
  valueless: { "trailing-equals": "trailing-equals", bare: "bare" },
  path: { "as-received": "as-received", "dots-collapsed": "dot-segments-resolved" },
  key_id_match: { exact: "exact", "any-case": "any-case" },
  names_join: { semicolon: "semicolon", comma: "comma" },
};

const MILESTONES = {
  "SDK 3.2": "2025-11-03",
  "SDK 3.2.1": "2025-12-01",
  "SDK 3.3": "2026-01-13",
  "receiver kit 2.0": "2025-11-28",
  "export client 1.4": "2025-12-18",
  "mesh sidecar 0.9": "2025-11-20",
  "admin CLI 2.2": "2026-02-03",
};
// Release candidates are listed in the calendar next to general availability.
// The kickoff note says which of the 2 dates an "effective with" item means.
const RELEASE_CANDIDATE = {
  "SDK 3.2": "2025-10-20",
  "SDK 3.2.1": "2025-11-21",
  "SDK 3.3": "2025-12-05",
  "receiver kit 2.0": "2025-11-10",
  "export client 1.4": "2025-12-04",
  "mesh sidecar 0.9": "2025-11-06",
  "admin CLI 2.2": "2026-01-12",
};
const MILESTONE_OF = { GW: ["SDK 3.3"], WH: ["receiver kit 2.0"], BX: ["export client 1.4"], MS: ["mesh sidecar 0.9"], AD: ["admin CLI 2.2"] };

// ---------------------------------------------------------------------------
// The events. The migrated scheme's are written out; the others are drawn.
// ---------------------------------------------------------------------------

const events = [];
let nextId = 1;
function add(scheme, dim, date, type, extra = {}) {
  const e = { id: `e${nextId++}`, scheme, dim, date, type, ...extra };
  events.push(e);
  return e;
}

// The migrated scheme's history. None of these items carries a sentence of its
// own: lead-ins, tails and reasons come from the same pools as every other
// signer's, so nothing but the meaning sets them apart.

// header values: the ends stripped, then the inside collapsed. The second item
// was minuted under the webhook signer and corrected a week later, so the
// rule's own text never appears under this scheme's name.
add("GW", "header_values", "2025-10-14", "set", { value: "trimmed", role: "introduces" });
add("GW", "header_values", "2025-11-04", "set", { value: "folded", recorded_as: "WH", role: "decides" });
add("GW", "header_values", "2025-11-11", "correction", { of: "2025-11-04", wrong: "WH", right: "GW", role: "resolves" });
// Lowercasing after folding: agreed subject to a load test with a limit at
// p99. The test passed at p95 and failed at p99.
add("GW", "header_values", "2025-11-25", "conditional", { value: "folded-lower", role: "challenge", option: "folded-lowercased", fact_role: "challenge", fact: { kind: "load", truth: false, limit: 2, p95: 1.4, measured: 2.6, resolved_on: "2025-12-01" } });

// query ordering: never stated for this scheme at all. It is brought in line
// with the export signer's "as it stands today", and the export signer's own
// rule that day had been brought in line with the mesh signer's a fortnight
// before. Both of those signers moved on to decoded values afterwards, which
// does not follow through.
add("MS", "query_order", "2025-09-30", "set", { value: "name-only" });
add("MS", "query_order", "2025-10-14", "set", { value: "name-then-value", role: "resolves", supports: "query_order" });
add("MS", "query_order", "2025-11-04", "set", { value: "name-then-decoded-value", role: "introduces", supports: "query_order", option: "name-then-decoded-value" });
add("BX", "query_order", "2025-10-07", "set", { value: "name-only" });
add("BX", "query_order", "2025-10-28", "align", { with: "MS", role: "resolves", supports: "query_order" });
add("BX", "query_order", "2025-11-25", "set", { value: "name-then-decoded-value", role: "introduces", supports: "query_order", option: "name-then-decoded-value" });
add("GW", "query_order", "2025-11-11", "align", { with: "BX", role: "decides" });
add("GW", "query_order", "2025-12-09", "decline", { value: "name-then-decoded-value", partner: "Umbrella", role: "challenge" });

// signed header set: a stopgap, then everything, on condition of sign-off by
// all 5 partners. The sign-off register lists each partner's date.
add("GW", "signed_headers", "2025-11-18", "set", { value: "prefix-ct", role: "introduces" });
add("GW", "signed_headers", "2025-12-02", "conditional", { value: "all-but-auth", role: "decides", fact: { kind: "signoff", truth: true, deadline: "2025-12-05", resolved_on: "2025-12-04", dates: { Globex: "2025-12-03", Initech: "2025-12-04", Umbrella: "2025-12-03", Contoso: "2025-12-04", Northwind: "2025-12-04" } } });
add("GW", "signed_headers", "2025-12-09", "decline", { value: "all-but-forwarding", partner: "Initech", role: "introduces", option: "all-but-forwarding" });

// body hash: the token narrowed, then removed effective with a release that
// did ship before rollout. An agent that ignores every "effective with" item
// keeps the token.
add("GW", "body_hash", "2025-10-21", "set", { value: "sentinel-absent", role: "introduces" });
add("GW", "body_hash", "2025-11-25", "later", { value: "always", milestone: "SDK 3.2.1", role: "decides" });

// string terminator: one plain item, at the freeze. The fresh signed record in
// the sample pins it in any case.
add("GW", "terminator", "2025-12-02", "set", { value: "none", role: "decides" });

// Register entries that were challenged and stand.
add("GW", "escapes", "2025-10-21", "conditional", { value: "uppercased", role: "introduces", option: "uppercased", fact: { kind: "proxy", truth: false, resolved_on: "2025-11-03" } });
add("GW", "valueless", "2025-11-04", "trial", { value: "bare", review: "the freeze", role: "introduces", option: "bare" });
add("GW", "valueless", "2025-12-02", "backout", { of: "2025-11-04", role: "decides" });
add("GW", "path", "2025-11-11", "later", { value: "dots-collapsed", milestone: "SDK 3.3", role: "introduces", option: "dot-segments-resolved" });
// Key ids in any case: agreed subject to sign-off by all 5 partners by a
// deadline. All 5 did sign before rollout. One signed 2 days after the deadline.
add("GW", "key_id_match", "2025-11-25", "conditional", { value: "any-case", role: "introduces", option: "any-case", fact: { kind: "signoff", truth: false, deadline: "2025-12-01", resolved_on: "2025-12-03", dates: { Globex: "2025-11-28", Initech: "2025-11-27", Umbrella: "2025-11-30", Contoso: "2025-11-28", Northwind: "2025-12-03" } } });
add("GW", "names_join", "2025-11-04", "propose", { value: "comma", role: "introduces", option: "comma", parked: "the client library team has looked at the cost" });
add("GW", "names_join", "2025-11-18", "withdraw", { of: "2025-11-04", value: "comma", role: "challenge" });
// The mesh signer's move to a comma was minuted under this scheme, and the
// correction at the freeze is the only thing that takes it back.
add("MS", "names_join", "2025-10-07", "set", { value: "semicolon" });
add("MS", "names_join", "2025-11-25", "set", { value: "comma", recorded_as: "GW", role: "introduces", supports: "names_join", option: "comma" });
add("GW", "names_join", "2025-12-02", "correction", { of: "2025-11-25", wrong: "GW", right: "MS", role: "decides" });

// The webhook signer as the hard variant described it.
add("WH", "header_values", "2025-09-30", "set", { value: "raw" });
add("WH", "terminator", "2025-09-30", "set", { value: "lf" });
add("WH", "names_join", "2025-09-30", "set", { value: "comma" });
add("WH", "key_loading", "2025-10-07", "set", { value: "whole" });

// Everything else about the other signers is drawn from a few chain shapes,
// the same shapes the migrated scheme's history is made of.
const SHAPES = [
  ["set"], ["set", "set"], ["set", "trial", "backout"], ["set", "trial", "confirm"],
  ["set", "propose", "withdraw"], ["set", "decline"], ["set", "conditional"],
  ["set", "later"], ["set", "propose"], ["set", "set", "decline"], ["set", "align"],
  ["set", "conditional", "decline"], ["set", "set", "later"],
  // Alignments are how the migrated scheme's query ordering is settled, so the
  // other signers get their share of them.
  ["set", "align"], ["set", "set", "align"], ["set", "align", "set"], ["set", "align", "decline"],
];
const fixed = new Set(events.map((e) => `${e.scheme}|${e.dim}`));
for (const scheme of DECOYS) {
  for (const dim of Object.keys(DIMS)) {
    if (fixed.has(`${scheme}|${dim}`)) continue;
    const forms = shuffle(Object.keys(DIMS[dim].values).filter((v) => v !== "all-but-forwarding"));
    const shape = pick(SHAPES);
    let at = int(0, 2);
    let form = 0;
    let trialDate = null;
    let proposal = null;
    shape.forEach((type, step) => {
      if (step > 0) at = Math.min(DATES.length - 1, at + int(1, 3));
      const date = DATES[at];
      const next = () => forms[(form = (form + 1) % forms.length)];
      if (type === "set") add(scheme, dim, date, "set", { value: step === 0 ? forms[0] : next() });
      else if (type === "trial") { trialDate = date; add(scheme, dim, date, "trial", { value: next(), review: "the next session but one" }); }
      else if (type === "backout") add(scheme, dim, date, "backout", { of: trialDate });
      else if (type === "confirm") add(scheme, dim, date, "confirm", { of: trialDate });
      else if (type === "propose") { proposal = { date, value: forms[(form + 1) % forms.length] }; add(scheme, dim, date, "propose", { value: proposal.value, parked: "there are numbers to look at" }); }
      else if (type === "withdraw") add(scheme, dim, date, "withdraw", { of: proposal.date, value: proposal.value });
      else if (type === "decline") add(scheme, dim, date, "decline", { value: forms[(form + 1) % forms.length], partner: pick(PARTNERS) });
      else if (type === "conditional") {
        const truth = rand() < 0.5;
        const kind = pick(["signoff", "load"]);
        const deadline = DATES[Math.min(DATES.length - 1, at + 1)];
        const shift = (days) => new Date(Date.parse(deadline) + 86400000 * days).toISOString().slice(0, 10);
        const late = pick(PARTNERS);
        const fact = kind === "signoff"
          ? { kind, truth, deadline, resolved_on: deadline, dates: Object.fromEntries(PARTNERS.map((q) => [q, !truth && q === late ? shift(int(1, 4)) : shift(-int(1, 3))])) }
          : { kind, truth, limit: int(2, 4), measured: 0, resolved_on: deadline };
        if (kind === "load") {
          fact.measured = truth ? fact.limit - int(2, 9) / 10 : fact.limit + int(2, 14) / 10;
          fact.p95 = Math.max(0.3, fact.measured - int(4, 12) / 10);
        }
        add(scheme, dim, date, "conditional", { value: next(), fact });
      } else if (type === "later") {
        const milestone = MILESTONE_OF[scheme][0];
        if (MILESTONES[milestone] > date) add(scheme, dim, date, "later", { value: next(), milestone });
        else add(scheme, dim, date, "set", { value: next() });
      } else if (type === "align") {
        // Only with a signer that has a rule on this subject by then, and no
        // item on it the same day, so "as it stands today" has one answer.
        const others = ["GW", ...DECOYS].filter((o) => o !== scheme
          && stateAt(o, dim, date) !== undefined
          && !events.some((x) => x.scheme === o && x.dim === dim && x.date === date));
        if (others.length > 0) add(scheme, dim, date, "align", { with: pick(others) });
        else add(scheme, dim, date, "set", { value: next() });
      }
    });
  }
}

// ---------------------------------------------------------------------------
// Replay: what a signer does on a given day.
// ---------------------------------------------------------------------------

function stateAt(scheme, dim, date, depth = 0) {
  if (depth > 6) throw new Error(`alignment loop at ${scheme} ${dim}`);
  let value = scheme === "GW" ? GW_REGISTER[dim] : undefined;
  let beforeTrial;
  const mine = events
    .filter((e) => e.scheme === scheme && e.dim === dim && e.date <= date)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  for (const e of mine) {
    if (e.type === "set") value = e.value;
    else if (e.type === "trial") { beforeTrial = value; value = e.value; }
    else if (e.type === "backout") value = beforeTrial;
    else if (e.type === "conditional") {
      if (e.fact.truth && e.fact.resolved_on <= date) value = e.value;
    } else if (e.type === "later") {
      if (MILESTONES[e.milestone] <= date) value = e.value;
    } else if (e.type === "align") {
      const theirs = stateAt(e.with, dim, e.date, depth + 1);
      if (theirs !== undefined && DIMS[dim].values[theirs]) value = theirs;
    }
  }
  return value;
}

// Minutes go wrong for the other signers too, at about the rate they do for the
// migrated one, so a correction is not a marker for it. Only items whose
// wording does not depend on the signer can be minuted under another.
const neutral = (e) => e.dim !== "signed_headers" && !(e.dim === "body_hash" && e.value !== "always");
let misminuted = 0;
for (const e of shuffle(events.filter((x) => DECOYS.includes(x.scheme) && x.type === "set" && !x.recorded_as && !x.role))) {
  if (misminuted >= 9) break;
  const at = DATES.indexOf(e.date);
  if (!neutral(e) || at >= DATES.length - 1) continue;
  const wrong = pick(DECOYS.filter((o) => o !== e.scheme));
  if (events.some((x) => x !== e && x.dim === e.dim && x.date === e.date && (x.recorded_as ?? x.scheme) === wrong)) continue;
  e.recorded_as = wrong;
  add(e.scheme, e.dim, DATES[Math.min(DATES.length - 1, at + int(1, 2))], "correction", { of: e.date, wrong, right: e.scheme });
  misminuted += 1;
}

// An alignment with a signer that has no rule yet says nothing. Drop those,
// and any alignment whose result this scheme's vocabulary cannot state.
for (let i = events.length - 1; i >= 0; i--) {
  const e = events[i];
  if (e.type !== "align") continue;
  const theirs = stateAt(e.with, e.dim, e.date);
  if (theirs === undefined || (e.scheme === "GW" && !TO_OPTION[e.dim]?.[theirs])) {
    if (e.scheme === "GW") throw new Error("the migrated scheme's alignment resolves to nothing");
    events.splice(i, 1);
  }
}

// A correction has to point at exactly one item: one decision on that subject,
// minuted under the signer it names, on the date it names. And the migrated
// scheme never has 2 items on one subject in one session, counting the ones
// minuted under it in error, so "the item of that date" is never ambiguous.
for (const c of events.filter((e) => e.type === "correction")) {
  const targets = events.filter((e) => e.type !== "correction" && e.date === c.of && e.dim === c.dim && (e.recorded_as ?? e.scheme) === c.wrong);
  if (targets.length !== 1) throw new Error(`correction of ${c.of} on ${c.dim} under ${c.wrong} points at ${targets.length} items`);
  if (targets[0].scheme !== c.right) throw new Error(`correction of ${c.of} on ${c.dim} names the wrong signer`);
}
const shownAsGw = new Map();
for (const e of events) {
  if ((e.recorded_as ?? e.scheme) !== "GW") continue;
  const k = `${e.dim}|${e.date}`;
  if (shownAsGw.has(k)) throw new Error(`2 items minuted for the migrated scheme on ${k}`);
  shownAsGw.set(k, e);
}
// Every item minuted under the wrong signer is corrected, or it would stand.
for (const e of events.filter((x) => x.recorded_as)) {
  const fixed = events.some((c) => c.type === "correction" && c.of === e.date && c.dim === e.dim && c.wrong === e.recorded_as && c.right === e.scheme);
  if (!fixed) throw new Error(`the item of ${e.date} on ${e.dim} minuted under ${e.recorded_as} is never corrected`);
}

// An alignment the migrated scheme leans on has to have one answer: the signer
// it copies must not have an item on that subject the same day.
for (const e of events.filter((x) => x.type === "align" && (x.scheme === "GW" || x.supports))) {
  if (events.some((x) => x.scheme === e.with && x.dim === e.dim && x.date === e.date)) {
    throw new Error(`${e.with} has an item on ${e.dim} the day ${e.scheme} is aligned with it`);
  }
}

const gwDims = Object.keys(GW_FINAL);
for (const dim of gwDims) {
  const got = stateAt("GW", dim, ROLLOUT);
  if (got !== GW_FINAL[dim]) throw new Error(`${dim} on rollout day is ${got}, the reference solution has ${GW_FINAL[dim]}`);
}
const optionsAt = (date) => {
  const o = { ...CORRECT };
  const map = { header_values: "header_values", query_order: "query_order", signed_headers: "signed_headers", body_hash: "body_hash", terminator: "trailing_newline", escapes: "percent_escapes", valueless: "valueless_parameter", path: "path", key_id_match: "key_id_match", names_join: "names_join" };
  for (const dim of gwDims) {
    const option = TO_OPTION[dim][stateAt("GW", dim, date)];
    if (option === undefined) throw new Error(`no switch for ${dim} on ${date}`);
    o[map[dim]] = option;
  }
  return o;
};
const finalOptions = optionsAt(ROLLOUT);
for (const [k, v] of Object.entries(finalOptions)) {
  if (CORRECT[k] !== v) throw new Error(`rollout state disagrees with the reference on ${k}: ${v}`);
}
const staleOptions = optionsAt(STALE);

// ---------------------------------------------------------------------------
// Rendering.
// ---------------------------------------------------------------------------

const TAILS = [
  "{partner} have been told.", "No change for anyone else.", "{person} will update the client notes.",
  "Effective from this meeting.", "The client libraries follow in their next release.",
  "The current client release already behaves this way.", "Documented in the client notes the same day.",
  "{person} will confirm with the partners affected.",
];
const REASONS = [
  "The cost of changing every client is not worth it.", "It would break integrations already in the field.",
  "The numbers did not support it.", "It made things worse in the partner test.", "2 partners objected.",
  "It changes values that are case sensitive.", "The receiving parser normalises it anyway, so it made things worse.",
  "It came too late for this cutover.", "Sharing that code saves a dozen lines and changes every signature.",
];
const fillNames = (text) => text.replace(/\{partner\}/g, () => pick(PARTNERS)).replace(/\{person\}/g, () => pick(PEOPLE));

function conditionText(fact) {
  if (fact.kind === "signoff") return `provided all 5 partners have signed off on it by ${fact.deadline}`;
  if (fact.kind === "load") return `provided the load test puts its added cost under ${fact.limit} ms at p99`;
  return "provided the proxy captures show the fronting proxy rewriting escapes";
}

function render(e) {
  const shown = e.recorded_as ?? e.scheme;
  const s = SCHEMES[shown];
  const alias = pick(s.aliases);
  const dim = DIMS[e.dim];
  const rule = (value) => dim.values[value](s);
  const lead = e.lead ?? fillNames(pick(dim.leads));
  const tail = e.tail ?? fillNames(pick(TAILS));
  const reason = e.reason ?? pick(REASONS);
  const person = pick(PEOPLE);
  let text;
  switch (e.type) {
    case "set":
      text = pick([
        `${lead} Agreed: for ${alias}, ${rule(e.value)}. ${tail}`,
        `${lead} Decision for ${alias}: ${rule(e.value)}. ${tail}`,
        `${lead} ${person} proposed, and the room agreed, that for ${alias} ${rule(e.value)}. ${tail}`,
      ]);
      break;
    case "propose":
      text = pick([
        `${lead} ${person} proposed that for ${alias} ${rule(e.value)}. Parked until ${e.parked}; nothing changes for now.`,
        `${lead} Proposal on the table for ${alias}: ${rule(e.value)}. Not decided. ${person} to come back once ${e.parked}.`,
      ]);
      break;
    case "withdraw":
      text = `For ${alias}, the proposal of ${e.of} that ${rule(e.value)} was withdrawn. ${reason} What was in place before stays.`;
      break;
    case "trial":
      text = `${lead} For ${alias}, as a trial: ${rule(e.value)}. To be confirmed or backed out at ${e.review}.`;
      break;
    case "backout":
      text = `For ${alias}, the trial started on ${e.of} is backed out. ${reason} From now ${rule(stateAt(e.scheme, e.dim, e.date))}, as before the trial.`;
      break;
    case "confirm":
      text = `For ${alias}, the trial started on ${e.of} is confirmed: ${rule(stateAt(e.scheme, e.dim, e.date))}.`;
      break;
    case "decline":
      text = pick([
        `${lead} ${e.partner} asked that for ${alias} ${rule(e.value)}. Not adopted. ${reason}`,
        `${lead} ${e.partner} asked for a change so that, for ${alias}, ${rule(e.value)}. Declined. ${reason}`,
      ]);
      break;
    case "conditional":
      text = `${lead} For ${alias}: ${rule(e.value)}, ${conditionText(e.fact)}. If not, what is in place now stays for this cutover.`;
      break;
    case "later":
      text = `${lead} Agreed for ${alias}: ${rule(e.value)}, effective with ${e.milestone}. Until ${e.milestone} is generally available, what is in place now stays.`;
      break;
    case "align":
      text = `${lead} Agreed to bring the ${dim.np} of ${alias} in line with that of ${pick(SCHEMES[e.with].aliases)}, as it stands today.`;
      break;
    case "correction": {
      const wrong = pick(SCHEMES[e.wrong].aliases);
      const right = pick(SCHEMES[e.right].aliases);
      text = `Correction to the minutes of ${e.of}: the item on the ${dim.np} recorded there under ${wrong} was agreed for ${right}, not for ${wrong}. Nothing changed for ${wrong} that day.`;
      break;
    }
    default:
      throw new Error(`no frame for ${e.type}`);
  }
  const heading = e.type === "correction" ? "Corrections to earlier minutes" : pick(dim.topics);
  return { heading, text: upperFirst(text), alias };
}

// Operational sentences, as in the hard variant. They say nothing about any
// signer's rules beyond what the register already states.
const OPS = [
  "{person} reported that the {svc} cutover is on track for the week of {date}.",
  "The {team} team asked for one more dry run on {host} before {svc} moves.",
  "Latency through the signer stayed under {ms}ms at p99 across the {svc} replay.",
  "The legacy signer peaked at roughly {k}k requests per minute on {svc} during the last cycle.",
  "{partner} confirmed they are on SDK 3.1 in production and 3.2 in their sandbox.",
  "The {svc} dashboard now splits signature mismatches by key id and by partner.",
  "Mismatch rate on {svc} was 0.{n1} percent over the window, all of it from one {partner} sandbox client.",
  "{person} checked that the same {svc} request produces the same canonical hash on {host} and {host2}.",
  "The access log truncates query strings longer than {bytes} bytes. The request itself is not truncated.",
  "The batch reader on {host} tolerates a trailing newline at the end of the input file.",
  "{person} will rerun the {svc} replay once {partner} finish their client release.",
  "The {team} team want the evidence files kept for {days} days after cutover.",
  "Evidence for {svc} is written to the spool directory and collected every {mins} minutes.",
  "Disk on {host} was at {pct} percent after the replay and was cleared by hand.",
  "{person} raised that the {svc} runbook still names the Perl script. To be fixed after cutover.",
  "The key directory on {host} is readable by the signer accounts only.",
  "Key files are distributed by the provisioning job, which {team} own.",
  "{partner} asked for a second sandbox key id and were pointed at the onboarding form.",
  "A {partner} engineer joined for this item and dropped off afterwards.",
  "The {svc} smoke test covers one signed request and one verified request per key id.",
  "{person} asked whether {svc} still needs the old batch window. Nobody objected to dropping it.",
  "The {svc} queue drained in {mins} minutes after the replay, which is within the agreed window.",
  "Alert thresholds for {svc} stay where they are until 2 clean weeks have passed.",
  "{person} has the action to circulate the {svc} numbers before the next session.",
  "The rollback rehearsal for {svc} took {mins} minutes end to end on {host}.",
  "{partner} reported {n} failed requests on {date}, all traced to an expired sandbox credential on their side.",
  "Requests with a body over {bytes} bytes are rejected upstream of the signer and never reach it.",
  "Header count per request on {svc} is between {n} and {n2} in the sampled traffic.",
  "The {team} team asked that query parameters carrying account numbers be masked in the dashboards.",
  "{partner} use the same key id for {svc} and {svc2}. That is allowed.",
  "The signer account on {host} has no outbound network route, which {team} verified again on {date}.",
  "{person} asked for the canonical hash to be shown next to each mismatch in the {svc} dashboard.",
  "Capacity headroom on {svc} is about {pct} percent at the current peak.",
  "The {svc} replay set has {n3} requests, of which {n} carry a query string.",
];
const OPS_HEADINGS = [
  "{Svc} cutover", "{Svc} replay results", "{Partner} update", "Dashboards", "Load test",
  "SDK rollout", "{Svc} runbook", "Capacity", "{Svc} smoke test", "Evidence retention",
  "{Partner} sandbox", "Host {host}", "{Svc} queue", "Rollback rehearsal",
  "Access and accounts",
];
function opsParagraph(before) {
  const dates = DATES.filter((d) => d <= before);
  const fill = (text) => {
    const [svc, svc2] = shuffle(SERVICES);
    const [host, host2] = shuffle(HOSTS);
    return text
      .replace(/\{person\}/g, pick(PEOPLE)).replace(/\{partner\}/g, pick(PARTNERS))
      .replace(/\{svc2\}/g, svc2).replace(/\{svc\}/g, svc).replace(/\{team\}/g, pick(TEAMS))
      .replace(/\{host2\}/g, host2).replace(/\{host\}/g, host).replace(/\{ms\}/g, int(1, 9))
      .replace(/\{k\}/g, int(3, 41)).replace(/\{n1\}/g, int(1, 9)).replace(/\{pct\}/g, int(22, 78))
      .replace(/\{bytes\}/g, pick([512, 1024, 2048, 4096, 8192])).replace(/\{days\}/g, pick([7, 14, 30, 90]))
      .replace(/\{mins\}/g, int(4, 55)).replace(/\{n3\}/g, int(400, 9000)).replace(/\{n2\}/g, int(9, 18))
      .replace(/\{n\}/g, int(2, 40)).replace(/\{date\}/g, pick(dates));
  };
  return shuffle(OPS).slice(0, int(3, 5)).map(fill).join(" ");
}
function opsHeading() {
  return pick(OPS_HEADINGS)
    .replace("{Svc}", upperFirst(pick(SERVICES))).replace("{Partner}", pick(PARTNERS)).replace("{host}", pick(HOSTS));
}

// Passages that are not a rule decision and are written once.
const WRITTEN = {
  "2025-09-30": [
    ["Scope", `4 signers besides the one being migrated come up in these sessions, because they share the Perl tree and most of the people. The notes use these names. Inbound request signing, also written as partner request signing, the gateway request scheme or by its identifier ${SCHEMES.GW.formal}, covers ${SCHEMES.GW.what}; it is the only one being migrated and the only one the register describes. Outbound webhook signing, also the webhook signer or callback signing, ${SCHEMES.WH.formal}, covers ${SCHEMES.WH.what}. Export manifest signing, also the export signer or batch manifest signing, ${SCHEMES.BX.formal}, covers ${SCHEMES.BX.what}. Service mesh signing, also the mesh signer or internal service signing, ${SCHEMES.MS.formal}, covers ${SCHEMES.MS.what}. Admin API signing, also the admin signer or ops tooling signing, ${SCHEMES.AD.formal}, covers ${SCHEMES.AD.what}. A decision minuted for one of them is a decision for that one only.`],
    ["How these notes work", "Each session minutes what was agreed, per signer. The register is left as it is. Where minutes turn out to be wrong they are corrected at a later session, in an item that begins \"Correction to the minutes of\", and the correction is what counts. An item that brings one signer in line with another copies the other's rule as it stood on that day; it does not follow what the other signer does afterwards. An item agreed as effective with a release takes effect on the day that release becomes generally available, and the release calendar has those dates."],
  ],
  "2025-10-14": [
    ["Webhook receivers", "The webhooks team surveyed the receivers in the field: 41 integrations, 9 of them on receiver kits older than 1.6. Nothing in outbound webhook signing changes for those 9 until receiver kit 2.0 is generally available."],
  ],
  "2025-10-28": [
    ["Export window", "The nightly settlement export moved from 02:00 to 03:30 UTC. Export manifest signing is unaffected: the manifest is signed when the export closes, whatever the hour."],
  ],
  "2025-11-18": [
    ["Mesh rollout", "Service mesh signing is now enforced between all payment services. The 3 reporting services stay in log-only mode until the first quarter."],
  ],
  "2025-11-25": [
    ["Admin tooling", "Ops tooling moved to admin CLI 2.1 this week. Admin API signing does not change with it; CLI 2.2 is the release that carries the pending items."],
  ],
  "2025-12-02": [
    ["Freeze", "Inbound request signing is frozen as of this meeting: what has been agreed up to and including today is what goes live on 2025-12-09. Anything raised from here on is a candidate for a later revision and does not change what the port implements."],
  ],
  "2025-12-09": [
    ["Cutover", "Inbound request signing went live today on the frozen scheme. There is no grace period: from cutover the gateway checks the frozen scheme only, and a request signed under any earlier form of the rules is rejected as a mismatch. Partners were told on 2025-12-03."],
    ["Key rotation", "`gw-prod-03` was cut on 2025-11-27 and its file is in the key directory on every edge host. The export signer has been on it since 2025-11-28. For inbound request signing, moving to it is a separate change with its own window in the first quarter and is not part of this cutover."],
  ],
};

const passages = [];
for (const e of events) {
  const r = render(e);
  passages.push({ event: e, date: e.date, heading: r.heading, text: r.text, alias: r.alias });
}

const NOTE_SIZE = 22000;
const files = new Map();
for (const m of MEETINGS) {
  const mine = passages.filter((p) => p.date === m.date).map((p) => [p.heading, p.text]);
  const written = WRITTEN[m.date] ?? [];
  let sections = shuffle([...mine, ...written]);
  let size = sections.reduce((n, [h, t]) => n + h.length + t.length + 6, 0);
  const ops = [];
  while (size < NOTE_SIZE || ops.length < 3) {
    const section = [opsHeading(), opsParagraph(m.date)];
    ops.push(section);
    size += section[0].length + section[1].length + 6;
  }
  // Decisions and operations interleaved, with an operations section first
  // and last so nothing can be found by position.
  const body = [ops.pop()];
  const rest = shuffle([...sections, ...ops.slice(1)]);
  body.push(...rest, ops[0]);
  const attendees = shuffle(PEOPLE).slice(0, int(5, 8)).join(", ");
  files.set(`${m.id}-${m.date}-${m.slug}.md`,
    `# ${m.date} ${m.title}\n\nAttendees: ${attendees}\n\n${body.map(([h, t]) => `## ${h}\n\n${t}`).join("\n\n")}\n`);
}

// Appendices. The facts that conditions and effective dates depend on live
// here, one line each, for every signer alike.
const factLines = { signoff: [], load: [], proxy: [] };
const factNeedles = new Map();
for (const e of events) {
  if (e.type !== "conditional") continue;
  const alias = upperFirst(pick(SCHEMES[e.scheme].aliases));
  const np = DIMS[e.dim].np;
  const f = e.fact;
  let line;
  if (f.kind === "signoff") {
    line = `${alias}, change to the ${np} tabled ${e.date}, sign-off received from: ${shuffle(Object.entries(f.dates)).map(([q, d]) => `${q} ${d}`).join("; ")}.`;
  } else if (f.kind === "load") {
    line = `${alias}, change to the ${np} tabled ${e.date}: added cost ${f.p95.toFixed(1)} ms at p95 and ${f.measured.toFixed(1)} ms at p99, against a limit of ${f.limit} ms at p99.`;
  } else {
    line = `${alias}, question tabled ${e.date}: percent escapes pass through the fronting proxy byte for byte, lowercase or uppercase. Captured ${f.resolved_on}.`;
  }
  factLines[f.kind].push(line);
  factNeedles.set(e.id, line);
}
const appendix = (title, intro, lines, size, before = "2025-12-08") => {
  const sections = lines.map((l) => ["Entry", l]);
  let used = sections.reduce((n, [, t]) => n + t.length, 0);
  const ops = [];
  while (used < size) {
    const s = [opsHeading(), opsParagraph(before)];
    ops.push(s);
    used += s[1].length;
  }
  const body = shuffle([...sections.map(([, t]) => ["", t]), ...ops]);
  return `# ${title}\n\n${intro}\n\n${body.map(([h, t]) => (h ? `## ${h}\n\n${t}` : `- ${t}`)).join("\n\n")}\n`;
};

const milestoneLines = Object.entries(MILESTONES).map(([name, date]) => `${name}: release candidate ${RELEASE_CANDIDATE[name]}, general availability ${date}.`);
files.set("20-release-calendar.md", appendix("Appendix - Release Calendar", "Release candidate and general availability dates for the client libraries and components the signers depend on.", milestoneLines, 9000));
files.set("21-load-test-observations.md", appendix("Appendix - Load Test Observations", "Measured cost of changes that were agreed subject to a load test.", factLines.load, 9000));
files.set("22-partner-sign-off-register.md", appendix("Appendix - Partner Sign-off Register", "Sign-offs received for changes that were agreed subject to partner sign-off.", factLines.signoff, 9000));
files.set("23-proxy-capture-results.md", appendix("Appendix - Proxy Capture Results", "What the captures taken either side of the fronting proxy showed.", factLines.proxy, 8000));
files.set("24-key-rotation-runbook.md", appendix("Appendix - Key Rotation Runbook", "Rotation steps and the state of each key.", [
  "`gw-prod-01` and `gw-prod-02` are the keys inbound request signing runs on.",
  "`gw-prod-03` was cut on 2025-11-27. The export signer moved to it on 2025-11-28. Inbound request signing moves in the first quarter rotation.",
], 9000));

// Support advice is dated and was right on its day. For the migrated scheme it
// is generated from the same replay, so it cannot disagree with the minutes.
const tickets = [];
const symptom = { GW: "Signatures failing on some of their inbound requests.", WH: "Their receiver rejects some webhook deliveries.", BX: "Export manifests failing verification on their side.", MS: "Mesh calls between 2 of their sandbox services rejected.", AD: "Admin API calls from their tooling rejected." };
const gwTickets = [["2025-10-20", "Contoso", "header_values"], ["2025-11-06", "Contoso", "valueless"], ["2025-11-13", "Globex", "query_order"], ["2025-11-13", "Contoso", "body_hash"], ["2025-11-20", "Umbrella", "signed_headers"]];
for (const [date, partner, dim] of gwTickets) {
  tickets.push({ date, partner, scheme: "GW", dim, text: `${symptom.GW} Support advised that for ${pick(SCHEMES.GW.aliases)} ${DIMS[dim].values[stateAt("GW", dim, date)](SCHEMES.GW)}. Resolved.` });
}
for (const scheme of DECOYS) {
  for (const dim of shuffle(Object.keys(DIMS)).slice(0, 3)) {
    const date = pick(["2025-10-24", "2025-11-07", "2025-11-14", "2025-11-21", "2025-12-04"]);
    const value = stateAt(scheme, dim, date);
    if (value === undefined) continue;
    tickets.push({ date, partner: pick(PARTNERS), scheme, dim, text: `${symptom[scheme]} Support advised that for ${pick(SCHEMES[scheme].aliases)} ${DIMS[dim].values[value](SCHEMES[scheme])}. Resolved.` });
  }
}
const generic = [
  "They were sending the sandbox key id to the production host. Closed with no change on our side.",
  "Their deploy had rolled back to an older SDK without anyone noticing. Resolved after they redeployed.",
  "The request never reached us. Their egress firewall was dropping it. Closed.",
  "A middlebox on their side was rewriting the request after it had been signed. Resolved on their side.",
];
for (let i = 0; i < 14; i++) {
  tickets.push({ date: pick(["2025-10-03", "2025-10-16", "2025-10-30", "2025-11-12", "2025-11-26", "2025-12-05"]), partner: pick(PARTNERS), text: `Every request rejected after a change on their side. ${pick(generic)}` });
}
tickets.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
files.set("25-partner-support-escalations.md", `# Appendix - Partner Support Escalations\n\nAdvice given on the day, in date order. It reflects the rules in force on that day.\n\n${tickets.map((t) => `## ${t.date} ${t.partner}\n\n${t.text}`).join("\n\n")}\n`);
files.set("26-error-taxonomy.md", appendix("Appendix - Error Taxonomy", "How rejections are counted on the dashboards.", [], 9000));
files.set("27-capacity-planning-notes.md", appendix("Appendix - Capacity Planning Notes", "Headroom and peak figures per service.", [], 9000));

// The register is the base task's, minus the note telling the reader to
// cross-check it.
const register = readFileSync(join(ROOT, "environment", "app", "dossier", "01-decision-register.md"), "utf8");
files.set("01-decision-register.md", register.slice(0, register.indexOf("> Reading guidance")) + register.slice(register.indexOf("## GW-002")));

rmSync(DOSSIER, { recursive: true, force: true });
mkdirSync(DOSSIER, { recursive: true });
let total = 0;
for (const [name, text] of files) {
  writeFileSync(join(DOSSIER, name), text);
  total += text.length;
  for (const line of text.split("\n")) {
    if (line.length > 1900) throw new Error(`${name} has a ${line.length} character line; a file reader would cut it`);
  }
}
const whole = [...files.values()].join("\n");

// ---------------------------------------------------------------------------
// Captures. The legacy request signer's are the hard variant's. The other 2
// signers' sit next to them, and one of them holds the third key open.
// ---------------------------------------------------------------------------

const CAPTURES = join(APP, "captures");
rmSync(CAPTURES, { recursive: true, force: true });
mkdirSync(CAPTURES, { recursive: true });
const hardCaptures = join(ROOT, "hard", "environment", "app", "captures");
for (const name of ["legacy-signer.strace", "legacy-signer.lsof"]) {
  writeFileSync(join(CAPTURES, name), readFileSync(join(hardCaptures, name)));
}
// The strace shows each key file read whole, 33 bytes. What the signer then
// hands to HMAC is in the library call trace of the same run: 32.
const traced = (call, result) => `${call.padEnd(88)}= ${result}`;
const hmacCalls = [["0x55f3a2c33f40", 187], ["0x55f3a2c33f80", 178], ["0x55f3a2c33f40", 204]].flatMap(([key, length]) => [
  traced(`legacy-signer->HMAC_Init_ex(0x55f3a2c41d30, ${key}, 32, 0x7f9c1d2a1c40, NULL)`, 1),
  traced(`legacy-signer->HMAC_Update(0x55f3a2c41d30, 0x55f3a2c35a10, ${length})`, 1),
  traced("legacy-signer->HMAC_Final(0x55f3a2c41d30, 0x7ffd2c19f8e0, 0x7ffd2c19f8dc)", 1),
  traced("legacy-signer->HMAC_CTX_reset(0x55f3a2c41d30)", 1),
]);
writeFileSync(join(CAPTURES, "legacy-signer.ltrace"), [
  traced("legacy-signer->EVP_sha256()", "0x7f9c1d2a1c40"),
  traced("legacy-signer->HMAC_CTX_new()", "0x55f3a2c41d30"),
  ...hmacCalls,
  traced("legacy-signer->HMAC_CTX_free(0x55f3a2c41d30)", "<void>"),
  "+++ exited (status 0) +++",
  "",
].join("\n"));
writeFileSync(join(CAPTURES, "export-signer.lsof"), [
  "COMMAND     PID  USER   FD   TYPE DEVICE SIZE/OFF     NODE NAME",
  "export-si 15233 bxsvc  cwd    DIR  259,1     4096  1441990 /var/spool/bx",
  "export-si 15233 bxsvc  rtd    DIR  259,1     4096        2 /",
  "export-si 15233 bxsvc  txt    REG  259,1   211208  1180311 /opt/bx/bin/export-signer",
  "export-si 15233 bxsvc  mem    REG  259,1  4451840  1049101 /usr/lib/x86_64-linux-gnu/libcrypto.so.3",
  "export-si 15233 bxsvc  mem    REG  259,1  1922136  1049088 /usr/lib/x86_64-linux-gnu/libc.so.6",
  "export-si 15233 bxsvc    0r   CHR    1,3      0t0        5 /dev/null",
  "export-si 15233 bxsvc    1w   REG  259,1    40112  1441995 /var/log/bx/export.out",
  "export-si 15233 bxsvc    2w   REG  259,1      312  1441996 /var/log/bx/export.err",
  "export-si 15233 bxsvc    3r   REG  259,1       33  1310803 /etc/gw/keys/gw-prod-03.key",
  "export-si 15233 bxsvc    4r   REG  259,1    90417  1441999 /var/spool/bx/manifest.json",
  "",
].join("\n"));
writeFileSync(join(CAPTURES, "webhook-signer.strace"), [
  'execve("/opt/wh/bin/webhook-signer", ["webhook-signer", "--queue", "/var/spool/wh/out"], 0x7ffe91c20e10 /* 22 vars */) = 0',
  'openat(AT_FDCWD, "/etc/wh/signer.conf", O_RDONLY)  = 3',
  'read(3, "# webhook signer configuration\\nk"..., 4096) = 377',
  "close(3)                                = 0",
  'openat(AT_FDCWD, "/etc/wh/keys", O_RDONLY|O_NONBLOCK|O_CLOEXEC|O_DIRECTORY) = 3',
  "getdents64(3, 0x5581c7a11a10 /* 3 entries */, 32768) = 80",
  "getdents64(3, 0x5581c7a11a10 /* 0 entries */, 32768) = 0",
  "close(3)                                = 0",
  'openat(AT_FDCWD, "/etc/wh/keys/wh-prod-01.key", O_RDONLY) = 3',
  "fstat(3, {st_mode=S_IFREG|0400, st_size=33, ...}) = 0",
  'read(3, "wh1deliverymaterial_77c0a1e93b5d\\n", 4096) = 33',
  "close(3)                                = 0",
  'socket(AF_INET, SOCK_STREAM|SOCK_CLOEXEC, IPPROTO_TCP) = 4',
  'connect(4, {sa_family=AF_INET, sin_port=htons(443), sin_addr=inet_addr("203.0.113.40")}, 16) = 0',
  'write(4, "POST /hooks/settlement HTTP/1.1\\r\\n"..., 612) = 612',
  "close(4)                                = 0",
  "exit_group(0)                           = ?",
  "+++ exited with 0 +++",
  "",
].join("\n"));
writeFileSync(join(CAPTURES, "README.md"), `# Captures from the production host

5 captures were taken from \`gw-edge-03\` on 2025-12-01, during the pre-migration
sweep. 3 signers run on that host.

- \`legacy-signer.strace\` is a syscall trace of one batch run of the legacy
  request signer, start to exit.
- \`legacy-signer.ltrace\` is the library call trace of the same run, filtered
  to the HMAC calls.
- \`legacy-signer.lsof\` is the open file descriptor table of the legacy request
  signer, sampled mid-batch.
- \`export-signer.lsof\` is the open file descriptor table of the export signer.
- \`webhook-signer.strace\` is a syscall trace of one delivery by the webhook
  signer.

Paths in the captures are from the production host, where the request signer's
key directory is \`/etc/gw/keys\`. The container has the same directory at
\`/app/keys\`.
`);

// ---------------------------------------------------------------------------
// The sample request set, and the held-out sets, which are the hard variant's.
// ---------------------------------------------------------------------------

// A plain recursive copy. fs.cpSync is not used: under Node 22.23.3 on Linux,
// in a bind-mounted checkout, it failed with EACCES and left a key file
// unreadable. CI reruns this script on whatever node the runner has, so the
// copy has to behave the same on every version.
function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    const src = join(from, entry.name);
    const dst = join(to, entry.name);
    if (entry.isDirectory()) copyTree(src, dst);
    else writeFileSync(dst, readFileSync(src));
  }
}

const KEYS = join(APP, "keys");
rmSync(KEYS, { recursive: true, force: true });
copyTree(join(ROOT, "hard", "environment", "app", "keys"), KEYS);
const keyFiles = new Map(readdirSync(KEYS).filter((n) => n.endsWith(".key")).map((n) => [n.slice(0, -4), readFileSync(join(KEYS, n))]));

const signedBy = (rec, options) => {
  const keyId = rec.headers.find(([n]) => n.toLowerCase() === "x-gw-key-id")[1];
  const signature = evidence(rec, 1, options, keyFiles).signature;
  return { ...rec, headers: [...rec.headers, ["Authorization", `${SCHEME} keyId=${keyId}, signature=${signature}`]] };
};
// The fresh record carries exactly one header, so its canonical string has no
// separator in it and it cannot be used to settle the name list. Its date is
// in the body. The stale record's escape is already upper case, so it says
// nothing about the escape rule either.
const fresh = { method: "POST", target: "/v2/settlement?cycle=7", headers: [["X-GW-Key-Id", "gw-prod-01"]], body: `{"batch":3,"sent":"${FRESH}T09:14:03Z"}` };
const stale = { method: "GET", target: "/v2/ledger/export?tag=%7E&tag=z&verbose", headers: [["X-GW-Key-Id", "gw-prod-02"], ["X-GW-Date", `${STALE}T16:02:41Z`], ["Host", "gw.example.com"], ["Content-Type", "application/json"]] };
const today = ["X-GW-Date", `${FRESH}T11:30:00Z`];
const sample = [
  { method: "post", target: "/v2/orders?b=2&a=1&a=10", headers: [["X-GW-Key-Id", "gw-prod-01"], today, ["Content-Type", "application/json"], ["Host", "gw.example.com"]], body: '{"id":7}' },
  { method: "GET", target: "/v2/health", headers: [["x-gw-key-id", "gw-prod-02"], today, ["host", "gw.example.com"]] },
  { method: "PUT", target: "/v2/catalog/items/91?dry_run=true", headers: [["X-GW-Key-Id", "gw-prod-01"], ["Content-Type", "  application/json   charset=utf-8  "], ["Host", "gw.example.com"], ["X-GW-Trace", "  a1  b2  "]], body: "" },
  { method: "POST", target: "/v2/refunds", headers: [["x-gw-key-id", "gw-prod-03"], ["host", "gw.example.com"]], body: "{}" },
  { method: "DELETE", target: "/v2/webhooks/12", headers: [["host", "gw.example.com"]], body: "" },
  // Signed the day before rollout: verifies under the frozen scheme.
  signedBy(fresh, CORRECT),
  // Signed on 2025-11-20 under the rules in force that day: a mismatch now.
  signedBy(stale, staleOptions),
  { method: "GET", target: "/v2/ledger", headers: [["X-GW-Key-Id", "gw-prod-01"], ["Host", "gw.example.com"], ["Authorization", "Bearer somethingelse"]] },
];
const sampleOut = sample.map((r, i) => JSON.stringify(evidence(r, i + 1, CORRECT, keyFiles)) + "\n").join("");
const outcomes = sample.map((r, i) => evidence(r, i + 1, CORRECT, keyFiles)).map((ev) => (ev.reason ? `${ev.outcome}/${ev.reason}` : ev.outcome));
if (outcomes[5] !== "verified" || outcomes[6] !== "rejected/signature-mismatch") throw new Error(`signed sample records came out as ${outcomes[5]} and ${outcomes[6]}`);
const underStale = evidence(sample[6], 7, staleOptions, keyFiles).outcome;
if (underStale !== "verified") throw new Error("the stale record does not verify under the rules of its own day");
mkdirSync(join(APP, "requests"), { recursive: true });
writeFileSync(join(APP, "requests", "sample-requests.json"), JSON.stringify(sample, null, 2) + "\n");

rmSync(join(FRONTIER, "tests", "holdout"), { recursive: true, force: true });
copyTree(join(ROOT, "hard", "tests", "holdout"), join(FRONTIER, "tests", "holdout"));

// ---------------------------------------------------------------------------
// The manifest: which passages bear on which rule, for analysis/exposure.mjs.
// ---------------------------------------------------------------------------

// A second way to recognise a passage: from the signer's name into the decision
// clause. An agent that prints only the clause never shows the lead-in.
function clauseOf(p) {
  const at = p.text.toLowerCase().indexOf(p.alias.toLowerCase());
  if (at === -1) return null;
  for (let n = 90; n <= 200; n += 20) {
    const needle = p.text.slice(at, at + n);
    if (whole.split(needle).length - 1 === 1) return needle;
  }
  return null;
}
function needleFor(text) {
  for (let n = 70; n <= text.length; n += 20) {
    const needle = text.slice(0, n);
    if (whole.split(needle).length - 1 === 1) return needle;
  }
  throw new Error(`no unique opening for: ${text.slice(0, 80)}`);
}
const manifest = [];
for (const p of passages) {
  const e = p.event;
  const supports = e.supports ?? (e.scheme === "GW" ? e.dim : null);
  if (supports === null || !e.role) continue;
  const option = e.option ?? (e.value && TO_OPTION[supports]?.[e.value]) ?? null;
  const needles = [needleFor(p.text), clauseOf(p)].filter(Boolean);
  manifest.push({ id: `${e.dim}-${e.date}-${e.type}`, rule: DIMS[supports].rule, role: e.role, option, date: e.date, needle: needles[0], needles });
}
for (const e of events) {
  if (e.scheme !== "GW" || e.type !== "conditional") continue;
  manifest.push({ id: `${e.dim}-fact`, rule: DIMS[e.dim].rule, role: e.fact_role ?? (e.fact.truth ? "resolves" : "decides"), option: null, date: e.fact.resolved_on, needle: needleFor(factNeedles.get(e.id)) });
}
manifest.push({ id: "path-release-date", rule: "path", role: "decides", option: null, date: MILESTONES["SDK 3.3"], needle: "SDK 3.3: release candidate 2025-12-05, general availability 2026-01-13." });
manifest.push({ id: "body-release-date", rule: "body_hash", role: "resolves", option: null, date: MILESTONES["SDK 3.2.1"], needle: "SDK 3.2.1: release candidate 2025-11-21, general availability 2025-12-01." });
manifest.push({ id: "how-these-notes-work", rule: "query_order", role: "resolves", option: null, date: "2025-09-30", needle: "An item that brings one signer in line with another copies the other's rule as it stood on that day" });
manifest.push({ id: "roster-in-rollout-note", rule: "roster", role: "decides", option: null, date: ROLLOUT, needle: "For inbound request signing, moving to it is a separate change" });
manifest.push({ id: "no-grace-period", rule: "stale_sample", role: "decides", option: null, date: ROLLOUT, needle: "a request signed under any earlier form of the rules is rejected as a mismatch" });
for (const item of manifest) {
  for (const needle of item.needles ?? [item.needle]) {
    if (whole.split(needle).length - 1 !== 1) throw new Error(`needle for ${item.id} is not unique in the dossier`);
  }
}
writeFileSync(join(HERE, "manifest.json"), JSON.stringify(manifest, null, 1) + "\n");

// ---------------------------------------------------------------------------
// The answer key, for people. Not shipped to the agent.
// ---------------------------------------------------------------------------

const key = ["# Answer key: the migrated scheme's history in the frontier dossier", "", "Generated by build.mjs from the same table of events the dossier is rendered from.", ""];
for (const dim of gwDims) {
  key.push(`## ${DIMS[dim].np}`, "", `Register: ${GW_REGISTER[dim]}. On ${STALE}: ${stateAt("GW", dim, STALE)}. On rollout day: **${GW_FINAL[dim]}**.`, "");
  const mine = events.filter((e) => (e.scheme === "GW" || e.supports === dim || e.recorded_as === "GW") && e.dim === dim).sort((a, b) => (a.date < b.date ? -1 : 1));
  for (const e of mine) {
    const bits = [e.date, e.type];
    if (e.scheme !== "GW") bits.push(`(a ${e.scheme} item)`);
    if (e.recorded_as) bits.push(`minuted under ${e.recorded_as}`);
    if (e.value) bits.push(e.value);
    if (e.with) bits.push(`with ${e.with}, which had ${stateAt(e.with, dim, e.date)}`);
    // The load-test appendix gives figures and no date, so none is claimed here.
    if (e.fact) bits.push(`condition ${e.fact.kind} is ${e.fact.truth}${e.fact.kind === "load" ? "" : `, known ${e.fact.resolved_on}`}`);
    if (e.milestone) bits.push(`effective with ${e.milestone}, ${MILESTONES[e.milestone]}`);
    if (e.type === "correction") bits.push(`of ${e.of}: recorded under ${e.wrong}, agreed for ${e.right}`);
    key.push(`- ${bits.join(", ")}`);
  }
  key.push("");
}
key.push("## Keys", "", "Key bytes come from the legacy request signer's captures: the strace shows 33 bytes read and the ltrace shows 32 handed to HMAC. The roster comes from the same signer's strace and lsof, and the key rotation runbook and the rollout note state it too. The export signer's capture holds `gw-prod-03.key` open; that is the export signer.", "");
key.push("## The 2 signed sample records", "", `Record 6 carries one header, its key id, and a body dated ${FRESH}. It verifies under the frozen scheme. Record 7 carries \`X-GW-Date: ${STALE}\` and was signed with the state the replay gives for that day:`, "", "```", JSON.stringify(Object.fromEntries(Object.entries(staleOptions).filter(([k, v]) => CORRECT[k] !== v)), null, 1), "```", "", "Under the frozen scheme it is a signature-mismatch, which is the approved outcome.", "");
writeFileSync(join(HERE, "ANSWER-KEY.md"), key.join("\n"));

const perScheme = Object.fromEntries(Object.keys(SCHEMES).map((s) => [s, events.filter((e) => e.scheme === s).length]));
console.log(`dossier: ${files.size} files, ${total} bytes; decision passages ${passages.length} (${JSON.stringify(perScheme)})`);
console.log(`manifest: ${manifest.length} passages bear on the migrated scheme`);
console.log(`stale record signed under: ${JSON.stringify(Object.fromEntries(Object.entries(staleOptions).filter(([k, v]) => CORRECT[k] !== v)))}`);
const sampleHash = createHash("sha256").update(sampleOut).digest("hex");
writeFileSync(join(HERE, "sample.sha256"), `${sampleHash}\n`);
console.log(`sample sha256 ${sampleHash}`);
console.log(`sample outcomes: ${outcomes.join(", ")}`);
