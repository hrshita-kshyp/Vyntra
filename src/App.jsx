import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Landing from "./components/Landing";
import { lazy, Suspense } from "react";
const Dashboard = lazy(() => import("./components/Dashboard"));
const AICoach = lazy(() => import("./components/AICoach"));
const HealthAnalytics = lazy(() => import("./components/HealthAnalytics"));
import FitnessTracker from "./components/FitnessTracker";
import DeviceConnect from "./components/DeviceConnect";
import Auth from "./components/Auth";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Sidebar from "./components/Sidebar";
import { GoogleFitProvider } from "./hooks/useGoogleFit";
import { useAuth } from "./hooks/useAuth";
import { Loader2 } from "lucide-react";

const AppLayout = ({ accountId }) => (
  <GoogleFitProvider key={accountId} accountId={accountId}>
  <div className="app-shell">
    <Sidebar />
    <main className="app-main">
      <Suspense
        fallback={
          <p className="page-loading" role="status">
            Loading your workspace...
          </p>
        }
      >
        <Outlet />
      </Suspense>
    </main>
  </div>
  </GoogleFitProvider>
);

function App() {
  const { user, loading } = useAuth();

  const loadingScreen = (
    <div className="loading-screen">
      <Loader2 className="spin" />
    </div>
  );

  return (
<Router>
        <Routes>
          {/* Public landing page */}
          <Route path="/" element={<Landing />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* Auth — redirect to /app if already logged in */}
          <Route
            path="/auth"
            element={
              loading ? (
                loadingScreen
              ) : !user ? (
                <Auth />
              ) : (
                <Navigate to="/app" replace />
              )
            }
          />

          {/* Protected app routes */}
          <Route
            path="/app"
            element={
              loading ? (
                loadingScreen
              ) : user ? (
                <AppLayout accountId={user.id} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="ai-coach" element={<AICoach />} />
            <Route path="analytics" element={<HealthAnalytics />} />
            <Route path="tracker" element={<FitnessTracker />} />
            <Route path="connect" element={<DeviceConnect />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
);
}

export default App;
