# Anugraha Pillai Portfolio - Implementation Phases

Status: Planning baseline  
Last updated: 24 July 2026  
Delivery model: Four gated phases

## 1. Delivery principles

- Complete and review each phase before treating the next phase as stable.
- Use JavaScript, React.js, Next.js App Router, Tailwind CSS and scoped vanilla CSS.
- Keep the public browser disconnected from Firestore; public content is rendered through secure server access and cached using ISR/Vercel CDN.
- Build against reusable schemas and mock data before connecting production services.
- Test security, accessibility and performance throughout development rather than postponing all checks until Phase 4.
- Deploy every phase to a Vercel preview environment for review.
- Keep all source changes in Git with focused commits and a reproducible `package-lock.json`.
- Never use real private credentials or sensitive contact information as test data.
- Before Phase 1, approve the editable-section scope matrix, named product/security/operations owners,
  estimates, capacity, budget assumptions, dependencies and minimum launch scope.

## 2. Phase overview

| Phase | Focus | Primary outcome |
|---|---|---|
| Phase 1 | Admin login and admin panel | Complete responsive admin experience operating on mock data |
| Phase 2 | Firebase connectivity and data validation | Secure admin connected to Firebase with tested, optimized data operations |
| Phase 3 | Public website design and data delivery | Complete public site rendering published Firebase content through cached server pages |
| Phase 4 | QA, beta, penetration testing and polishing | Production-ready, tested, secured and polished release |

## 3. Phase 1 - Admin login and admin panel

### 3.1 Objective

Build the complete administrative user experience before coupling it to Firebase. The interface will initially use realistic mock data and service adapters, allowing workflows and validation to be reviewed quickly.

### 3.2 Foundation setup

- Initialize Next.js App Router using JavaScript, not TypeScript.
- Configure Tailwind CSS and the project design tokens.
- Add scoped vanilla CSS/CSS Modules for editor styling, complex selectors and animation where required.
- Configure ESLint, Prettier, environment templates and Git ignore rules.
- Establish application folders for public routes, admin routes, components, validation, services and tests.
- Configure Vercel preview deployment.
- Add the shared data schemas and mock repositories that Firebase adapters will implement in Phase 2.

### 3.3 Admin authentication interface

- Build admin sign-in, forgotten-password and reset-status screens.
- Implement form validation, loading, success and error states using a temporary authentication adapter.
- Build protected-route behavior and session-expired UI states.
- Add logout and account/session controls.
- Ensure no public registration interface exists.
- Include MFA enrollment/recovery, non-enumerating reset feedback and recent-authentication UI states.
- Prepare the authentication boundary so the temporary adapter can be replaced with Firebase Authentication in Phase 2.

The Phase 1 login is an interface and flow prototype. It must not be represented as production security until Firebase session verification is connected and tested.

### 3.4 Admin application shell

- Responsive desktop sidebar and mobile navigation drawer.
- Dashboard header, page titles, breadcrumbs and global action area.
- Navigation for Dashboard, Blogs, Posters, Research, Services, Pages and Settings.
- Accessible dialogs, drawers, toasts and persistent inline errors.
- Unsaved-change warning and destructive-action confirmation patterns.
- Loading, empty and failure states for each admin module.

### 3.5 Dashboard

- Quick actions: New Blog, New Poster, New Research and Edit Home.
- Recent content and drafts-needing-action sections using bounded mock records.
- Status presentation for Draft, Publication pending, Live, Publication failed and Archived.
- Avoid dashboard features that would later require full-collection reads.

### 3.6 Content management screens

Build list, create, edit, preview and management screens for:

- Blogs;
- Posters;
- Research and analysis;
- Services;
- About/profile;
- Home and other approved page sections;
- Site, contact, social and SEO settings.

Content list requirements:

- desktop table and mobile summary-row presentation;
- type, status and category filters;
- search within the currently loaded admin view;
- cursor-pagination UI contract;
- row actions for edit, duplicate, archive and delete;
- explicit confirmation before permanent deletion.

### 3.7 Editor experience

