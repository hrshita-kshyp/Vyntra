
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import AICoach from './components/AICoach';
import HealthAnalytics from './components/HealthAnalytics';
import FitnessTracker from './components/FitnessTracker';
import DeviceConnect from './components/DeviceConnect';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';

const AppLayout = () => (
  <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
    <Sidebar />
    <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
      <Outlet />
    </main>
  </div>
);

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<Landing />} />

        {/* Auth — redirect to /app if already logged in */}
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/app" />} />

        {/* Protected app routes */}
        <Route path="/app" element={user ? <AppLayout /> : <Navigate to="/auth" />}>
          <Route index element={<Dashboard />} />
          <Route path="ai-coach"  element={<AICoach />} />
          <Route path="analytics" element={<HealthAnalytics />} />
          <Route path="tracker"   element={<FitnessTracker />} />
          <Route path="connect"   element={<DeviceConnect />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
