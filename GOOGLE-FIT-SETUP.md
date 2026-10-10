# Automatic Google Fit renewal

The browser uses Google's authorization-code popup. The server verifies the Vyntra session and request origin, exchanges the code, encrypts credentials with AES-256-GCM, and stores them in a table inaccessible to browser roles. Only short-lived access tokens are returned to the authenticated account. The app restores and renews this connection on login, before requests, and while open. Revoked Google consent requires reconnecting.

## Activate

1. Run `supabase/migrations/20261010_google_fit_connections.sql` in the project's Supabase SQL editor. This adds one server-only table, with user deletion cascading to credentials.
2. Add these server variables in Vercel and in ignored `.env.local` for local development:
   - `GOOGLE_CLIENT_SECRET`: secret from the existing Google OAuth web client.
   - `SUPABASE_SERVICE_ROLE_KEY`: server key from the same Supabase project. Never use a `VITE_` prefix.
   - `GOOGLE_FIT_TOKEN_ENCRYPTION_KEY`: random 32 bytes encoded as base64; generate with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`. Keep the same key across deployments; changing it prevents decrypting existing connections.
   - `GOOGLE_FIT_ALLOWED_ORIGINS`: `https://vyntra.ranuvo.tech,http://127.0.0.1:5174,http://localhost:5174` (include other origins only when you use them).
   Existing `VITE_GOOGLE_CLIENT_ID`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY` are supported. Separate server `GOOGLE_CLIENT_ID`, `SUPABASE_URL`, and `SUPABASE_ANON_KEY` may also be used.
3. In Google Cloud's existing OAuth web client, authorize the website origin and the exact local origin used for development. The popup code exchange uses that origin. Keep the existing Supabase sign-in redirect URI unchanged.
4. Redeploy Vercel and restart the local Vite server after changing environment variables.
5. Connect Google Fit once to grant offline access. Older browser-only tokens cannot be converted to refresh tokens. Test logout/login and browser restart, then force access-token expiry in a test account to verify renewal.

Until secrets are present, the existing browser-only connection remains available. No claim of live automatic renewal should be made before configuration and a real-account test. A configured server with missing table returns a setup error rather than hiding it.

Google OAuth apps in Testing can issue refresh tokens that expire after seven days for fitness scopes. Production/verification settings and revoked permissions can still require renewed consent. See Google's [web server OAuth documentation](https://developers.google.com/identity/protocols/oauth2/web-server).
