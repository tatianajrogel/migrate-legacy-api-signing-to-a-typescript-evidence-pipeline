const fs=require('fs');const dir=require("path").resolve(__dirname, "../../../frontier").replace(/\\/g, "/") + '/environment/app/dossier/';
const files=fs.readdirSync(dir).filter(f=>f!=='01-decision-register.md').sort();
const norm=s=>s.replace(/\b[A-Z]\. [A-Z][a-z]+\b/g,'NAME').replace(/gw-edge-\d+/g,'HOST').replace(/\d{4}-\d\d-\d\d/g,'DATE').replace(/\d+(\.\d+)?k?/g,'N').replace(/\b(orders|refunds|payouts|ledger|catalog|disputes|webhooks|onboarding|settlement|reconciliation)\b/g,'SVC').replace(/\b(Globex|Northwind|Contoso|Initech|Umbrella)\b/g,'PARTNER').replace(/\b(billing|identity|sre-core|fraud-ops|edge-platform|partner-integrations|payments-api|data-plane)\b/g,'TEAM');
const all=[];
for(const f of files){const t=fs.readFileSync(dir+f,'utf8');const secs=t.split(/\n(?=## )/);for(const s of secs){const lines=s.split('\n');const head=lines[0];const body=lines.slice(1).join(' ').trim();const sents=body.split(/(?<=[.?!])\s+(?=[A-Z`"'(\d])/).filter(x=>x);all.push({f,head,sents});}}
const cnt={};for(const s of all)for(const x of s.sents){const k=norm(x);cnt[k]=(cnt[k]||0)+1;}
const which=process.argv[2];
for(const s of all){if(which&&!s.f.startsWith(which))continue;const keep=s.sents.filter(x=>cnt[norm(x)]<8);if(keep.length){console.log(`[${s.f}] ${s.head}\n  ${keep.join(' ')}\n`);}}
