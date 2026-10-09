import { useState } from "react";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { calculateBioAge } from "../utils/bioAgeCalculator";
export default function BioAgeScore({ averages, isDemo = false }) {
  const [message, setMessage] = useState("");
  const birthYear = Number(localStorage.getItem("user_birth_year"));
  const sleep = Number(localStorage.getItem("user_avg_sleep"));
  const age = birthYear ? new Date().getFullYear() - birthYear : 0;
  const ready = age > 0 && age < 120;
  const result = ready
    ? calculateBioAge(age, {
        avgRestingHR: averages?.avgHR,
        avgDailySteps: averages?.avgSteps,
        avgSleepHours: sleep || undefined,
      })
    : null;
  async function copy() {
    try {
      await navigator.clipboard.writeText(
        `Vyntra wellness estimate: ${result.bioAge} years; calendar age: ${age}. ${isDemo ? "Based on sample activity." : "Based on connected activity."}`,
      );
      setMessage("Copied");
    } catch {
      setMessage("Copy unavailable");
    }
  }
  return (
    <section className="wellness-panel">
      <div className="panel-heading">
        <h2>Wellness snapshot</h2>
        {ready && (
          <button
            className="icon-button"
            onClick={copy}
            aria-label="Copy wellness estimate"
          >
            {message === "Copied" ? <Check size={17} /> : <Copy size={17} />}
          </button>
        )}
      </div>
      {ready ? (
        <>
          <div className="wellness-value">
            {result.bioAge}
            <span>estimated years</span>
          </div>
          <p className="wellness-context">
            Calendar age {age} <span>/</span>{" "}
            {isDemo ? "Sample activity" : "Device activity"}
          </p>
          <div className="wellness-scale">
            <i style={{ left: `${result.score}%` }} />
          </div>
          <div className="scale-labels">
            <span>Room to grow</span>
            <span>Doing well</span>
          </div>
          <dl className="detail-list">
            {result.breakdown.map((item) => (
              <div key={item.metric}>
                <dt>
                  {item.metric.replace(
                    "Resting Heart Rate",
                    "Average heart rate",
                  )}
                </dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : (
        <>
          <div className="wellness-placeholder">
            A fuller picture
            <br /> starts here.
          </div>
          <p>
            Add your age and connect your activity to see a simple wellness
            estimate.
          </p>
          <Link className="button button-dark" to="/app/connect">
            Complete your profile <ArrowUpRight size={16} />
          </Link>
        </>
      )}
      <p className="fine-print">
        A habit-based estimate, not a clinical measurement.
      </p>
      <span className="sr-only" role="status">
        {message}
      </span>
    </section>
  );
}
