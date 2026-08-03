# Project Technology and Security Rules

This document is the implementation baseline for the approved technology stack, coding standards and Firebase security behavior.

## Approved technology stack

| Area | Approved technology | Project rule |
|---|---|---|
| Frontend library | React.js | Use React components and hooks; prefer Server Components where supported by Next.js |
| Framework | Next.js | Use the App Router, static generation and ISR for public content |
| Language | JavaScript | Use modern JavaScript (`.js`/`.jsx`); do not introduce TypeScript or `.ts`/`.tsx` files |
| Styling | Tailwind CSS + vanilla CSS | Tailwind is the default; use CSS Modules/global vanilla CSS for complex animation, rich article styling and cases where utilities reduce clarity |
| Authentication | Firebase Authentication | Single allow-listed administrator; public account registration is excluded |
| Database | Cloud Firestore | Private CMS source of truth with bounded queries and cursor pagination |
| Media | Firebase Storage | Store only optimized, publication-ready media; stable assets remain in the repository |
| Server integration | Firebase Admin SDK | Server-only Firestore/media access, session verification and secure rendering |
| Hosting/CDN | Vercel | Preview and production deployment, HTTPS, ISR and CDN caching |
| Version control | Git | All source and configuration changes are version controlled; secrets and generated build output are excluded |
| Contact delivery | Transactional mail provider | Send through a Next.js server endpoint; do not store enquiries in Firestore by default |
| Spam protection | Honeypot + timing validation + Turnstile + WAF limits | Verification runs only on the server; deferral requires written risk acceptance |
| Validation | Zod or equivalent JavaScript schema validator | Share validation schemas where practical; server validation remains authoritative |
| Image processing | Browser Canvas/Image APIs or a small approved library | Resize and compress before Firebase upload |
| Testing | Vitest/Jest + React Testing Library; Playwright for critical journeys | Security Rules are tested separately through Firebase Emulator Suite |
| Code quality | ESLint + Prettier | Checks must pass before production deployment |
| Package manager | npm | Commit one lockfile and do not mix package managers |

## JavaScript and React rules

- Use ES modules, `async`/`await` and functional React components.
- Use the Next.js App Router; do not add the legacy Pages Router.
- Default to Server Components. Add `"use client"` only when browser state, effects or event handlers require it.
- Public pages must not import the Firebase browser SDK.
- Firebase browser SDK usage is limited to authentication and approved admin operations.
- Keep server-only modules clearly separated and use `server-only` protection where appropriate.
- Validate all server-action and route-handler input before use.
- All publish, unpublish, archive, permanent-delete, slug-transition, redirect, public-settings and
  allow-list mutations are server-only. Browser Firestore access is limited to approved draft fields.
- Every server mutation re-verifies the session, allow-list state, operation authorization and full
  resulting schema. Firebase Admin SDK bypasses Security Rules and is not protected by them.
- Do not use `dangerouslySetInnerHTML` with untrusted content. Sanitization is required for any approved rich HTML.
- Prefer native platform features and small focused dependencies; do not add a package for behavior that can be implemented clearly with React, JavaScript or CSS.
- Use dynamic imports only for genuinely heavy or client-only features.
- Every list item uses a stable data key; array indexes are not keys for editable/reordered content.

## Styling rules

- Tailwind CSS implements layout, spacing, responsive behavior and standard component states.
- Use CSS custom properties for the approved design tokens and colour palette.
- Use CSS Modules or a small global stylesheet for typography, article content, keyframes and complex selectors.
- Avoid inline styles except for values that are truly data-driven.
- Do not duplicate the same declaration across utility classes and vanilla CSS.
- All interactions require visible hover, focus, active and disabled states.
- Implement `prefers-reduced-motion` for every non-essential animation.
- Avoid scroll-jacking, continuous canvas/WebGL decoration and animation that blocks navigation.

## Deployment and Git rules

- Use `main` as the production branch and Vercel preview deployments for review.
- Production deploys only from the approved branch.
- Use focused commits with meaningful messages; do not commit directly generated `.next` output.
- Commit `package-lock.json` and keep dependency versions reproducible.
- Never commit `.env*`, Firebase service-account files, private keys, API keys or Vercel credentials.
- Keep separate Preview and Production environment variables in Vercel.
- Use separate Firebase projects, service identities, buckets and mail destinations for Preview and
  Production. Preview must never read or mutate production content.
- Run lint, tests and production build before release.
- Use Vercel rollback for application regressions; database changes require a separate recovery procedure.

## Performance and API rules

- Public page views should be served through static generation/ISR and make zero Firebase calls when cached.
- Do not use public Firestore listeners or fetch full collections.
- Use explicit query limits and cursor pagination.
- Revalidate only affected pages after publishing.
- Keep search on a compact CDN-cached public index until scale requires another service.
- Public queries and indexes require `status == published` and `deliveryState == live`. Draft preview
  responses are authenticated and `private, no-store`.
