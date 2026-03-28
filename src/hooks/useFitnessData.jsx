
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useGoogleFit } from './useGoogleFit';
import { syncFitnessSession } from '../services/supabaseService';

// Demo data used when no device is connected
const DEMO_DATA = {
  steps:     { current: 8742,  goal: 10000 },
  heartRate: { current: 72 },
  calories:  { current: 1842,  goal: 2500 },
  recovery:  { current: 8 },
};

const DEMO_WEEKLY = [
  { date: 'Mon', steps: 7200,  heartRate: 74, calories: 1950 },
  { date: 'Tue', steps: 9500,  heartRate: 71, calories: 2200 },
  { date: 'Wed', steps: 6300,  heartRate: 76, calories: 1700 },
  { date: 'Thu', steps: 10200, heartRate: 69, calories: 2400 },
  { date: 'Fri', steps: 8100,  heartRate: 73, calories: 2000 },
  { date: 'Sat', steps: 11500, heartRate: 68, calories: 2600 },
  { date: 'Sun', steps: 8742,  heartRate: 72, calories: 1842 },
];

export const useFitnessData = () => {
  const { user } = useAuth();
  const { connected, fitData, loading: fitLoading } = useGoogleFit();

  const isLive = connected && !!fitData;

  // Derive current data from Google Fit or demo
  const currentData = isLive ? fitData.today : DEMO_DATA;
  const weeklyData  = isLive ? fitData.weeklyData : DEMO_WEEKLY;
  const averages    = isLive ? fitData.averages : {
    avgSteps: 8791,
    avgHR: 72,
    avgCalories: 2127,
  };

  // Simulate real-time step/HR ticks only in demo mode
  const [liveDemo, setLiveDemo] = useState(DEMO_DATA);

  useEffect(() => {
    if (isLive) return; // real data — no simulation needed

    const interval = setInterval(() => {
      setLiveDemo((prev) => ({
        ...prev,
        steps:     { ...prev.steps,     current: Math.min(prev.steps.current + Math.floor(Math.random() * 15), prev.steps.goal) },
        heartRate: { current: Math.floor(Math.random() * 12) + 68 },
        calories:  { ...prev.calories,  current: Math.min(prev.calories.current + 1, prev.calories.goal) },
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Sync to Supabase every 30 s when logged in and live
  useEffect(() => {
    if (!user?.id || !isLive) return;

    const sync = setInterval(async () => {
      const { error } = await syncFitnessSession(user.id, currentData);
      if (error) console.error('Sync error:', error.message);
    }, 30000);

    return () => clearInterval(sync);
  }, [user, isLive, currentData]);

  const data = isLive ? currentData : liveDemo;

  return {
    // Flat fields (backward compat with Dashboard / StatCard)
    steps:     data.steps,
    heartRate: data.heartRate,
    calories:  data.calories,
    recovery:  data.recovery,

    // Extra data for charts + BioAge
    weeklyData,
    averages,
    isLive,
    fitLoading,
    healthScore: 88,
  };
};
