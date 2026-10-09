
import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useGoogleFit } from './useGoogleFit';
import { syncFitnessSession } from '../services/supabaseService';

// Demo data used when no device is connected
const DEMO_DATA = {
  steps:     { current: 8742,  goal: Number(localStorage.getItem('daily_step_goal')) || 10000 },
  heartRate: { current: 72 },
  calories:  { current: 1842,  goal: Number(localStorage.getItem('daily_calorie_goal')) || 2500 },
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
  const { connected, needsReconnect, fitData, loading: fitLoading, refresh } = useGoogleFit();

  // Treat as live if real step data exists — don't gate on current connection state
  // so data stays visible even while a silent token refresh is in progress
  const hasRealData = !!fitData && fitData.weeklyData.some(day => day.steps > 0 || day.heartRate != null || day.calories > 0);
  const isLive = hasRealData;

  // Derive current data from Google Fit or demo
  const currentData = isLive ? fitData.today : DEMO_DATA;
  const weeklyData  = isLive ? fitData.weeklyData : DEMO_WEEKLY;
  const averages    = isLive ? fitData.averages : {
    avgSteps: Math.round(DEMO_WEEKLY.reduce((sum, day) => sum + day.steps, 0) / DEMO_WEEKLY.length),
    avgHR: 72,
    avgCalories: Math.round(DEMO_WEEKLY.reduce((sum, day) => sum + day.calories, 0) / DEMO_WEEKLY.length),
  };

  // Sync to Supabase every 30 s when logged in and live
  useEffect(() => {
    if (!user?.id || !isLive) return;

    const sync = setInterval(async () => {
      const { error } = await syncFitnessSession(user.id, currentData);
      if (error) console.error('Sync error:', error.message);
    }, 30000);

    return () => clearInterval(sync);
  }, [user, isLive, currentData]);

  const data = currentData;

  return {
    // Flat fields (backward compat with Dashboard / StatCard)
    steps:     { ...data.steps, goal: Number(localStorage.getItem('daily_step_goal')) || 10000 },
    heartRate: data.heartRate,
    calories:  { ...data.calories, goal: Number(localStorage.getItem('daily_calorie_goal')) || 2500 },
    recovery:  data.recovery,

    // Extra data for charts + BioAge
    weeklyData,
    averages,
    isLive,
    connected,
    needsReconnect,
    fitLoading,
    refresh,
    healthScore: 88,
  };
};
