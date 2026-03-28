
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import StatCard from './StatCard';
import BioAgeScore from './BioAgeScore';
import { useFitnessData } from '../hooks/useFitnessData';
import { useAIInsights } from '../hooks/useAIInsights';
import { Brain, Zap, Clock, TrendingUp, Loader2, Wifi, Watch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isGoogleFitConnected } from '../services/googleFitService';

// Custom tooltip for the trend chart
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-white/10 rounded-xl px-4 py-3 shadow-2xl text-white text-xs">
      <p className="font-bold text-gray-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { steps, heartRate, calories, recovery, weeklyData, averages, isLive, fitLoading } = useFitnessData();
  const { insights, loading: aiLoading } = useAIInsights();
  const deviceConnected = isGoogleFitConnected();

  // No device linked at all — show connect prompt
  if (!deviceConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 px-4">
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center">
          <Watch size={36} className="text-blue-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">No device connected</h2>
          <p className="text-gray-400 mt-2 max-w-sm">Link Google Fit to see your real health data and calculate your BioAge Score™</p>
        </div>
        <button
          onClick={() => navigate('/app/connect')}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/25"
        >
          Connect a Device
        </button>
      </div>
    );
  }

  // Device connected but loading
  if (fitLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-gray-400 font-semibold">Fetching your Google Fit data...</p>
      </div>
    );
  }

  // Device connected but no data found
  if (!isLive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 px-4">
        <div className="w-20 h-20 bg-yellow-50 rounded-3xl flex items-center justify-center">
          <Watch size={36} className="text-yellow-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Google Fit connected — no data yet</h2>
          <p className="text-gray-400 mt-2 max-w-md">
            Your Google Fit account doesn't have any fitness data. If you use a Mi Band, enable Google Fit sync in the Mi Fitness app first.
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-left max-w-md w-full space-y-3 text-sm">
          <p className="font-black text-gray-700 text-xs uppercase tracking-widest">Mi Band / Xiaomi users:</p>
          <ol className="text-gray-500 space-y-2 leading-relaxed">
            <li>1. Open <strong className="text-gray-800">Mi Fitness</strong> app</li>
            <li>2. Profile → Settings → <strong className="text-gray-800">Connected apps</strong></li>
            <li>3. Tap <strong className="text-gray-800">Google Fit</strong> → Enable</li>
            <li>4. Wait a few minutes, then refresh this page</li>
          </ol>
          <p className="text-gray-400 text-xs pt-2 border-t border-gray-100">
            Android users without a band: Install the Google Fit app and open it once — your phone tracks steps automatically.
          </p>
        </div>
        <button
          onClick={() => navigate('/app/connect')}
          className="text-blue-600 hover:text-blue-700 font-bold underline underline-offset-4 text-sm"
        >
          Manage Devices
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Overview</h1>
          <p className="text-gray-500 mt-1">Vyntra OS — Live Biometric Feed</p>
        </div>
        <div className="flex items-center gap-3">
          {isLive ? (
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
              <Wifi size={14} className="text-green-500" />
              <span className="text-sm font-semibold text-gray-700">Google Fit Live</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          ) : (
            <button
              onClick={() => navigate('/app/connect')}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-2xl shadow-sm transition-colors"
            >
              <Link size={14} />
              <span className="text-sm font-semibold">Connect Device</span>
            </button>
          )}
          {!isLive && (
            <div className="flex items-center space-x-2 bg-yellow-50 px-4 py-2 rounded-2xl border border-yellow-200">
              <WifiOff size={14} className="text-yellow-500" />
              <span className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Demo Mode</span>
            </div>
          )}
        </div>
      </div>

      {/* BioAge + Stats row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BioAge Score — spans 1 col on lg */}
        <div className="lg:col-span-1">
          <BioAgeScore averages={averages} isDemo={!isLive} />
        </div>

        {/* 4 stat cards in a 2×2 grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <StatCard
            title="Daily Steps"
            value={steps.current.toLocaleString()}
            goal={steps.goal}
            icon="activity"
            trend="up"
            trendValue="vs avg"
          />
          <StatCard
            title="Heart Rate"
            value={heartRate.current}
            status="bpm"
            icon="heart"
            color="red"
            pulse
          />
          <StatCard
            title="Active Burn"
            value={calories.current}
            goal={calories.goal}
            icon="fire"
            color="orange"
            trend="up"
            trendValue="+120"
          />
          <StatCard
            title="Avg Sleep"
            value={`${localStorage.getItem('user_avg_sleep') || recovery.current}h`}
            status={localStorage.getItem('user_avg_sleep') ? 'per night' : 'recovery'}
            icon="moon"
            color="blue"
          />
        </div>
      </div>

      {/* Charts + AI row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* 7-day trend chart */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">7-Day Activity Trend</h3>
              <p className="text-gray-400 text-sm mt-0.5">{isLive ? 'Real data from Google Fit' : 'Demo data — connect a device for real trends'}</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-bold">
              <span className="flex items-center space-x-1.5 text-blue-500">
                <span className="w-3 h-0.5 bg-blue-500 rounded inline-block" />
                <span>Steps</span>
              </span>
              <span className="flex items-center space-x-1.5 text-red-400">
                <span className="w-3 h-0.5 bg-red-400 rounded inline-block" />
                <span>Heart Rate</span>
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="steps"
                orientation="left"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                yAxisId="hr"
                orientation="right"
                domain={[50, 120]}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                yAxisId="steps"
                type="monotone"
                dataKey="steps"
                name="Steps"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="hr"
                type="monotone"
                dataKey="heartRate"
                name="Heart Rate"
                stroke="#f87171"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#f87171', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Coach quick card */}
        <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Brain size={140} />
          </div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center space-x-2 text-blue-400 mb-4">
              <Zap size={18} />
              <span className="font-bold tracking-widest text-xs uppercase">AI Engine</span>
            </div>

            <h2 className="text-xl font-bold mb-4 leading-snug">
              {aiLoading
                ? 'Synthesizing...'
                : insights?.workoutSuggestion?.title || 'Evaluating Performance...'}
            </h2>

            {aiLoading ? (
              <div className="flex items-center space-x-2 mt-auto">
                <Loader2 size={16} className="animate-spin text-blue-400" />
                <span className="text-blue-200 text-sm">Processing biometric vectors...</span>
              </div>
            ) : (
              <div className="space-y-4 mt-auto">
                <p className="text-blue-100 text-sm leading-relaxed">
                  {insights?.workoutSuggestion?.reason || 'Complete 500 more steps to unlock today\'s recommendation.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {insights?.workoutSuggestion?.duration && (
                    <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                      <Clock size={13} className="text-blue-400" />
                      <span className="text-xs font-semibold">{insights.workoutSuggestion.duration}</span>
                    </div>
                  )}
                  {insights?.workoutSuggestion?.focus && (
                    <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                      <TrendingUp size={13} className="text-green-400" />
                      <span className="text-xs font-semibold">{insights.workoutSuggestion.focus}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Weekly averages summary */}
      {averages && (
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-5">7-Day Averages</h3>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Avg Steps / Day', value: averages.avgSteps.toLocaleString(), color: 'text-blue-600' },
              { label: 'Avg Heart Rate',  value: `${averages.avgHR} bpm`,            color: 'text-red-500'  },
              { label: 'Avg Calories',    value: averages.avgCalories.toLocaleString(), color: 'text-orange-500' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className={`text-3xl font-black ${item.color}`}>{item.value}</p>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
