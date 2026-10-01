import { readFileSync, readdirSync } from "node:fs";
const D = "../../../frontier/environment/app/dossier/";
const AL = {
  GW: ["inbound request signing", "the gateway request scheme", "partner request signing", "GW-HMAC-SHA256"],
  WH: ["outbound webhook signing", "the webhook signer", "callback signing", "WH-HMAC-SHA256"],
  BX: ["export manifest signing", "the export signer", "batch manifest signing", "BX-HMAC-SHA256"],
  MS: ["service mesh signing", "the mesh signer", "internal service signing", "MS-HMAC-SHA256"],
  AD: ["admin API signing", "the admin signer", "ops tooling signing", "AD-HMAC-SHA256"],
};
const TOP = {
  "Header values":"header_values","Header value spacing":"header_values","Query ordering":"query_order","Repeated query names":"query_order",
  "Signed header set":"signed_headers","Which headers are signed":"signed_headers","Body hash":"body_hash","Empty bodies":"body_hash",
  "String terminator":"terminator","End of the string to sign":"terminator","Escapes in the target":"escapes","Percent escapes":"escapes",
  "Valueless parameters":"valueless","Parameters with no value":"valueless","Path handling":"path","Dot segments":"path",
  "Key ids":"key_id_match","Key id matching":"key_id_match","Name list separator":"names_join","Signed name list":"names_join",
  "Key loading":"key_loading","Key files":"key_loading","Corrections to earlier minutes":"CORR","Minutes":"CORR"};
const out = [];
for (const f of readdirSync(D).sort()) {
  const t = readFileSync(D + f, "utf8");
  const secs = t.split(/\n(?=## |- )/);
  for (const s of secs) {
    const low = s;
    const who = Object.entries(AL).filter(([k, as]) => as.some(a => low.toLowerCase().includes(a.toLowerCase()))).map(([k]) => k);
    const h = (s.match(/^## (.*)/) || [,""])[1];
    if (who.length || TOP[h]) out.push({ f: f.slice(0,13), h, dim: TOP[h] || "", who: who.join("+"), text: s.replace(/^## .*\n\n/, "").trim() });
  }
}
const mode = process.argv[2];
for (const o of out) {
  if (mode === "gw" && !o.who.includes("GW")) continue;
  if (mode === "dim" && o.dim !== process.argv[3] && !(o.dim==="CORR")) continue;
  console.log(`[${o.f}] <${o.h}> {${o.dim}} (${o.who})\n  ${o.text}\n`);
}
