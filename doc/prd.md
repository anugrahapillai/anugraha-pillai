# Anugraha Pillai Portfolio - Product Requirements Document

Status: Planning baseline  
Version: 1.0  
Last updated: 24 July 2026  
Product owner: Anugraha Pillai  
Implementation partner: Ratiraj Chavan

## 1. Product summary

The product is a responsive personal-brand and publishing platform for Anugraha Pillai. It presents blogs, visual posters, research and analysis, professional services, biography and contact information through a distinctive editorial website.

A protected single-owner admin panel allows Anugraha to manage every agreed public section without modifying code or relying on a developer for routine publishing.

The platform is intended to become a searchable, durable body of work rather than a static portfolio. It must support frequent publishing, remain easy to operate, and minimize Firebase usage through statically generated and CDN-cached public pages.

## 2. Problem statement

Anugraha needs one credible online destination that can:

- establish a clear and memorable professional identity;
- organize different kinds of creative and analytical work;
- support frequent blog and poster publishing;
- make older work searchable and discoverable;
- present services and convert visitor interest into enquiries;
- be updated independently through a secure admin panel;
- remain affordable, performant and maintainable as the content library grows.

A basic static portfolio would require developer involvement for updates. A generic CMS may introduce unnecessary cost, complexity and visual constraints. The product therefore combines a custom editorial experience with a focused, single-owner content-management workflow.

## 3. Product vision

Create a distinctive editorial home for Anugraha's ideas, visual work and professional practice - a platform that feels alive through regular publishing while remaining fast, secure and calm to use.

Working design concept: **Ideas, stories and journeys in motion.**

## 4. Product goals

### 4.1 Primary goals

1. Enable the owner to publish a complete blog, poster or research item in ten minutes or less, excluding content creation time.
2. Give every published item a stable URL, metadata, social preview and sitemap eligibility.
3. Let visitors quickly understand who Anugraha is, explore her work and make contact.
4. Allow the owner to manage all agreed page content, media, ordering and visibility from the admin panel.
5. Deliver cached public pages without Firebase calls during normal repeat visits.
6. Maintain strong accessibility, security, performance and recovery fundamentals.

### 4.2 Secondary goals

- Create a visual identity that works equally well for long-form writing and visual posters.
- Build a content model that supports years of regular publishing without redesign.
- Keep infrastructure and storage costs low.
- Provide a foundation for future enhancements without placing them in the launch scope.

## 5. Non-goals

The baseline product is not:

- a multi-author publishing organization;
- a social network or community platform;
- an e-commerce, subscription, membership or donation platform;
- a newsletter/marketing automation system;
- a visitor-account or commenting system;
- a native mobile application;
- a full digital-asset archive for original high-resolution files;
- a replacement for professional copywriting, branding or poster production;
- a third-party hosted full-text search implementation.

## 6. Target users

### 6.1 Owner / Administrator

**Who:** Anugraha Pillai, the sole administrator and content owner.

**Needs:**

- publish content frequently without developer support;
- save drafts and preview work before it becomes public;
- upload optimized images and provide alt text;
- correct, unpublish or archive existing content safely;
- update About, Services, contact links, homepage sections and SEO defaults;
- understand content status and receive clear validation/error messages;
- access the admin panel securely from desktop and mobile when required.

**Technical comfort assumption:** comfortable with common web forms and publishing interfaces, but should not need knowledge of Git, Firebase, HTML or deployment.

### 6.2 Prospective client or collaborator

**Who:** A visitor evaluating Anugraha's expertise, perspective or suitability for professional work.

**Needs:**

- understand the professional offer quickly;
- review credible examples of work;
- learn about Anugraha's background and approach;
- identify relevant services;
- send a legitimate enquiry with confidence.

### 6.3 Reader / Research visitor

**Who:** A visitor arriving through search, social sharing or a direct article link.

**Needs:**

- read comfortably on mobile or desktop;
- understand authorship, date, topic and context;
- explore related writing or research;
- navigate sources and external documents clearly;
- share or return to a stable page URL.

