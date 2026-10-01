// Prints the request records that would catch each surviving key-lens
// departure if added to h3, with the evidence line the reference produces and
// the line the departure produces.
import { SCHEME } from "file:///C:/expert/migrate-legacy-api-signing-to-a-typescript-evidence-pipeline/analysis/scheme.mjs";
import { reference, loadSet, KEYS } from "./harness.mjs";
import { keyEvidence } from "./departures.mjs";

const host = ["Host", "contract.example.net"];
const sig = (rec) => reference(rec, 1, "base").signature;
const plain = { method: "GET", target: "/v5/contract/auth-key-case", headers: [["X-GW-Key-Id", "gw-prod-01"], host] };

const suggestions = [
  ["D2 padded key id", { method: "POST", target: "/v5/contract/padded-key-id", headers: [["X-GW-Key-Id", "  gw-prod-01  "], host], body: "{}" }, { key_id_value: "verbatim" }],
  ["D3 duplicate key id header", { method: "POST", target: "/v5/contract/dup-key-id", headers: [["X-GW-Key-Id", "gw-prod-01"], host, ["x-gw-key-id", "gw-prod-02"]], body: "{}" }, { duplicate_header: "last" }],
  ["D4 empty key id value", { method: "GET", target: "/v5/contract/empty-key-id", headers: [["X-GW-Key-Id", ""], host] }, { empty_value: "present" }],
  ["D5 path in key id", { method: "GET", target: "/v5/contract/traversal", headers: [["X-GW-Key-Id", "../keys/gw-prod-01"], host] }, { key_lookup: "resolve-path-then-roster" }],
  ["D6 key id in other case (base lacks it)", { method: "GET", target: "/v5/contract/key-case", headers: [["X-GW-Key-Id", "GW-PROD-02"], host] }, { key_id_case: "any-case" }],
  ["D9 Authorization keyId in other case", { ...plain, headers: [...plain.headers, ["Authorization", `${SCHEME} keyId=GW-PROD-01, signature=${sig(plain)}`]] }, { auth_key_id_case: "any-case" }],
];

for (const [label, rec, overrides] of suggestions) {
  console.log(`\n== ${label}`);
  console.log(`   record:    ${JSON.stringify(rec)}`);
  for (const variant of ["base", "hard"]) {
    console.log(`   ${variant} reference: ${JSON.stringify(reference(rec, 1, variant))}`);
    console.log(`   ${variant} departure: ${JSON.stringify(keyEvidence(rec, 1, variant, overrides))}`);
  }
}

// D5 on the shipped sample: which key files does the resolve-path departure open?
console.log("\n== D5 key files the resolve-path departure would open on each graded set");
import path from "node:path";
for (const variant of ["base", "hard"]) {
  for (const name of ["sample", "h1", "h2", "h3"]) {
    const opened = new Set();
    for (const rec of loadSet(variant, name)) {
      const hit = rec.headers.find(([n]) => n.toLowerCase() === "x-gw-key-id");
      if (!hit) continue;
      const resolved = path.posix.resolve("/app/keys", `${hit[1].trim()}.key`);
      const base = path.posix.basename(resolved).slice(0, -4);
      if (["gw-prod-01", "gw-prod-02"].includes(base)) opened.add(path.posix.basename(resolved));
    }
    console.log(`   ${variant}/${name}: ${[...opened].join(", ")}`);
  }
}
