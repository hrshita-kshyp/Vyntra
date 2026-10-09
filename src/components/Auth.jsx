import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Logo from "./Logo";

export default function Auth() {
  const [signup, setSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { signIn, signUp, signInWithGoogle } = useAuth();
  async function submit(event) {
    event.preventDefault();
    setBusy("email");
    setError("");
    setSuccess("");
    try {
      const result = await (signup
        ? signUp(email, password)
        : signIn(email, password));
      if (result.error) throw result.error;
      if (signup) setSuccess("Check your inbox for a verification link.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  }
  async function google() {
    setBusy("google");
    setError("");
    try {
      const result = await signInWithGoogle();
      if (result.error) throw result.error;
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  }
  return (
    <div className="auth-page">
      <section className="auth-story">
        <Link to="/" aria-label="Vyntra home">
          <Logo showWordmark />
        </Link>
        <div>
          <p className="kicker">YOUR EVERYDAY, A LITTLE BETTER</p>
          <h1>
            Come as
            <br />
            you are.
            <br />
            <em>Keep moving.</em>
          </h1>
          <p>
            A simple space for your activity, your goals, and a routine that
            feels like you.
          </p>
        </div>
        <span className="auth-story-footer">
          ONE DAY AT A TIME <span>EST. 2026</span>
        </span>
      </section>
      <main className="auth-main">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          Back to home
        </Link>
        <div className="auth-form-wrap">
          <p className="kicker">YOUR VYNTRA ACCOUNT</p>
          <h2>{signup ? "Make yourself at home." : "Welcome back."}</h2>
          <p>
            {signup
              ? "Create an account to keep your activity together."
              : "A fresh check-in is waiting for you."}
          </p>
          <button
            className="button button-outline full-width"
            onClick={google}
            disabled={!!busy}
          >
            {busy === "google" ? (
              <Loader2 size={18} className="spin" />
            ) : (
              <span className="google-letter">G</span>
            )}
            Continue with Google
          </button>
          <div className="form-divider">
            <span>or use your email</span>
          </div>
          <form onSubmit={submit}>
            <label className="field-label" htmlFor="auth-email">
              Email address
            </label>
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="field-label" htmlFor="auth-password">
              Password
            </label>
            <div className="password-field">
              <input
                id="auth-password"
                type={visible ? "text" : "password"}
                required
                minLength={6}
                autoComplete={signup ? "new-password" : "current-password"}
                placeholder={
                  signup ? "At least 6 characters" : "Enter your password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="icon-button"
                aria-label={visible ? "Hide password" : "Show password"}
                onClick={() => setVisible(!visible)}
              >
                {visible ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            {success && (
              <p className="form-success" role="status">
                {success}
              </p>
            )}
            <button
              className="button button-dark full-width"
              type="submit"
              disabled={!!busy}
            >
              {busy === "email" ? (
                <Loader2 size={18} className="spin" />
              ) : (
                <>
                  {signup ? "Create account" : "Sign in"}
                  <ArrowUpRight size={17} />
                </>
              )}
            </button>
          </form>
          <p className="auth-switch">
            {signup ? "Already a member?" : "New around here?"}{" "}
            <button
              onClick={() => {
                setSignup(!signup);
                setError("");
                setSuccess("");
              }}
            >
              {signup ? "Sign in" : "Create an account"}
            </button>
          </p>
          <p className="auth-privacy">
            Read how your information is handled in our{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </div>
        <span className="auth-bottom">YOUR PACE. YOUR SPACE.</span>
      </main>
    </div>
  );
}