### 6.4 Visual-work visitor

**Who:** A visitor interested primarily in posters and visual projects.

**Needs:**

- browse artwork without aggressive cropping;
- view poster details and context;
- filter by useful tags/topics;
- download only when the owner explicitly enables it;
- use the gallery with keyboard or touch input.

### 6.5 Search engine and social crawler

**Who:** Automated systems that index pages or generate link previews.

**Needs:**

- stable canonical URLs;
- server-rendered public content;
- titles, descriptions, Open Graph metadata and images;
- sitemap and robots directives consistent with visibility status.

## 7. User roles and permissions

| Role | Authentication | Permissions |
|---|---|---|
| Visitor | None | View and search published content, open enabled downloads, follow external links and submit contact form |
| Owner/Admin | Firebase Authentication | Manage all agreed content, media, public sections, settings and publication states |
| Server services | Separate least-privilege identities | Render published/live pages and media, perform protected publication, send email and run backup/maintenance according to role |

Only one owner/admin account is included. Additional staff roles or editorial approval workflows require a future scope decision.

## 8. Core user journeys

### 8.1 Discover and explore

1. Visitor lands on Home or a shared content URL.
2. Visitor understands the creator and primary content categories.
3. Visitor opens a featured or relevant item.
4. Visitor follows related content, a service or the About page.
5. Visitor may submit an enquiry.

### 8.2 Find specific content

1. Visitor opens Blogs, Posters or Research.
2. Visitor enters a keyword or selects a category/tag.
3. Results update with a clear count or empty state.
4. Visitor opens a detail page.
5. Browser history and shareable URLs preserve navigation context where practical.

### 8.3 Publish new content

1. Admin signs in.
2. Admin selects New Blog, New Poster or New Research.
3. Admin enters required content and uploads optimized media.
4. System validates required fields, slug, media and alt text.
5. Admin saves a draft and previews the public presentation.
6. Admin publishes the item.
7. The affected public page, listing, Home selection and sitemap are revalidated.

### 8.4 Manage an existing item

1. Admin opens a paginated content list and filters by type/status.
2. Admin opens the item and edits its fields.
3. Admin saves, publishes, unpublishes or archives it.
4. Destructive deletion requires explicit confirmation and recent authentication where appropriate.

### 8.5 Send an enquiry

1. Visitor opens Contact and completes the form.
2. Client and server validate the fields.
3. Anti-spam checks run.
4. A transactional mail provider delivers the message to the approved inbox.
5. Visitor receives a stable success or actionable failure state.
6. The message is not stored in Firestore by default.

## 9. Product scope and requirements

Priority definitions:

- **Must:** required for launch acceptance.
- **Should:** valuable for launch but may be deferred if necessary without breaking the core product.
- **Could:** optional enhancement after the baseline is stable.

### 9.1 Public website

| ID | Requirement | Priority |
|---|---|---|
| PUB-01 | Home presents Anugraha's introduction, featured/latest work, content entry points and contact CTA | Must |
| PUB-02 | Global navigation exposes Blogs, Posters, Research, Services, About and Contact | Must |
| PUB-03 | Header and footer remain responsive and keyboard accessible | Must |
| PUB-04 | Public pages provide branded loading, empty, error and 404 states | Must |
| PUB-05 | Page sections and ordering defined as editable in scope are driven by admin-managed content | Must |
| PUB-06 | Search overlay/page groups matching published Blogs, Posters and Research | Must |
| PUB-07 | Public pages use static generation/ISR and CDN caching | Must |

### 9.2 Blogs

| ID | Requirement | Priority |
|---|---|---|
| BLOG-01 | List published blogs newest-first with cover, title, excerpt, category, date and reading time | Must |
| BLOG-02 | Provide keyword search, category/tag filtering and cursor/load-more pagination | Must |
| BLOG-03 | Render a unique detail page with rich structured content, media, links and metadata | Must |
| BLOG-04 | Display related content and share controls | Must |
| BLOG-05 | Support anchored headings and sources where supplied | Should |
| BLOG-06 | Show a reading-progress indicator on appropriate long articles | Could |

