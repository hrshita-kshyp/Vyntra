import { useState } from 'react';

export function useFitnessData() {
    const [fitnessData, setFitnessData] = useState({ steps: 0, calories: 0 });
    const [workoutMode, setWorkoutMode] = useState('rest');
    const [healthScore, setHealthScore] = useState(100);

    function startWorkout() {
        setWorkoutMode('active');
        setHealthScore((score) => score + 1);
        setFitnessData((data) => ({
            ...data,
            steps: data.steps + 100,
            calories: data.calories + 10,
        }));
    }

    return { fitnessData, workoutMode, startWorkout, healthScore };
}