
import { useState, useEffect } from 'react';
import { getAIRecommendations } from '../services/aiService';
import useFitnessData from './useFitnessData';

export const useAIInsights = () => {
    const fitnessData = useFitnessData();
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInsights = async () => {
            if (!fitnessData) return;
            
            setLoading(true);
            try {
                const data = await getAIRecommendations(fitnessData);
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
        if (!insights && fitnessData.steps.current > 0) {
            fetchInsights();
        }
    }, [fitnessData, insights]);

    return { insights, loading, error };
};
