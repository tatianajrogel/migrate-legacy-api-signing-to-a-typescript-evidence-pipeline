const fs=require('fs'),c=require('crypto');const app=require("path").resolve(__dirname, "../../../frontier").replace(/\\/g, "/") + '/environment/app/';
const recs=JSON.parse(fs.readFileSync(app+'requests/sample-requests.json','utf8'));
const cmp=(a,b)=>Buffer.compare(Buffer.from(a),Buffer.from(b));
function canon(r,o){const t=r.target,q=t.indexOf('?');const path=q<0?t:t.slice(0,q);const qs=q<0?'':t.slice(q+1);
 let pairs=qs===''?[]:qs.split('&').map(p=>{const e=p.indexOf('=');return e<0?[p,'',false]:[p.slice(0,e),p.slice(e+1),true]});
 if(o.up)pairs=pairs.map(([n,v,e])=>[n.replace(/%[0-9a-f]{2}/gi,m=>m.toUpperCase()),v.replace(/%[0-9a-f]{2}/gi,m=>m.toUpperCase()),e]);
 const dec=v=>{try{return decodeURIComponent(v.replace(/\+/g,' '))}catch{return v}};
 if(o.order==='nv')pairs.sort((a,b)=>cmp(a[0],b[0])||cmp(a[1],b[1]));else if(o.order==='dec')pairs.sort((a,b)=>cmp(a[0],b[0])||cmp(dec(a[1]),dec(b[1])));else pairs.sort((a,b)=>cmp(a[0],b[0]));
 const cq=pairs.map(([n,v,e])=>(o.bare&&!e)?n:`${n}=${v}`).join('&');
 const hv=v=>o.hv==='collapse'?v.replace(/^[ \t]+|[ \t]+$/g,'').replace(/[ \t]+/g,' '):o.hv==='strip'?v.replace(/^[ \t]+|[ \t]+$/g,''):v;
 let hs=r.headers.map(([n,v])=>[n.toLowerCase(),hv(v)]).filter(([n])=>o.set==='all'?n!=='authorization':o.set==='gwct'?(n.startsWith('x-gw-')||n==='content-type'):n.startsWith('x-gw-'));
 hs.sort((a,b)=>cmp(a[0],b[0]));
 const hasBody=r.body!==undefined&&r.body!==null;const body=hasBody?r.body:'';
 const bh=o.body==='sha'?c.createHash('sha256').update(body).digest('hex'):o.body==='absent'?(hasBody?c.createHash('sha256').update(body).digest('hex'):'UNSIGNED'):(body===''?'UNSIGNED':c.createHash('sha256').update(body).digest('hex'));
 return [r.method.toUpperCase(),path,cq,hs.map(([n,v])=>n+':'+v).join('\n'),hs.map(h=>h[0]).join(o.join||';'),bh].join('\n')+(o.nl?'\n':'');}
const key=(id,strip)=>{let k=fs.readFileSync(app+'keys/'+id+'.key');if(strip)k=Buffer.from(k.toString('latin1').replace(/\r?\n$/,''),'latin1');return k};
module.exports={recs,canon,key,c};
if(require.main===module){const final={order:'nv',hv:'collapse',set:'all',body:'sha',nl:false,bare:false,up:false};
 recs.forEach((r,i)=>{const id=(r.headers.find(h=>h[0].toLowerCase()==='x-gw-key-id')||[])[1]||'';const cs=canon(r,final);console.log('--- rec',i+1,id);console.log(JSON.stringify(cs));
  if(['gw-prod-01','gw-prod-02'].includes(id))for(const s of [false,true])console.log(s?'stripped':'whole   ',c.createHmac('sha256',key(id,s)).update(cs).digest('hex'));
  const a=r.headers.find(h=>h[0].toLowerCase()==='authorization');if(a)console.log('presented',a[1]);});}
