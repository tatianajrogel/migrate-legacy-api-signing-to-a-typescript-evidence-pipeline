// Writes the sample and held-out request sets for the hard variant, and prints
// the evidence each one should produce.
//
// The signing code here is a second implementation, written separately from
// solution/src, so that the Authorization headers on the records meant to
// verify do not come from the code they are later checked by. If the 2
// implementations ever disagree, the hashes printed here stop matching the
// ones in tests/test_outputs.py and ci/validate.sh fails on the oracle.
//
// Usage: node hard/authoring/build_requests.mjs

import { createHash, createHmac } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HARD = join(dirname(fileURLToPath(import.meta.url)), "..");
const KEYS = join(HARD, "environment", "app", "keys");
const ROSTER = ["gw-prod-01", "gw-prod-02"];
const SCHEME = "GW-HMAC-SHA256";

const sha = (s) => createHash("sha256").update(s, "utf8").digest("hex");
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

function canonical(rec) {
  const q = rec.target.indexOf("?");
  const path = q === -1 ? rec.target : rec.target.slice(0, q);
  const query = q === -1 ? "" : rec.target.slice(q + 1);
  const pairs = query
    .split("&")
    .filter((p) => p !== "")
    .map((p) => {
      const eq = p.indexOf("=");
      return eq === -1 ? [p, ""] : [p.slice(0, eq), p.slice(eq + 1)];
    })
    .sort((a, b) => cmp(a[0], b[0]) || cmp(a[1], b[1]));
  const headers = rec.headers
    .map(([n, v]) => [n.toLowerCase(), v.replace(/[ \t]+/g, " ").trim()])
    .filter(([n]) => n !== "authorization")
    .sort((a, b) => cmp(a[0], b[0]));
  return [
    rec.method.toUpperCase(),
    path,
    pairs.map(([n, v]) => `${n}=${v}`).join("&"),
    headers.map(([n, v]) => `${n}:${v}`).join("\n"),
    headers.map(([n]) => n).join(";"),
    sha(rec.body ?? ""),
  ].join("\n");
}

function header(rec, name) {
  const hit = rec.headers.find(([n]) => n.toLowerCase() === name);
  return hit ? hit[1].trim() : null;
}

function sign(rec) {
  const keyId = header(rec, "x-gw-key-id") ?? "";
  if (!ROSTER.includes(keyId)) return null;
  const key = readFileSync(join(KEYS, `${keyId}.key`)).subarray(0, 32);
  return createHmac("sha256", key).update(canonical(rec), "utf8").digest("hex");
}

function evidence(rec, seq) {
  const keyId = header(rec, "x-gw-key-id") ?? "";
  const q = rec.target.indexOf("?");
  const ev = {
    seq,
    key_id: keyId,
    method: rec.method.toUpperCase(),
    path: q === -1 ? rec.target : rec.target.slice(0, q),
    outcome: "signed",
    signature: "",
    canonical_sha256: sha(canonical(rec)),
  };
  if (keyId === "") return { ...ev, outcome: "rejected", reason: "missing-key-id" };
  const signature = sign(rec);
  if (signature === null) return { ...ev, outcome: "rejected", reason: "unknown-key-id" };
  ev.signature = signature;
  const auth = header(rec, "authorization");
  if (auth === null) return ev;
  const prefix = `${SCHEME} keyId=${keyId}, signature=`;
  if (!auth.startsWith(prefix)) {
    return { ...ev, outcome: "rejected", reason: "malformed-authorization" };
  }
  return auth.slice(prefix.length).trim() === signature
    ? { ...ev, outcome: "verified" }
    : { ...ev, outcome: "rejected", reason: "signature-mismatch" };
}

// Appends a correct Authorization header to a record that is meant to verify.
function withValidAuth(rec) {
  const keyId = header(rec, "x-gw-key-id");
  const value = `${SCHEME} keyId=${keyId}, signature=${sign(rec)}`;
  return { ...rec, headers: [...rec.headers, ["Authorization", value]] };
}

const ZEROS = "0".repeat(64);

