
import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { Heart, Moon, Zap, Shield, TrendingUp, Activity, Trophy } from 'lucide-react';

const mockDailyData = [
  { name: 'Mon', steps: 4500, hr: 72, recovery: 24, sleep: 7.5 },
  { name: 'Tue', steps: 8200, hr: 78, recovery: 18, sleep: 6.8 },
  { name: 'Wed', steps: 6100, hr: 71, recovery: 12, sleep: 8.2 },
  { name: 'Thu', steps: 10500, hr: 85, recovery: 28, sleep: 7.0 },
  { name: 'Fri', steps: 9300, hr: 76, recovery: 22, sleep: 7.4 },
  { name: 'Sat', steps: 12100, hr: 82, recovery: 32, sleep: 8.5 },
  { name: 'Sun', steps: 8742, hr: 132, recovery: 28, sleep: 7.2 },
];

const HealthAnalytics = ({ fitnessData }) => {
    // Basic checks for fitnessData structure
    const safeData = fitnessData || {
        recoveryTime: 28,
        sleepQuality: 7.2,
        stressLevel: 4,
        steps: { current: 8742, goal: 10000 }
    };

    return (
        <div className="space-y-6 p-4 max-w-6xl mx-auto pb-20">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-8">
                Bio-Metric Analytics
            </h2>

            {/* High Level Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Recovery Score */}
                <div className="bg-gray-900/40 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-xl flex flex-col items-center">
                    <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={364 * (safeData.recoveryTime / 48)} className="text-blue-500 transition-all duration-1000" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-white">{safeData.recoveryTime}h</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Rest Left</span>
                        </div>
                    </div>
                    <div className="flex items-center text-blue-400 font-medium">
                        <Activity size={16} className="mr-2" />
                        Optimal Intensity: 65%
                    </div>
                </div>

                {/* Sleep Analysis */}
                <div className="bg-gray-900/40 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 text-sm">Sleep Quality</p>
                            <h3 className="text-2xl font-bold text-white">{safeData.sleepQuality}/10</h3>
                        </div>
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Moon className="text-purple-400" size={20} />
                        </div>
                    </div>
                    <div className="h-24 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockDailyData}>
                                <defs>
                                    <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="sleep" stroke="#a855f7" fillOpacity={1} fill="url(#colorSleep)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stress & Performance */}
                <div className="bg-gray-900/40 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 text-sm">Strain Level</p>
                            <h3 className="text-2xl font-bold text-white">{safeData.stressLevel}/10</h3>
                        </div>
                        <div className="p-2 bg-red-500/20 rounded-lg">
                            <Zap className="text-red-400" size={20} />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                        {[...Array(10)].map((_, i) => (
                            <div 
                                key={i} 
                                className={`h-8 w-full rounded-sm ${i < safeData.stressLevel ? 'bg-gradient-to-t from-red-600 to-orange-400' : 'bg-gray-800'}`}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-4 italic">High strain detected during 10:00 - 11:30</p>
                </div>
            </div>

            {/* Performance Trends Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Step Trends */}
                <div className="bg-gray-900/40 backdrop-blur-md rounded-3xl p-8 border border-gray-800/50 shadow-2xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                        <TrendingUp className="mr-2 text-green-400" /> Weekly Activity Trends
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockDailyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="name" stroke="#9CA3AF" axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px', color: '#fff' }}
                                    cursor={{fill: '#374151', opacity: 0.2}}
                                />
                                <Bar dataKey="steps" radius={[6, 6, 0, 0]}>
                                    {mockDailyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 6 ? '#10B981' : '#3B82F6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Heart Rate Variability Prediction */}
                <div className="bg-gray-900/40 backdrop-blur-md rounded-3xl p-8 border border-gray-800/50 shadow-2xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                        <Heart className="mr-2 text-red-500" /> Predictive HRV Map
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockDailyData}>
                                <XAxis dataKey="name" stroke="#9CA3AF" hide />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px' }}
                                    itemStyle={{ color: '#F87171' }}
                                />
                                <Line 
                                    type="stepAfter" 
                                    dataKey="hr" 
                                    stroke="#F87171" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#F87171' }}
                                    activeDot={{ r: 8, stroke: '#111827', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Premium Insights Overlay */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                    <Trophy className="text-yellow-400 mr-2" />
                    <h4 className="font-bold text-white">2026 Prediction Algorithm v4.2</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <p className="text-blue-400 font-bold mb-1">Injury Prevention Focus</p>
                        <p className="text-gray-400">Your left ankle impact force has trended 4% higher this week. Recommend 15mins of eccentric calf loading.</p>
                    </div>
                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <p className="text-purple-400 font-bold mb-1">Longevity Forecast</p>
                        <p className="text-gray-400">Current VO2 Max trend suggests a +3.2 year longevity projection above baseline.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HealthAnalytics;