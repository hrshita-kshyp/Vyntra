
import { useState, useEffect } from 'react';
import { getFitnessData } from '../services/fitnessService';

export const useFitnessData = () => {
  const [data, setData] = useState({
    steps: { current: 0, goal: 10000 },
    heartRate: { current: 72 },
    calories: { current: 0, goal: 2500 },
    recovery: { current: 48 }
  });

  const [workoutMode, setWorkoutMode] = useState(false);
  const [healthScore, setHealthScore] = useState(88);

  useEffect(() => {
    const fetchData = async () => {
      const fitnessData = await getFitnessData();
      setData(fitnessData);
    };
    
    fetchData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(prev => {
        const newSteps = Math.min(prev.steps.current + Math.floor(Math.random() * 20), prev.steps.goal);
        const newHeartRate = Math.floor(Math.random() * (160 - 120 + 1)) + 120;
        const newCalories = Math.min(prev.calories.current + 1, prev.calories.goal);
        
        return {
          ...prev,
          steps: { ...prev.steps, current: newSteps },
          heartRate: { current: newHeartRate },
          calories: { ...prev.calories, current: newCalories }
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const startWorkout = () => {
    setWorkoutMode(true);
    // Logic for starting workout
  };

  return { 
    ...data, // spread steps, heartRate, calories, recovery
    fitnessData: data, 
    workoutMode, 
    startWorkout, 
    healthScore 
  };
};

