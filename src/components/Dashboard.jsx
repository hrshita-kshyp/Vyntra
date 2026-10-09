import DailyJournal from "./DailyJournal";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ArrowUpRight, RefreshCw, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useFitnessData } from "../hooks/useFitnessData";
import { useAuth } from "../hooks/useAuth";
import { displayName } from "../utils/userProfile";
import StatCard from "./StatCard";
import BioAgeScore from "./BioAgeScore";
import {
  PageHeader,
  DataNote,
  PanelHeading,
  ChartTooltip,
  TextLink,
} from "./UI";

export default function Dashboard() {
  const data = useFitnessData();
  const { user } = useAuth();
  const [metric, setMetric] = useState("steps");
  const remaining = Math.max(0, data.steps.goal - data.steps.current);
  const goalDays = data.weeklyData.filter(
    (day) => day.steps >= data.steps.goal,
  ).length;
  return (
    <div className="page">
      <PageHeader
        section="YOUR DAILY CHECK-IN"
        title={
          user
            ? `Hello, ${displayName(user, "there")}.`
            : "A good day to move."
        }
        description="Your activity, a little perspective, and what comes next."
      >
        <DataNote live={data.isLive} source={data.source} />
        {data.connected && (
          <button
            className="icon-button bordered"
            disabled={data.fitLoading}
            onClick={data.refresh}
            aria-label="Refresh activity"
          >
            <RefreshCw size={17} className={data.fitLoading ? "spin" : ""} />
          </button>
        )}
      </PageHeader>
      {!data.isLive && (
        <div className="notice">
          <span>No device data yet. Log your day or connect your activity.</span>
          <TextLink to="/app/connect">Connect your activity</TextLink>
        </div>
      )}
      {data.needsReconnect && (
        <div className="notice notice-warning">
          <span>
            Your connection has expired. Reconnect to update your activity.
          </span>
          <TextLink to="/app/connect">Reconnect</TextLink>
        </div>
      )}
      <div className="notice" role="status"><span>{data.error || (data.fetchedAt ? 'Last fetched ' + new Date(data.fetchedAt).toLocaleString() + '. Mobile Fit uploads may arrive later.' : 'Missing readings stay blank. Zero is shown only when reported.')} Averages use days with readings; today is partial.</span></div>
      <section className="metric-grid" aria-label="Today's metrics">
        <StatCard
          title="Steps"
          value={(data.steps.current?.toLocaleString() ?? "--")}
          goal={data.steps.goal}
          icon="activity"
        />
        <StatCard
          title="Heart rate"
          value={data.heartRate.current}
          status="bpm"
          icon="heart"
          detail="Latest daily average"
        />
        <StatCard
          title="Energy used"
          value={(data.calories.current?.toLocaleString() ?? "--")}
          status="kcal"
          goal={data.calories.goal}
          icon="fire"
        />
        <StatCard
          title="Sleep logged"
          value={Number(localStorage.getItem("user_avg_sleep")) || null}
          status="hrs"
          icon="moon"
          detail="Self-reported profile average"
        />
      </section>
      <DailyJournal />
      <div className="overview-grid">
        <section className="panel activity-panel">
          <PanelHeading
            title="The week in motion"
            description="A little consistency adds up."
          >
            <div className="segmented" aria-label="Chart metric">
              {["steps", "calories"].map((item) => (
                <button
                  key={item}
                  aria-pressed={metric === item}
                  className={metric === item ? "selected" : ""}
                  onClick={() => setMetric(item)}
                >
                  {item === "steps" ? "Steps" : "Energy"}
                </button>
              ))}
            </div>
          </PanelHeading>
          <div className="chart-summary">
            <strong>
              {(metric === "steps"
                ? data.averages.avgSteps
                : data.averages.avgCalories
              )?.toLocaleString() ?? "--"}
            </strong>
            <span>{metric === "steps" ? "steps" : "kcal"} / daily average</span>
          </div>
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.weeklyData}
                margin={{ top: 12, right: 8, left: -24, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="overview-fill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#28786c" stopOpacity={0.16} />
                    <stop offset="100%" stopColor="#28786c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#e9eae4" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#78817a", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#78817a", fontSize: 11 }}
                  tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  isAnimationActive={false}
                  type="monotone"
                  dataKey={metric}
                  name={metric === "steps" ? "Steps" : "Energy"}
                  stroke="#28786c"
                  strokeWidth={2.5}
                  fill="url(#overview-fill)"
                  activeDot={{ r: 5, strokeWidth: 3, stroke: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-footer">
            <span>
              <i className="legend-dot" />
              Daily {metric === "steps" ? "steps" : "energy expenditure"}
            </span>
            <TextLink to="/app/analytics">View activity</TextLink>
          </div>
        </section>
        <BioAgeScore data={data} />
      </div>
      <div className="overview-bottom">
        <section className="next-step">
          <span className="kicker">A SMALL NEXT STEP</span>
          <h2>
            {data.steps.current == null ? "Your next step starts here." : remaining > 0
              ? `${(remaining?.toLocaleString() ?? "--")} steps to your target.`
              : "Your step target is complete."}
          </h2>
          <p>
            {remaining > 0
              ? "A walk around the block. The long way home. Make it work for your day."
              : "Take a moment to enjoy it. Your next goal can wait until tomorrow."}
          </p>
          <Link className="text-link" to="/app/tracker">
            Adjust your daily goals <ArrowRight size={17} />
          </Link>
        </section>
        <section className="week-note">
          <span className="kicker">THIS WEEK</span>
          <div>
            <strong>
              {goalDays}
              <span>/ {data.weeklyData.length}</span>
            </strong>
            <ArrowUpRight size={25} />
          </div>
          <p>days meeting your step target</p>
          <div className="week-dots">
            {data.weeklyData.map((day) => (
              <span
                key={day.date}
                className={day.steps >= data.steps.goal ? "complete" : ""}
                title={`${day.date}: ${(day.steps?.toLocaleString() ?? "--")} steps`}
              >
                {day.date[0]}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
