
import { useState, useEffect, useCallback } from 'react';
import {
  connectGoogleFit,
  disconnectGoogleFit,
  isGoogleFitConnected,
  fetchGoogleFitData,
  getStoredToken,
  hasPreviousConnection,
  silentRefreshToken,
} from '../services/googleFitService';

const TOKEN_EXPIRY_KEY = 'gfit_token_expiry';

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

  // On mount: if token expired but a previous connection exists, try silent refresh
  useEffect(() => {
    if (connected || !hasPreviousConnection()) return;
    silentRefreshToken()
      .then(() => setConnected(true))
      .catch(() => {
        // Silent refresh failed — user will need to reconnect manually
        localStorage.removeItem('gfit_access_token');
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Proactive token refresh: check every 2 min and refresh when <5 min remain
  useEffect(() => {
    if (!connected) return;
    const interval = setInterval(async () => {
      const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
      if (!expiry) return;
      const timeLeft = parseInt(expiry) - Date.now();
      if (timeLeft < 5 * 60 * 1000) {
        try {
          await silentRefreshToken();
          await loadFitData();
        } catch {
          setConnected(false);
        }
      }
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
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
    setError(null);
  };

  return { connected, fitData, loading, error, connect, disconnect, refresh: loadFitData };
};
