import { useSyncExternalStore } from 'react';
import { useGoogleFit } from './useGoogleFit';
import { useAuth } from './useAuth';
import { calendarWeek, summarizeWeek } from '../utils/activityData';
const subscribe = callback => { window.addEventListener('vyntra-journal', callback); return () => window.removeEventListener('vyntra-journal', callback); };
export const useFitnessData = () => {
  const { user } = useAuth(); const fit = useGoogleFit();
  const raw = useSyncExternalStore(subscribe, () => localStorage.getItem('vyntra_journal_' + (user?.id || 'guest')));
  let entries = {}; try { entries = JSON.parse(raw || '{}'); } catch { /* Ignore damaged storage. */ }
  const manual = summarizeWeek(calendarWeek().map(day => ({ ...day, ...entries[day.dateKey]?.activity })), 'Daily check-in');
  const data = fit.fitData || manual;
  return { ...data.today,
    steps: { ...data.today.steps, goal: Number(localStorage.getItem('daily_step_goal')) || 10000 },
    calories: { ...data.today.calories, goal: Number(localStorage.getItem('daily_calorie_goal')) || 2500 },
    weeklyData: data.weeklyData, averages: data.averages, isLive: !!fit.fitData,
    source: fit.fitData ? 'Google Fit' : Object.keys(entries).length ? 'Daily check-in' : 'No activity yet',
    connected: fit.connected, needsReconnect: fit.needsReconnect, fitLoading: fit.loading,
    error: fit.error, fetchedAt: data.fetchedAt, refresh: fit.refresh,
  };
};
