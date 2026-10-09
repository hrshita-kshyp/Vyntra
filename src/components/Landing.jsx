import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Footprints,
  Heart,
  MoveUpRight,
} from "lucide-react";
import Logo from "./Logo";

export default function Landing() {
  return (
    <div className="landing">
      <nav className="public-nav" aria-label="Website navigation">
        <Link to="/" aria-label="Vyntra home">
          <Logo showWordmark />
        </Link>
        <div className="public-nav-middle">
          <a href="#approach">The approach</a>
          <a href="#inside">Inside Vyntra</a>
        </div>
        <Link className="button button-outline" to="/auth">
          Sign in <ArrowUpRight size={16} />
        </Link>
      </nav>
      <main>
        <section className="landing-hero">
          <div className="hero-copy">
            <p className="kicker">A MORE EVERYDAY KIND OF FITNESS</p>
            <h1>
              Find your rhythm.
              <br />
              <em>Keep it going.</em>
            </h1>
            <p className="hero-description">
              Less noise. A clearer picture of your activity. A few good habits
              you can actually keep.
            </p>
            <div className="hero-actions">
              <Link className="button button-dark" to="/auth">
                Explore your dashboard <ArrowUpRight size={18} />
              </Link>
              <a className="text-link" href="#inside">
                Take a look inside <ArrowRight size={16} />
              </a>
            </div>
            <p className="hero-footnote">
              Sign in or create an account to get started.
            </p>
          </div>
          <div
            className="hero-visual"
            aria-label="Illustrated preview of daily activity"
          >
            <div className="track-art">
              <div />
              <div />
              <div />
              <div />
              <span className="track-marker" />
            </div>
            <span className="visual-caption">BUILT AROUND YOUR EVERYDAY</span>
            <div className="hero-reading">
              <div>
                <span>DAILY MOVEMENT</span>
                <strong>
                  8,742 <small>steps</small>
                </strong>
              </div>
              <Footprints size={25} strokeWidth={1.4} />
              <p>
                <span>87% of daily target</span>
                <span>Sample day</span>
              </p>
              <div className="metric-track">
                <span style={{ width: "87%" }} />
              </div>
            </div>
            <div className="visual-note">
              <Heart size={17} />
              <span>A little more in tune.</span>
            </div>
          </div>
        </section>
        <section id="approach" className="approach-section">
          <p className="kicker">THE APPROACH</p>
          <h2>
            Good habits don't need
            <br />
            <em>a complicated system.</em>
          </h2>
          <div className="approach-grid">
            {[
              {
                n: "01",
                title: "See where you are.",
                text: "Steps, heart rate, and energy in one calm overview. Know what your week actually looks like.",
              },
              {
                n: "02",
                title: "Choose your own pace.",
                text: "Set daily targets that fit your life. Keep them realistic, and adjust as you go.",
              },
              {
                n: "03",
                title: "Make room for progress.",
                text: "Find a little guidance, notice the patterns, and turn everyday movement into a routine.",
              },
            ].map((item) => (
              <article key={item.n}>
                <span>{item.n}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="inside" className="inside-section">
          <div>
            <p className="kicker">INSIDE VYNTRA</p>
            <h2>
              Everything you need.
              <br />
              <em>Room to breathe.</em>
            </h2>
            <p>
              Your daily check-in, a week of activity, personal targets, and a
              coach when you want a little direction.
            </p>
            <Link className="text-link" to="/auth">
              Open your workspace <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="inside-preview">
            <div className="preview-top">
              <span>YOUR WEEK</span>
              <span>Sample activity</span>
            </div>
            <strong>
              8,792 <small>average steps / day</small>
            </strong>
            <div className="preview-bars">
              {[62, 82, 54, 88, 70, 100, 76].map((height, i) => (
                <div key={i}>
                  <span style={{ height: `${height}%` }} />
                  <small>{["M", "T", "W", "T", "F", "S", "S"][i]}</small>
                </div>
              ))}
            </div>
            <div className="preview-bottom">
              <span>Small steps, steady progress.</span>
              <MoveUpRight size={20} />
            </div>
          </div>
        </section>
        <section className="landing-cta">
          <p className="kicker">START WHERE YOU ARE</p>
          <h2>
            Your next good habit
            <br />
            starts with a check-in.
          </h2>
          <Link className="button button-dark" to="/auth">
            Give it a try <ArrowUpRight size={18} />
          </Link>
        </section>
      </main>
      <footer className="public-footer">
        <Logo size={23} showWordmark />
        <span>Move well. Live a little more.</span>
        <Link to="/privacy">Privacy policy</Link>
        <Link to="/auth">
          Your account <ArrowUpRight size={14} />
        </Link>
      </footer>
    </div>
  );
}
