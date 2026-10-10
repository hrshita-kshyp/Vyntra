import { calendarWeek, parseFitDay, summarizeWeek } from '../utils/activityData';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const FITNESS_SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
].join(' ');

const TOKEN_KEY = 'gfit_access_token';
const TOKEN_EXPIRY_KEY = 'gfit_token_expiry';
const ACCOUNT_KEY = 'gfit_account_id';
const CONNECTION_KEY = 'gfit_previously_connected';

// Preserve each Vyntra account's connection without revoking Google consent
// when another Vyntra account signs in on the same browser.
export const restoreGoogleFitAccount = accountId => {
  const previous = localStorage.getItem(ACCOUNT_KEY);
  if (previous === accountId) return;
  if (previous) localStorage.setItem('gfit_session_' + previous, JSON.stringify({
    token: localStorage.getItem(TOKEN_KEY), expiry: localStorage.getItem(TOKEN_EXPIRY_KEY),
    connected: hasPreviousConnection(),
  }));
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem('gfit_session_' + accountId)); } catch { /* Ignore invalid saved storage. */ }
  for (const key of [TOKEN_KEY, TOKEN_EXPIRY_KEY, CONNECTION_KEY]) localStorage.removeItem(key);
  if (saved?.token) localStorage.setItem(TOKEN_KEY, saved.token);
  if (saved?.expiry) localStorage.setItem(TOKEN_EXPIRY_KEY, saved.expiry);
  if (saved?.connected) localStorage.setItem(CONNECTION_KEY, 'true');
  localStorage.setItem(ACCOUNT_KEY, accountId);
};

// Wait for Google Identity Services to load
const waitForGIS = () =>
  new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) return resolve();
    let attempts = 0;
    const check = setInterval(() => {
      if (window.google?.accounts?.oauth2) {
        clearInterval(check);
        resolve();
      } else if (++attempts > 30) {
        clearInterval(check);
        reject(new Error('Google Identity Services failed to load. Check your Client ID and internet connection.'));
      }
    }, 300);
  });

export const isGoogleFitConnected = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!token || !expiry) return false;
  return Date.now() < parseInt(expiry);
};

export const getStoredToken = () => {
  if (!isGoogleFitConnected()) return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const hasPreviousConnection = () => !!localStorage.getItem(TOKEN_KEY) || localStorage.getItem(CONNECTION_KEY) === 'true';

export const connectGoogleFit = async (options = {}) => {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('VITE_GOOGLE_CLIENT_ID is not set in your .env file.');
  }
  await waitForGIS();

  return new Promise((resolve, reject) => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: FITNESS_SCOPES,
      // Called on successful token grant OR token errors
      callback: (response) => {
        if (response.error) {
          const msg =
            response.error === 'access_denied'
              ? 'Access denied. Please allow the requested permissions.'
              : response.error_description || response.error;
          reject(new Error(msg));
          return;
        }
        localStorage.setItem(TOKEN_KEY, response.access_token);
        localStorage.setItem(CONNECTION_KEY, 'true');
        localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + Number(response.expires_in || 3600) * 1000));
        resolve(response.access_token);
      },
      // Called when the popup is closed or dismissed — without this the
      // Promise hangs forever and loading never resets
      error_callback: (err) => {
        const msg =
          err.type === 'popup_closed'
            ? 'Popup was closed. Please try again.'
            : err.type === 'popup_failed_to_open'
            ? 'Popup was blocked. Please allow popups for this site.'
            : err.message || 'Google authorization failed. Please try again.';
        reject(new Error(msg));
      },
    });
    tokenClient.requestAccessToken(options);
  });
};

// Request renewal from a user action, without forcing repeat consent.
// Google may still show its authorization dialog.
export const silentRefreshToken = () => connectGoogleFit({ prompt: '' });

export const disconnectGoogleFit = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(token, () => {});
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  localStorage.removeItem(CONNECTION_KEY);
  const account = localStorage.getItem(ACCOUNT_KEY);
  if (account) localStorage.removeItem('gfit_session_' + account);
};

// Request each local calendar day separately, including DST boundaries.
export const fetchGoogleFitData = async (accessToken) => {
  const now = new Date();
  const days = await Promise.all(calendarWeek(now).map(async day => {
    const res = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        aggregateBy: [
          { dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps' },
          { dataTypeName: 'com.google.heart_rate.bpm' },
          { dataTypeName: 'com.google.calories.expended' },
        ],
        bucketByTime: { durationMillis: day.end - day.start },
        startTimeMillis: day.start, endTimeMillis: day.end,
      }),
    });
    if (res.status === 401) {
      localStorage.setItem(CONNECTION_KEY, 'true');
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      throw new Error('Session expired. Please reconnect Google Fit.');
    }
    if (res.status === 403) throw new Error('Google Fit access was denied. Check account permissions and API availability, or use a daily check-in.');
    if (!res.ok) throw new Error('Google Fit could not load activity (' + res.status + '). Try refreshing.');
    return parseFitDay(await res.json(), day);
  }));
  return summarizeWeek(days, 'Google Fit', now.toISOString());
};
