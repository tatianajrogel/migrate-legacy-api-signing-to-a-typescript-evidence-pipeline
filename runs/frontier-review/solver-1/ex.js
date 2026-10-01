const fs=require('fs'),path=require('path');
const d=require("path").resolve(__dirname, "../../../frontier").replace(/\\/g, "/") + '/environment/app/dossier';
const filler=/^(Proxy upgrade|Capacity|SDK rollout|Dashboards|Rollback rehearsal|Load test|Evidence retention|Access and accounts|Host gw-edge-0\d|\w+ (update|sandbox|cutover|smoke test|replay results|runbook|queue))$/;
const mode=process.argv[2];
for(const f of fs.readdirSync(d).sort()){
  if(!/^(0[3-9]|1[0-2])/.test(f))continue;
  const t=fs.readFileSync(path.join(d,f),'utf8');
  const secs=t.split(/\n(?=## )/);
  console.log('\n######## '+f+'\n'+secs[0].split('\n').slice(0,4).join(' | '));
  for(const s of secs.slice(1)){
    const h=s.split('\n')[0].slice(3).trim();
    const isF=filler.test(h);
    if(mode==='dec'&&!isF)console.log('['+h+'] '+s.split('\n').slice(1).join(' ').trim());
    if(mode==='fill'&&isF&&/GW-HMAC|inbound|partner request|gateway request|request signer|Agreed|Decision|agreed|correct|roster|revers|supersed|withdraw|rotat|retire|revoke|key id match|percent|escape|whitespace/i.test(s))console.log('['+h+'] '+s.split('\n').slice(1).join(' ').trim());
  }
}
