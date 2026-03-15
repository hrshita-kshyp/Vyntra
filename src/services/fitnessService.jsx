
export const getFitnessData = async () => {
  // In a real app, this would fetch from an API
  return {
    steps: { current: 8742, goal: 10000 },
    heartRate: { current: 132 },
    calories: { current: 1842, goal: 2500 },
    recovery: { current: 28 }
  };
};

export const saveFitnessData = async (data) => {
  // Save to localStorage or API
  localStorage.setItem('fitnessData', JSON.stringify(data));
};
