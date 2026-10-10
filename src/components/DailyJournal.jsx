import { useState, useSyncExternalStore } from 'react';
import { Check, Plus, Trash2, Download, Share2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { calendarWeek, dateKey } from '../utils/activityData';
import { PanelHeading } from './UI';
import JournalBackup from './JournalBackup';
const subscribe = callback => { window.addEventListener('vyntra-journal', callback); return () => window.removeEventListener('vyntra-journal', callback); };
const habits = ['Move a little', 'Take a screen break', 'Wind down'];
export default function DailyJournal() {
  const { user } = useAuth();
  const key = 'vyntra_journal_' + (user?.id || 'guest');
  const raw = useSyncExternalStore(subscribe, () => localStorage.getItem(key));
  let journal = {}; try { journal = JSON.parse(raw || '{}'); } catch { /* Ignore damaged storage. */ }
  const [selected, setSelected] = useState(dateKey());
  const [message, setMessage] = useState('');
  const [restoreVersion, setRestoreVersion] = useState(0);
  const [workout, setWorkout] = useState('Walk');
  const [minutes, setMinutes] = useState('20');
  const entry = journal[selected] || {};
  const week = calendarWeek();
  const completed = week.filter(day => journal[day.dateKey]?.checkedIn).length;
  let streak = 0;
  const cursor = new Date();
  if (!journal[dateKey(cursor)]?.checkedIn) cursor.setDate(cursor.getDate() - 1);
  while (journal[dateKey(cursor)]?.checkedIn && streak < 3660) { streak++; cursor.setDate(cursor.getDate() - 1); }
  function commit(next) { localStorage.setItem(key, JSON.stringify(next)); window.dispatchEvent(new Event('vyntra-journal')); }
  function update(patch) { commit({ ...journal, [selected]: { ...entry, ...patch } }); setMessage('Saved on this browser.'); }
  function checkIn(event) {
    event.preventDefault(); const values = new FormData(event.currentTarget);
    const number = name => values.get(name) === '' ? null : Number(values.get(name));
    update({ checkedIn: true, mood: values.get('mood'), time: number('time'), note: values.get('note'), activity: { steps: number('steps'), calories: number('calories'), heartRate: number('heartRate') } });
  }
  function addWorkout(event) { event.preventDefault(); update({ workouts: [...(entry.workouts || []), { id: crypto.randomUUID(), type: workout, minutes: Number(minutes) }] }); }
  const workoutMinutes = week.reduce((sum, day) => sum + (journal[day.dateKey]?.workouts || []).reduce((total, item) => total + item.minutes, 0), 0);
  async function share() {
    const text = `My Vyntra week: ${completed}/7 daily check-ins, ${workoutMinutes} minutes of logged movement, ${streak}-day check-in streak. https://vyntra.ranuvo.tech`;
    try { if (navigator.share) await navigator.share({ title: 'My week with Vyntra', text }); else { await navigator.clipboard.writeText(text); setMessage('Weekly summary copied. Personal notes were excluded.'); } }
    catch (error) { if (error.name !== 'AbortError') setMessage('Sharing unavailable. Try exporting your journal.'); }
  }
  function exportJournal() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(journal, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'vyntra-journal.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Journal exported. This file includes your personal notes.');
  }
  return <section className="panel journal-panel">
    <PanelHeading title="Your day, in context" description="Numbers tell part of the story. Keep the rest here."><span className="status">{streak} day streak</span></PanelHeading>
    <div className="journal-toolbar"><label className="field-label">Choose a day<input aria-label="Journal date" type="date" max={dateKey()} value={selected} onChange={event => { setSelected(event.target.value); setMessage(''); }} /></label><div className="journal-week" aria-label="This week's check-ins">{week.map(day => <button key={day.dateKey} title={day.dateKey} aria-pressed={selected === day.dateKey} className={journal[day.dateKey]?.checkedIn ? 'done' : ''} onClick={() => setSelected(day.dateKey)}>{day.date[0]}{journal[day.dateKey]?.checkedIn && <Check size={12} />}</button>)}</div></div>
    <div className="journal-columns"><form key={selected + key + restoreVersion} onSubmit={checkIn}>
      <div className="journal-fields"><label className="field-label">How did you feel?<select name="mood" defaultValue={entry.mood || 'Steady'}>{['Low energy', 'Steady', 'Energized'].map(value => <option key={value}>{value}</option>)}</select></label><label className="field-label">Time for movement (min)<input name="time" type="number" min="0" max="1440" defaultValue={entry.time ?? ''} placeholder="Optional" /></label></div>
      <details className="journal-manual"><summary>Log activity manually</summary><p className="fine-print">Separate from Google Fit; manual numbers never overwrite device readings.</p><div className="journal-fields">{[['steps', 'Steps', 100000], ['calories', 'Total energy (kcal)', 10000], ['heartRate', 'Average heart rate (bpm)', 250]].map(([name, label, max]) => <label className="field-label" key={name}>{label}<input type="number" name={name} min="0" max={max} step="1" defaultValue={entry.activity?.[name] ?? ''} placeholder="Leave blank if unknown" /></label>)}</div></details>
      <label className="field-label">A note to future you<textarea name="note" maxLength="500" defaultValue={entry.note || ''} placeholder="What helped? What got in the way?" rows="2" /></label>
      <button className="button button-dark" type="submit"><Check size={15} />{entry.checkedIn ? 'Update check-in' : 'Save check-in'}</button>
    </form><div><h3>Small habits</h3><div className="journal-habits">{habits.map(habit => <label key={habit}><input type="checkbox" checked={!!entry.habits?.includes(habit)} onChange={event => update({ habits: event.target.checked ? [...(entry.habits || []), habit] : entry.habits.filter(item => item !== habit) })} />{habit}</label>)}</div>
      <h3>Movement journal</h3><form className="workout-form" onSubmit={addWorkout}><select aria-label="Workout type" value={workout} onChange={event => setWorkout(event.target.value)}>{['Walk', 'Run', 'Strength', 'Cycling', 'Yoga', 'Other'].map(type => <option key={type}>{type}</option>)}</select><input aria-label="Workout minutes" type="number" min="1" max="1440" required value={minutes} onChange={event => setMinutes(event.target.value)} /><button className="icon-button bordered" aria-label="Add workout"><Plus size={18} /></button></form>
      <ul className="workout-list">{(entry.workouts || []).map(item => <li key={item.id}><span>{item.type} <small>{item.minutes} min</small></span><button className="icon-button" aria-label={`Remove ${item.type} workout`} onClick={() => update({ workouts: entry.workouts.filter(workout => workout.id !== item.id) })}><Trash2 size={15} /></button></li>)}</ul>
      {!entry.workouts?.length && <p className="fine-print">No sessions logged for this day.</p>}
      {entry.checkedIn && <div className="context-note"><span className="kicker">YOUR CONTEXT NOTE</span><p>{entry.mood === 'Low energy' ? 'You checked in on a low-energy day. A smaller session or rest day can still be intentional.' : entry.time === 0 ? 'You had no time for movement. Keep that context beside your numbers instead of calling the day a failure.' : 'Notice which routines fit the time and energy you actually had. Your own notes are the starting point.'}</p></div>}
    </div></div>
    <div className="journal-footer"><span>{completed}/7 check-ins · {workoutMinutes} min logged this week</span><div><button className="button button-text" onClick={share}><Share2 size={15} />Share week</button><button className="button button-text" onClick={exportJournal}><Download size={15} />Export journal</button><button className="button button-text danger" onClick={() => { const next = { ...journal }; delete next[selected]; commit(next); setMessage('Selected day cleared.'); }}><Trash2 size={15} />Clear day</button></div></div>
    <p className="fine-print" role="status">{message || 'Private browser storage, scoped to your account. Sharing includes only check-in and workout totals.'}</p>
    {user && <JournalBackup key={user.id} accountId={user.id} raw={raw} onRestore={next => { commit(next); setRestoreVersion(value => value + 1); }} />}
  </section>;
}
