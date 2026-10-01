import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
export const D = `${fileURLToPath(new URL("../../../frontier", import.meta.url)).replace(/\\/g, "/")}/environment/app/dossier`;
export const ALIAS = {
  GW: ["inbound request signing", "the gateway request scheme", "partner request signing", "GW-HMAC-SHA256"],
  WH: ["outbound webhook signing", "the webhook signer", "callback signing", "WH-HMAC-SHA256"],
  BX: ["export manifest signing", "the export signer", "batch manifest signing", "BX-HMAC-SHA256"],
  MS: ["service mesh signing", "the mesh signer", "internal service signing", "MS-HMAC-SHA256"],
  AD: ["admin API signing", "the admin signer", "ops tooling signing", "AD-HMAC-SHA256"],
};
export function sections() {
  const out = [];
  for (const f of readdirSync(D).sort()) {
    const t = readFileSync(`${D}/${f}`, "utf8");
    const blocks = t.split(/\n\n/);
    let heading = "";
    let idx = 0;
    for (const b of blocks) {
      if (b.startsWith("## ")) { heading = b.slice(3).trim(); continue; }
      if (b.startsWith("# ")) continue;
      out.push({ file: f, heading, text: b.trim(), idx: idx++, off: t.indexOf(b) / t.length });
    }
  }
  return out;
}
export const schemesIn = (text) => Object.entries(ALIAS).filter(([, as]) => as.some((a) => text.toLowerCase().includes(a.toLowerCase()))).map(([k]) => k);
