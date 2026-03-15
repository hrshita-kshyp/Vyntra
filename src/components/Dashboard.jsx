
import { useState, useEffect } from 'react';
import StatCard from './StatCard';
import useFitnessData from '../hooks/useFitnessData';
import { useAIInsights } from '../hooks/useAIInsights';

const Dashboard = () => {
  const { steps, heartRate, calories, recovery } = useFitnessData();
  const { recommendations } = useAIInsights();

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Good Morning, User</h1>
          <p className="text-gray-600">Here's your fitness overview for today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Steps" 
          value={steps.current} 
          goal={steps.goal} 
          icon="activity"
          trend="up"
          trendValue="12%"
        />
        <StatCard 
          title="Heart Rate" 
          value={heartRate.current} 
          status="During workout"
          icon="heart"
          color="red"
          pulse
        />
        <StatCard 
          title="Calories" 
          value={calories.current} 
          goal={calories.goal}
          icon="fire"
          color="orange"
          trend="up"
          trendValue="350"
        />
        <StatCard 
          title="Recovery" 
          value={`${recovery.current}h`} 
          status="Optimal rest period"
          icon="moon"
          color="blue"
        />
      </div>
    </div>
  );
};

export default Dashboard;
