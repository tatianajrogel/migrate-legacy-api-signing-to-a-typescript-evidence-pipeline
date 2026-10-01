// The GW-HMAC-SHA256 scheme with every rule an attempt can get wrong turned
// into a switch.
//
// diagnose.mjs uses this to work out which form of each rule an attempt
// implemented: it runs the attempt's pipeline over the probe set, then looks
// for the switch settings that reproduce the attempt's canonical hashes.
//
// The first option of every rule is the one in force at the 2025-12-02 freeze.
// The others are forms the dossier held at some point, proposals it turned
// down, the webhook signer's rule, or a mistake an implementation makes on its
// own (locale collation, trimming without collapsing).

import { createHash, createHmac } from "node:crypto";

export const SCHEME = "GW-HMAC-SHA256";

export const RULES = {
  header_values: ["folded", "raw", "trimmed", "folded-lowercased"],
  query_order: [
    "name-then-value",
    "name-only",
    "name-then-decoded-value",
    "name-then-value-locale",
    "unsorted",
  ],
  signed_headers: [
    "all-but-authorization",
    "x-gw-only",
    "x-gw-plus-content-type",
    "x-gw-plus-content-type-and-host",
    "all-but-forwarding",
    "all",
  ],
  body_hash: ["always-sha256", "unsigned-when-empty-or-absent", "unsigned-when-absent"],
  trailing_newline: ["none", "lf"],
  percent_escapes: ["as-received", "uppercased"],
  valueless_parameter: ["trailing-equals", "bare"],
  path: ["as-received", "single-dots-removed", "dot-segments-resolved"],
  names_join: ["semicolon", "comma"],
};

// Rules that do not show in the canonical request. They are read off the
// signature and the outcome instead.
export const KEY_RULES = {
  key_bytes: ["newline-stripped", "verbatim"],
  // Whether canonical_sha256 is the hash of the string that was signed, or of
  // that string with its final line feed left off or added.
  hashed_text: ["as-signed", "without-lf", "with-lf"],
  roster: ["from-captures", "every-file-in-directory"],
  key_id_match: ["exact", "any-case"],
};

export const CORRECT = Object.fromEntries(
  Object.entries({ ...RULES, ...KEY_RULES }).map(([rule, options]) => [rule, options[0]]),
);

export const ROSTER = ["gw-prod-01", "gw-prod-02"];

export const sha256 = (s) => createHash("sha256").update(s, "utf8").digest("hex");

const bytewise = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

function decoded(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function headerValue(value, option) {
  if (option === "raw") return value;
  if (option === "trimmed") return value.replace(/^[ \t]+|[ \t]+$/g, "");
  if (option === "folded-lowercased") return value.replace(/[ \t]+/g, " ").trim().toLowerCase();
  return value.replace(/[ \t]+/g, " ").trim();
}

function keepHeader(name, option) {
  const forwarding = name === "via" || name === "x-forwarded-for";
  switch (option) {
    case "x-gw-only":
      return name.startsWith("x-gw-");
    case "x-gw-plus-content-type":
      return name.startsWith("x-gw-") || name === "content-type";
    case "x-gw-plus-content-type-and-host":
      return name.startsWith("x-gw-") || name === "content-type" || name === "host";
    case "all-but-forwarding":
      return name !== "authorization" && !forwarding;
    case "all":
      return true;
    default:
      return name !== "authorization";
  }
}

function canonicalPath(path, option) {
  if (option === "single-dots-removed") {
    return path.replace(/\/\.(?=\/|$)/g, "");
  }
  if (option === "dot-segments-resolved") {
    const out = [];
    for (const segment of path.split("/")) {
      if (segment === ".") continue;
      if (segment === "..") {
        if (out.length > 1) out.pop();
        continue;
      }
      out.push(segment);
    }
    return out.join("/");
  }
  return path;
}

function canonicalQuery(query, opts) {
  if (query === "") return "";
  const pairs = [];
  for (const part of query.split("&")) {
    if (part === "") continue;
    const eq = part.indexOf("=");
    if (eq === -1) pairs.push([part, "", true]);
    else pairs.push([part.slice(0, eq), part.slice(eq + 1), false]);
  }
  const byName = (a, b) => bytewise(a[0], b[0]);
  switch (opts.query_order) {
    case "unsorted":
      break;
    case "name-only":
      pairs.sort(byName);
      break;
    case "name-then-decoded-value":
      pairs.sort((a, b) => byName(a, b) || bytewise(decoded(a[1]), decoded(b[1])));
      break;
    case "name-then-value-locale":
      pairs.sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]));
      break;
    default:
      pairs.sort((a, b) => byName(a, b) || bytewise(a[1], b[1]));
  }
  return pairs
    .map(([name, value, bare]) =>
      bare && opts.valueless_parameter === "bare" ? name : `${name}=${value}`,
    )
    .join("&");
}

