
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AICoach from './components/AICoach';
import HealthAnalytics from './components/HealthAnalytics';
import FitnessTracker from './components/FitnessTracker';
import Auth from './components/Auth';
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Auth Route */}
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />

          {/* Protected Routes */}
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
          <Route path="/ai-coach" element={user ? <AICoach /> : <Navigate to="/auth" />} />
          <Route path="/analytics" element={user ? <HealthAnalytics /> : <Navigate to="/auth" />} />
          <Route path="/tracker" element={user ? <FitnessTracker /> : <Navigate to="/auth" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
