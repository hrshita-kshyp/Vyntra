
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true // Necessary for client-side demo, though not recommended for production
});

export const getAIRecommendations = async (fitnessData) => {
    try {
        const prompt = `
            Analyze this fitness data and provide a JSON response with specific recommendations:
            Steps: ${fitnessData.steps.current} / Goal: ${fitnessData.steps.goal}
            Heart Rate: ${fitnessData.heartRate.current} bpm
            Calories: ${fitnessData.calories.current} kcal / Goal: ${fitnessData.calories.goal}
            Recovery Time remaining: ${fitnessData.recovery.current} hours

            Return only a JSON object with:
            1. recommendations (array of 3 strings: "Optimal Workout Window", "Health Insight", "Sleep/Recovery Insight")
            2. behavioralInsights (array of 3 objects with {title, value, detail})
            3. smartGoals (array of 3 objects with {title, trend, value})
            4. workoutSuggestion (object with {title, duration, focus, reason})
        `;

        const chatCompletion = await groq.chat.completions.create({
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
