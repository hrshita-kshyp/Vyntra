import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { createFitHandler, seal, unseal } from '../server/googleFit.js';
const key = randomBytes(32).toString('base64');
const env = { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_ANON_KEY: 'anon', SUPABASE_SERVICE_ROLE_KEY: 'service', GOOGLE_CLIENT_ID: 'client', GOOGLE_CLIENT_SECRET: 'secret', GOOGLE_FIT_TOKEN_ENCRYPTION_KEY: key, GOOGLE_FIT_ALLOWED_ORIGINS: 'https://vyntra.ranuvo.tech' };
const rows = new Map(); let oauthCalls = 0; let revoked = false; let invalidGrant = false; let noRefresh = false; let disconnectDuringRefresh = false;
const scope = 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.heart_rate.read';
function clientFactory(_url, credential) {
  if (credential === 'anon') return { auth: { getUser: async jwt => ({ data: { user: jwt === 'bad' ? null : { id: jwt } }, error: null }) } };
  assert.equal(credential, 'service');
  return { from: () => {
    let id, operation='read', payload;
    const q = {
      select: () => q, eq: (_field, value) => { id=value;return q; },
      maybeSingle: async () => ({ data: rows.get(id) || null, error: null }),
      upsert: async value => { rows.set(value.user_id,value); return { error:null }; },
      update: value => { operation='update';payload=value;return q; },
      delete: () => { operation='delete';return q; },
      then: (resolve,reject) => Promise.resolve().then(()=> { if(operation==='delete') rows.delete(id);if(operation==='update'&&rows.has(id)) rows.set(id,{...rows.get(id),...payload});return {error:null}; }).then(resolve,reject),
    };return q;
  } };
}
const fetcher = async (url, request) => {
  if (url.endsWith('/revoke')) { revoked=true; return { ok:true }; }
  assert.equal(url,'https://oauth2.googleapis.com/token');
  assert.equal(request.body.get('client_secret'),'secret');oauthCalls++;
  if (request.body.get('grant_type') === 'refresh_token') {
    assert.equal(request.body.get('refresh_token'),'private-refresh');
    if(disconnectDuringRefresh) rows.delete('A');
    if(invalidGrant)return {ok:false,json:async()=>({error:'invalid_grant'})};
    return {ok:true,json:async()=>({access_token:'renewed-access',expires_in:3600})};
  }
  assert.equal(request.body.get('redirect_uri'),'https://vyntra.ranuvo.tech');
  return {ok:true,json:async()=>({access_token:'initial-access',...(noRefresh?{}:{refresh_token:'private-refresh'}),expires_in:3600,scope})};
};
const handler = createFitHandler({ env, clientFactory, fetcher });
async function call(action, {user='A', origin='https://vyntra.ranuvo.tech', header='Vyntra',body={}}={}) {
  const req={url:'/api/google-fit?action='+action,method:action==='status'?'GET':'POST',headers:{origin,authorization:user?'Bearer '+user:undefined,'x-requested-with':header},body};
  const res={headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(v){this.body=v;}};
  await handler(req,res);assert.equal(res.headers['Cache-Control'],'no-store');return res;
}
const encrypted=seal('private-refresh',key);assert.ok(!encrypted.includes('private-refresh'));assert.equal(unseal(encrypted,key),'private-refresh');assert.throws(()=>unseal(encrypted,randomBytes(32).toString('base64')));
assert.equal((await call('token',{user:null})).code,401);
assert.equal((await call('token',{user:'bad'})).code,401);
assert.equal((await call('connect',{origin:'https://evil.example',body:{code:'code'}})).code,403);
assert.equal((await call('connect',{header:'',body:{code:'code'}})).code,403);
assert.equal((await call('connect')).code,400);
assert.equal(oauthCalls,0);
let result=await call('connect',{body:{code:'one-time-code'}});assert.equal(result.code,200);assert.equal(result.body.accessToken,'initial-access');assert.equal(result.body.refresh_token,undefined);assert.equal(unseal(rows.get('A').refresh_token,key),'private-refresh');assert.ok(!JSON.stringify(rows.get('A')).includes('private-refresh'));
assert.equal((await call('status',{user:'B'})).body.connected,false);assert.equal((await call('token',{user:'B'})).body.connected,false);
assert.equal((await call('token')).body.accessToken,'initial-access');assert.equal(oauthCalls,1);
rows.get('A').expires_at=0;result=await call('token');assert.equal(result.body.accessToken,'renewed-access');assert.equal(oauthCalls,2);
noRefresh=true;result=await call('connect',{body:{code:'new-code'}});assert.equal(result.code,200);assert.equal(unseal(rows.get('A').refresh_token,key),'private-refresh');
result=await call('connect',{user:'B',body:{code:'no-offline'}});assert.equal(result.code,409);assert.equal(rows.has('B'),false);noRefresh=false;
result=await call('disconnect');assert.equal(result.code,200);assert.equal(rows.has('A'),false);assert.equal(revoked,true);
await call('connect',{body:{code:'reconnect'}});invalidGrant=true;result=await call('token',{body:{force:true}});assert.equal(result.code,409);assert.equal(result.body.code,'reconnect_required');assert.equal(rows.has('A'),false);
invalidGrant=false;await call('connect',{body:{code:'reconnect'}});disconnectDuringRefresh=true;result=await call('token',{body:{force:true}});assert.equal(result.body.connected,false);assert.equal(rows.has('A'),false);
console.log('PASS encrypted credentials, authentication, CSRF, account isolation, code exchange, automatic renewal, missing refresh grant, disconnect and revoked consent');