### 9.3 Posters

| ID | Requirement | Priority |
|---|---|---|
| POSTER-01 | Display responsive poster artwork without unintended cropping | Must |
| POSTER-02 | Show title, date, tags and meaningful alternative text | Must |
| POSTER-03 | Provide poster detail/viewing experience | Must |
| POSTER-04 | Filter by agreed tags/topics and year | Should |
| POSTER-05 | Show download control only when enabled by admin | Should |
| POSTER-06 | Provide zoom/lightbox behavior where useful and accessible | Could |

### 9.4 Research and analysis

| ID | Requirement | Priority |
|---|---|---|
| RESEARCH-01 | List published research items in a structured editorial index | Must |
| RESEARCH-02 | Show title, summary, topic, dates and document/content type | Must |
| RESEARCH-03 | Render body content or a clearly labelled external/document link | Must |
| RESEARCH-04 | Present sources/references distinctly | Must |
| RESEARCH-05 | Filter by topic and year | Should |

### 9.5 Services

| ID | Requirement | Priority |
|---|---|---|
| SERVICE-01 | Display administrator-managed services | Must |
| SERVICE-02 | Each service supports title, description, outcome/scope, ordering, visibility and CTA | Must |
| SERVICE-03 | Services route visitors toward the contact journey | Must |
| SERVICE-04 | Public pricing is absent unless explicitly supplied and approved by the owner | Must |

### 9.6 About

| ID | Requirement | Priority |
|---|---|---|
| ABOUT-01 | Display editable biography, headline, portrait and professional links | Must |
| ABOUT-02 | Support highlights, interests and skills without proficiency-bar scoring | Must |
| ABOUT-03 | Provide an optional editable timeline/currently section | Should |

### 9.7 Contact

| ID | Requirement | Priority |
|---|---|---|
| CONTACT-01 | Collect name, email, subject, message and consent | Must |
| CONTACT-02 | Validate all input in the browser and again on the server | Must |
| CONTACT-03 | Apply honeypot, timing checks, launch-enabled Turnstile, WAF/application rate limits and idempotency protection | Must |
| CONTACT-04 | Deliver through an approved transactional mail provider | Must |
| CONTACT-05 | Do not store messages in Firestore by default | Must |
| CONTACT-06 | Display sending, success, retry and failure states without losing entered data unnecessarily | Must |
| CONTACT-07 | Provide a privacy/retention summary and fallback contact method | Must |

### 9.8 SEO and discoverability

| ID | Requirement | Priority |
|---|---|---|
| SEO-01 | Generate canonical URL, page title and description for every public page | Must |
| SEO-02 | Generate Open Graph/social preview metadata | Must |
| SEO-03 | Generate sitemap and robots behavior that respects publication status | Must |
| SEO-04 | Include structured data where it is accurate and useful | Should |
| SEO-05 | Draft, preview and archived pages must not be publicly indexed | Must |

### 9.9 Admin authentication and shell

| ID | Requirement | Priority |
|---|---|---|
| ADMIN-01 | Authenticate only the approved owner/admin account | Must |
| ADMIN-02 | Support sign-in, sign-out and password reset | Must |
| ADMIN-03 | Protect admin routes using verified server sessions and Firebase rules | Must |
| ADMIN-04 | Provide responsive navigation for Dashboard, Blogs, Posters, Research, Services, Pages and Settings | Must |
| ADMIN-05 | Warn before leaving an editor with unsaved changes | Must |
| ADMIN-06 | Require MFA and recent authentication for account/security and destructive operations | Must |
| ADMIN-07 | Disable end-user account creation/deletion in Firebase configuration and prevent account enumeration | Must |
| ADMIN-08 | Keep authenticated drafts/previews private, non-indexable and out of shared caches | Must |

