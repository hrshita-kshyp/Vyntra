
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to save user fitness pulse
export const syncFitnessSession = async (userId, fitnessData) => {
    const { data, error } = await supabase
        .from('fitness_sessions')
        .insert([
            { 
                user_id: userId, 
                steps: fitnessData.steps.current,
                heart_rate: fitnessData.heartRate.current,
                calories: fitnessData.calories.current,
                recovery_hours: fitnessData.recovery.current,
                timestamp: new Date().toISOString()
            }
        ]);
    return { data, error };
};

// Helper to save AI Insights
export const saveAIInsight = async (userId, insightData) => {
    const { data, error } = await supabase
        .from('ai_logs')
        .insert([
            { 
                user_id: userId, 
                content: insightData,
                model_used: 'llama-3.3-70b-versatile',
                timestamp: new Date().toISOString()
            }
        ]);
    return { data, error };
};
