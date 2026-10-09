import { getAIRecommendations } from '../services/aiService';
import { useFitnessData } from './useFitnessData';
export const useAIInsights = () => {
  const data = useFitnessData();
  return { insights: getAIRecommendations(data), loading: false, error: null, source: data.source };
};
