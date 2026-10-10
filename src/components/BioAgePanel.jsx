import { PanelHeading } from './UI';

export default function BioAgePanel({ data }) {
  return <section className="panel bio-age-panel">
    <PanelHeading title="Biological age" description="A separate view of what your connected data can support.">
      <span className="status">Not available</span>
    </PanelHeading>
    <p>Vyntra does not currently calculate biological age. A watch connection does not automatically provide a validated biological-age measurement.</p>
    <dl className="detail-list">
      <div><dt>Activity source</dt><dd>{data.source}</dd></div>
      <div><dt>Steps today</dt><dd>{data.steps.current?.toLocaleString() ?? 'No reading'}</dd></div>
      <div><dt>Daily average heart rate</dt><dd>{data.heartRate.current == null ? 'No reading' : `${data.heartRate.current} bpm`}</dd></div>
      <div><dt>Biological-age method</dt><dd>Not implemented</dd></div>
    </dl>
    <p className="fine-print">Steps, total calories and daily average heart rate are not used to invent an age. Weekly goal progress remains available separately.</p>
  </section>;
}
