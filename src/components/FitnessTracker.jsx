import React, { useState } from 'react';
import { Activity, Brain, TrendingUp } from 'lucide-react';
import Dashboard from './Dashboard';
import AICoach from './AICoach';
import HealthAnalytics from './HealthAnalytics';
import { useFitnessData } from '../hooks/useFitnessData';
import { useAIInsights } from '../hooks/useAIInsights';

const TabButton = ({ id, icon: Icon, label, active, onClick }) => (
    <button
        onClick={() => onClick(id)}
        className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${active
            ? 'bg-blue-600 text-white shadow-lg transform scale-105'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:transform hover:scale-102'
            }`}
    >
        <Icon size={20} />
        <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
);

const FitnessTracker = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { fitnessData, workoutMode, startWorkout, healthScore } = useFitnessData();
    const { aiInsight } = useAIInsights();

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <Dashboard
                        fitnessData={fitnessData}
                        workoutMode={workoutMode}
                        startWorkout={startWorkout}
                    />
                );
            case 'ai-coach':
                return <AICoach fitnessData={fitnessData} />;
            case 'health':
                return <HealthAnalytics fitnessData={fitnessData} />;
            default:
                return (
                    <Dashboard
                        fitnessData={fitnessData}
                        workoutMode={workoutMode}
                        startWorkout={startWorkout}
                    />
                );
        }
    };

    return (
        <div className="w-full bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <h1 className="text-xl font-bold tracking-wide">AI FitTracker Pro</h1>
                            <p className="text-purple-200 text-sm font-medium">
                                {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center">
                                {healthScore}
                            </div>
                            <div className="text-purple-200 text-xs mt-1 font-medium">Health Score</div>
                        </div>
                    </div>
                    {/* AI Insight Banner */}
                    <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-3 mt-3 border border-white border-opacity-20">
                        <div className="flex items-center mb-2">
                            <Brain size={18} className="text-yellow-400 mr-2" />
                            <span className="text-yellow-400 font-semibold text-sm">AI Insight</span>
                            <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-sm text-white leading-relaxed font-medium">{aiInsight || "Analyzing biometrics..."}</p>
                    </div>
                </div>
            </div>
            {/* Content Area */}
            <div className="p-6 bg-white min-h-96">{renderTabContent()}</div>
            {/* Bottom Navigation */}
            <div className="bg-gray-50 p-4 border-t border-gray-100">
                <div className="flex justify-around space-x-2">
                    <TabButton
                        id="dashboard"
                        icon={Activity}
                        label="Dashboard"
                        active={activeTab === 'dashboard'}
                        onClick={setActiveTab}
                    />
                    <TabButton
                        id="ai-coach"
                        icon={Brain}
                        label="AI Coach"
                        active={activeTab === 'ai-coach'}
                        onClick={setActiveTab}
                    />
                    <TabButton
                        id="health"
                        icon={TrendingUp}
                        label="Health"
                        active={activeTab === 'health'}
                        onClick={setActiveTab}
                    />
                </div>
            </div>
        </div>
    );
};

export default FitnessTracker;