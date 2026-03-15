
import { useState, useEffect } from 'react';
import { getFitnessData } from '../services/fitnessService';

const useFitnessData = () => {
  const [data, setData] = useState({
    steps: { current: 0, goal: 10000 },
    heartRate: { current: 72 },
    calories: { current: 0, goal: 2500 },
    recovery: { current: 0 }
  });

  useEffect(() => {
    const fetchData = async () => {
      const fitnessData = await getFitnessData();
      setData(fitnessData);
    };
    
    fetchData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        steps: { ...prev.steps, current: Math.min(prev.steps.current + 50, prev.steps.goal) },
        heartRate: { 
          current: Math.floor(Math.random() * (160 - 120 + 1)) + 120 
        },
        calories: { ...prev.calories, current: Math.min(prev.calories.current + 10, prev.calories.goal) }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return data;
};

export default useFitnessData;
