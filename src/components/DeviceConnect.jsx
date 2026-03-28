
import React, { useState } from 'react';
import { useGoogleFit } from '../hooks/useGoogleFit';
import { CheckCircle, Loader2, AlertCircle, Unlink, Smartphone, Lock } from 'lucide-react';

const FUTURE_DEVICES = [
  { name: 'Samsung Health', emoji: '📱', users: '200M+ users', badge: 'Coming Soon' },
  { name: 'Garmin Connect', emoji: '⌚', users: '25M+ users', badge: 'Coming Soon' },
  { name: 'Fitbit', emoji: '🏃', users: '35M+ users', badge: 'Coming Soon' },
  { name: 'Oura Ring', emoji: '💍', users: 'Best sleep data', badge: 'Coming Soon' },
];

const DeviceConnect = () => {
  const { connected, fitData, loading, error, connect, disconnect } = useGoogleFit();

  const [birthYear, setBirthYear] = useState(localStorage.getItem('user_birth_year') || '');
  const [sleepHours, setSleepHours] = useState(localStorage.getItem('user_avg_sleep') || '');

  const handleConnect = () => {
    if (birthYear) localStorage.setItem('user_birth_year', birthYear);
    if (sleepHours) localStorage.setItem('user_avg_sleep', sleepHours);
    connect();
  };

  const chronoAge = birthYear ? new Date().getFullYear() - parseInt(birthYear) : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Connect Devices</h1>
        <p className="text-gray-500 mt-1">Link your health platforms to unlock your BioAge Score™</p>
      </div>

      {/* Google Fit Card */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 rounded-[2rem] p-8 text-white shadow-2xl">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            {/* Google G icon */}
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-8 h-8">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">Google Fit</h2>
              <p className="text-gray-400 text-sm">Steps · Heart Rate · Calories · Activity</p>
              <p className="text-blue-400 text-xs font-bold mt-0.5 uppercase tracking-wider">500M+ Android users</p>
            </div>
          </div>

          {connected && (
            <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-full">
              <CheckCircle size={15} className="text-green-400" />
              <span className="text-green-400 font-semibold text-sm">Connected</span>
            </div>
          )}
        </div>

        {!connected ? (
          <div className="mt-8 space-y-5">
            <p className="text-gray-400 text-sm leading-relaxed">
              We need two quick details to calculate your <span className="text-white font-semibold">BioAge Score™</span>. Your data stays private and is never shared.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 block">
                  Birth Year <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1992"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                  min="1940"
                  max="2006"
                />
                {chronoAge && (
                  <p className="text-gray-500 text-xs mt-1">Age: {chronoAge} years</p>
                )}
              </div>
              <div>
                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 block">
                  Avg. Sleep Hours / Night
                </label>
                <input
                  type="number"
                  placeholder="e.g. 7.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                  min="3"
                  max="12"
                  step="0.5"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start space-x-3 text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl p-4">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              onClick={handleConnect}
              disabled={loading || !birthYear}
              className="w-full md:w-auto bg-white text-gray-900 font-bold px-8 py-4 rounded-2xl hover:bg-gray-100 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-white/10"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <Smartphone size={20} />
                  <span>Connect Google Fit</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {fitData && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Today's Steps", value: fitData.today.steps.current.toLocaleString() },
                  { label: 'Heart Rate', value: `${fitData.today.heartRate.current} bpm` },
                  { label: 'Calories', value: fitData.today.calories.current.toLocaleString() },
                ].map((item) => (
                  <div key={item.label} className="bg-white/10 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black">{item.value}</p>
                    <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider">{item.label}</p>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={disconnect}
              className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors font-semibold text-sm"
            >
              <Unlink size={16} />
              <span>Disconnect Google Fit</span>
            </button>
          </div>
        )}
      </div>

      {/* Coming Soon devices */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Lock size={16} className="text-gray-400" />
          <span>More Integrations — Coming Soon</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FUTURE_DEVICES.map((device) => (
            <div
              key={device.name}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between opacity-60 cursor-not-allowed select-none"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{device.emoji}</span>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{device.name}</p>
                  <p className="text-gray-400 text-xs">{device.users}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {device.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeviceConnect;
