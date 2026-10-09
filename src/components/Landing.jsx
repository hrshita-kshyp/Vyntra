import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Footprints,
  Heart,
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
              Keep your movement, energy, and small habits together. A daily
              check-in that gives your numbers a little context.
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
              See how daily check-ins, a movement journal, and personal targets
              come together. Take a 30-second tour before signing in.
            </p>
            <Link className="text-link" to="/auth">
              Open your workspace <ArrowUpRight size={18} />
            </Link>
          </div>
          <figure className="landing-film">
            <video controls playsInline preload="none" poster="/media/vyntra-poster.png" aria-label="Vyntra 30-second product introduction with instrumental music">
              <source src="/media/vyntra-intro.mp4" type="video/mp4" />
              Your browser does not support video. <a href="/media/vyntra-intro.mp4">Download the product tour.</a>
            </video>
            <figcaption>30-second tour · Music on play · Sample account and manual data</figcaption>
          </figure>
        </section>
        <section className="feature-stories" aria-label="A closer look at Vyntra">
          {[
            { title: "Keep the story beside the stats.", kicker: "YOUR DAILY CONTEXT", text: "How did you feel? How much time did you have? Save a quick check-in, a note, and the small habits that helped your day.", image: "daily-check-in", alt: "Daily check-in showing mood, movement time, habits and a workout journal" },
            { title: "A week you can actually read.", kicker: "YOUR ACTIVITY", text: "Review your movement across the week. Missing readings stay blank, and manually logged activity stays separate from device data.", image: "activity", alt: "Weekly activity charts with sample manually logged steps and energy" },
            { title: "Your pace. Your targets.", kicker: "YOUR PERSONAL GOALS", text: "Set your own daily goals and adjust them as life changes. Log a walk, a yoga session, or a workout without needing a wearable.", image: "goals", alt: "Personal goals screen showing editable activity targets" },
          ].map(feature => <article className="feature-story" key={feature.image}>
            <div><p className="kicker">{feature.kicker}</p><h2>{feature.title}</h2><p>{feature.text}</p><Link className="text-link" to="/auth">Try it for yourself <ArrowUpRight size={16} /></Link></div>
            <figure><img src={`/media/${feature.image}.png`} alt={feature.alt} width="1440" height="1000" loading="lazy" decoding="async" /><figcaption>Product preview · Sample account and manual data</figcaption></figure>
          </article>)}
        </section>
        <section className="landing-plans" aria-label="Vyntra plans">
          <div><p className="kicker">START SMALL. KEEP GOING.</p><h2>Basic stays free.</h2><p>Get started with activity tracking, daily check-ins, a movement journal, and personal goals.</p><Link className="button button-dark" to="/auth">Start for free <ArrowUpRight size={18} /></Link></div>
          <div className="pro-preview"><span className="status">PRO · COMING SOON</span><h3>7 days to try Pro.</h3><p className="pro-price">₹99 <span>/ month after trial</span></p><p>Pro and its 7-day trial will be available when paid features and billing are ready. Signing up today starts a free Basic account.</p></div>
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
