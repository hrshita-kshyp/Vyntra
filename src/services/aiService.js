
import Groq from "groq-sdk";

// Lazy initialization of Groq to prevent crash on missing key
let groqClient = null;

const getGroqClient = () => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    
    if (!apiKey) {
        console.warn("VITE_GROQ_API_KEY is missing. AI features will be disabled.");
        return null;
    }

    if (!groqClient) {
        groqClient = new Groq({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true 
        });
    }
    return groqClient;
};

export const getAIRecommendations = async (fitnessData) => {
    const client = getGroqClient();
    if (!client) return null;

    try {
        const prompt = `
            Analyze this fitness data and provide a JSON response with specific recommendations:
            Steps: ${fitnessData.steps?.current || 0} / Goal: ${fitnessData.steps?.goal || 10000}
            Heart Rate: ${fitnessData.heartRate?.current || 72} bpm
            Calories: ${fitnessData.calories?.current || 0} kcal / Goal: ${fitnessData.calories?.goal || 2500}
            Recovery Time remaining: ${fitnessData.recovery?.current || 48} hours

            Return only a JSON object with:
            1. recommendations (array of 3 strings: "Optimal Workout Window", "Health Insight", "Sleep/Recovery Insight")
            2. behavioralInsights (array of 3 objects with {title, value, detail})
            3. smartGoals (array of 3 objects with {title, trend, value})
            4. workoutSuggestion (object with {title, duration, focus, reason})
        `;

        const chatCompletion = await client.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("Groq API Error:", error);
        return null;
    }
};
