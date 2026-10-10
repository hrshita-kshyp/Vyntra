import { Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Logo from "./Logo";

const sections = [
  {
    id: "information",
    title: "Information we handle",
    content: (
      <>
        <p>
          Vyntra is an activity and wellness app maintained through the{" "}
          <a href="https://github.com/hrshita-kshyp/Vyntra">Vyntra project</a>.
          The information handled depends on the features you choose to use.
        </p>
        <ul>
          <li>
            <strong>Account information.</strong> When you register with email,
            Supabase processes your email address and password to authenticate
            you. When you choose Google sign-in, Google and Supabase provide
            account information such as your email address, account identifier,
            and available basic profile details. Vyntra does not receive your
            Google password.
          </li>
          <li>
            <strong>Optional profile and goals.</strong> Birth year, average
            sleep hours, daily step and energy targets, daily check-ins, personal notes, habits, workout entries, and a saved coach
            session are stored in your browser.
          </li>
          <li>
            <strong>Connected activity.</strong> If you authorize a Google Fit
            connection, Vyntra requests read access to activity and heart-rate information. The current integration reads daily steps,
            average heart rate, and energy expenditure for activity charts and
            activity summaries. Sleep displayed from your profile is entered by
            you; it is not currently fetched from Google Fit.
          </li>
          <li>
            <strong>Technical information.</strong> Hosting and authentication
            providers may process IP addresses, request information, and
            security logs to deliver and protect the service. Google Fonts and
            Google Identity Services are loaded from Google and receive the
            technical information associated with those requests.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use information",
    content: (
      <>
        <p>
          We use this information to sign you in, display your activity, compare
          it with your targets, summarize progress against your targets, and
          provide coaching features. Sample data is labeled and is not a
          measurement of your health.
        </p>
        <p>
          Connected activity is used in memory for your charts. The current app does not automatically upload activity snapshots to Supabase. When automatic renewal is enabled, encrypted Google authorization tokens are stored in a server-only Supabase table so your connection can be restored after sign-in. Disconnect deletes that saved connection. Older activity snapshots, if previously saved, may remain until removed separately.
          </p>
          <p>When Pro cloud journal backup is available, choosing Back up journal uploads an encrypted copy of your check-ins, notes, habits, and workouts to Supabase. It is not automatic. Restore merges cloud days into this browser and preserves existing local days. You can restore or delete an existing cloud copy after Pro expires. Deleting the cloud copy leaves your local journal intact; deleting local days does not update an existing cloud backup.</p>
        <p>
          Vyntra does not sell personal information or use connected Google
          activity for advertising.
        </p>
      </>
    ),
  },
  {
    id: "services",
    title: "Services that receive information",
    content: (
      <>
        <dl className="privacy-services">
          <div>
            <dt>Supabase</dt>
            <dd>
              Processes authentication, sessions, and account-linked activity
              snapshots previously saved by earlier versions.{" "}
              <a href="https://supabase.com/privacy">Supabase privacy policy</a>
              .
            </dd>
          </div>
          <div>
            <dt>Google</dt>
            <dd>
              Processes Google sign-in, permission grants, optional Google Fit
              access, font requests, and identity-service requests.{" "}
              <a href="https://policies.google.com/privacy">
                Google privacy policy
              </a>
              .
            </dd>
          </div>
<div>
            <dt>Vercel</dt>
            <dd>
              Hosts the deployed website and processes requests needed to serve
              it.{" "}
              <a href="https://vercel.com/legal/privacy-policy">
                Vercel privacy policy
              </a>
              .
            </dd>
          </div>
        </dl>
        <p>
          These providers operate under their own terms and may process
          information in countries different from where you live. Vyntra's
          handling of Google API information is also subject to the{" "}
          <a href="https://developers.google.com/terms/api-services-user-data-policy">
            Google API Services User Data Policy
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "storage",
    title: "Browser storage and retention",
    content: (
      <>
        <p>
          Vyntra uses browser local storage for sign-in sessions, Google Fit
          access tokens and their expiry, optional profile details, targets, and
          your saved coach session and account-scoped journal. Journal export includes notes; weekly sharing excludes notes and health readings. Local coach suggestions run in your browser without sending metrics to an AI provider. The app does not include an advertising
          tracker.
        </p>
        <p>
          Browser data remains until you remove it, the relevant token is
          cleared, or a feature replaces it. Google Fit tokens have a stored
          expiry, and Disconnect removes the stored connection token. Signing
          out clears the Supabase sign-in session; it does not remove your
          locally saved goals or profile.
        </p>
        <p>
          Account records and synced activity stored in Supabase can remain
          after you sign out or disconnect. They must be removed separately.
          Service providers may retain security logs or backups under their own
          retention practices.
        </p>
      </>
    ),
  },
  {
    id: "choices",
    title: "Your choices and deletion",
    content: (
      <ul>
        <li>You can skip Google sign-in and use email authentication.</li>
        <li>
          You can decline the optional fitness connection or disconnect it from
          Connections. You can also revoke access in your{" "}
          <a href="https://myaccount.google.com/connections">
            Google Account connections
          </a>
          .
        </li>
        <li>
          You can edit or clear your birth year and sleep details in Connections
          and save the changes.
        </li>
        <li>
          You can clear this website's browser data to remove locally saved
          information. This does not delete cloud records or revoke access in
          your Google Account.
        </li>
        <li>
          For access, correction, or deletion of account-linked cloud
          information, use the contact method below. There is currently no
          automatic account-deletion button in the app.
        </li>
      </ul>
    ),
  },
  {
    id: "security",
    title: "Security and wellness information",
    content: (
      <>
        <p>
          The deployed website and service connections use HTTPS. Access tokens
          are stored in your browser, so protect access to your device and do
          not share tokens or account credentials. No storage or transmission
          method can be guaranteed completely secure.
        </p>
        <p>
          Activity readings, activity summaries, and
          generated coaching are informational. They are not medical diagnoses
          or a substitute for professional advice.
        </p>
        <p>
          Vyntra is not intended for children under 13. If you believe a child
          has provided personal information, contact the maintainer to request
          its removal.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact and policy updates",
    content: (
      <>
        <p>
          For privacy questions or data-deletion requests, contact the
          maintainer through the{" "}
          <a href="https://github.com/hrshita-kshyp/Vyntra/issues/new?title=Privacy%20request">
            Vyntra project contact channel
          </a>
          . Ask for a private way to verify your account before sharing personal
          information. Do not post passwords, tokens, or health records in a
          public issue.
        </p>
        <p>
          We may update this policy when the app or its data practices change.
          The date at the top identifies the latest update.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Privacy Policy | Vyntra";
    return () => {
      document.title = previousTitle;
    };
  }, []);
  return (
    <div className="privacy-page">
      <nav className="public-nav" aria-label="Website navigation">
        <Link to="/" aria-label="Vyntra home">
          <Logo showWordmark />
        </Link>
        <Link className="text-link" to="/">
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </nav>
      <main className="privacy-main">
        <header className="privacy-header">
          <p className="kicker">YOUR INFORMATION, EXPLAINED</p>
          <h1>Privacy policy.</h1>
          <p>How Vyntra accesses, uses, stores, and shares information.</p>
          <span className="fine-print">Last updated: 9 October 2026</span>
        </header>
        <div className="privacy-layout">
          <nav className="privacy-contents" aria-label="Policy contents">
            {sections.map((section, index) => (
              <a key={section.id} href={`#${section.id}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {section.title}
              </a>
            ))}
          </nav>
          <article className="privacy-body">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id}>
                <p className="kicker">{String(index + 1).padStart(2, "0")}</p>
                <h2>{section.title}</h2>
                {section.content}
              </section>
            ))}
          </article>
        </div>
      </main>
      <footer className="public-footer">
        <Logo size={23} showWordmark />
        <span>Move well. Live a little more.</span>
        <Link to="/auth">
          Your account <ArrowUpRight size={14} />
        </Link>
      </footer>
    </div>
  );
}
