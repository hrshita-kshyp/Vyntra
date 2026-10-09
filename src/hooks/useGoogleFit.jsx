
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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

const FitContext = createContext(null);

export const useGoogleFit = () => useContext(FitContext);

export const GoogleFitProvider = ({ children }) => {
  const [connected, setConnected] = useState(isGoogleFitConnected());
  // true when a previous token existed but has since expired — show reconnect banner
  const [needsReconnect, setNeedsReconnect] = useState(
    !isGoogleFitConnected() && hasPreviousConnection()
  );
  const [fitData, setFitData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Prevent two OAuth flows running at the same time
  const oauthInProgress = useRef(false);

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
        setNeedsReconnect(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch when connected
  useEffect(() => {
    if (connected) loadFitData();
  }, [connected, loadFitData]);

  // Proactive token refresh: check every 2 min and silently renew when <5 min remain.
  // Only fires while the user is actively connected — no surprise popup on page load.
  useEffect(() => {
    if (!connected) return;
    const interval = setInterval(async () => {
      const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
      if (!expiry) return;
      const timeLeft = parseInt(expiry) - Date.now();
      if (timeLeft < 5 * 60 * 1000 && !oauthInProgress.current) {
        oauthInProgress.current = true;
        try {
          await silentRefreshToken();
          await loadFitData();
        } catch {
          setConnected(false);
          setNeedsReconnect(true);
        } finally {
          oauthInProgress.current = false;
        }
      }
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [connected, loadFitData]);

  const connect = async () => {
    if (oauthInProgress.current) return; // block double-tap / concurrent flows
    oauthInProgress.current = true;
    setLoading(true);
    setError(null);
    try {
      await connectGoogleFit();
      setConnected(true);
      setNeedsReconnect(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      oauthInProgress.current = false;
    }
  };

  const disconnect = () => {
    disconnectGoogleFit();
    setConnected(false);
    setNeedsReconnect(false);
    setFitData(null);
    setError(null);
  };

  return <FitContext.Provider value={{ connected, needsReconnect, fitData, loading, error, connect, disconnect, refresh: loadFitData }}>{children}</FitContext.Provider>;
};
