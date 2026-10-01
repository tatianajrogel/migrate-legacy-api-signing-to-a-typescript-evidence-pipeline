const {recs,canon,key,c}=require('./sig.js');
for(const idx of [5,6]){const r=recs[idx];const want=r.headers.find(h=>h[0]==='Authorization')[1].split('signature=')[1];const id=r.headers[0][1];
for(const order of ['n','nv','dec'])for(const hv of ['raw','strip','collapse'])for(const set of ['all','gwct','gw'])for(const body of ['sha','absent','unsigned'])for(const nl of [false,true])for(const bare of [false,true])for(const up of [false,true])for(const join of [';',','])for(const strip of [false,true]){
 const o={order,hv,set,body,nl,bare,up,join};const s=c.createHmac('sha256',key(id,strip)).update(canon(r,o)).digest('hex');if(s===want)console.log('rec',idx+1,JSON.stringify(o),'strip',strip);}}
