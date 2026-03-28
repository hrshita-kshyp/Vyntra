
import { useState, useEffect, useCallback } from 'react';
import {
  connectGoogleFit,
  disconnectGoogleFit,
  isGoogleFitConnected,
  fetchGoogleFitData,
  getStoredToken,
} from '../services/googleFitService';

export const useGoogleFit = () => {
  const [connected, setConnected] = useState(isGoogleFitConnected());
  const [fitData, setFitData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFitData = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchGoogleFitData(token);
      setFitData(data);
    } catch (err) {
      setError(err.message);
      if (err.message.includes('expired')) {
        setConnected(false);
        setFitData(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch when connected
  useEffect(() => {
    if (connected) loadFitData();
  }, [connected, loadFitData]);

  const connect = async () => {
    setLoading(true);
    setError(null);
    try {
      await connectGoogleFit();
      setConnected(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    disconnectGoogleFit();
    setConnected(false);
    setFitData(null);
  };

  return { connected, fitData, loading, error, connect, disconnect, refresh: loadFitData };
};
