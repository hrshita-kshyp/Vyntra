# Vyntra

![Vyntra](public/brand/vyntra-logo.svg)

Your activity, with room for real life. A React and Vite fitness journal with Supabase account sign-in.

## What works

- Google/email sign-in and protected app routes.
- Optional legacy Google Fit integration: merged steps, daily average heart rate, total energy expenditure. Seven local calendar days with explicit missing readings and last-fetched time.
- Manual daily activity check-ins, mood, available movement time, and private notes.
- Habit checkboxes, consecutive check-in streaks, and dated workout logging.
- Weekly sharing without personal notes or health readings; full journal JSON export and activity CSV export.
- Editable goals and profile, transparent weekly goal progress, and local step-based coaching rules.
- Public privacy policy at /privacy.

Journal entries are stored in this browser and scoped to the signed-in account. They do not sync across devices. Goals and profile remain browser-level preferences. Manual readings never overwrite Google Fit readings. Missing values remain blank; a recorded zero counts in averages. Today is partial. Energy is total expenditure, not food intake or active calories alone.

No biological-age, recovery, HRV, readiness, or medical assessment is calculated. Coaching runs locally; no Groq key is needed or sent to the browser.

## Development

Use Node.js supported by Vite 7. Run npm install, then npm run dev. On Windows PowerShell use npm.cmd if script execution policy blocks npm.

Create a local ignored .env containing VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and optionally VITE_GOOGLE_CLIENT_ID for fitness authorization. Never use a service-role key in the frontend. A Google OAuth client must be configured for the site's allowed origins and the existing Fit project must have access to the legacy Fitness API.

In Supabase Authentication / URL Configuration set Site URL to https://vyntra.ranuvo.tech and allow https://vyntra.ranuvo.tech/app. Add localhost development addresses separately. Google OAuth redirects to the Supabase project's /auth/v1/callback; Supabase then redirects to the app.

## Checks

- node scripts/test-activity.mjs
- npm run lint
- npm run build

Tests cover local calendar days, daylight-saving boundaries, missing versus zero values, final calorie rounding, recorded-day averages, and avoiding invented measurements.

## Launch

See [LAUNCH.md](LAUNCH.md) for beta positioning, post drafts, channel research, and production setup.

Google Fit API support ends in 2026: [official migration guide](https://developer.android.com/health-and-fitness/health-connect/migration/fit). Replacing it is necessary before broad release; Health Connect requires a native Android integration. Compare real-account Fit readings manually before claiming parity with the mobile app.
