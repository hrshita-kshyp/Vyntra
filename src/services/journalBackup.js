import { supabase } from './supabaseService';
export async function journalRequest(action, body, accountId) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || session.user.id !== accountId) throw new Error('Sign in to your current account again.');
  const response = await fetch('/api/journal?action=' + action, {
    method: action === 'status' ? 'GET' : 'POST',
    headers: { Authorization: 'Bearer ' + session.access_token, 'Content-Type': 'application/json', 'X-Requested-With': 'Vyntra' },
    ...(action === 'status' ? {} : { body: JSON.stringify(body || {}) }),
  });
  if (action === 'status' && (response.status === 404 || !response.headers.get('content-type')?.includes('application/json'))) return { configured: false, proActive: false };
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Cloud journal request failed.');
  return data;
}
// A restore adds missing dates; existing local dates always win conflicts.
export function mergeJournal(cloud, local) { return { ...cloud, ...local }; }
