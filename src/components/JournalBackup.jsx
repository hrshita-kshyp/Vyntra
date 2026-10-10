import { useEffect, useRef, useState } from 'react';
import { Cloud, Download, Upload, Trash2 } from 'lucide-react';
import { journalRequest, mergeJournal } from '../services/journalBackup';

export default function JournalBackup({ accountId, raw, onRestore }) {
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const alive = useRef(false);
  useEffect(() => {
    alive.current = true;
    journalRequest('status', undefined, accountId).then(data => { if (alive.current) setStatus(data); }).catch(() => { if (alive.current) setMessage('Cloud status unavailable. Your local journal is still available.'); });
    return () => { alive.current = false; };
  }, [accountId]);
  async function run(action) {
    if (busy) return;
    setBusy(true); setMessage('');
    try {
      let local = {}; try { local = JSON.parse(raw || '{}'); } catch { throw new Error('Export and check your local journal before backing up.'); }
      const data = await journalRequest(action, action === 'save' ? { journal: local, revision: status?.revision || 0 } : undefined, accountId);
      if (!alive.current) return;
      if (action === 'restore') {
        // Read storage again so entries edited during the request are retained.
        const current = JSON.parse(localStorage.getItem('vyntra_journal_' + accountId) || '{}');
        onRestore(mergeJournal(data.journal, current));
        setStatus(previous => ({ ...previous, revision: data.revision, savedAt: data.savedAt }));
        setMessage('Cloud days restored. Existing local days were kept when dates matched.');
      } else if (action === 'save') {
        setStatus(previous => ({ ...previous, revision: data.revision, savedAt: data.savedAt })); setMessage('Journal backed up. You can restore it on another device.');
      } else { setStatus(previous => ({ ...previous, revision: 0, savedAt: null })); setConfirmDelete(false); setMessage('Cloud backup deleted. Your local journal was kept.'); }
    } catch (error) { if (alive.current) setMessage(error.message); }
    finally { if (alive.current) setBusy(false); }
  }
  return <div className="journal-backup">
    <div className="backup-heading"><h3><Cloud size={18} /> Your journal, across devices</h3><span className="status">{status?.proActive ? 'PRO' : status?.configured ? 'BASIC' : 'PRO · COMING SOON'}</span></div>
    <p>Save an encrypted cloud copy of your check-ins, private notes, habits and workouts. Backups are manual. Restore adds missing days and keeps your local entries on matching dates.</p>
    {!status?.configured ? <p className="fine-print">Cloud backup is being prepared. Your Basic journal stays free on this browser.</p> : <>
      <p className="fine-print">{status.savedAt ? `Last backup: ${new Date(status.savedAt).toLocaleString()}` : 'No cloud backup saved yet.'}{!status.proActive && ' Saving requires Pro. Existing backups remain available to restore or delete.'}</p>
      <div className="backup-actions">
        <button className="button button-outline" disabled={busy || !status.proActive || !raw || raw === '{}'} onClick={() => run('save')}><Upload size={15} />Back up journal</button>
        <button className="button button-outline" disabled={busy || !status.savedAt} onClick={() => run('restore')}><Download size={15} />Restore & merge</button>
        {status.savedAt && <button className="button button-text danger" disabled={busy} onClick={() => setConfirmDelete(true)}><Trash2 size={15} />Delete cloud copy</button>}
      </div>
      {confirmDelete && <div className="backup-delete"><p>Delete the cloud copy, including its private notes? Your journal on this browser will stay.</p><button className="button button-outline" disabled={busy} onClick={() => run('delete')}>Delete cloud backup</button><button className="button button-text" disabled={busy} onClick={() => setConfirmDelete(false)}>Keep it</button></div>}
    </>}
    <p role="status" className="fine-print">{busy ? 'Working on your cloud journal…' : message}</p>
  </div>;
}
