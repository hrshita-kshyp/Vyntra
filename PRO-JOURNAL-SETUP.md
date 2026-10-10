# Pro journal backup

Basic journal features remain free and local. Pro adds optional manual encrypted cloud backup and cross-device restore. Restore merges days and preserves current local entries on date conflicts. Users can restore/delete already saved backups after Pro expires. Saving a backup requires server-verified `pro_until` in `user_entitlements`; no browser flag can unlock it.

## Configuration

- Run `supabase/migrations/20261010_pro_journal.sql` in the Supabase SQL editor.
- Configure the same server-only Supabase credentials, 32-byte base64 encryption key and allowed origins documented in `GOOGLE-FIT-SETUP.md`. Journal payloads use AES-256-GCM; do not lose or rotate the key without a data migration.
- Restart Vite or redeploy Vercel after changing secrets. Vite serves both local APIs for development.
- Pro entitlement population and trial/payment handling are still pending. Do not expose an endpoint that grants Pro based on client claims. A future verified billing webhook will populate `pro_until`.
- For controlled testing only, use a separate test account and set its `pro_until` using trusted SQL/admin tooling. No production users are granted Pro by this implementation.

Save uses optimistic revision checks: if another device changes the backup, restore/merge before saving again. Matching days are preserved from the local journal, so restore does not sync deletions or automatically combine fields from conflicting days. Each user has one current snapshot, not version history. Cloud backups include private notes; weekly sharing still excludes notes. Journal data can be exported locally at any time.

Run `node scripts/test-journal-server.mjs` and `node scripts/test-google-fit-server.mjs`, then `npm run lint` and `npm run build -- --configLoader runner`.