### 9.10 Admin dashboard and content management

| ID | Requirement | Priority |
|---|---|---|
| ADMIN-10 | Dashboard prioritizes New Blog, New Poster, New Research and Edit Home | Must |
| ADMIN-11 | Show bounded recent content/draft information without full-collection reads | Must |
| ADMIN-12 | Create, view, edit, duplicate, archive and permanently delete supported content | Must |
| ADMIN-13 | Filter and paginate content lists | Must |
| ADMIN-14 | Support title, slug, excerpt/summary, body, media, tags, SEO and publish date fields | Must |
| ADMIN-15 | Save draft and request server-only preview, publish, unpublish, backdate and feature operations with visible pending/live/failed delivery state | Must |
| ADMIN-16 | Validate duplicate/invalid slugs and required fields | Must |
| ADMIN-17 | Confirm permanent deletion and other destructive actions | Must |
| ADMIN-18 | Allow the owner to manage content, media, ordering and visibility for every agreed public section | Must |
| ADMIN-19 | Reserve normalized slugs atomically; published slug changes create redirects and cannot silently reassign old URLs | Must |
| ADMIN-20 | Keep permanent deletion server-only behind recent authentication, MFA, dependency checks and explicit confirmation | Must |

### 9.11 Media management

| ID | Requirement | Priority |
|---|---|---|
| MEDIA-01 | Resize and compress images before Firebase upload | Must |
| MEDIA-02 | Retain only publication-ready display/thumbnail variants by default | Must |
| MEDIA-03 | Validate and re-encode media in trusted server processing; client checks are usability-only | Must |
| MEDIA-04 | Capture alt text for meaningful images | Must |
| MEDIA-05 | Display upload progress and before/after size information | Should |
| MEDIA-06 | Replace media safely and remove only verified unreferenced objects | Must |
| MEDIA-07 | Deny anonymous access to draft, archived, failed-delivery and download-disabled variants | Must |
| MEDIA-08 | Explain that previously published/downloaded media cannot be reliably recalled | Must |

### 9.12 Settings and editable sections

| ID | Requirement | Priority |
|---|---|---|
| SETTINGS-01 | Edit public contact and social links | Must |
| SETTINGS-02 | Edit site title and default SEO metadata | Must |
| SETTINGS-03 | Select featured content and approved navigation/homepage options | Must |
| SETTINGS-04 | Update About/profile and Services without code changes | Must |

## 10. Content model summary

| Entity | Core fields |
|---|---|
| Blog post | title, slug, excerpt, structured body, cover image, tags/category, status, featured, publish date, SEO |
| Poster | title, slug, display image, thumbnail, alt text, caption, tags, status, featured, publish date, download-enabled |
| Research item | title, slug, summary, body or external/document URL, topics, sources, cover image, status, publish date, SEO |
| Service | title, description, outcome/scope, order, status/visibility, CTA, media if required |
| Profile/About | display name, headline, biography, portrait, interests/skills, highlights, links |
| Page section | section key, heading, body, media, CTA, order and visibility |
| Site settings | site title, SEO defaults, contact details, social links and feature selections |
| Admin allow-list | approved Firebase UID and administrative state |

All publishable content supports `draft`, `published` and `archived` states plus a server-managed
`deliveryState` (`pending`, `live`, `failed`). Public rendering includes only `published + live`
revisions. Browser clients cannot change either state directly.

## 11. Experience and design requirements

- Visual direction is editorial, intelligent, ambitious and personal.
- The supplied palette uses Ink `#0D0D11`, Night `#1A1822`, Violet `#7B2CBF`, Lilac `#C77DFF` and Paper `#F8F9FA`.
- The logo's orbit/aircraft informs restrained flight-path motifs and directional movement.
- Public pages alternate calm light reading surfaces with selected dark immersive sections.
- Recommended typography is Newsreader for editorial headings and Inter for body/UI.
- Home uses an asymmetric editorial hero, featured writing, dark poster collage, research index, Services, About preview and contact CTA.
- Motion is subtle, purposeful and disabled/reduced according to user preference.
- No essential interaction depends on hover or animation.
- Admin UI is quieter and denser than the expressive public site.

