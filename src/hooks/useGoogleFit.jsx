import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { connectGoogleFit, disconnectGoogleFit, isGoogleFitConnected, fetchGoogleFitData, getStoredToken, hasPreviousConnection, restoreGoogleFitAccount } from '../services/googleFitService';
const FitContext = createContext(null);
export const useGoogleFit = () => useContext(FitContext);
export const GoogleFitProvider = ({ children, accountId }) => {
  const owned = localStorage.getItem('gfit_account_id') === accountId;
  const [connected, setConnected] = useState(owned && isGoogleFitConnected());
  const [needsReconnect, setNeedsReconnect] = useState(owned && !isGoogleFitConnected() && hasPreviousConnection());
  const [fitData, setFitData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const generation = useRef(0);
  const oauthInProgress = useRef(false);
  const loadFitData = useCallback(async () => {
    const token = getStoredToken();
    if (!token) { setConnected(false); setNeedsReconnect(hasPreviousConnection()); return; }
    const request = ++generation.current;
    setLoading(true); setError(null);
    try { const data = await fetchGoogleFitData(token); if (request === generation.current) setFitData(data); }
    catch (err) { if (request !== generation.current) return; setError(err.message); if (err.message.includes('expired')) { setConnected(false); setNeedsReconnect(true); } }
    finally { if (request === generation.current) setLoading(false); }
  }, []);
  useEffect(() => {
    const counter = generation;
    restoreGoogleFitAccount(accountId);
    setConnected(isGoogleFitConnected());
    setNeedsReconnect(!isGoogleFitConnected() && hasPreviousConnection());
    if (isGoogleFitConnected()) loadFitData();
    return () => { counter.current++; };
  }, [accountId, loadFitData]);
  useEffect(() => {
    if (!connected) return;
    const interval = setInterval(() => { if (!isGoogleFitConnected()) { setConnected(false); setNeedsReconnect(true); } }, 30000);
    return () => clearInterval(interval);
  }, [connected]);
  const connect = async () => {
    if (oauthInProgress.current) return;
    oauthInProgress.current = true; setLoading(true); setError(null);
    try { await connectGoogleFit(hasPreviousConnection() ? { prompt: '' } : {}); localStorage.setItem('gfit_account_id', accountId); setFitData(null); setConnected(true); setNeedsReconnect(false); await loadFitData(); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); oauthInProgress.current = false; }
  };
  const disconnect = () => {
    generation.current++; disconnectGoogleFit(); localStorage.removeItem('gfit_account_id');
    setConnected(false); setNeedsReconnect(false); setFitData(null); setError(null); setLoading(false);
  };
  return <FitContext.Provider value={{ connected, needsReconnect, fitData, loading, error, connect, disconnect, refresh: loadFitData }}>{children}</FitContext.Provider>;
};
