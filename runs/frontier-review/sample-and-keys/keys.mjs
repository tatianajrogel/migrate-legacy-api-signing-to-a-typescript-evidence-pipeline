import { readFileSync } from "node:fs";
import { evidence, CORRECT } from "../../../analysis/scheme.mjs";
const F = "../../../frontier/";
const keyFiles = new Map(["gw-prod-01","gw-prod-02","gw-prod-03"].map(k => [k, readFileSync(`${F}environment/app/keys/${k}.key`)]));
const sample = JSON.parse(readFileSync(`${F}environment/app/requests/sample-requests.json`, "utf8"));
const NOV = { ...CORRECT, query_order:"name-then-decoded-value", signed_headers:"x-gw-plus-content-type", body_hash:"unsigned-when-absent", trailing_newline:"lf", valueless_parameter:"bare" };
for (const [name, r, o] of [["r6",sample[5],CORRECT],["r7",sample[6],NOV]]) for (const k of keyFiles.keys()) for (const kb of ["newline-stripped","verbatim"]) { const kf = new Map(keyFiles); kf.set(r.headers[0][1], keyFiles.get(k)); const e = evidence(r, 1, {...o, key_bytes: kb}, kf); console.log(name, "key material", k, kb, e.outcome, e.reason ?? ""); }
// record 4 under every-file roster
console.log(JSON.stringify(evidence(sample[3],4,{...CORRECT,roster:"every-file-in-directory"},keyFiles)));
console.log(JSON.stringify(evidence(sample[3],4,CORRECT,keyFiles)));
