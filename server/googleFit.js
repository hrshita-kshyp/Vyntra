import { createClient } from '@supabase/supabase-js';
import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

const scopes = ['https://www.googleapis.com/auth/fitness.activity.read', 'https://www.googleapis.com/auth/fitness.heart_rate.read'];
const table = 'google_fit_connections';
export function seal(value, key) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(key, 'base64'), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map(v => v.toString('base64')).join('.');
}
export function unseal(value, key) {
  const [iv, tag, data] = value.split('.').map(v => Buffer.from(v, 'base64'));
  const cipher = createDecipheriv('aes-256-gcm', Buffer.from(key, 'base64'), iv);
  cipher.setAuthTag(tag);
  return Buffer.concat([cipher.update(data), cipher.final()]).toString('utf8');
}
function failure(status, message, code) { return Object.assign(new Error(message), { status, code }); }

// Dependency injection keeps authentication, encryption and OAuth testable
// without making real requests or granting real Google permissions.
export function createFitHandler({ env = process.env, fetcher = fetch, clientFactory = createClient } = {}) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    const send = (status, body) => res.status(status).json(body);
    try {
      const action = new URL(req.url, 'http://localhost').searchParams.get('action') || 'status';
      if (!['status', 'connect', 'token', 'disconnect'].includes(action)) return send(404, { error: 'Unknown action.' });
      if (req.method !== (action === 'status' ? 'GET' : 'POST')) return send(405, { error: 'Method not allowed.' });
      const origin = req.headers.origin;
      const origins = (env.GOOGLE_FIT_ALLOWED_ORIGINS || 'https://vyntra.ranuvo.tech').split(',').map(v => v.trim());
      if (req.method === 'POST' && (!origins.includes(origin) || req.headers['x-requested-with'] !== 'Vyntra')) return send(403, { error: 'Request origin is not allowed.' });
      const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
      const anon = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
      if (!url || !anon) throw failure(503, 'Account authentication is not configured.');
      const jwt = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
      if (!jwt) return send(401, { error: 'Sign in to Vyntra first.' });
      const auth = clientFactory(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
      const { data: { user }, error: authError } = await auth.auth.getUser(jwt);
      if (authError || !user) return send(401, { error: 'Your Vyntra session expired. Sign in again.' });
      const clientId = env.GOOGLE_CLIENT_ID || env.VITE_GOOGLE_CLIENT_ID;
      const key = env.GOOGLE_FIT_TOKEN_ENCRYPTION_KEY;
      const enabled = !!(clientId && env.GOOGLE_CLIENT_SECRET && env.SUPABASE_SERVICE_ROLE_KEY && key && Buffer.from(key, 'base64').length === 32);
      if (!enabled) return send(action === 'status' ? 200 : 503, { enabled: false, connected: false, error: 'Automatic Google Fit renewal is not configured yet.' });
      const db = clientFactory(url, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
      const { data: saved, error: readError } = await db.from(table).select('*').eq('user_id', user.id).maybeSingle();
      if (readError) throw failure(503, 'Google Fit storage is not ready. Apply the connection migration.');
      const query = () => db.from(table);
      async function save(record) {
        const { error } = await query().upsert({ user_id: user.id, ...record, updated_at: new Date().toISOString() });
        if (error) throw failure(503, 'Could not save the Google Fit connection. Try again.');
      }
      async function remove() { const { error } = await query().delete().eq('user_id', user.id); if (error) throw failure(503, 'Could not remove the saved connection. Try again.'); }
      async function googleToken(parameters) {
        const response = await fetcher('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: clientId, client_secret: env.GOOGLE_CLIENT_SECRET, ...parameters }), signal: AbortSignal.timeout(15000) });
        const data = await response.json();
        if (!response.ok) {
          if (data.error === 'invalid_grant' && parameters.grant_type === 'refresh_token') { await remove(); throw failure(409, 'Google permission expired or was revoked. Connect Google Fit again.', 'reconnect_required'); }
          throw failure(502, 'Google could not authorize this connection. Try again.', 'google_authorization_failed');
        }
        if (!data.access_token || !Number.isFinite(Number(data.expires_in)) || Number(data.expires_in) <= 0) throw failure(502, 'Google returned an invalid token response.');
        return data;
      }
      if (action === 'status') return send(200, { enabled: true, connected: !!saved });
      if (action === 'disconnect') {
        // Delete first so the app cannot continue refreshing after disconnect.
        await remove();
        if (saved) { try { await fetcher('https://oauth2.googleapis.com/revoke', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ token: unseal(saved.refresh_token, key) }), signal: AbortSignal.timeout(10000) }); } catch { /* Cloud connection was removed; Google account controls remain available. */ } }
        return send(200, { connected: false });
      }
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      if (action === 'connect') {
        if (typeof body.code !== 'string' || !body.code || body.code.length > 4096) return send(400, { error: 'Missing Google authorization code.' });
        const tokens = await googleToken({ code: body.code, grant_type: 'authorization_code', redirect_uri: origin });
        const granted = (tokens.scope || '').split(' ');
        if (!scopes.every(scope => granted.includes(scope))) throw failure(403, 'Allow activity and heart-rate read permissions to connect Google Fit.');
        const refresh = tokens.refresh_token ? seal(tokens.refresh_token, key) : saved?.refresh_token;
        if (!refresh) throw failure(409, 'Google did not grant offline access. Remove Vyntra in Google Account connections, then connect again.', 'offline_access_required');
        const expiresAt = Date.now() + Number(tokens.expires_in) * 1000;
        await save({ refresh_token: refresh, access_token: seal(tokens.access_token, key), expires_at: expiresAt });
        return send(200, { enabled: true, connected: true, accessToken: tokens.access_token, expiresAt });
      }
      if (!saved) return send(200, { enabled: true, connected: false });
      if (!body.force && Number(saved.expires_at) > Date.now() + 60000) return send(200, { enabled: true, connected: true, accessToken: unseal(saved.access_token, key), expiresAt: Number(saved.expires_at) });
      const tokens = await googleToken({ grant_type: 'refresh_token', refresh_token: unseal(saved.refresh_token, key) });
      const expiresAt = Date.now() + Number(tokens.expires_in) * 1000;
      // An explicit disconnect that happened during the Google request wins.
      const { data: remaining, error: checkError } = await query().select('user_id').eq('user_id', user.id).maybeSingle();
      if (checkError) throw failure(503, 'Could not verify the connection. Try again.');
      if (!remaining) return send(200, { enabled: true, connected: false });
      const { error: updateError } = await query().update({ access_token: seal(tokens.access_token, key), refresh_token: tokens.refresh_token ? seal(tokens.refresh_token, key) : saved.refresh_token, expires_at: expiresAt, updated_at: new Date().toISOString() }).eq('user_id', user.id);
      if (updateError) throw failure(503, 'Could not save the renewed session. Try again.');
      return send(200, { enabled: true, connected: true, accessToken: tokens.access_token, expiresAt });
    } catch (error) { return send(error.status || 500, { error: error.status ? error.message : 'Google Fit connection could not be processed. Try again.', code: error.code }); }
  };
}
