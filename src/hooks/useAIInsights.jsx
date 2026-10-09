
import { useState, useEffect } from 'react';
import { getAIRecommendations } from '../services/aiService';
import { useFitnessData } from './useFitnessData';

export const useAIInsights = () => {
    const { steps, heartRate, calories, recovery, isLive } = useFitnessData();
    const stepCount = steps.current;
    const stepGoal = steps.goal;
    const hr = heartRate.current;
    const calorieCount = calories.current;
    const calorieGoal = calories.goal;
    const recoveryHours = recovery.current;
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInsights = async () => {
            if (!isLive || !import.meta.env.VITE_GROQ_API_KEY) return;
            
            setLoading(true);
            try {
                const data = await getAIRecommendations({ steps: { current: stepCount, goal: stepGoal }, heartRate: { current: hr }, calories: { current: calorieCount, goal: calorieGoal }, recovery: { current: recoveryHours } });
                if (data) {
                    setInsights(data);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        // Fetch initially and then maybe every few hours or on significant data change
        // For demo purposes, we'll just do it once when data is available
        if (!insights && stepCount > 0) {
            fetchInsights();
        }
    }, [stepCount, stepGoal, hr, calorieCount, calorieGoal, recoveryHours, isLive, insights]);

    return { insights, loading, error };
};