- Content, Media, SEO and Publishing sections.
- Title, slug, excerpt/summary, structured body, tags/category and cover fields.
- Content-type-specific poster, research and service fields.
- Save draft, authenticated Preview, and server-requested Publish, Unpublish and Archive actions.
- Required-field, length, URL, slug and publish-date validation.
- Image selection, client-side preview, crop/resize/compression preview and alt-text fields.
- Sticky save/publish action bar and clear save-state feedback.
- Mock public preview matching the approved public component contract.

### 3.8 Phase 1 testing

- Component tests for admin forms, validation, lists, dialogs and editor states.
- Keyboard testing for sidebar, drawer, dialogs and editor actions.
- Responsive checks at 360, 768, 1024 and 1440 px.
- Tests for unsaved-change warnings and destructive confirmations.
- Mock-repository tests ensuring Firebase can replace mock services without changing UI components.

### 3.9 Phase 1 deliverables

- Working admin preview deployed to Vercel.
- Complete admin navigation and primary screens.
- Login/reset interfaces using temporary adapters.
- Realistic seed/mock data for every content type.
- Shared JavaScript validation schemas.
- Approved admin workflow and UI review notes.

### 3.10 Phase 1 completion gate

Phase 1 is complete when the owner completes a timed UAT with three representative items, every
editable section in the approved scope matrix is represented, pending/live/failed and recovery states
are demonstrated, and responsive/keyboard evidence is recorded.

## 4. Phase 2 - Firebase connectivity, testing and data optimization

### 4.1 Objective

Replace mock persistence and temporary authentication with secure Firebase services, validate the data model, optimize reads/storage and prove complete admin-to-Firebase operations before public-site integration.

### 4.2 Firebase environment setup

- Create or connect the client-owned Firebase project.
- Configure approved development/preview and production separation.
- Enable Firebase Authentication with the approved owner account.
- Disable end-user account creation/deletion in Firebase settings and require MFA for the owner.
- Configure the admin custom claim and UID allow-list.
- Configure Cloud Firestore and Firebase Storage.
- Add Firebase client configuration only to approved browser environment variables.
- Configure separate least-privilege runtime-read, publishing and maintenance/backup identities.
  Prefer platform/workload identity; do not distribute broad service-account JSON keys.
- Configure the Firebase Emulator Suite for local rule and data testing.

### 4.3 Authentication integration

- Replace the Phase 1 authentication adapter with Firebase Authentication.
- Exchange/verify Firebase identity through protected server sessions.
- Set secure `HttpOnly`, `Secure` and `SameSite` session cookies.
- Implement sign-in, sign-out, password reset, session expiry and revoked-session behavior.
- Verify admin custom claim and allow-list membership on privileged operations.
- Apply login/reset rate limits, non-enumerating responses and owner alerts for password/email/MFA changes.
- Document recovery codes, emergency recovery and session-revocation drill.
- Confirm unauthorized users cannot access admin data or mutation routes.

### 4.4 Firestore schema implementation

Implement and validate the agreed collections:

```text
posts/{id}
posters/{id}
research/{id}
services/{id}
pages/{pageKey}
settings/public
admins/{uid}
slugReservations/{typeAndNormalizedSlug}
publicationJobs/{id}
redirects/{typeAndOldNormalizedSlug}
```

- Freeze required and optional fields for every entity.
- Enforce content status plus server-managed `pending`, `live` and `failed` delivery state.
- Use generated IDs and atomically reserved normalized slugs. Published slug changes are server-only
  and create redirect history; old slugs cannot be assigned to other content.
- Use server timestamps for creation and update times.
- Store only required denormalized display data.
- Create only indexes used by implemented queries.
- Document schema evolution and seed-data format.

### 4.5 Firebase service integration

- Replace mock repositories with Firestore service adapters.
- Connect direct browser CRUD only for allowed draft fields. Publish, unpublish, archive, permanent
  delete, slug/redirect, settings and allow-list mutations use protected server endpoints exclusively.
