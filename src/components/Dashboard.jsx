
import React from 'react';
import StatCard from './StatCard';
import useFitnessData from '../hooks/useFitnessData';
import { useAIInsights } from '../hooks/useAIInsights';
import { Brain, Zap, Clock, TrendingUp, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { steps, heartRate, calories, recovery } = useFitnessData();
  const { insights, loading: aiLoading } = useAIInsights();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Overview</h1>
          <p className="text-gray-500 mt-1">Vyntra OS v2026.3.16 — Live Biometric Feed</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-gray-700">Sync Active</span>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Daily Steps" 
          value={steps.current.toLocaleString()} 
          goal={steps.goal} 
          icon="activity"
          trend="up"
          trendValue="8% vs avg"
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
          title="System Recovery" 
          value={`${recovery.current}h`} 
          status="Ready for Strain"
          icon="moon"
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Quick Insight */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-blue-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
             <Brain size={180} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-blue-400 mb-4">
              <Zap size={20} />
              <span className="font-bold tracking-widest text-sm uppercase">AI Engine Output</span>
            </div>
            
            <h2 className="text-3xl font-bold mb-6">
              {aiLoading ? "Synthesizing Recommendations..." : (insights?.workoutSuggestion?.title || "Evaluating Performance...")}
            </h2>
            
            {aiLoading ? (
              <div className="flex items-center space-x-3">
                <Loader2 className="animate-spin" />
                <span className="text-blue-200">Processing cross-modal biometric vectors...</span>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-lg text-blue-100 max-w-xl leading-relaxed">
                  {insights?.workoutSuggestion?.reason || "Complete 500 more steps to unlock today's predictive workout recommendation."}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                    <Clock size={16} className="text-blue-400" />
                    <span className="text-sm font-medium">{insights?.workoutSuggestion?.duration || "--"}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                    <TrendingUp size={16} className="text-green-400" />
                    <span className="text-sm font-medium">{insights?.workoutSuggestion?.focus || "--"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
             <Activity className="mr-2 text-blue-600" size={24} /> Bio-Metrics
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-500">VO2 MAX EST.</span>
                <span className="text-blue-600">54.2</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-500">SLEEP LATENCY</span>
                <span className="text-purple-600">8.5 min</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-purple-600 h-3 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-500">HRV (SDNN)</span>
                <span className="text-red-500">62 ms</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-red-500 h-3 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-sm text-blue-700 leading-relaxed font-medium">
              Your HRV is trending 12% higher than last week. This indicates excellent cardiovascular recovery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
