import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { createJournalHandler, validateJournal } from '../server/journal.js';
import { unseal } from '../server/googleFit.js';
const key=randomBytes(32).toString('base64');
const env={SUPABASE_URL:'https://example.supabase.co',SUPABASE_ANON_KEY:'anon',SUPABASE_SERVICE_ROLE_KEY:'service',GOOGLE_FIT_TOKEN_ENCRYPTION_KEY:key};
const plans=new Map([['A',{user_id:'A',pro_until:new Date(Date.now()+3600000).toISOString()}]]),backups=new Map();
function clientFactory(_url,credential) {
  if(credential==='anon') return {auth:{getUser:async jwt=>({data:{user:jwt==='bad'?null:{id:jwt}},error:null})}};
  assert.equal(credential,'service');
  return {from:table=>{const map=table==='user_entitlements'?plans:backups;let id,revision,operation='read',payload;
    const execute=()=>{let row=map.get(id);if(revision!==undefined&&row?.revision!==revision)row=null;
      if(operation==='delete')map.delete(id);
      if(operation==='update'&&row){map.set(id,{...row,...payload});row=map.get(id);}
      return {data:row||null,error:null};};
    const q={select:()=>q,eq:(field,v)=>{if(field==='user_id')id=v;else if(field==='revision')revision=v;return q;},maybeSingle:async()=>execute(),update:v=>{operation='update';payload=v;return q;},delete:()=>{operation='delete';return q;},insert:async v=>{if(map.has(v.user_id))return {error:{code:'23505'}};map.set(v.user_id,v);return {error:null};},then:(resolve,reject)=>Promise.resolve(execute()).then(resolve,reject)};return q;
  }};
}
const handler=createJournalHandler({env,clientFactory});
async function call(action,{user='A',origin='https://vyntra.ranuvo.tech',body={}}={}){
 const req={url:'/api/journal?action='+action,method:action==='status'?'GET':'POST',headers:{authorization:user?'Bearer '+user:undefined,origin,'x-requested-with':'Vyntra'},body};
 const res={setHeader(k,v){assert.equal(k,'Cache-Control');assert.equal(v,'no-store');},status(n){this.code=n;return this;},json(v){this.body=v;}};await handler(req,res);return res;
}
const journal={'2026-10-10':{checkedIn:true,note:'Private personal note',activity:{steps:6000},workouts:[]}};
assert.ok(validateJournal(journal));assert.equal(validateJournal({}),false);assert.equal(validateJournal({'2026-02-30':{note:'bad date'}}),false);assert.equal(validateJournal({'2026-10-10':{note:'x'.repeat(256001)}}),false);
assert.equal((await call('save',{user:null})).code,401);assert.equal((await call('save',{user:'bad'})).code,401);assert.equal((await call('save',{origin:'https://evil.example'})).code,403);
assert.equal((await call('status')).body.proActive,true);assert.equal((await call('status',{user:'B'})).body.proActive,false);
assert.equal((await call('save',{user:'B',body:{journal,revision:0}})).code,403);assert.equal(backups.has('B'),false);
assert.equal((await call('save',{body:{journal,revision:0}})).code,200);assert.equal(backups.get('A').revision,1);assert.ok(!backups.get('A').payload.includes('Private'));assert.deepEqual(JSON.parse(unseal(backups.get('A').payload,key)),journal);
assert.equal((await call('restore',{user:'B'})).code,404);assert.equal((await call('save',{body:{journal,revision:0}})).code,409);
assert.equal((await call('save',{body:{journal,revision:1}})).code,200);assert.equal(backups.get('A').revision,2);
plans.get('A').pro_until=new Date(Date.now()-1000).toISOString();assert.equal((await call('save',{body:{journal,revision:2}})).code,403);assert.deepEqual((await call('restore')).body.journal,journal);
await call('delete',{user:'B'});assert.ok(backups.has('A'));assert.equal((await call('delete')).code,200);assert.equal(backups.has('A'),false);
console.log('PASS authentication, origin checks, server-only Pro access, encrypted notes, account isolation, revision conflicts, expired-plan restore and deletion');
