# Anugraha Project Decision and Precaution Register

Status: Required living record  
Last updated: 30 July 2026

This file records decisions that must survive handovers. It does not replace the PRD, architecture,
rules or phase gates. Update it whenever an approved decision changes security, schema, scope, cost,
operations or privacy.

## Stakeholder & Domain Baseline

- **Portfolio Owner / Client**: **Anugraha** (Aeronautical Engineer). Non-technical user requiring a clean, friendly CMS to manage website content without code.
- **Lead Developer**: **Ratiraj**.
- **Public Domain Subject**: Aeronautical engineering, aerospace research dispatches, technical policy papers, visual poster artwork, and advisory services.
- **Strict Admin Access Boundary**: The Admin Panel (`/admin/*`) is exclusively restricted to **Anugraha** and **Ratiraj**. Public user registration is disabled; logins from any other email or UID are denied by server identity verification and allow-list rules.

## Locked baseline decisions

- Browser clients may edit approved draft fields only. Publication-state, settings, slug/redirect,
  allow-list and permanent-delete operations are server-only.
- Public rendering and media require both `published` and `deliveryState == live`.
- Admin MFA and Firebase service-level disabling of end-user account creation/deletion are mandatory.
- Upload sources remain quarantined; only trusted server-decoded/re-encoded variants may be published.
- Published slugs are atomically reserved and immutable by default; approved changes create redirects.
- Draft previews are authenticated, `private, no-store`, `noindex, nofollow` and never use public media URLs.
- Turnstile, WAF/application contact limits and idempotency protection are enabled at launch.
- Runtime reading, publication and maintenance/backup use separate least-privilege identities.
- Firestore and media are backed up separately and restoration is tested before launch and quarterly.

## Decisions requiring named approval

| Decision | Required output | Owner | Due date | Status |
|---|---|---|---|---|
| Admin Allow-List | Approved email addresses and Firebase UIDs for Anugraha and Ratiraj | Ratiraj | Phase 2 Gate | Active |
| Mail provider and retention | Provider, sender domain, inbox/provider retention and deletion process | Anugraha / Ratiraj | Before Phase 2 | Open |
| RPO/RTO | Numeric recovery point/time objectives and backup retention | Ratiraj | Before Phase 2 gate | Open |

## Change record template

For every material change record: date, decision, reason, affected requirements/files, security and
privacy impact, cost/schedule impact, approver, migration/rollback plan and verification evidence.

## Operational precautions

- Never use production credentials or personal contact content in local/preview environments.
- Never treat a UI restriction, hidden route or `noindex` directive as authorization.
- Never allow public account registration or unapproved admin login attempts.
- Never serve source uploads, raw bucket paths, drafts or failed-delivery revisions publicly.
- Keep the CMS admin interface intuitive, clear, and accessible for non-technical content management.