- Use explicit limits and cursor pagination.
- Implement transactional slug reservation and publication outbox jobs with stable idempotency keys,
  retries/backoff, delivery verification and visible pending/live/failed states.
- Prevent full-collection reads for dashboards and list screens.
- Handle offline/network failure without falsely reporting successful saves.
- Add retry-safe behavior to avoid accidental duplicate writes.

### 4.6 Firebase Storage integration

- Compress images before upload to a restricted quarantine path for usability.
- Store display and thumbnail variants only by default.
- Decode, validate and re-encode on trusted server processing before promotion to public paths; reject
  invalid format, dimensions, frame count and output size. Never publish the source upload.
- Use deterministic, versioned object paths.
- Store object paths and metadata in the owning Firestore document.
- Replace media safely: update the document before removing the verified old object.
- Add orphan-report logic; do not perform blind recursive deletion.
- Keep logos, fonts, icons and decorative SVGs in Git/Vercel instead of Firebase Storage.

### 4.7 Security Rules

- Implement deny-by-default Firestore Rules.
- Implement deny-by-default Storage Rules.
- Permit allow-listed admins to write approved draft fields and quarantine uploads only.
- Deny browser publication/status, protected settings, slug reservation, redirect, audit and deletion operations.
- Validate allowed fields, full resulting types/lengths and immutable fields.
- Restrict Storage paths, MIME type and object size.
- Deny public listing, upload, modification and deletion.
- Confirm Firebase Admin SDK access remains server-only.
- Document that Admin SDK bypasses Security Rules and test server authorization plus least-privilege IAM separately.

### 4.8 Test data and migration utilities

- Create non-sensitive seed data for Blogs, Posters, Research, Services, Pages and Settings.
- Provide an idempotent development seed/reset workflow.
- Push approved test records to the development/preview Firebase environment.
- Do not automatically seed or overwrite production.
- Validate Unicode, long titles, missing optional media, tag/category combinations and empty collections.
- Document the controlled process for importing initial client content.

### 4.9 Data and API optimization tests

- Record Firestore reads/writes for each main admin operation.
- Confirm every content list is bounded and cursor-paginated.
- Confirm dashboard queries remain bounded.
- Measure compressed media output and reject files above limits.
- Verify no duplicate records are produced during retry scenarios.
- Test composite indexes used for status/type/date/category queries.
- Confirm stable assets do not enter Firebase Storage.

### 4.10 Phase 2 testing

- Firebase Emulator tests for all positive admin and negative unauthorized cases.
- Authentication/session integration tests.
- Direct API test proving Firebase end-user account creation/deletion is disabled.
- MFA, recent-auth, enumeration, login/reset throttling and inactive-allow-list tests.
- CRUD and publishing tests for every entity.
- Tests proving browser clients cannot publish, change protected settings/slugs or permanently delete.
- Concurrent slug reservation and idempotent publication retry tests.
- Storage upload, invalid-file, replacement and deletion tests.
- Trusted decode/re-encode tests using MIME spoofing, malformed and oversized-dimension fixtures.
- Schema-validation and malformed-data tests.
- Read/write count review for critical workflows.
- Preview deployment tested against the non-production Firebase environment.

### 4.11 Phase 2 deliverables

- Secure Firebase Authentication and admin sessions.
- Connected Firestore CRUD and publishing workflow.
- Connected optimized Storage upload workflow.
- Deployable `firestore.rules`, `storage.rules` and required indexes.
- Emulator test suite and test-data utilities.
- Data schema, environment and seed/import documentation.
- Firebase usage baseline for common admin actions.

### 4.12 Phase 2 completion gate

Phase 2 is complete when draft workflows persist, protected transitions succeed only through server
endpoints, direct/API unauthorized cases fail, MFA and account-creation controls are proven, Security
Rules and server-authorization/IAM tests pass, trusted media processing succeeds, concurrent slugs and
retries are safe, and measured data operations meet the bounded-query plan.

## 5. Phase 3 - Public website design and database content delivery

### 5.1 Objective

Build the approved public experience and connect it to published Firebase content through secure Next.js server rendering, static generation and incremental revalidation.

