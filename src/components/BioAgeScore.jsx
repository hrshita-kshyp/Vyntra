import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
export default function BioAgeScore({ data }) {
  const [message, setMessage] = useState('');
  const recorded = data.weeklyData.filter(day => Number.isFinite(day.steps));
  const reached = recorded.filter(day => day.steps >= data.steps.goal).length;
  async function copy() {
    try { await navigator.clipboard.writeText('My Vyntra week: ' + reached + ' of ' + recorded.length + ' recorded days reached my ' + data.steps.goal.toLocaleString() + ' step target. Source: ' + data.source + '. Today may be partial.'); setMessage('Copied'); }
    catch { setMessage('Copy unavailable'); }
  }
  return <section className="wellness-panel">
    <div className="panel-heading"><h2>A week of showing up</h2><button className="icon-button" onClick={copy} aria-label="Copy weekly progress">{message === 'Copied' ? <Check size={17} /> : <Copy size={17} />}</button></div>
    <div className="wellness-value">{reached}<span>days at your step target</span></div>
    <p className="wellness-context">{recorded.length} of 7 days with step readings</p>
    <dl className="detail-list"><div><dt>Your daily target</dt><dd>{data.steps.goal.toLocaleString()} steps</dd></div><div><dt>Recorded-day average</dt><dd>{data.averages.avgSteps?.toLocaleString() ?? '--'}</dd></div><div><dt>Source</dt><dd>{data.source}</dd></div></dl>
    <p className="fine-print">Days with reported steps at or above your target. Missing days are excluded. Today is still in progress. This describes activity, not biological age or health.</p><span role="status">{message}</span>
  </section>;
}
