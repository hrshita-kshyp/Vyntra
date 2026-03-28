
import React, { useState, useEffect } from 'react';
import { calculateBioAge } from '../utils/bioAgeCalculator';
import { TrendingDown, TrendingUp, Minus, Share2, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BioAgeScore = ({ averages, isDemo = false }) => {
  const navigate = useNavigate();
  const birthYear = parseInt(localStorage.getItem('user_birth_year') || '0');
  const sleepHours = parseFloat(localStorage.getItem('user_avg_sleep') || '0');
  const chronoAge = birthYear ? new Date().getFullYear() - birthYear : null;

  const [displayAge, setDisplayAge] = useState(chronoAge || 30);

  // If no birth year set, show the connect prompt
  if (!chronoAge) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-8 text-white shadow-2xl flex flex-col items-center justify-center text-center min-h-[200px]">
        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">BioAge Score™</p>
        <p className="text-white font-bold text-lg mb-2">Connect a device to unlock</p>
        <p className="text-gray-400 text-sm mb-6 max-w-xs">Link Google Fit to calculate your true biological age from real health data</p>
        <button
          onClick={() => navigate('/app/connect')}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl flex items-center space-x-2 transition-colors"
        >
          <Link size={18} />
          <span>Connect Device</span>
        </button>
      </div>
    );
  }

  const result = calculateBioAge(chronoAge, {
    avgRestingHR: averages?.avgHR || 72,
    avgDailySteps: averages?.avgSteps || 0,
    avgSleepHours: sleepHours || 7,
  });

  // Animated count-up/down to bioAge
  useEffect(() => {
    const target = result.bioAge;
    const start = chronoAge;
    const duration = 1800;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayAge(Math.round(start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [result.bioAge, chronoAge]);

  const delta = result.delta;
  const isYounger = delta < 0;
  const isSame = delta === 0;

  const gradientClass =
    result.score >= 75 ? 'from-emerald-400 to-green-500'
    : result.score >= 55 ? 'from-blue-400 to-cyan-500'
    : result.score >= 35 ? 'from-yellow-400 to-orange-400'
    : 'from-red-400 to-rose-500';

  const deltaColor =
    isYounger ? 'text-emerald-400' : isSame ? 'text-gray-400' : 'text-red-400';

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
      {/* Subtle glow */}
      <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br ${gradientClass} opacity-10 blur-3xl pointer-events-none`} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">BioAge Score™</p>
            {isDemo && (
              <span className="inline-block mt-1 text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full font-bold">
                Demo Data
              </span>
            )}
          </div>
          <button
            onClick={() => {
              const text = `My BioAge Score is ${result.bioAge} — I'm biologically ${Math.abs(delta)} year${Math.abs(delta) !== 1 ? 's' : ''} ${isYounger ? 'younger' : 'older'} than my age! Track yours at vyntra.app`;
              navigator.clipboard?.writeText(text);
            }}
            title="Copy shareable text"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Share2 size={16} />
          </button>
        </div>

        {/* Score */}
        <div className="flex items-end space-x-6 mb-8">
          <div className={`text-[88px] font-black leading-none bg-gradient-to-br ${gradientClass} bg-clip-text text-transparent`}>
            {displayAge}
          </div>
          <div className="pb-2">
            <p className="text-gray-400 text-sm">Biological Age</p>
            <p className="text-gray-600 text-xs mt-0.5">Chrono: {chronoAge} yrs</p>
            <div className={`flex items-center space-x-1.5 mt-2 font-bold text-sm ${deltaColor}`}>
              {isYounger ? (
                <TrendingDown size={16} />
              ) : isSame ? (
                <Minus size={16} />
              ) : (
                <TrendingUp size={16} />
              )}
              <span>
                {isYounger
                  ? `${Math.abs(delta)} yrs younger`
                  : isSame
                  ? 'On target'
                  : `${delta} yrs older`}
              </span>
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 font-bold mb-2">
            <span>WELLNESS SCORE</span>
            <span className={`${result.score >= 60 ? 'text-emerald-400' : result.score >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {result.score}/100
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-1000`}
              style={{ width: `${result.score}%` }}
            />
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-3 border-t border-white/10 pt-5">
          {result.breakdown.map((item) => (
            <div key={item.metric} className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">{item.metric}</span>
              <div className="flex items-center space-x-3">
                <span className="text-white text-sm font-semibold">{item.value}</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    item.rating === 'Excellent'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : item.rating === 'Good'
                      ? 'bg-blue-500/20 text-blue-400'
                      : item.rating === 'Average' || item.rating === 'Needs Work'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {item.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BioAgeScore;