// The one sample record that verifies carries only x-gw-* headers, a single
// query parameter and a body. It confirms the field layout, the missing
// trailing newline and the key length, and says nothing about the other rules.
const sample = [
  { method: "post", target: "/v2/orders?b=2&a=1&a=10", headers: [["X-GW-Key-Id", "gw-prod-01"], ["Content-Type", "application/json"], ["Host", "gw.example.com"]], body: '{"id":7}' },
  { method: "GET", target: "/v2/health", headers: [["x-gw-key-id", "gw-prod-02"], ["host", "gw.example.com"]] },
  { method: "PUT", target: "/v2/catalog/items/91?dry_run=true", headers: [["X-GW-Key-Id", "gw-prod-01"], ["Content-Type", "  application/json   charset=utf-8  "], ["Host", "gw.example.com"], ["X-GW-Trace", "  a1  b2  "]], body: "" },
  { method: "POST", target: "/v2/refunds", headers: [["x-gw-key-id", "gw-prod-03"], ["host", "gw.example.com"]], body: "{}" },
  { method: "DELETE", target: "/v2/webhooks/12", headers: [["host", "gw.example.com"]], body: "" },
  withValidAuth({ method: "POST", target: "/v2/settlement?cycle=7", headers: [["X-GW-Key-Id", "gw-prod-01"], ["X-GW-Trace", "t-7781"]], body: '{"batch":3}' }),
  { method: "POST", target: "/v2/settlement?cycle=8", headers: [["X-GW-Key-Id", "gw-prod-02"], ["X-GW-Trace", "t-7782"], ["Authorization", `${SCHEME} keyId=gw-prod-02, signature=${ZEROS}`]], body: '{"batch":4}' },
  { method: "GET", target: "/v2/ledger", headers: [["X-GW-Key-Id", "gw-prod-01"], ["Host", "gw.example.com"], ["Authorization", "Bearer somethingelse"]] },
];

const h1 = [
  { method: "patch", target: "/v3/disputes/55?z=1&a=9&a=2&a=10", headers: [["X-GW-Key-Id", "gw-prod-02"], ["Content-Type", "application/json"], ["Host", "edge.example.net"], ["X-GW-Trace", "qr"]], body: '{"state":"open"}' },
  { method: "GET", target: "/v3/ping", headers: [["x-gw-key-id", "gw-prod-01"], ["HOST", "edge.example.net"]] },
  { method: "POST", target: "/v3/payouts", headers: [["X-GW-Key-Id", "gw-prod-03"], ["Host", "edge.example.net"]], body: "{}" },
  { method: "PUT", target: "/v3/onboarding?flag&x=1", headers: [["X-GW-Key-Id", "gw-prod-01"], ["Host", "edge.example.net"]], body: "" },
  { method: "GET", target: "/v3/./orders/../orders%2fopen?q=%7e&q=z&q=%7E", headers: [["X-GW-Key-Id", "gw-prod-02"], ["Host", "edge.example.net"]] },
  { method: "POST", target: "/v3/ledger/export", headers: [["X-GW-Key-Id", "gw-prod-01"], ["Host", "edge.example.net"], ["Via", "1.1 egress-7"], ["X-Forwarded-For", "203.0.113.9"], ["Content-Type", "text/csv"]] },
  { method: "GET", target: "/v3/catalog", headers: [["X-GW-Key-Id", "GW-PROD-01"], ["Host", "edge.example.net"]] },
];

const h2 = [
  { method: "POST", target: "/v4/reconciliation?b=&a=1", headers: [["X-GW-Key-Id", "gw-prod-01"], ["Host", "gw2.example.org"], ["Content-Type", "text/plain"]], body: "lineone\nlinetwo" },
  { method: "DELETE", target: "/v4/catalog/9", headers: [["Host", "gw2.example.org"]], body: "" },
  { method: "GET", target: "/v4/ledger?x=b&x=a", headers: [["X-GW-Key-Id", "gw-prod-02"], ["Host", "gw2.example.org"], ["Authorization", `${SCHEME} keyId=gw-prod-02, signature=deadbeef`]] },
  withValidAuth({ method: "put", target: "/v4/./refunds/7?t=b%20c&t=a&dry&t=B", headers: [["X-GW-Key-Id", "gw-prod-02"], ["Host", "gw2.example.org"], ["Content-Type", "\tapplication/json;  charset=utf-8 "], ["Via", "1.1 egress-2"]] }),
  { method: "GET", target: "/v4/ledger", headers: [["X-GW-Key-Id", "gw-prod-01"], ["Host", "gw2.example.org"], ["Authorization", `${SCHEME}  keyId=gw-prod-01, signature=${ZEROS}`]] },
];

function emit(name, file, records) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(records, null, 2) + "\n");
  const out = records.map((r, i) => JSON.stringify(evidence(r, i + 1)) + "\n").join("");
  console.log(`== ${name}  sha256 ${createHash("sha256").update(out).digest("hex")}`);
  process.stdout.write(out);
}

emit("sample", join(HARD, "environment", "app", "requests", "sample-requests.json"), sample);
emit("h1", join(HARD, "tests", "holdout", "h1", "requests.json"), h1);
emit("h2", join(HARD, "tests", "holdout", "h2", "requests.json"), h2);
