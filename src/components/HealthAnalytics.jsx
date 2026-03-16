
import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { Heart, Moon, Zap, Shield, TrendingUp, Activity, Trophy } from 'lucide-react';
import useFitnessData from '../hooks/useFitnessData';

const mockDailyData = [
  { name: 'Mon', steps: 4500, hr: 72, recovery: 24, sleep: 7.5 },
  { name: 'Tue', steps: 8200, hr: 78, recovery: 18, sleep: 6.8 },
  { name: 'Wed', steps: 6100, hr: 71, recovery: 12, sleep: 8.2 },
  { name: 'Thu', steps: 10500, hr: 85, recovery: 28, sleep: 7.0 },
  { name: 'Fri', steps: 9300, hr: 76, recovery: 22, sleep: 7.4 },
  { name: 'Sat', steps: 12100, hr: 82, recovery: 32, sleep: 8.5 },
  { name: 'Sun', steps: 8742, hr: 132, recovery: 28, sleep: 7.2 },
];

const HealthAnalytics = () => {
    const fitnessData = useFitnessData();
    
    const safeData = {
        recoveryTime: fitnessData.recovery?.current || 28,
        sleepQuality: 7.2,
        stressLevel: 4,
        steps: fitnessData.steps || { current: 8742, goal: 10000 }
    };

    return (
        <div className="space-y-6 p-4 max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-8">
                Bio-Metric Analytics
            </h2>

            {/* High Level Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Recovery Score */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center">
                    <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={364 * (1 - safeData.recoveryTime / 48)} className="text-blue-600 transition-all duration-1000" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-gray-900">{safeData.recoveryTime}h</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Recovery</span>
                        </div>
                    </div>
                    <div className="flex items-center text-blue-600 font-bold text-sm">
                        <Activity size={16} className="mr-2" />
                        Optimal Intensity: 65%
                    </div>
                </div>

                {/* Sleep Analysis */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Sleep Quality</p>
                            <h3 className="text-2xl font-black text-gray-900">{safeData.sleepQuality}/10</h3>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-2xl">
                            <Moon className="text-purple-600" size={24} />
                        </div>
                    </div>
                    <div className="h-24 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockDailyData}>
                                <defs>
                                    <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="sleep" stroke="#9333ea" strokeWidth={3} fillOpacity={1} fill="url(#colorSleep)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stress & Performance */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Strain Level</p>
                            <h3 className="text-2xl font-black text-gray-900">{safeData.stressLevel}/10</h3>
                        </div>
                        <div className="p-3 bg-red-50 rounded-2xl">
                            <Zap className="text-red-600" size={24} />
                        </div>
                    </div>
                    <div className="flex items-center space-x-1 mt-4">
                        {[...Array(10)].map((_, i) => (
                            <div 
                                key={i} 
                                className={`h-8 w-full rounded-md transition-all duration-500 ${i < safeData.stressLevel ? 'bg-gradient-to-t from-red-600 to-orange-400' : 'bg-gray-100'}`}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-4 font-medium italic">High strain detected during 10:00 - 11:30</p>
                </div>
            </div>

            {/* Performance Trends Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Step Trends */}
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-2xl shadow-gray-200/30">
                    <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center">
                        <TrendingUp className="mr-2 text-green-500" /> Weekly Activity Trends
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockDailyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{fill: '#f3f4f6', opacity: 0.5}}
                                />
                                <Bar dataKey="steps" radius={[6, 6, 6, 6]}>
                                    {mockDailyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 6 ? '#2563eb' : '#e2e8f0'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Heart Rate Variability Prediction */}
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-2xl shadow-gray-200/30">
                    <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center">
                        <Heart className="mr-2 text-red-500" /> Predictive HRV Map
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockDailyData}>
                                <XAxis dataKey="name" stroke="#94a3b8" hide />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#ef4444' }}
                                />
                                <Line 
                                    type="stepAfter" 
                                    dataKey="hr" 
                                    stroke="#ef4444" 
                                    strokeWidth={4} 
                                    dot={{ r: 6, fill: '#ef4444', strokeWidth: 0 }}
                                    activeDot={{ r: 8, stroke: '#ffffff', strokeWidth: 3 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Premium Insights Overlay */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-500/30">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Trophy size={160} />
                </div>
                <div className="relative z-10 flex items-center mb-6">
                    <Trophy className="text-yellow-400 mr-2" />
                    <h4 className="font-black text-xl tracking-tight">Vyntra Longevity Algorithm v4.2</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                        <p className="text-blue-100 font-black mb-2 uppercase text-xs tracking-widest">Injury Prevention Focus</p>
                        <p className="text-gray-100 text-sm leading-relaxed">
                            Your left ankle impact force has trended 4% higher this week. We recommend adding 15mins of eccentric calf loading to your next session.
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                        <p className="text-purple-100 font-black mb-2 uppercase text-xs tracking-widest">Longevity Forecast</p>
                        <p className="text-gray-100 text-sm leading-relaxed">
                            Current VO2 Max trend suggests a +3.2 year longevity projection above your age baseline due to consistent heart rate stabilization.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HealthAnalytics;