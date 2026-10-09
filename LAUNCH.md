# Vyntra beta launch kit

## Positioning

**Tagline:** Your activity, with room for real life.

**Short description:** Vyntra pairs activity readings with private daily check-ins, habits, and a movement journal. Set your own targets, keep track of what helped, and share a simple weekly summary.

**Distinctive angle:** A day in context. Record your energy, available time, and a personal note alongside activity, rather than judging every day by a step count. Context notes are transparent local rules, not medical or AI assessments. This is a positioning hypothesis, not a claim of market exclusivity.

## Start with a small beta

Invite 10–20 people who already use Google Fit, plus people who prefer manual logging. Ask them to use Vyntra for seven days. Check whether they return to the journal and whether they understand missing readings, total energy versus active calories, and browser-only storage. Compare the same account, date, timezone, and sync state when investigating Fit discrepancies.

## Channels

1. **Indie Hackers:** share the build story and ask for specific feedback on the context journal. Useful for maker feedback; fitness-user acquisition is an experiment. [Product directory](https://www.indiehackers.com/products?sorting=recently-added).
2. **Product Hunt:** launch after the beta confirms sign-in and daily usage. Prepare three screenshots and a brief walkthrough. [Official preparation guide](https://www.producthunt.com/launch/preparing-for-launch), [launch guide](https://help.producthunt.com/en/articles/17350772-launch-guide).
3. **Your existing social audience:** demonstrate a low-energy check-in, a logged walk, and the weekly summary in a short video. Show only a test account. Compare which story brings people who actually return, rather than claiming guaranteed reach.

No platform submissions or posts have been published.

## Product Hunt maker comment draft

Hi! I’m building Vyntra because a fitness dashboard can tell you how much you moved without remembering what your day was like.

Vyntra gives you a daily check-in, a small habit list, a movement journal, and a weekly summary. Record how you felt and the time you had alongside your activity. Missing measurements stay blank, manual entries are separate from device data, and coaching uses simple local rules.

This is an early beta. The journal is saved in your browser, so export it before clearing site data or switching devices. Google Fit is an optional legacy integration; we’re planning its replacement as API support ends in 2026.

I’d especially like feedback on whether the day-in-context note makes weekly progress more useful. What would you want to remember about a day beyond your steps?

## Social post draft

Some days you have energy and an hour. Some days you have ten minutes.

I’m building Vyntra to remember both: activity readings, private daily check-ins, a movement journal, and a weekly summary you can share.

Looking for a few beta testers who will try it for a week and tell me what helps them come back.

https://vyntra.ranuvo.tech

## Before sharing the production link

- In Supabase Authentication → URL Configuration, set Site URL to `https://vyntra.ranuvo.tech` and allow `https://vyntra.ranuvo.tech/app`. The client already requests the current origin plus `/app`. Add local development addresses separately.
- Verify Google sign-in in a private browser on the production deployment. Google Cloud's authorized callback remains `https://afvvwmpxcvzwpvtfhrpv.supabase.co/auth/v1/callback`.
- Check OAuth consent publishing/access requirements for the intended beta audience; Google sign-in and Google Fit permissions are separate.
- Reconnect Google Fit once after upgrading: older tokens without an account owner are cleared to prevent cross-account readings.
- Compare device readings with the mobile Fit app before describing them as matching. Fixture tests verify parsing, not a user's real Google account.
- Replace the legacy Google Fit integration before broad launch. [Google's migration guide](https://developer.android.com/health-and-fitness/health-connect/migration/fit) says support ends in 2026. Health Connect needs a native Android integration; it cannot be added as a browser-only API.
- Set a private support contact in the privacy policy. The current fallback is the project contact channel.
- Rotate any previously deployed browser-exposed Groq API key. Coaching no longer uses or ships that key.
- Be explicit that check-ins, goals, profile, and workout entries are browser storage, not cross-device cloud sync.

## Validation commands

`node scripts/test-activity.mjs`

`npm run lint`

`npm run build`

The activity test covers local calendar boundaries, daylight saving, reported zero versus missing readings, calorie rounding, and avoiding fabricated heart-rate or recovery values.