Detailed specifications live in `doc/design.md`.

## 12. Non-functional requirements

### 12.1 Performance

- Cached public page views make zero Firebase calls.
- Use static generation/ISR and Vercel CDN delivery.
- Use explicit image dimensions, responsive images and lazy loading.
- Do not load the entire content library for lists, dashboards or search.
- Launch search covers title, excerpt/summary, tags/topic and slug, not body full text. Its compressed
  public index is capped at 250 KB or 2,000 records; reaching either threshold triggers a reviewed
  server-paginated/hosted-search decision.
- Target Lighthouse Performance score of at least 85 on the agreed representative mobile run.

### 12.2 Accessibility

- Meet WCAG 2.2 AA for applicable public and admin journeys, verified with automated and manual checks.
- Support keyboard navigation, visible focus, semantic headings and labelled controls.
- Provide meaningful alternative text for posters and content imagery.
- Support 200% zoom without loss of content/function.
- Respect `prefers-reduced-motion`.
- Target Lighthouse Accessibility score of at least 90 on the agreed representative run.

### 12.3 Security

- Deny Firestore and Storage access by default.
- Use Firebase Auth, allow-listed administrator identity and verified server sessions.
- Require MFA, disable end-user account creation/deletion in Firebase configuration, rate-limit auth
  flows and document secure account recovery.
- Validate and sanitize input at all trust boundaries.
- Keep private credentials only in Vercel server environment variables.
- Do not commit secrets, service-account files or `.env` files.
- Protect mutation/contact endpoints against abuse and cross-site requests.
- Permit browser Firestore mutations only for approved draft fields. Publication, settings, slug,
  redirect, allow-list and deletion operations are server-only and protected by least-privilege IAM.
- Process uploads through restricted quarantine and trusted server decode/re-encode before publication.
- Test Firebase rules through the Emulator Suite.

### 12.4 Privacy

- Collect only information necessary for contact delivery.
- Do not store contact messages in Firestore by default.
- Avoid logging email addresses, message bodies or raw IP addresses.
- Display a privacy notice and define mail/inbox retention expectations before launch.

### 12.5 Compatibility

- Support current major Chrome, Safari, Firefox and Edge releases.
- Support responsive layouts from 360 px upward.
- Primary validation widths: 360, 768, 1024 and 1440 px.

### 12.6 Reliability and recovery

- Target 99.5% monthly application availability, measured by an approved external uptime check against
  the production Home and contact-health endpoints; define monthly owner, review date and exclusions.
- Preserve source and deployment revisions through Git and Vercel.
- Define RPO/RTO; back up Firestore and media daily to a separate restricted location with 30-day
  baseline retention, and test restoration before launch and quarterly.
- Configure Firebase/Vercel usage and billing alerts.

### 12.7 Maintainability

- Use reusable React components and clear server/client boundaries.
- Use JavaScript only (`.js`/`.jsx`), Next.js App Router, Tailwind CSS and scoped vanilla CSS where justified.
- Run ESLint, Prettier, tests and a production build before release.
- Prefer small dependencies and documented environment configuration.

## 13. Approved technical baseline

| Area | Technology |
|---|---|
| Application | Next.js App Router + React.js |
| Language | JavaScript, not TypeScript |
| Styling | Tailwind CSS plus vanilla CSS/CSS Modules when required |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore |
| Media | Firebase Storage |
| Server access | Firebase Admin SDK |
| Contact | Next.js server endpoint + approved transactional mail service |
| Hosting/CDN | Vercel |
| Version control | Git |
| Testing | React unit/component tests, Playwright critical journeys and Firebase Emulator tests |

Implementation constraints are defined in `doc/rules.md`; system decisions are defined in `doc/architecture.md`.

## 14. Success metrics