- Store fixed logos, icons, fonts and decorative SVG assets in Git/Vercel rather than Firebase Storage.
- Use `next/image` with explicit dimensions and optimized media delivery.
- Do not add analytics, third-party scripts or monitoring SDKs without approval and privacy review.

## Environment variables

Browser-visible Firebase configuration uses approved `NEXT_PUBLIC_*` variables. All privileged values remain server-only, including Firebase Admin credentials, mail API keys, contact addresses, bot-protection secrets and revalidation secrets. Prefer workload/platform identity or narrowly scoped credentials over a long-lived service-account private key. Rotate secrets on a documented schedule and immediately after suspected exposure.

## Firebase Security Rules baseline

Deployable `firestore.rules` and `storage.rules` will be created during the application foundation and tested in the Firebase Emulator Suite.

### Firestore policy

Default behavior: deny every read and write.

- Public browser access: denied for all collections.
- Server-side page generation: Firebase Admin SDK only.
- Admin draft reads/writes: authenticated user with `admin == true` custom claim and an active matching
  allow-list entry. Rule lookups must be included in cost and rules-evaluation tests.
- `admins` collection: never readable or writable by the browser.
- Creates: validate allowed fields, types, lengths, initial timestamps and accepted status.
- Updates: prevent browser changes to identity, creation, publication, delivery, slug-reservation,
  redirect, audit and server-timestamp fields; validate every resulting draft field.
- Browser deletes are denied. Permanent deletion is server-only and requires explicit confirmation,
  recent authentication, MFA and a checked dependency/orphan report.
- `admins`, `slugReservations`, `publicationJobs`, `redirects` and audit records are never browser-writable.
- Query rules are not filters; every admin query must already satisfy the rule constraints.

### Storage policy

Default behavior: deny every read and write.

- Public browser reads: denied by default. Public media is fetched by generated pages/CDN using approved delivery URLs.
- Admin writes are limited to new objects under a per-document quarantine prefix. Promotion to public
  processed paths and deletion from those paths are server-only.
- Storage Rules enforce path, declared content type and object-size limits. They cannot prove decoded
  format, dimensions or safety; trusted server decoding and re-encoding is authoritative.
- Disallow overwriting an existing versioned object. Replacement uses a new asset ID.
- Disallow list operations for public users.
- Deletion is admin-only and must target an exact object path.

### Mandatory emulator tests

1. Unauthenticated Firestore read and write fail.
2. Authenticated non-admin read and write fail.
3. Allow-listed admin can perform valid CRUD.
4. Admin writes with unexpected fields or invalid status fail.
5. Public and non-admin Storage uploads fail.
6. Admin upload to an invalid path, MIME type or oversized object fails.
7. Admin upload of an accepted optimized image succeeds.
8. Public object listing and deletion fail.
9. Server rendering can read published content using Admin SDK credentials.
10. Revoked/expired admin sessions cannot reach protected mutation endpoints.
11. Browser attempts to publish, unpublish, archive, delete or change protected fields fail.
12. Inactive allow-list record fails even when the token still contains an admin claim.
13. Concurrent publication cannot reserve the same normalized slug twice.
14. Draft/archived/failed-delivery media and previews cannot be fetched anonymously or cached publicly.
15. MFA/recent-auth gates protect account changes and destructive operations.
16. Firebase end-user account creation/deletion is disabled and verified through direct API tests.

## Runtime endpoint rules

- Contact: POST-only, strict JSON/schema/body limit, production/approved-preview origin check,
  Turnstile, WAF and secondary rate limits, idempotency token and generic responses.
- Admin mutations: CSRF token or equivalent same-origin protection in addition to cookie attributes
  and Origin validation; authorization is checked per operation and object.
- Media: resolve ownership from trusted metadata; require published/live status and variant permission;
  reject raw bucket paths and traversal/encoding tricks.
- Preview: authenticated, non-shareable by default, `private, no-store`, `noindex, nofollow`.
- Redirects and external URLs: only `https:` plus specifically approved schemes; reject credentials,
  control characters, protocol-relative URLs and unsafe redirect hosts.
- CSP: define explicit directives, nonce/hash strategy and third-party allow-list; validate in
  report-only preview mode and enforce in production without broad wildcards or `unsafe-eval`.

## Authentication operations

- Require MFA for the owner and securely retain recovery codes offline.
- Disable Firebase end-user account creation and deletion at the service configuration level.
- Apply rate limits to login and reset routes and avoid email/account enumeration.
- Notify the owner of password, email, MFA and allow-list changes.
- Document recovery, session revocation and emergency administrator restoration; test annually.

## Backup and recovery rules

- Define RPO/RTO, daily database and media backup, separate backup location and 30-day baseline retention.
- Encrypt backups and restrict restore permission to the maintenance identity.
- A Storage manifest is not a backup.
- Perform and record a non-production restore before launch and quarterly thereafter.
