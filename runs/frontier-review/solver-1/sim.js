const fs=require('fs'),c=require('crypto');
const A=require("path").resolve(__dirname, "../../../frontier").replace(/\\/g, "/") + '/environment/app/';
const recs=JSON.parse(fs.readFileSync(A+'requests/sample-requests.json','utf8'));
const cmp=(a,b)=>Buffer.compare(Buffer.from(a),Buffer.from(b));
function canon(r,o){
  const t=r.target,q=t.indexOf('?');const path=q<0?t:t.slice(0,q);const qs=q<0?'':t.slice(q+1);
  let pairs=qs===''?[]:qs.split('&').map(p=>{const e=p.indexOf('=');return e<0?[p,'',false]:[p.slice(0,e),p.slice(e+1),true]});
  const dec=v=>{try{return decodeURIComponent(v.replace(/\+/g,' '))}catch{return v}};
  pairs=pairs.map((p,i)=>[...p,i]);
  pairs.sort((a,b)=>cmp(a[0],b[0])||(o.qorder==='namevalue'?cmp(a[1],b[1]):o.qorder==='decoded'?cmp(dec(a[1]),dec(b[1])):0)||a[3]-b[3]);
  let cq=pairs.map(p=>(p[2]||!o.bare)?p[0]+'='+p[1]:p[0]).join('&');
  let pth=path; if(o.upper){const u=s=>s.replace(/%[0-9a-fA-F]{2}/g,m=>m.toUpperCase());pth=u(pth);cq=u(cq);}
  let hs=r.headers.map(([n,v])=>[n.toLowerCase(),v]).filter(([n])=>o.hdr==='all'?n!=='authorization':o.hdr==='ct'?(n.startsWith('x-gw-')||n==='content-type'):n.startsWith('x-gw-'));
  hs=hs.map(([n,v])=>[n,o.hv==='collapse'?v.replace(/^[ \t]+|[ \t]+$/g,'').replace(/[ \t]+/g,' '):o.hv==='trim'?v.replace(/^[ \t]+|[ \t]+$/g,''):v]);
  hs=hs.map((h,i)=>[...h,i]).sort((a,b)=>cmp(a[0],b[0])||a[2]-b[2]);
  const sha=s=>c.createHash('sha256').update(s,'utf8').digest('hex');
  let bh; if(o.body==='always')bh=sha(r.body??''); else if(o.body==='absent')bh=r.body===undefined?'UNSIGNED':sha(r.body); else bh=(r.body??'')===''?'UNSIGNED':sha(r.body);
  return [r.method.toUpperCase(),pth,cq,hs.map(h=>h[0]+':'+h[1]).join('\n'),hs.map(h=>h[0]).join(o.sep||';'),bh].join('\n')+(o.nl?'\n':'');
}
const roster=['gw-prod-01','gw-prod-02'];
const key=(id,strip)=>{let b=fs.readFileSync(A+'keys/'+id+'.key');if(strip)b=b.subarray(0,b.length-1);return b};
const F={qorder:'namevalue',bare:false,upper:false,hdr:'all',hv:'collapse',body:'always',nl:false,sep:';'};
module.exports={canon,recs,key,F,roster};
if(require.main===module){
recs.forEach((r,i)=>{
  const kid=(r.headers.find(([n])=>n.toLowerCase()==='x-gw-key-id')||[])[1]??'';
  const auth=(r.headers.find(([n])=>n.toLowerCase()==='authorization')||[])[1];
  const cs=canon(r,F);
  let out,reason,sig='';
  if(kid==='')[out,reason]=['rejected','missing-key-id'];
  else if(!roster.includes(kid))[out,reason]=['rejected','unknown-key-id'];
  else{ sig=c.createHmac('sha256',key(kid,false)).update(cs).digest('hex');
    const sigS=c.createHmac('sha256',key(kid,true)).update(cs).digest('hex');
    if(auth===undefined)out='signed';
    else{const pre='GW-HMAC-SHA256 keyId='+kid+', signature=';
      if(!auth.startsWith(pre))[out,reason]=['rejected','malformed-authorization'];
      else{const p=auth.slice(pre.length).trim(); out=p===sig?'verified(whole key)':p===sigS?'verified(stripped key)':'rejected';if(out==='rejected')reason='signature-mismatch';}}
  }
  console.log(i+1,out,reason||'',sig);console.log(JSON.stringify(cs));
});
}