const upperEscapes = (text) => text.replace(/%[0-9a-f]{2}/gi, (m) => m.toUpperCase());

export function splitTarget(target) {
  const q = target.indexOf("?");
  return q === -1 ? [target, ""] : [target.slice(0, q), target.slice(q + 1)];
}

export function canonical(rec, opts = CORRECT) {
  let [path, query] = splitTarget(rec.target);
  if (opts.percent_escapes === "uppercased") {
    path = upperEscapes(path);
    query = upperEscapes(query);
  }
  const headers = rec.headers
    .map(([name, value]) => [name.toLowerCase(), headerValue(value, opts.header_values)])
    .filter(([name]) => keepHeader(name, opts.signed_headers))
    .sort((a, b) => bytewise(a[0], b[0]));

  const absent = rec.body === undefined || rec.body === null;
  const body = absent ? "" : rec.body;
  let bodyField = sha256(body);
  if (opts.body_hash === "unsigned-when-empty-or-absent" && body === "") bodyField = "UNSIGNED";
  if (opts.body_hash === "unsigned-when-absent" && absent) bodyField = "UNSIGNED";

  const text = [
    rec.method.toUpperCase(),
    canonicalPath(path, opts.path),
    canonicalQuery(query, opts),
    headers.map(([name, value]) => `${name}:${value}`).join("\n"),
    headers.map(([name]) => name).join(opts.names_join === "comma" ? "," : ";"),
    bodyField,
  ].join("\n");
  return opts.trailing_newline === "lf" ? `${text}\n` : text;
}

export function headerOf(rec, name) {
  const hit = rec.headers.find(([n]) => n.toLowerCase() === name);
  return hit ? hit[1].trim() : null;
}

// keyFiles maps a key id to the raw bytes of its file, newline included.
function resolveKey(keyId, opts, keyFiles) {
  const allowed = opts.roster === "every-file-in-directory" ? [...keyFiles.keys()] : ROSTER;
  const id = opts.key_id_match === "any-case" ? keyId.toLowerCase() : keyId;
  if (!allowed.includes(id) || !keyFiles.has(id)) return null;
  const raw = keyFiles.get(id);
  if (opts.key_bytes === "verbatim") return raw;
  let end = raw.length;
  while (end > 0 && (raw[end - 1] === 0x0a || raw[end - 1] === 0x0d)) end--;
  return raw.subarray(0, end);
}

export function hmac(key, text) {
  return createHmac("sha256", key).update(text, "utf8").digest("hex");
}

// The evidence line the instruction asks for, given one setting of the rules.
export function evidence(rec, seq, opts, keyFiles) {
  const keyId = headerOf(rec, "x-gw-key-id") ?? "";
  const text = canonical(rec, opts);
  let hashed = text;
  if (opts.hashed_text === "without-lf" && text.endsWith("\n")) hashed = text.slice(0, -1);
  if (opts.hashed_text === "with-lf" && !text.endsWith("\n")) hashed = `${text}\n`;
  const ev = {
    seq,
    key_id: keyId,
    method: rec.method.toUpperCase(),
    path: splitTarget(rec.target)[0],
    outcome: "signed",
    signature: "",
    canonical_sha256: sha256(hashed),
  };
  if (keyId === "") return { ...ev, outcome: "rejected", reason: "missing-key-id" };
  const key = resolveKey(keyId, opts, keyFiles);
  if (key === null) return { ...ev, outcome: "rejected", reason: "unknown-key-id" };
  ev.signature = hmac(key, text);

  const auth = headerOf(rec, "authorization");
  if (auth === null) return ev;
  const prefix = `${SCHEME} keyId=${keyId}, signature=`;
  if (!auth.startsWith(prefix)) {
    return { ...ev, outcome: "rejected", reason: "malformed-authorization" };
  }
  return auth.slice(prefix.length).trim() === ev.signature
    ? { ...ev, outcome: "verified" }
    : { ...ev, outcome: "rejected", reason: "signature-mismatch" };
}

// Every setting of the canonical rules, as an array of option objects.
export function everySetting() {
  let settings = [{}];
  for (const [rule, options] of Object.entries(RULES)) {
    settings = settings.flatMap((s) => options.map((o) => ({ ...s, [rule]: o })));
  }
  return settings;
}
