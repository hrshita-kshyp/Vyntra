# vyntra.ranuvo.tech

The code's public sharing and metadata URLs now target `https://vyntra.ranuvo.tech`. Authentication uses the current browser origin and `/app`, so it works on the new domain after provider configuration. The domain has been attached to the existing Vyntra Vercel production project. Vercel ownership is verified; Hostinger DNS is still pending. Google and Supabase dashboard settings still need updating.

## Hostinger DNS record (confirmed through Vercel)

| Type | Name | Points to | TTL |
| --- | --- | --- | --- |
| CNAME | vyntra | fed5576818c8b8a7.vercel-dns-017.com | Default |

Vercel's domain configuration API returned this as the rank-1 recommended CNAME. The domain currently has no CNAME or A records. This record changes only the Vyntra subdomain.

## Connect the domain

1. In the existing Vyntra Vercel project, open Settings → Domains and add `vyntra.ranuvo.tech` to Production.
2. Copy the exact CNAME destination Vercel displays for that domain. Do not guess a generic destination.
3. In Hostinger, open Domains → Domain portfolio → ranuvo.tech → DNS / Nameservers → DNS records. Ensure Hostinger is the authoritative DNS provider before editing.
4. Add a CNAME with Name `vyntra`, Points to the Vercel-provided destination, and default TTL. If a record already exists for the same subdomain, inspect it before replacing it. Preserve the root website and email records.
5. Wait for Vercel to confirm the DNS configuration and provision HTTPS. Check `/`, `/privacy`, and `/app` on the custom domain.

This keeps Vercel hosting and uses your Ranuvo domain as the public address. Moving hosting to Hostinger is a separate migration and is not necessary to resolve domain ownership verification.

## Verify Google branding

1. In Google Search Console, add the Domain property `ranuvo.tech`, using an account associated with the OAuth project's Owner or Editor role.
2. Add the exact Search Console verification TXT value to Hostinger DNS at the root (`@`), then verify ownership.
3. In Google Auth Platform → Branding, set homepage `https://vyntra.ranuvo.tech/`, privacy policy `https://vyntra.ranuvo.tech/privacy`, and add Authorized domain `ranuvo.tech`. Keep the Supabase callback domain required by your existing OAuth client.
4. For the web OAuth client used by Google Identity Services, add Authorized JavaScript origin `https://vyntra.ranuvo.tech`.
5. For Supabase Google sign-in, the authorized Google redirect URI remains `https://afvvwmpxcvzwpvtfhrpv.supabase.co/auth/v1/callback`.
6. After the homepage is live and ownership is verified, follow the review panel's instruction to wait 24 hours, select “I have fixed the issues,” and request re-verification. Publish approved branding when Google offers that step. Custom DNS alone does not establish verified ownership.

## Supabase

- Authentication → URL Configuration → Site URL: `https://vyntra.ranuvo.tech`.
- Add Redirect URL: `https://vyntra.ranuvo.tech/app`.
- Keep the previous production and local URLs during testing. Test sign-in in a private browser on the custom domain before removing old URLs or redirecting the old deployment hostname.

Browser-stored goals, profiles and journals belong to the old site's origin. Export your journal before changing domains; the new hostname does not automatically inherit that storage. Google Fit requires a new authorization on the new origin.

## Sources

- [Vercel domain configuration](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
- [Hostinger DNS records](https://www.hostinger.com/support/1583249-how-to-manage-dns-records-at-hostinger/)
- [Google brand verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/brand-verification)
- [Supabase redirects](https://supabase.com/docs/guides/auth/redirect-urls)
