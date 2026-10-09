// Transparent, local coaching rules. No API keys or health data leave the browser.
export const getAIRecommendations = (data) => {
  if (!Number.isFinite(data.steps.current)) return null;
  const remaining = Math.max(0, data.steps.goal - data.steps.current);
  const met = remaining === 0;
  return {
    workoutSuggestion: {
      title: met ? 'You met your target. Choose what feels good.' : 'Make room for a comfortable walk.',
      duration: met ? 'Optional' : '10?20 minutes', focus: 'Everyday movement',
      reason: met ? 'Your reported steps have reached your chosen target. More is optional.' : remaining.toLocaleString() + ' steps remain against your chosen target. This suggestion does not predict how many steps a walk will add.',
    },
    recommendations: ['Choose a pace and duration that fit how you feel today.', 'Missing heart-rate and energy readings are excluded from this plan.', 'If your device has not finished syncing, refresh before comparing your progress.'],
    smartGoals: [
      { title: 'Your chosen target', value: data.steps.goal.toLocaleString(), trend: 'Steps per day; adjustable in Goals' },
      { title: 'Reported steps', value: data.steps.current.toLocaleString(), trend: 'Today so far; not a prediction' },
      { title: 'Make it realistic', value: 'Your pace', trend: 'Use your check-in to remember your time and energy' },
    ],
  };
};
