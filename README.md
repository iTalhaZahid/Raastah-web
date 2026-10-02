This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Admin dashboard

Open `/admin` to sign in with an existing backend administrator or moderator account.
Administrators can open **Staff → Inspect an account → New role → Moderator**,
enter a reason, and confirm the appointment. Select **User** to remove staff access.
The Staff section searches the recent registered-account list and supports direct
Auth user ID lookup; the API does not provide a complete staff directory or account
creation endpoint. Role changes replace existing roles and revoke target sessions.
Signing out requires confirmation. The audit log includes user, configuration, and
report actions, including entries without a target user ID.
Set the backend origin in `.env.local` (no `/api` path):

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3000
```

With the backend on port 3000, run the dashboard with `npm run dev -- --port 3001`.
Allow `http://localhost:3001` in the backend's `BETTER_AUTH_TRUSTED_ORIGINS` and
credentialed CORS configuration. Restart/rebuild the dashboard after changing the
public API URL. Production requires HTTPS; prefer hosts under the same parent site.

The dashboard uses native fetch with session cookies for Better Auth sign-in,
session lookup, and sign-out. Next.js rewrites forward these requests and admin
requests through the dashboard's own origin, avoiding third-party-cookie blocking
when the backend is hosted on Render. Keep backend cookies host-only (no explicit
Domain targeting the backend host), and keep the dashboard origin in Better Auth's
trusted origins. Cookie security attributes are preserved. The dashboard does not
create an auth server or persist tokens in browser storage.
All account mutations use the audited `/api/v1/admin` routes. See
[API reference](docs/API_REFERENCE.md) and [connection guide](docs/DASHBOARD_IMPLEMENTATION.md).

Users, verifications, reports, configuration, and audits use live API responses;
there is no demo-data fallback. User and audit lists are capped at 100 records.
Deletion jobs display their queued result without polling. Backend authorization
remains authoritative for roles, account boundaries, and last-admin protection.

Run `npx playwright test --config playwright.admin.config.ts` for isolated admin
flow checks against mocked API responses (no real accounts are changed).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## University email verification rollout

`/verify-university-email` is public and only consumes a challenge after the visitor
presses Verify. The token lives in component memory; the URL is cleaned before
navigation links appear. Reloading the cleaned URL requires a fresh link. This
route has no analytics, replay, service worker, or shared marketing navigation.
It sends no-store/no-referrer headers and uses the existing same-origin API proxy.
Current browser account status is fetched separately from `/api/v1/user/me`;
historical email ownership never establishes current student verification.

Administrators can edit **Universities → Edit → Replace email domains**. Leaving
replacement unchecked preserves mappings, an array replaces them, and an empty
replacement disables email verification. Existing names are submitted unchanged.

Before production activation, operators must:

- Deploy this page, then set the backend `UNIVERSITY_EMAIL_VERIFICATION_URL` to
  `https://<actual-web-origin>/verify-university-email` (no query or fragment).
- Redact token query strings for both this page and the verification API from
  hosting, CDN, proxy, and backend access logs, including initial requests.
  This repository cannot configure upstream logging. Disable query-string request
  logging in local development too when testing with real challenges.
- Exclude this route and verification API from any future analytics, session replay,
  URL telemetry, and service-worker/CDN caches; verify deployed response headers.
- Run backend `npm run migrate:indexes` and `npm run verify:indexes`, configure
  real university domains, and verify email provider delivery before enabling it.

This repository has no student onboarding, ride requests, sockets, or journey map
client. Those sections of the handoff apply to the student application repository.
No mobile deep-link configuration exists here, so the page tells visitors to return
to the app manually rather than inventing a scheme. The page also offers browser
sign-in when a profile check finds no session.

The admin Playwright command above includes mocked public verification checks.
These do not validate production email delivery or hosting log redaction.
