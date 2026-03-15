
import React from 'react';
import { Target, Heart, Moon, Brain, TrendingUp, Zap, Loader2 } from 'lucide-react';
import { useAIInsights } from '../hooks/useAIInsights';
import useFitnessData from '../hooks/useFitnessData';

const AICoach = () => {
    const { insights, loading, error } = useAIInsights();
    const fitnessData = useFitnessData();

    if (loading && !insights) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-gray-400 font-medium">AI Coach is analyzing your biometrics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-500">
                Error loading AI insights. Please check your API key.
            </div>
        );
    }

    // Fallback data if insights haven't loaded yet
    const data = insights || {
        recommendations: [
            "Optimal Workout Window: 14:00 - 16:00",
            "Heart Rate Variability analysis suggests HIIT",
            "Sleep debt: 0.5hrs. Recovery time extended"
        ],
        behavioralInsights: [
            { title: "Tuesday Performance Boost", value: "+23%", detail: "Consistent pattern detected" },
            { title: "Morning Session Success", value: "+15%", detail: "Higher completion rates" },
            { title: "Stress-Sleep Correlation", value: "89%", detail: "Strong predictive relationship" }
        ],
        smartGoals: [
            { title: "Weekly Step Increase", trend: "Based on current trend", value: "+8.5%" },
            { title: "Recovery Optimization", trend: "Time reduction target", value: "-2.3hrs" },
            { title: "Consistency Score", trend: "Workout adherence", value: "94%" }
        ],
        workoutSuggestion: {
            title: "High-Intensity Interval Training",
            duration: "25 minutes",
            focus: "Cardio + Strength",
            reason: "Based on your recovery status and performance history"
        }
    };

    return (
        <div className="space-y-4 p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-blue-400 mb-6">AI Personal Coach</h2>

            {/* Today's AI Recommendations */}
            <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-6 border border-purple-500/30 shadow-xl">
                <h3 className="font-bold mb-4 flex items-center text-white text-lg">
                    <Brain className="mr-2 text-purple-400" size={24} />
                    Today's AI Recommendations
                </h3>
                <div className="space-y-3">
                    {data.recommendations.map((rec, idx) => {
                        const Icons = [Target, Heart, Moon];
                        const Colors = ["text-green-400", "text-red-400", "text-purple-400"];
                        const Icon = Icons[idx % 3];
                        return (
                            <div key={idx} className="flex items-start space-x-3 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                                <Icon className={`${Colors[idx % 3]} mt-0.5 flex-shrink-0`} size={20} />
                                <div className="text-gray-100 font-medium">{rec}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Behavioral Insights */}
                <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-lg">
                    <h3 className="font-bold mb-4 text-yellow-400 flex items-center text-lg">
                        <TrendingUp className="mr-2" size={20} />
                        Behavioral Insights
                    </h3>
                    <div className="space-y-3">
                        {data.behavioralInsights.map((insight, idx) => (
                            <div key={idx} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-200 font-medium">{insight.title}</span>
                                    <span className="text-green-400 font-bold">{insight.value}</span>
                                </div>
                                <div className="text-xs text-gray-400">{insight.detail}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Smart Goals */}
                <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-lg">
                    <h3 className="font-bold mb-4 text-green-400 flex items-center text-lg">
                        <Zap className="mr-2" size={20} />
                        Smart Goals (AI Generated)
                    </h3>
                    <div className="space-y-3">
                        {data.smartGoals.map((goal, idx) => (
                            <div key={idx} className="flex justify-between items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                                <div>
                                    <div className="font-medium text-gray-200">{goal.title}</div>
                                    <div className="text-xs text-gray-400">{goal.trend}</div>
                                </div>
                                <span className="text-green-400 font-bold text-xl">{goal.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Workout Recommendation */}
            <div className="bg-gradient-to-br from-orange-900 to-red-900 rounded-2xl p-6 border border-orange-500/30 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Zap size={120} className="text-white" />
                </div>
                <h3 className="font-bold mb-4 text-orange-400 flex items-center text-lg">
                    🔥 AI Workout Suggestion
                </h3>
                <div className="space-y-3 relative z-10">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-black/20 rounded-lg">
                            <span className="text-xs text-orange-300 block mb-1">Recommended Activity</span>
                            <span className="font-bold text-white text-sm">{data.workoutSuggestion.title}</span>
                        </div>
                        <div className="p-3 bg-black/20 rounded-lg">
                            <span className="text-xs text-orange-300 block mb-1">Duration</span>
                            <span className="font-bold text-white text-sm">{data.workoutSuggestion.duration}</span>
                        </div>
                    </div>
                    <div className="p-3 bg-black/20 rounded-lg">
                        <span className="text-xs text-orange-300 block mb-1">Focus Areas</span>
                        <span className="font-bold text-white text-sm">{data.workoutSuggestion.focus}</span>
                    </div>
                    <p className="text-sm text-gray-200 italic mt-2">
                        "{data.workoutSuggestion.reason}"
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AICoach;