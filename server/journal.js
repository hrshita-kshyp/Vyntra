import { createClient } from '@supabase/supabase-js';
import { seal, unseal } from './googleFit.js';

export function validateJournal(journal) {
  if (!journal || typeof journal !== 'object' || Array.isArray(journal)) return false;
  const days = Object.entries(journal);
  if (!days.length || days.length > 3660 || Buffer.byteLength(JSON.stringify(journal)) > 256000) return false;
  return days.every(([day, entry]) => /^\d{4}-\d{2}-\d{2}$/.test(day) && !Number.isNaN(Date.parse(day)) && new Date(day).toISOString().slice(0, 10) === day && entry && typeof entry === 'object' && !Array.isArray(entry));
}
export function createJournalHandler({ env = process.env, clientFactory = createClient } = {}) {
  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const send = (code, body) => res.status(code).json(body);
    try {
      const action = new URL(req.url, 'http://localhost').searchParams.get('action') || 'status';
      if (!['status', 'save', 'restore', 'delete'].includes(action)) return send(404, { error: 'Unknown action.' });
      if (req.method !== (action === 'status' ? 'GET' : 'POST')) return send(405, { error: 'Method not allowed.' });
      const origins = (env.GOOGLE_FIT_ALLOWED_ORIGINS || 'https://vyntra.ranuvo.tech').split(',').map(v => v.trim());
      if (req.method === 'POST' && (!origins.includes(req.headers.origin) || req.headers['x-requested-with'] !== 'Vyntra')) return send(403, { error: 'Request origin is not allowed.' });
      const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
      const anon = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
      const jwt = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
      if (!jwt) return send(401, { error: 'Sign in to Vyntra first.' });
      if (!url || !anon) return send(503, { error: 'Account authentication is not configured.' });
      const options = { auth: { persistSession: false, autoRefreshToken: false } };
      const { data: { user }, error: authError } = await clientFactory(url, anon, options).auth.getUser(jwt);
      if (authError || !user) return send(401, { error: 'Sign in to Vyntra again.' });
      const key = env.GOOGLE_FIT_TOKEN_ENCRYPTION_KEY;
      if (!env.SUPABASE_SERVICE_ROLE_KEY || !key || Buffer.from(key, 'base64').length !== 32) return send(action === 'status' ? 200 : 503, { configured: false, proActive: false, error: 'Cloud journal backup is not available yet.' });
      const db = clientFactory(url, env.SUPABASE_SERVICE_ROLE_KEY, options);
      const { data: entitlement, error: planError } = await db.from('user_entitlements').select('pro_until').eq('user_id', user.id).maybeSingle();
      const { data: backup, error: backupError } = await db.from('journal_backups').select('revision,updated_at').eq('user_id', user.id).maybeSingle();
      if (planError || backupError) return send(action === 'status' ? 200 : 503, { configured: false, proActive: false, error: 'Cloud journal storage is not ready.' });
      const proActive = !!entitlement?.pro_until && Date.parse(entitlement.pro_until) > Date.now();
      if (action === 'status') return send(200, { configured: true, proActive, revision: backup?.revision || 0, savedAt: backup?.updated_at || null });
      if (action === 'delete') {
        const { error } = await db.from('journal_backups').delete().eq('user_id', user.id);
        return send(error ? 503 : 200, error ? { error: 'Could not delete the cloud backup. Try again.' } : { deleted: true });
      }
      // Reading/deleting an existing backup remains possible after Pro expires.
      if (action === 'restore') {
        const { data, error } = await db.from('journal_backups').select('*').eq('user_id', user.id).maybeSingle();
        if (error) return send(503, { error: 'Could not read the cloud backup. Try again.' });
        if (!data) return send(404, { error: 'No cloud backup saved yet.' });
        return send(200, { journal: JSON.parse(unseal(data.payload, key)), revision: data.revision, savedAt: data.updated_at });
      }
      if (!proActive) return send(403, { error: 'An active Pro plan is required to save cloud backups.' });
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      if (!validateJournal(body.journal) || !Number.isInteger(body.revision) || body.revision < 0) return send(400, { error: 'Invalid or empty journal backup.' });
      if (body.revision !== (backup?.revision || 0)) return send(409, { error: 'Another device updated your backup. Restore and merge it before saving again.' });
      const updatedAt = new Date().toISOString();
      const record = { user_id: user.id, payload: seal(JSON.stringify(body.journal), key), revision: body.revision + 1, updated_at: updatedAt };
      if (backup) {
        const { data, error } = await db.from('journal_backups').update(record).eq('user_id', user.id).eq('revision', body.revision).select('revision').maybeSingle();
        if (error) return send(503, { error: 'Could not save the cloud backup. Try again.' });
        if (!data) return send(409, { error: 'Another device updated your backup. Restore and merge it before saving again.' });
      } else {
        const { error } = await db.from('journal_backups').insert(record);
        if (error) return send(error.code === '23505' ? 409 : 503, { error: 'Could not save the cloud backup. Restore the latest backup and try again.' });
      }
      return send(200, { savedAt: updatedAt, revision: record.revision });
    } catch { return send(500, { error: 'Cloud journal request failed. Try again.' }); }
  };
}
