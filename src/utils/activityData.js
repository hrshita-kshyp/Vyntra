export const dateKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export function calendarWeek(now = new Date()) {
  return Array.from({ length: 7 }, (_, i) => {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (6 - i));
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { date: start.toLocaleDateString('en-US', { weekday: 'short' }), dateKey: dateKey(start), start: +start, end: Math.min(+end, +now), steps: null, heartRate: null, calories: null };
  });
}

export function summarizeWeek(weeklyData, source, fetchedAt = null) {
  const average = (key) => {
    const values = weeklyData.map(day => day[key]).filter(Number.isFinite);
    return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : null;
  };
  const today = weeklyData.at(-1);
  return {
    source, fetchedAt, weeklyData,
    today: { steps: { current: today?.steps ?? null }, heartRate: { current: today?.heartRate ?? null }, calories: { current: today?.calories ?? null }, recovery: { current: null } },
    averages: { avgSteps: average('steps'), avgHR: average('heartRate'), avgCalories: average('calories') },
  };
}

export function parseFitDay(json, day) {
  const result = { ...day };
  for (const dataset of (json.bucket || []).flatMap(bucket => bucket.dataset || [])) {
    const id = dataset.dataSourceId || '';
    const key = id.includes('step_count') ? 'steps' : id.includes('heart_rate') ? 'heartRate' : id.includes('calories') ? 'calories' : null;
    if (!key) continue;
    const values = (dataset.point || []).map(point => point.value?.[0]?.intVal ?? point.value?.[0]?.fpVal).filter(value => Number.isFinite(value) && value >= 0);
    if (values.length) result[key] = key === 'heartRate' ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : Math.round(values.reduce((sum, value) => sum + value, 0));
  }
  return result;
}
