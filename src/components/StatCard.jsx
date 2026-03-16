
import React from 'react';
import { Activity, Heart, Flame, Moon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, goal, status, icon, color = 'blue', trend, trendValue, pulse = false }) => {
    const iconMap = {
        activity: Activity,
        heart: Heart,
        fire: Flame,
        moon: Moon,
    };

    const colors = {
        indigo: { text: 'text-indigo-600', bg: 'bg-indigo-50' },
        red: { text: 'text-red-600', bg: 'bg-red-50' },
        orange: { text: 'text-orange-600', bg: 'bg-orange-50' },
        blue: { text: 'text-blue-600', bg: 'bg-blue-50' },
        green: { text: 'text-green-600', bg: 'bg-green-50' },
    };

    const IconComponent = iconMap[icon] || Activity;
    const colorStyle = colors[color] || colors.blue;

    return (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${colorStyle.bg} ${colorStyle.text} group-hover:scale-110 transition-transform`}>
                    <IconComponent size={24} />
                </div>
                {trend && (
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold ${trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>
            
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{title}</p>
            <div className="flex items-baseline space-x-1 mt-1">
                <h2 className={`text-3xl font-black text-gray-900 ${pulse ? 'animate-pulse' : ''}`}>
                    {value}
                </h2>
                {status && <span className="text-gray-400 text-xs font-medium ml-1">{status}</span>}
            </div>

            {goal && (
                <div className="mt-4">
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className={`h-full rounded-full ${colorStyle.bg.replace('50', '500')}`} 
                            style={{ width: `${Math.min((parseFloat(value.replace(/,/g, '')) / goal) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatCard;
