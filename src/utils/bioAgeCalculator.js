
/**
 * BioAge Score™ — estimates biological age from wearable metrics.
 *
 * Returns:
 *   bioAge     — calculated biological age (years)
 *   delta      — bioAge - chronoAge (negative = younger, positive = older)
 *   score      — 0–100 wellness score (100 = peak)
 *   breakdown  — per-metric detail for display
 */
export const calculateBioAge = (chronoAge, metrics) => {
  const { avgRestingHR, avgDailySteps, avgSleepHours } = metrics;

  let adjustment = 0;
  const breakdown = [];

  // ── 1. Resting Heart Rate ───────────────────────────────────────────────
  // Optimal: 50–60 bpm. Each bpm above 60 adds ~0.25 years.
  if (avgRestingHR && avgRestingHR > 0) {
    const hrAdj = Math.min(Math.max((avgRestingHR - 60) * 0.25, -4), 8);
    adjustment += hrAdj;
    breakdown.push({
      metric: 'Resting Heart Rate',
      value: `${avgRestingHR} bpm`,
      adjustment: hrAdj,
      rating:
        avgRestingHR < 60 ? 'Excellent'
        : avgRestingHR < 70 ? 'Good'
        : avgRestingHR < 80 ? 'Average'
        : 'Poor',
    });
  }

  // ── 2. Daily Steps ──────────────────────────────────────────────────────
  // Optimal: 10,000+ steps. Sedentary lifestyle ages you fast.
  if (avgDailySteps !== undefined) {
    let stepAdj;
    if (avgDailySteps >= 12500)     stepAdj = -2.5;
    else if (avgDailySteps >= 10000) stepAdj = -1.5;
    else if (avgDailySteps >= 7500)  stepAdj = 0;
    else if (avgDailySteps >= 5000)  stepAdj = 1.5;
    else if (avgDailySteps >= 3000)  stepAdj = 3;
    else                              stepAdj = 5;

    adjustment += stepAdj;
    breakdown.push({
      metric: 'Daily Activity',
      value: `${Number(avgDailySteps).toLocaleString()} steps/day`,
      adjustment: stepAdj,
      rating:
        stepAdj <= -1 ? 'Excellent'
        : stepAdj === 0 ? 'Good'
        : stepAdj <= 2 ? 'Average'
        : 'Poor',
    });
  }

  // ── 3. Sleep Duration ───────────────────────────────────────────────────
  // Optimal: 7–8.5 hours. Both under- and over-sleeping age you.
  if (avgSleepHours && avgSleepHours > 0) {
    let sleepAdj;
    if (avgSleepHours >= 7 && avgSleepHours <= 8.5)   sleepAdj = -0.5;
    else if (avgSleepHours >= 6.5 || avgSleepHours <= 9) sleepAdj = 0.5;
    else if (avgSleepHours >= 6 || avgSleepHours <= 9.5) sleepAdj = 2;
    else if (avgSleepHours < 5)                          sleepAdj = 5;
    else                                                  sleepAdj = 3;

    adjustment += sleepAdj;
    breakdown.push({
      metric: 'Sleep Duration',
      value: `${Number(avgSleepHours).toFixed(1)}h / night`,
      adjustment: sleepAdj,
      rating:
        sleepAdj <= 0 ? 'Excellent'
        : sleepAdj <= 1 ? 'Good'
        : 'Needs Work',
    });
  }

  // ── Final calculation ───────────────────────────────────────────────────
  const raw = chronoAge + adjustment;
  // Cap: max 15 years younger, max 20 years older
  const bioAge = Math.round(Math.max(chronoAge - 15, Math.min(chronoAge + 20, raw)));
  const delta = bioAge - chronoAge;

  // Score 0–100: 100 = 10+ years younger, 50 = same age, 0 = 10+ years older
  const score = Math.round(Math.max(0, Math.min(100, 50 - delta * 5)));

  return { bioAge, delta, score, breakdown };
};
