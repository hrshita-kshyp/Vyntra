import { useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";
import { Download, ArrowUpRight } from "lucide-react";
import { useFitnessData } from "../hooks/useFitnessData";
import { PageHeader, PanelHeading, DataNote, ChartTooltip } from "./UI";

export default function HealthAnalytics() {
  const data = useFitnessData();
  const [metric, setMetric] = useState("steps");
  const total = data.weeklyData.reduce((sum, day) => sum + day[metric], 0);
  const best = data.weeklyData.reduce((a, b) =>
    a[metric] >= b[metric] ? a : b,
  );
  function download() {
    const csv =
      "Day,Steps,Heart rate (bpm),Energy (kcal)\n" +
      data.weeklyData
        .map((day) =>
          [day.date, day.steps, day.heartRate ?? "", day.calories].join(","),
        )
        .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `vyntra-${data.isLive ? "activity" : "sample"}-week.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="page">
      <PageHeader
        section="THE BIGGER PICTURE"
        title="Your week, in perspective."
        description="See your rhythm. Notice what works."
      >
        <DataNote live={data.isLive} />
        <button className="button button-outline" onClick={download}>
          <Download size={16} />
          Export week
        </button>
      </PageHeader>
      <div className="activity-summary">
        <div>
          <span>Total steps</span>
          <strong>
            {data.weeklyData
              .reduce((sum, day) => sum + day.steps, 0)
              .toLocaleString()}
            <small>this week</small>
          </strong>
        </div>
        <div>
          <span>Average heart rate</span>
          <strong>
            {data.averages.avgHR}
            <small>bpm</small>
          </strong>
        </div>
        <div>
          <span>Average daily energy</span>
          <strong>
            {data.averages.avgCalories.toLocaleString()}
            <small>kcal</small>
          </strong>
        </div>
      </div>
      <section className="panel">
        <PanelHeading
          title="Daily activity"
          description={
            data.isLive
              ? "Your connected activity, day by day."
              : "A sample of seven days of activity."
          }
        >
          <div className="segmented">
            {["steps", "calories"].map((item) => (
              <button
                key={item}
                className={metric === item ? "selected" : ""}
                aria-pressed={metric === item}
                onClick={() => setMetric(item)}
              >
                {item === "steps" ? "Steps" : "Energy"}
              </button>
            ))}
          </div>
        </PanelHeading>
        <div className="chart-frame chart-tall">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.weeklyData}
              margin={{ top: 12, left: -18, right: 10, bottom: 0 }}
              barSize={38}
            >
              <CartesianGrid vertical={false} stroke="#e9eae4" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#78817a", fontSize: 12 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#78817a", fontSize: 11 }}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "#f3f4ee" }}
              />
              {metric === "steps" && (
                <ReferenceLine
                  y={data.steps.goal}
                  stroke="#969f93"
                  strokeDasharray="4 4"
                  label={{
                    value: "Daily target",
                    fill: "#78817a",
                    fontSize: 11,
                    position: "insideTopRight",
                  }}
                />
              )}
              <Bar
                isAnimationActive={false}
                dataKey={metric}
                name={metric === "steps" ? "Steps" : "Energy"}
                radius={[3, 3, 0, 0]}
              >
                {data.weeklyData.map((day) => (
                  <Cell
                    key={day.date}
                    fill={day.date === best.date ? "#286457" : "#bbcec1"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-footer">
          <span>
            {total.toLocaleString()} {metric === "steps" ? "steps" : "kcal"}{" "}
            across the week
          </span>
          <span>
            Best day: <strong>{best.date}</strong>
          </span>
        </div>
      </section>
      <div className="analytics-bottom">
        <section className="panel">
          <PanelHeading
            title="Heart rate"
            description="Daily averages, in beats per minute."
          />
          <div className="chart-frame chart-short">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.weeklyData}
                margin={{ top: 10, right: 8, left: -22, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="#e9eae4" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#78817a", fontSize: 11 }}
                />
                <YAxis
                  domain={["dataMin - 5", "dataMax + 5"]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#78817a", fontSize: 11 }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  isAnimationActive={false}
                  dataKey="heartRate"
                  name="Heart rate"
                  type="monotone"
                  stroke="#ae705a"
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 0, fill: "#ae705a" }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="pattern-note">
          <span className="kicker">A NOTE ON YOUR WEEK</span>
          <h2>
            {
              data.weeklyData.filter((day) => day.steps >= data.steps.goal)
                .length
            }{" "}
            days above your step target.
          </h2>
          <p>
            The busiest day was {best.date}. A weekly view helps you see the
            quieter days too, without making every day a competition.
          </p>
          <ArrowUpRight size={28} />
          <span className="fine-print">
            {data.isLive
              ? "Based on your connected activity."
              : "Based on sample activity. Connect your device for your own patterns."}
          </span>
        </section>
      </div>
      <section className="panel activity-table-panel">
        <PanelHeading title="The daily details" />
        <div className="table-scroll">
          <table className="activity-table">
            <thead>
              <tr>
                <th scope="col">Day</th>
                <th scope="col">Steps</th>
                <th scope="col">Heart rate</th>
                <th scope="col">Energy</th>
                <th scope="col">Step target</th>
              </tr>
            </thead>
            <tbody>
              {data.weeklyData.map((day) => (
                <tr key={day.date}>
                  <th scope="row">{day.date}</th>
                  <td>{day.steps.toLocaleString()}</td>
                  <td>{day.heartRate ?? "--"} bpm</td>
                  <td>{day.calories.toLocaleString()} kcal</td>
                  <td>
                    <span
                      className={`status ${day.steps >= data.steps.goal ? "status-live" : ""}`}
                    >
                      {day.steps >= data.steps.goal ? "Reached" : "In progress"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