### 5.2 Public design system implementation

- Implement the approved palette, typography, spacing, grid and responsive tokens.
- Prepare transparent, compact and reverse logo assets.
- Build global header, mobile menu, search and footer.
- Implement the light/dark editorial section rhythm and flight-path visual motif.
- Implement reusable public buttons, links, tags, cards, media, rows, forms and states.
- Add purposeful animation and complete reduced-motion behavior.

### 5.3 Home page

- Asymmetric editorial hero.
- Featured story/latest dispatch.
- Latest writing composition.
- Dark selected-posters section.
- Research and analysis index.
- Services overview.
- About preview.
- Contact call-to-action.
- All configured content, order and visibility derived from approved settings/page records.

### 5.4 Content libraries and detail pages

Build responsive public routes for:

- Blogs listing and detail;
- Posters gallery and detail/viewer;
- Research listing and detail/external document state;
- Services;
- About;
- Contact;
- Search;
- privacy/utility content;
- branded 404 and error states.

### 5.5 Secure database fetching

- Fetch Firestore data only in protected server modules using the read-only runtime identity.
- Never import the Firebase browser SDK into public pages.
- Render only immutable revisions marked `published + live`.
- Use static generation and ISR for public content.
- Invalidate revision/content cache tags plus affected detail/list/Home/search/sitemap/media paths;
  verify regeneration before marking delivery live.
- Ensure cached page views make zero Firebase calls.
- Fetch public media through validated, same-origin, CDN-cached media routes.
- Never expose permanent Firebase download-token URLs.
- Resolve media through owning content and require published/live status plus variant permission;
  downloads require `downloadEnabled`. Preview media is authenticated and `private, no-store`.

### 5.6 Search and filtering

- Generate a compact CDN-cached index from published/live title, excerpt/summary, tags/topic and slug.
- Cap it at 250 KB compressed or 2,000 records; body full-text search is excluded at launch.
- Search title, excerpt/summary, category and tags in the browser after the index is cached.
- Group or label results by Blogs, Posters and Research.
- Keep filter state in the URL where practical.
- Use Load More/cursor navigation instead of infinite scrolling.
- Provide useful empty and reset states.

### 5.7 Contact mail integration

- Implement `POST /api/contact` as a Next.js server endpoint.
- Validate and normalize name, email, subject, message and consent.
- Add body-size limits, origin checks, honeypot and timing validation.
- Require single-use Turnstile verification at launch plus documented WAF/application rate limits,
  idempotency tokens and provider quota/spending alerts.
- Send using the selected transactional mail provider and verified sender identity.
- Use the visitor address only as `Reply-To`, never as `From`.
- Return generic, stable success/failure responses.
- Do not store enquiries in Firestore by default.
- Do not log message bodies or visitor email addresses.
- If abuse correlation needs an identifier, use a keyed short-lived hash rather than raw IP storage.

### 5.8 SEO and sharing

- Unique page titles and descriptions.
- Canonical URLs.
- Open Graph and social preview metadata/images.
- Sitemap generation and robots directives.
- No indexing for drafts, previews or archived content.
- Preview routes require an active session and send `private, no-store` plus `noindex, nofollow`.
- Accurate structured data where useful.
- Descriptive URLs and correct redirect/canonical-host behavior.

### 5.9 Phase 3 testing

- Validate published/draft/archived visibility.
- Verify targeted revalidation after every publishing action.
- Simulate cache/revalidation failure and verify pending/failed state, idempotent retry and absence of partial public content.
- Confirm cached public page views make zero Firebase calls.
- Verify search/filter results and empty states.
- Test contact validation, duplicate-submit prevention and provider failure states.
- Test Turnstile replay/failure, configured rate thresholds and idempotency without high-volume abuse.
- Test metadata, social previews, sitemap and robots behavior.
- Test keyboard navigation, focus order, alt text and reduced motion.
- Test responsive layouts at 360, 768, 1024 and 1440 px.
- Run preliminary Lighthouse performance/accessibility checks.

### 5.10 Phase 3 deliverables