| Metric | Initial target |
|---|---|
| Publishing efficiency | In a timed UAT with three representative items, trained admin completes required metadata/media and reaches `live` in <= 10 minutes per item, excluding writing time |
| Launch quality | No unresolved critical production defect |
| Public Firebase usage | Zero Firebase calls for an already cached public page |
| Performance | Lighthouse Performance >= 85 using production build, cold navigation, documented mobile device profile and throttling, with the report retained |
| Accessibility | Lighthouse Accessibility >= 90 plus documented keyboard, screen-reader, zoom and contrast checks |
| Discoverability | Every published item has unique URL, canonical metadata, social data and sitemap eligibility |
| Contact reliability | Valid submission produces one mail request; duplicate idempotency token produces no second mail; abuse limits and provider failure states are tested |
| Admin independence | Owner updates every agreed public section without source-code changes |

Before launch, record either an approved privacy-respecting measurement plan for visits, contact starts
and successful enquiries, or a written decision that conversion cannot yet be measured. Add targets
after 60 days of representative production data; product claims must not rely on unavailable analytics.

## 15. Launch acceptance criteria

1. Admin can sign in, sign out and reset the password; unauthorized users cannot write data.
2. Admin can create, preview, publish, edit, unpublish and archive every supported content type.
3. Published items appear at the correct listing and unique URL; drafts do not.
4. Valid images upload with alt text/progress; invalid files receive clear rejection.
5. About, Services, settings and agreed page sections update publicly without code changes.
6. Search/filter returns correct published results and useful empty states.
7. Valid contact submission is sent once through the mail service; invalid/spam-like input is rejected safely.
8. Canonical, Open Graph, sitemap and robots behavior matches visibility.
9. No critical layout failure occurs at 360, 768, 1024 or 1440 px.
10. Production domain uses HTTPS and the approved Git branch deploys successfully through Vercel.
11. Firestore and Storage rules pass positive admin and negative unauthorized tests.
12. Keyboard navigation, visible focus and reduced-motion behavior pass manual review.
13. Client receives admin, deployment, credential-handover and backup instructions.
14. Browser/API attempts cannot create end-user accounts or perform publication, settings, slug,
    redirect, allow-list or permanent-delete mutations directly.
15. MFA is active; login/reset enumeration and rate-limit tests pass; recovery and session revocation are demonstrated.
16. Draft/archived/failed-delivery previews and media are not anonymously accessible, indexable or shared-cacheable.
17. Concurrent publication cannot reserve the same normalized slug; approved slug changes preserve a redirect.
18. Publication retry is idempotent and exposes pending/live/failed state; failed cache regeneration
    never causes a draft or partial revision to become publicly discoverable.
19. Contact Turnstile, WAF/application limits and idempotency are enabled with documented thresholds.
20. A full Firestore and media restore into non-production meets the approved RPO/RTO.

## 16. Dependencies

### 16.1 Client inputs

- approved domain choice;
- transparent full logo, compact logo and reverse/monochrome logo;
- professional title/tagline and final name styling;
- portrait, biography and public links;
- initial recommended content: 3 blogs, 6 posters and 2 research items;
- service descriptions and enquiry destination email;
- privacy wording and message-retention expectation;
- consolidated milestone feedback within two working days.

### 16.2 Account and service decisions

- client-owned Firebase, Vercel, Git and domain accounts;
- selected transactional mail provider and verified sender domain;
- Turnstile site/secret configuration and approved contact-rate thresholds;
- confirmation of whether high-resolution poster downloads are required.

