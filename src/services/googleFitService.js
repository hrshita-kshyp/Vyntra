
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const FITNESS_SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
].join(' ');

const TOKEN_KEY = 'gfit_access_token';
const TOKEN_EXPIRY_KEY = 'gfit_token_expiry';

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

export const connectGoogleFit = async () => {
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
        localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + 55 * 60 * 1000));
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
    tokenClient.requestAccessToken();
  });
};

export const disconnectGoogleFit = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(token, () => {});
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

// Fetch 7 days of aggregated fitness data
export const fetchGoogleFitData = async (accessToken) => {
  const endMs = Date.now();
  const startMs = endMs - 7 * 24 * 60 * 60 * 1000;

  const res = await fetch(
    'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aggregateBy: [
          { dataTypeName: 'com.google.step_count.delta' },
          { dataTypeName: 'com.google.heart_rate.bpm' },
          { dataTypeName: 'com.google.calories.expended' },
        ],
        bucketByTime: { durationMillis: 86400000 }, // 1-day buckets
        startTimeMillis: startMs,
        endTimeMillis: endMs,
      }),
    }
  );

  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    throw new Error('Session expired. Please reconnect Google Fit.');
  }

  if (res.status === 403) {
    throw new Error('Fitness API not enabled. In Google Cloud Console → APIs & Services → Library → search "Fitness API" → Enable it, then reconnect.');
  }

  if (!res.ok) throw new Error(`Google Fit API error (${res.status})`);

  const json = await res.json();
  return parseResponse(json);
};

const parseResponse = (json) => {
  const weeklyData = [];

  (json.bucket || []).forEach((bucket) => {
    const dayLabel = new Date(parseInt(bucket.startTimeMillis)).toLocaleDateString('en-US', {
      weekday: 'short',
    });

    const day = { date: dayLabel, steps: 0, heartRate: null, calories: 0 };

    (bucket.dataset || []).forEach((dataset) => {
      const srcId = dataset.dataSourceId || '';

      (dataset.point || []).forEach((point) => {
        if (srcId.includes('step_count')) {
          day.steps += point.value?.[0]?.intVal || 0;
        } else if (srcId.includes('heart_rate')) {
          // Google Fit aggregate returns avg as first value
          const avg = point.value?.[0]?.fpVal;
          if (avg) day.heartRate = Math.round(avg);
        } else if (srcId.includes('calories')) {
          day.calories += Math.round(point.value?.[0]?.fpVal || 0);
        }
      });
    });

    weeklyData.push(day);
  });

  // Today = last bucket
  const today = weeklyData[weeklyData.length - 1] || {};

  // 7-day averages (skip days with 0 steps — likely missing data)
  const activeDays = weeklyData.filter((d) => d.steps > 0);
  const avgSteps = activeDays.length
    ? Math.round(activeDays.reduce((s, d) => s + d.steps, 0) / activeDays.length)
    : 0;

  const hrDays = weeklyData.filter((d) => d.heartRate);
  const avgHR = hrDays.length
    ? Math.round(hrDays.reduce((s, d) => s + d.heartRate, 0) / hrDays.length)
    : 72;

  const calDays = weeklyData.filter((d) => d.calories > 0);
  const avgCalories = calDays.length
    ? Math.round(calDays.reduce((s, d) => s + d.calories, 0) / calDays.length)
    : 0;

  return {
    today: {
      steps: { current: today.steps || 0, goal: 10000 },
      heartRate: { current: today.heartRate || avgHR },
      calories: { current: today.calories || 0, goal: 2500 },
      recovery: { current: 8 },
    },
    weeklyData,
    averages: { avgSteps, avgHR, avgCalories },
  };
};
