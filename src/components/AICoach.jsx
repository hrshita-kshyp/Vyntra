import { useState } from "react";
import { ArrowUpRight, Check, Clock, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAIInsights } from "../hooks/useAIInsights";
import { PageHeader, PanelHeading } from "./UI";

const example = {
  workoutSuggestion: {
    title: "An easy walk, a clearer head.",
    duration: "20 minutes",
    focus: "Everyday movement",
    reason: "A simple session to make space for movement in your day.",
  },
  recommendations: [
    "Choose a time you can keep. A short walk after lunch is an easy place to start.",
    "Keep the pace comfortable. There is no need to make every session your hardest.",
    "Leave room for rest. Finish with a few minutes to slow down.",
  ],
  smartGoals: [
    {
      title: "Make a little space",
      value: "20 min",
      trend: "An easy session to fit into your day",
    },
    {
      title: "Keep a steady routine",
      value: "3 days",
      trend: "An example weekly intention",
    },
    {
      title: "Check in with yourself",
      value: "Daily",
      trend: "Notice how you feel, along with your numbers",
    },
  ],
};
export default function AICoach() {
  const { insights, loading, error } = useAIInsights();
  const [planned, setPlanned] = useState(
    () => localStorage.getItem("vyntra_planned_session") || "",
  );
  const suggestion = insights?.workoutSuggestion || example.workoutSuggestion;
  const recommendations = insights?.recommendations || example.recommendations;
  const goals = insights?.smartGoals || example.smartGoals;
  function save() {
    localStorage.setItem("vyntra_planned_session", suggestion.title);
    setPlanned(suggestion.title);
  }
  return (
    <div className="page">
      <PageHeader
        section="A LITTLE DIRECTION"
        title="Make a plan that fits."
        description="Keep it manageable. Leave room for real life."
      >
        <span className="status">
          {insights ? "Personalized plan" : "Example plan"}
        </span>
      </PageHeader>
      {loading && (
        <div className="notice" role="status">
          <Loader2 className="spin" size={16} />
          Your activity plan is being prepared.
        </div>
      )}
      {error && (
        <div className="notice notice-warning" role="alert">
          Your personalized plan could not load. You can still use the example
          below.
        </div>
      )}
      <section className="coach-feature">
        <div className="coach-feature-copy">
          <span className="kicker">YOUR NEXT SESSION</span>
          <h2>{suggestion.title}</h2>
          <p>{suggestion.reason}</p>
          <div className="session-meta">
            <span>
              <Clock size={16} />
              {suggestion.duration}
            </span>
            <span>{suggestion.focus}</span>
          </div>
          <button
            className="button button-dark"
            onClick={save}
            disabled={planned === suggestion.title}
          >
            {planned === suggestion.title ? (
              <>
                <Check size={17} />
                Added to your plan
              </>
            ) : (
              <>
                <Plus size={17} />
                Add to my plan
              </>
            )}
          </button>
          <span className="sr-only" role="status">
            {planned === suggestion.title
              ? "Session saved on this device."
              : ""}
          </span>
        </div>
        <div className="session-illustration" aria-hidden="true">
          <svg viewBox="0 0 240 220" fill="none">
            <path
              d="M35 178H213M52 159L86 120L106 74L139 100L165 154M106 74L121 40M105 78L75 86L51 108M138 99L173 83"
              stroke="currentColor"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="132" cy="24" r="14" fill="currentColor" />
            <path
              d="M26 41H66M16 61H56M168 187H218"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <span>MAKE TIME FOR YOU</span>
        </div>
      </section>
      <div className="coach-grid">
        <section className="panel">
          <PanelHeading
            title="A few things to keep in mind"
            description={
              insights
                ? "From your activity plan."
                : "Simple ideas to make the example session your own."
            }
          />
          <ol className="recommendation-list">
            {recommendations.map((text, i) => (
              <li key={i}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="panel">
          <PanelHeading title="Small intentions" />
          {goals.map((goal, i) => (
            <div key={i} className="intention-row">
              <div>
                <h3>{goal.title}</h3>
                <p>{goal.trend}</p>
              </div>
              <strong>{goal.value}</strong>
            </div>
          ))}
          <Link className="text-link" to="/app/tracker">
            Set your daily targets <ArrowUpRight size={16} />
          </Link>
        </section>
      </div>
      <div className="coach-footer">
        <span>
          {insights
            ? "Your plan uses connected activity data."
            : "This is a general example, not a personalized assessment."}
        </span>
        <Link to="/app/connect">
          Manage your activity source <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}