## 17. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Delayed content/feedback | Launch delay | Use agreed sample content and consolidated review deadlines |
| Detailed logo lacks production variants | Poor small/dark usage | Produce transparent, compact and reverse variants before UI implementation |
| Large poster uploads | Storage/bandwidth growth | Client-side compression, strict size limits and display-only baseline |
| Frequent public database reads | Increased cost/latency | Static generation, ISR and CDN caching; no public listeners |
| Spam/contact abuse | Mail cost and inbox noise | Validation, honeypot, timing checks, mandatory launch Turnstile, layered rate limits and idempotency |
| Rich content injection | Security/content risk | Structured content or sanitized allow-listed HTML |
| Single-owner account compromise | Complete CMS takeover | Mandatory MFA, login/reset limits, change alerts, recovery codes and session-revocation drill |
| Direct client publication | Validation/cache bypass | Browser writes limited to drafts; all state/settings/destructive transitions use protected server endpoints |
| Draft or revoked media disclosure | Confidential content exposure | Owner/status/variant authorization, private previews and cache invalidation; never publish sensitive material |
| Slug race or reuse | Wrong canonical page/link hijack | Atomic normalized reservation, immutable published slug and redirect history |
| Permanent deletion breaks durable URLs | Link rot or slug reassignment | Archive by default; retain a non-sensitive reserved tombstone and return 410 after approved deletion |
| Publication/cache partial failure | Stale or inconsistent public site | Outbox job, delivery state, idempotent retries, precise cache tags and verification |
| Malicious image payload | Browser/server risk | Quarantine plus trusted decode/re-encode; never serve source upload |
| Backup is incomplete or unusable | Permanent content/media loss | Separate daily database/media backups and quarterly measured restoration |
| Firebase/Vercel quota changes | Unexpected operational cost | Usage alerts, bounded queries and documented upgrade triggers |
| Scope expansion during build | Schedule/budget impact | Treat unspecified functionality as a separately estimated change request |

## 18. Release scope

### Version 1.0 launch

- responsive public website;
- Home, Blogs, Posters, Research, Services, About and Contact;
- content detail pages, cached search/filter and SEO;
- protected single-owner admin panel;
- content/media/page/settings management;
- secure email contact delivery;
- Firebase/Vercel/Git setup, testing, launch and handover.

### Future candidates

- additional administrator/editor roles;
- newsletter integration;
- hosted full-text search;
- scheduled publishing automation;
- analytics dashboard;
- higher-resolution poster download archive;
- comments, membership, payments or mobile applications.

Future candidates are not commitments and require separate approval, design and estimation.

## 19. Open decisions

1. Final transactional mail provider.
2. Turnstile is enabled at launch. Any exception requires named risk owner, compensating rate limits and expiry date.
3. Final professional tagline and Home hero copy.
4. Final production logo variants and portrait choice.
5. Whether poster downloads use display resolution or a separately stored high-resolution file.
6. Exact mail-provider/inbox retention period for contact messages.
7. Whether publish-date scheduling means metadata backdating only or true future automatic publication; automatic scheduling is not assumed in version 1.0.
8. Approved numeric RPO/RTO and backup retention beyond the 24-hour/30-day baseline.
9. Named operational owner for security alerts, failed publication jobs, backups and monthly availability review.
10. Privacy-approved conversion measurement decision and 60-day metric review date.

## 20. Scope, ownership and change-control precautions

Before implementation begins, maintain a scope matrix listing every editable public section, its
fields, validation, publication behavior and responsible approver. The delivery plan must also record:

- named product owner, engineering/security owner and operational incident owner;
- phase estimates, budget/capacity assumptions, dependencies and contingency;
- explicit minimum launch scope and deferrable `Should`/`Could` items;
- schema migration/rollback owner and compatibility rules for existing content;
- measurable phase exit evidence rather than approval by demonstration alone.

If the referenced commercial SRS or brand assets are contractual inputs, place approved copies in the
controlled project document store or replace the references with accessible versioned links before
baseline approval. Missing source documents must be logged as blockers, not silently assumed.

## 21. Related documents

- `doc/architecture.md` - secure, low-cost system architecture
- `doc/design.md` - visual system, layouts, interactions and accessibility
- `doc/rules.md` - approved stack, implementation rules and Firebase security baseline
- `doc/phases.md` - delivery phases and implementation sequence
- `Anugraha_Pillai_Portfolio_SRS.pdf` - commercial scope and acceptance source