- Complete public website on a Vercel preview deployment.
- All public pages connected to published Firebase content.
- CDN-cached search and media delivery.
- Secure contact-mail workflow.
- SEO, sitemap and social metadata implementation.
- Approved responsive and motion implementation.
- Initial approved content imported for beta review.

### 5.11 Phase 3 completion gate

Phase 3 is complete when published admin content appears correctly on all public routes, drafts remain private, cached pages avoid Firebase calls, the contact route delivers safely, and the owner approves the complete public preview for beta testing.

## 6. Phase 4 - QA, beta testing, penetration testing and UI polishing

### 6.1 Objective

Validate the complete system under realistic content and user behavior, correct defects, harden security, polish the experience and prepare a controlled production launch.

### 6.2 Functional QA

- Execute every PRD launch acceptance scenario.
- Test sign-in, sign-out, password reset and session expiry.
- Test MFA enrollment/challenge/recovery, account enumeration, end-user sign-up denial, credential
  throttling, allow-list deactivation, session revocation and owner security-change alerts.
- Test create, edit, preview, publish, unpublish, archive, duplicate and delete flows.
- Test each supported content type and editable page section.
- Verify media replacement and orphan-handling behavior.
- Verify draft/archived/failed-delivery/download-disabled media authorization and public-cache removal.
- Verify search, filters, pagination, related content and sharing.
- Verify contact success, failure, retry and duplicate prevention.
- Test long titles, missing optional fields, empty sections and malformed external links.

### 6.3 Cross-browser and responsive QA

- Current major Chrome, Safari, Firefox and Edge.
- Physical or representative mobile/tablet testing.
- Required widths: 360, 768, 1024 and 1440 px.
- Portrait/landscape orientation where relevant.
- 200% zoom and increased text-size checks.
- Slow network and failed-request behavior.

### 6.4 Accessibility QA

- Keyboard-only navigation through public and admin applications.
- Skip link, heading hierarchy, landmarks and form labels.
- Focus visibility, trapping and restoration for menus/dialogs/lightboxes.
- Screen-reader smoke tests for navigation, forms, status and poster descriptions.
- Colour-contrast verification.
- Reduced-motion verification.
- Touch-target and mobile-navigation review.

### 6.5 Performance and data-usage QA

- Lighthouse performance target: at least 85 on the agreed representative mobile run.
- Lighthouse accessibility target: at least 90 plus manual checks.
- Inspect Core Web Vitals and layout shifts.
- Confirm image sizing, compression, lazy loading and cache headers.
- Confirm production bundles exclude unnecessary Firebase/public dependencies.
- Confirm cached public routes make zero Firebase calls.
- Review Firestore read/write counts and Firebase Storage usage.
- Review Vercel function invocations and cache behavior.

### 6.6 Security and penetration testing

Testing is authorized only against the project's approved local, preview and production targets and must avoid destructive denial-of-service activity.

- Verify admin route and API authorization bypass resistance.
- Test expired, revoked, malformed and non-admin sessions.
- Test Firestore/Storage Rules against unauthorized read, write, list and delete attempts.
- Test IDOR/BOLA risks across document IDs, slugs and media paths.
- Test direct client/API attempts to bypass server-only publication, settings, redirect and deletion operations.
- Test CSRF and origin validation on mutation/contact endpoints.
- Test stored/reflected XSS through titles, rich content, URLs and enquiry fields.
- Test injection and malformed JSON/request bodies.
- Test unrestricted upload, MIME spoofing, oversized images and path manipulation.
- Test open redirect and unsafe external URL behavior.
- Test contact spam protections against documented numeric rate limits without high-volume abuse.
- Review Content Security Policy and security headers.
- Scan dependencies and remediate relevant known vulnerabilities.
- Verify that secrets, service credentials and private source maps are not exposed.
- Review IAM permissions for every runtime/publishing/maintenance identity and prove the read-only
  runtime identity cannot mutate data.
- Record each finding with severity, reproduction, impact and resolution evidence.

### 6.7 Beta/UAT testing

