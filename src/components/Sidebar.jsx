import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  LayoutGrid,
  ChartNoAxesCombined,
  ArrowUpRight,
  Target,
  Cable,
  Compass,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../hooks/useAuth";
const navigation = [
  { path: "/app", label: "Overview", icon: LayoutGrid },
  { path: "/app/analytics", label: "Activity", icon: ChartNoAxesCombined },
  { path: "/app/ai-coach", label: "Coach", icon: Compass },
  { path: "/app/tracker", label: "Goals", icon: Target },
  { path: "/app/connect", label: "Connections", icon: Cable },
];
export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const { user, signOut } = useAuth();
  useEffect(() => {
    if (!open) return;
    const close = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  async function logout() {
    const result = await signOut();
    if (result.error) setError("Could not sign out. Try again.");
  }
  return (
    <>
      <header className="mobile-bar">
        <Link to="/" aria-label="Vyntra home">
          <Logo size={24} showWordmark />
        </Link>
        <button
          className="icon-button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="app-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>
      {open && (
        <button
          className="nav-scrim"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`sidebar ${open ? "sidebar-open" : ""}`}
        id="app-navigation"
      >
        <Link className="sidebar-brand" to="/" aria-label="Vyntra home">
          <Logo showWordmark />
        </Link>
        <p className="nav-caption">YOUR SPACE</p>
        <nav aria-label="Main navigation">
          {navigation.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              end={path === "/app"}
              to={path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} strokeWidth={1.6} />
              <span>{label}</span>
              <span className="nav-indicator" />
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="kicker">KEEP IT SIMPLE</span>
            <p>
              A little progress,
              <br />
              every day.
            </p>
            <Link to="/app/tracker" onClick={() => setOpen(false)}>
              Your daily targets <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="account-row">
            <span className="avatar">
              {(user?.email || "Guest")[0].toUpperCase()}
            </span>
            <div>
              <strong>{user?.email?.split("@")[0] || "Guest workspace"}</strong>
              <span>{user ? "Personal account" : "Exploring Vyntra"}</span>
            </div>
            {user ? (
              <button
                className="icon-button"
                aria-label="Sign out"
                onClick={logout}
              >
                <LogOut size={17} />
              </button>
            ) : (
              <Link to="/auth" aria-label="Sign in">
                <ArrowUpRight size={18} />
              </Link>
            )}
          </div>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
