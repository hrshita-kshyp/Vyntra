import { useState } from "react";
import {
  Cable,
  Watch,
  Smartphone,
  RefreshCw,
  ArrowUpRight,
  Loader2,
  Check,
} from "lucide-react";
import { useGoogleFit } from "../hooks/useGoogleFit";
import { PageHeader, PanelHeading } from "./UI";

export default function DeviceConnect() {
  const { connected, fitData, loading, error, connect, disconnect, refresh } =
    useGoogleFit();
  const [birthYear, setBirthYear] = useState(
    () => localStorage.getItem("user_birth_year") || "",
  );
  const [sleep, setSleep] = useState(
    () => localStorage.getItem("user_avg_sleep") || "",
  );
  const [saved, setSaved] = useState(false);
  const currentYear = new Date().getFullYear();
  function save(event) {
    event.preventDefault();
    if (birthYear) localStorage.setItem("user_birth_year", birthYear);
    else localStorage.removeItem("user_birth_year");
    if (sleep) localStorage.setItem("user_avg_sleep", sleep);
    else localStorage.removeItem("user_avg_sleep");
    setSaved(true);
  }
  return (
    <div className="page">
      <PageHeader
        section="BRING IT TOGETHER"
        title="Your activity lives here."
        description="Connect your source. Keep your profile up to date."
      />
      <section className="panel connection-panel">
        <PanelHeading
          title="Activity source"
          description="A connection brings your own data into Vyntra."
        />
        <div className="connection-main">
          <span className="provider-icon">
            <Smartphone size={27} strokeWidth={1.5} />
          </span>
          <div>
            <h3>Google Fit</h3>
            <p>Steps, average heart rate, and energy expenditure.</p>
          </div>
          <span className={`status ${connected ? "status-live" : ""}`}>
            <span className="status-dot" />
            {connected ? "Connected" : "Not connected"}
          </span>
        </div>
        {error && (
          <div className="notice notice-warning" role="alert">
            {error}
          </div>
        )}
        {connected && fitData && (
          <div className="connection-readings">
            <div>
              <span>Latest steps</span>
              <strong>{fitData.today.steps.current.toLocaleString()}</strong>
            </div>
            <div>
              <span>Heart rate</span>
              <strong>
                {fitData.today.heartRate.current}
                <small> bpm</small>
              </strong>
            </div>
            <div>
              <span>Energy</span>
              <strong>
                {fitData.today.calories.current.toLocaleString()}
                <small> kcal</small>
              </strong>
            </div>
          </div>
        )}
        <div className="connection-actions">
          <p>
            {connected
              ? "Refresh to check for the latest activity from your account."
              : "You will be asked to allow access in a Google authorization window."}
          </p>
          <div>
            {connected ? (
              <>
                <button
                  className="button button-outline"
                  disabled={loading}
                  onClick={refresh}
                >
                  {loading ? (
                    <Loader2 size={16} className="spin" />
                  ) : (
                    <RefreshCw size={16} />
                  )}
                  Refresh activity
                </button>
                <button
                  className="button button-text danger"
                  onClick={disconnect}
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                className="button button-dark"
                disabled={loading}
                onClick={connect}
              >
                {loading ? (
                  <Loader2 className="spin" size={16} />
                ) : (
                  <Cable size={16} />
                )}
                Connect Google Fit
                <ArrowUpRight size={16} />
              </button>
            )}
          </div>
        </div>
      </section>
      <div className="connections-grid">
        <form className="panel profile-form" onSubmit={save}>
          <PanelHeading
            title="A little about you"
            description="Optional details for your wellness snapshot."
          />
          <div className="profile-fields">
            <div>
              <label className="field-label" htmlFor="birth-year">
                Birth year
              </label>
              <input
                id="birth-year"
                type="number"
                min={currentYear - 110}
                max={currentYear - 13}
                placeholder="1994"
                value={birthYear}
                onChange={(e) => {
                  setBirthYear(e.target.value);
                  setSaved(false);
                }}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="sleep-hours">
                Average sleep, hours
              </label>
              <input
                id="sleep-hours"
                type="number"
                min={1}
                max={16}
                step={0.5}
                placeholder="7.5"
                value={sleep}
                onChange={(e) => {
                  setSleep(e.target.value);
                  setSaved(false);
                }}
              />
            </div>
          </div>
          <div className="form-actions">
            <button className="button button-outline" type="submit">
              Save profile
              <Check size={16} />
            </button>
            <span className="form-success" role="status">
              {saved ? "Profile saved." : ""}
            </span>
          </div>
          <p className="fine-print">
            These profile details are saved in this browser.
          </p>
        </form>
        <section className="panel integration-panel">
          <PanelHeading
            title="More ways to connect"
            description="Additional sources are not available yet."
          />
          {["Garmin", "Fitbit", "Oura", "Samsung Health"].map((name) => (
            <div className="integration-row" key={name}>
              <Watch size={18} strokeWidth={1.5} />
              <span>{name}</span>
              <span className="subtle">Planned</span>
            </div>
          ))}
        </section>
      </div>
      <details className="connection-help">
        <summary>Connected, but your activity is missing?</summary>
        <p>
          Open your source app and check that it is syncing to the same Google
          account you connected here. Refresh your activity once the upload is
          complete. Vyntra shows sample data until device activity is available.
        </p>
      </details>
    </div>
  );
}