- Release a controlled Vercel beta preview to the owner and agreed reviewers.
- Provide a fixed test script covering visitor and admin journeys.
- Collect issues in one prioritized list rather than scattered messages.
- Classify findings as Critical, High, Medium, Low or Enhancement.
- Correct in-scope defects and complete one consolidated UAT correction round.
- Treat new features or layout changes outside the approved design as change requests.
- Obtain explicit launch approval after retesting resolved findings.

### 6.8 UI polishing

- Correct typography rhythm, spacing, alignment and visual hierarchy.
- Refine responsive image crops and poster presentation.
- Standardize hover, focus, active, disabled, loading and error states.
- Tune motion duration/easing and reduced-motion replacements.
- Remove layout shift and animation jank.
- Polish empty, error, success and 404 experiences.
- Check final logo variants, favicons, social previews and browser theme colours.
- Review admin density and frequent-action placement with the owner.
- Remove temporary copy, mock assets, debugging output and development-only controls.

### 6.9 Production readiness and launch

- Confirm client-owned domain, Firebase, Vercel, Git and mail-provider access.
- Configure production environment variables and allowed domains.
- Verify billing/usage alerts.
- Verify contact WAF rules, Turnstile, provider spending caps and publication-failure alerts.
- Verify approved production Firebase Rules and indexes.
- Approve numeric RPO/RTO; complete separate Firestore and media backups and a measured restore into
  non-production. A Storage inventory alone does not satisfy this gate.
- Confirm canonical host, HTTPS and redirects.
- Seed/import approved launch content and perform content review.
- Tag the release in Git and preserve the known-good Vercel deployment.
- Complete admin training, credentials handover and operational documentation.
- Monitor login, public errors, contact delivery and usage after launch.
- Assign named responders for auth/security alerts, failed publication jobs, backups and availability review.

### 6.10 Severity and release policy

| Severity | Definition | Launch rule |
|---|---|---|
| Critical | Authentication bypass, data exposure/loss, unusable core flow or production outage | Must be fixed and retested |
| High | Serious security issue or major feature failure without acceptable workaround | Must be fixed and retested |
| Medium | In-scope defect with a usable workaround or limited impact | Fix before launch where practical; otherwise document and approve |
| Low | Minor visual/copy issue with no meaningful functional impact | May be scheduled after launch with approval |
| Enhancement | New or changed behavior outside approved requirements | Separate scope decision |

### 6.11 Phase 4 deliverables

- QA and browser/device test report.
- Accessibility review and resolved findings.
- Performance/data-usage report.
- Penetration-test findings and remediation evidence.
- Consolidated beta/UAT sign-off.
- Polished production application.
- Deployment, backup, incident and admin documentation.
- Production launch and monitored handover.

### 6.12 Phase 4 completion gate

Phase 4 is complete when no unresolved Critical or High defect remains; Firebase Rules, server
authorization, IAM, MFA, media authorization, publication-failure and contact-abuse tests pass; a full
database/media restore meets RPO/RTO; documented performance/accessibility checks pass or are formally
accepted; named operational ownership exists; UAT is approved and handover is complete.

## 7. Cross-phase definition of done

A feature is done only when:

- it matches the approved PRD and design behavior;
- it handles loading, empty, success and failure states;
- it works at the agreed responsive widths;
- it is keyboard accessible and has visible focus;
- input is validated at the correct trust boundary;
- relevant automated tests pass;
- it does not introduce unbounded Firebase queries or unnecessary Storage usage;
- it is reviewed in a Vercel preview;
- documentation is updated when behavior or configuration changes.
- server-only operations cannot be invoked through a lower-trust browser path;
- privacy, abuse, cache invalidation, audit and recovery behavior has explicit test evidence where relevant.

## 8. Phase change control

- A phase gate approves completed scope; it does not automatically approve new functionality.
- Changes affecting schema, security boundaries, page structure, delivery date or cost must be recorded before implementation.
- New requests outside `doc/prd.md` are evaluated as change requests.
- Defects against approved requirements remain part of the current scope.
- Production data, credentials and destructive operations require explicit target verification and documented procedures.
