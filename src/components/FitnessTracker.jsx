import { useState } from "react";
import { Check, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useFitnessData } from "../hooks/useFitnessData";
import { PageHeader, DataNote } from "./UI";

export default function FitnessTracker() {
  const data = useFitnessData();
  const [steps, setSteps] = useState(
    () => localStorage.getItem("daily_step_goal") || "10000",
  );
  const [calories, setCalories] = useState(
    () => localStorage.getItem("daily_calorie_goal") || "2500",
  );
  const [saved, setSaved] = useState(false);
  const [baseline, setBaseline] = useState({ steps, calories });
  function save(event) {
    event.preventDefault();
    localStorage.setItem("daily_step_goal", steps);
    localStorage.setItem("daily_calorie_goal", calories);
    setBaseline({ steps, calories });
    setSaved(true);
  }
  function reset() {
    setSteps(baseline.steps);
    setCalories(baseline.calories);
    setSaved(false);
  }
  return (
    <div className="page">
      <PageHeader
        section="YOUR OWN PACE"
        title="Something to work toward."
        description="Set a couple of daily targets. Adjust them as life changes."
      >
        <DataNote live={data.isLive} source={data.source} />
      </PageHeader>
      <div className="goals-layout">
        <form className="panel goals-form" onSubmit={save}>
          <div className="panel-heading">
            <h2>Daily targets</h2>
            <span className="subtle">Saved on this device</span>
          </div>
          {[
            {
              id: "steps",
              title: "Get your steps in",
              description: "A daily movement target, at your own pace.",
              value: steps,
              set: setSteps,
              current: data.steps.current,
              min: 100,
              max: 100000,
              unit: "steps / day",
            },
            {
              id: "energy",
              title: "Your daily energy",
              description:
                "Total energy used through activity and everyday life.",
              value: calories,
              set: setCalories,
              current: data.calories.current,
              min: 100,
              max: 10000,
              unit: "kcal / day",
            },
          ].map((item) => (
            <section className="goal-row" key={item.id}>
              <div className="goal-row-heading">
                <div>
                  <label htmlFor={`goal-${item.id}`}>{item.title}</label>
                  <p>{item.description}</p>
                </div>
                <span className="goal-percentage">
                  {item.current == null ? "--" : Math.min(
                    100,
                    Math.round((item.current / Number(item.value || 1)) * 100),
                  )}
                  %
                </span>
              </div>
              <div className="goal-input-wrap">
                <input
                  id={`goal-${item.id}`}
                  type="number"
                  required
                  min={item.min}
                  max={item.max}
                  step={100}
                  value={item.value}
                  onChange={(e) => {
                    item.set(e.target.value);
                    setSaved(false);
                  }}
                />
                <span>{item.unit}</span>
              </div>
              <div className="metric-track">
                <span
                  style={{
                    width: `${Math.min(100, (item.current / Number(item.value || 1)) * 100)}%`,
                  }}
                />
              </div>
              <p className="goal-current">
                {(item.current?.toLocaleString() ?? "--")}{" "}
                {item.id === "steps" ? "steps" : "kcal"}{" "}
                {data.isLive ? "today" : "in your check-in"}
              </p>
            </section>
          ))}
          <div className="form-actions">
            <button className="button button-dark" type="submit">
              Save targets <Check size={16} />
            </button>
            <button
              className="button button-text"
              type="button"
              onClick={reset}
            >
              Reset changes
            </button>
            <span className="form-success" role="status">
              {saved ? "Targets saved." : ""}
            </span>
          </div>
        </form>
        <aside className="goals-aside">
          <span className="kicker">A GOOD PLACE TO START</span>
          <h2>
            Make it
            <br /> <em>doable.</em>
          </h2>
          <p>
            A target is a guide for your day. Start with something that fits
            your routine, then build from there.
          </p>
          <div className="aside-rule" />
          <p className="fine-print">
            Energy expenditure is the energy you use. It is not a target for
            food intake.
          </p>
          <Link className="text-link" to="/app/ai-coach">
            Find a little direction <ArrowUpRight size={16} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
