// Builds the suggested h3 additions with valid signatures (keys identical in
// both variants for gw-prod-01/02, which is why h3 is byte-identical), and
// prints the reference line for each so the expected outcome is on record.
import { writeFileSync } from "node:fs";
import { KEYS, SCHEME, reference } from "./harness.mjs";

const HOST = ["Host", "contract.example.net"];
const rec = (target, keyId, extra = [], body) => {
  const r = { method: "GET", target, headers: [["X-GW-Key-Id", keyId], HOST, ...extra] };
  if (body !== undefined) r.body = body;
  return r;
};
const sig = (r) => reference(r, 1, KEYS.base).signature;
const withAuth = (r, make) => ({ ...r, headers: [...r.headers, ["Authorization", make(sig(r))]] });

const out = {
  "scheme-case-insensitive": withAuth(rec("/v5/contract/scheme-case", "gw-prod-01"), (s) => `gw-hmac-sha256 keyId=gw-prod-01, signature=${s}`),
  "param-names-case-insensitive": withAuth(rec("/v5/contract/param-case", "gw-prod-02"), (s) => `${SCHEME} keyid=gw-prod-02, Signature=${s}`),
  "keyid-value-case-insensitive": withAuth(rec("/v5/contract/keyid-case", "gw-prod-01"), (s) => `${SCHEME} keyId=GW-PROD-01, signature=${s}`),
  "comma-then-one-or-more-spaces": withAuth(rec("/v5/contract/two-spaces", "gw-prod-02"), (s) => `${SCHEME} keyId=gw-prod-02,  signature=${s}`),
  "whitespace-around-equals-and-before-comma": withAuth(rec("/v5/contract/spaced-equals", "gw-prod-01"), (s) => `${SCHEME} keyId = gw-prod-01 , signature = ${s}`),
  "scheme-then-one-or-more-spaces": withAuth(rec("/v5/contract/scheme-two-spaces", "gw-prod-01"), (s) => `${SCHEME}  keyId=gw-prod-01, signature=${s}`),
  "trailing-params-ignored": withAuth(rec("/v5/contract/trailing-param", "gw-prod-02"), (s) => `${SCHEME} keyId=gw-prod-02, signature=${s}, nonce=17`),
  "quoted-signature-accepted": withAuth(rec("/v5/contract/quoted", "gw-prod-01"), (s) => `${SCHEME} keyId=gw-prod-01, signature="${s}"`),
  "empty-signature-malformed": withAuth(rec("/v5/contract/empty-sig", "gw-prod-02"), () => `${SCHEME} keyId=gw-prod-02, signature=`),
  "leading-whitespace-is-malformed": withAuth(rec("/v5/contract/leading-space", "gw-prod-01"), (s) => ` ${SCHEME} keyId=gw-prod-01, signature=${s}`),
  "header-name-case-sensitive": (() => { const r = rec("/v5/contract/lower-name", "gw-prod-02"); return { ...r, headers: [...r.headers, ["authorization", `${SCHEME} keyId=gw-prod-02, signature=${sig(r)}`]] }; })(),
  "duplicate-authorization": (() => { const r = rec("/v5/contract/dup", "gw-prod-01"); return { ...r, headers: [...r.headers, ["Authorization", `${SCHEME} keyId=gw-prod-01, signature=${sig(r)}`], ["Authorization", "Bearer x"]] }; })(),
  "empty-authorization-value-as-absent": withAuth(rec("/v5/contract/empty-auth", "gw-prod-02"), () => ""),
  "trim-ascii-space-tab-only": withAuth(rec("/v5/contract/tab-padded", "gw-prod-01"), (s) => `${SCHEME} keyId=gw-prod-01, signature=\t${s}\r\n`),
  "record-key-id-untrimmed": (() => { const r = { method: "GET", target: "/v5/contract/padded-key-id", headers: [["X-GW-Key-Id", " gw-prod-02 "], HOST] }; return { ...r, headers: [...r.headers, ["Authorization", `${SCHEME} keyId=gw-prod-02, signature=${sig(r)}`]] }; })(),
};

for (const [id, r] of Object.entries(out)) {
  console.log(`== ${id}\n   record:   ${JSON.stringify(r)}\n   expected: ${JSON.stringify(reference(r, 1, KEYS.base))}`);
}
writeFileSync(new URL("./suggested_h3.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
