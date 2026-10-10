import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { connectGoogleFit, disconnectGoogleFit, isGoogleFitConnected, fetchGoogleFitData, hasPreviousConnection, restoreGoogleFitAccount, getGoogleFitSession, disconnectCloudGoogleFit } from '../services/googleFitService';
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
  const automatic = useRef(false);
  const loadFitData = useCallback(async () => {
    const request = ++generation.current;
    setLoading(true); setError(null);
    try {
      const session = await getGoogleFitSession();
      if (request !== generation.current) return;
      automatic.current = session.automatic;
      if (!session.token) { setConnected(false); setNeedsReconnect(hasPreviousConnection()); return; }
      setConnected(true); setNeedsReconnect(false);
      let data;
      try { data = await fetchGoogleFitData(session.token); }
      catch (err) {
        if (!session.automatic || !err.message.includes('expired')) throw err;
        const renewed = await getGoogleFitSession(true);
        if (request !== generation.current) return;
        if (!renewed.token) throw new Error('Google permission expired. Connect Google Fit again.');
        data = await fetchGoogleFitData(renewed.token);
      }
      if (request === generation.current) setFitData(data);
    }
    catch (err) { if (request !== generation.current) return; setError(err.message); if (err.message.includes('expired') || err.code === 'reconnect_required') { setConnected(false); setNeedsReconnect(true); } }
    finally { if (request === generation.current) setLoading(false); }
  }, []);
  useEffect(() => {
    const counter = generation;
    restoreGoogleFitAccount(accountId);
    setConnected(isGoogleFitConnected());
    setNeedsReconnect(!isGoogleFitConnected() && hasPreviousConnection());
    loadFitData();
    return () => { counter.current++; };
  }, [accountId, loadFitData]);
  useEffect(() => {
    if (!connected) return;
    const interval = setInterval(() => { if (!isGoogleFitConnected() && !oauthInProgress.current) { if (automatic.current) loadFitData(); else { setConnected(false); setNeedsReconnect(true); } } }, 30000);
    return () => clearInterval(interval);
  }, [connected, loadFitData]);
  const connect = async () => {
    if (oauthInProgress.current) return;
    oauthInProgress.current = true; setLoading(true); setError(null);
    const request = ++generation.current;
    try { await connectGoogleFit(hasPreviousConnection() ? { prompt: '' } : {}); if (request !== generation.current) return; localStorage.setItem('gfit_account_id', accountId); setFitData(null); setConnected(true); setNeedsReconnect(false); await loadFitData(); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); oauthInProgress.current = false; }
  };
  const disconnect = async () => {
    generation.current++; setLoading(true);
    try { await disconnectCloudGoogleFit(); }
    catch (err) { setError(err.message); setLoading(false); return; }
    automatic.current = false; disconnectGoogleFit(); localStorage.removeItem('gfit_account_id');
    setConnected(false); setNeedsReconnect(false); setFitData(null); setError(null); setLoading(false);
  };
  return <FitContext.Provider value={{ connected, needsReconnect, fitData, loading, error, connect, disconnect, refresh: loadFitData }}>{children}</FitContext.Provider>;
};
