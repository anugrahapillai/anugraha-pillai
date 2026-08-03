# Anugraha Pillai Portfolio - Design System and Layout Specification

Status: Design direction for discussion  
Last updated: 24 July 2026  
Reference assets: `anugraha-pillai-1.png` colour palette and the supplied Anugraha "A + aircraft" logo

## 1. Design direction

The portfolio should feel **editorial, intelligent, ambitious and personal**. The logo introduces motion, travel and upward direction through the aircraft, orbit and pointed letterform. The interface should echo that energy with controlled arcs, diagonal accents and directional transitions, while keeping articles and research calm and highly readable.

The site is not designed as a constant purple gradient. Purple is the identifying accent; generous light space and deep ink surfaces give it authority.

Design principles:

1. **Content first:** writing, posters and research remain the visual focus.
2. **Editorial structure:** strong typography, clear rhythm and restrained cards.
3. **Motion with purpose:** arcs and angled details reference the logo without decorating every surface.
4. **Two complementary moods:** light reading surfaces and dark, high-impact brand moments.
5. **Accessible by default:** text contrast, keyboard focus and reduced-motion support are part of the design.

## 2. Brand assets

### 2.1 Logo usage

- Use the full circular logo in the header, footer, About page and social previews.
- Prepare a simplified `A` mark for favicon and compact mobile contexts.
- The default header mark should be approximately 36-44 px tall on desktop and 32-36 px on mobile.
- Maintain clear space equal to at least one quarter of the logo diameter.
- Do not place the detailed logo below 28 px; the aircraft and orbit lose clarity.
- Use the supplied light-background version on `Paper` surfaces.
- Create a transparent-background asset before implementation. Do not use the white square as part of the logo.
- A future monochrome light version is required for dark backgrounds.
- Do not stretch, rotate, recolour individual parts, add shadows or place text over the mark.

### 2.2 Visual motif

The logo's orbit becomes a reusable **flight-path motif**:

- one thin curved line behind the Home hero;
- a short diagonal or curved purple rule above major section headings;
- a subtle path transition between selected Home sections;
- an arc-shaped crop or corner treatment on one featured image.

Use at most one strong motif per viewport. It must never cross body text or interactive controls.

## 3. Colour system

### 3.1 Supplied brand palette

| Token | Hex | Role |
|---|---|---|
| Ink | `#0D0D11` | Primary text, footer, dark hero and strong borders |
| Night | `#1A1822` | Elevated dark surface, admin navigation, dark cards |
| Violet | `#7B2CBF` | Brand accent, active states, links on light surfaces |
| Lilac | `#C77DFF` | Highlight, focus ring and accent on dark surfaces |
| Paper | `#F8F9FA` | Main page background and light text on dark surfaces |

### 3.2 Supporting neutrals

The supplied palette needs neutral steps for borders, muted copy and layered surfaces.

| Token | Hex | Role |
|---|---|---|
| White | `#FFFFFF` | Article/card surface |
| Mist | `#F1EEF5` | Soft section background |
| Line | `#DED9E5` | Borders and separators |
| Muted | `#625D6B` | Secondary text on light backgrounds |
| Night muted | `#B9B2C3` | Secondary text on dark backgrounds |
| Violet dark | `#5A178F` | Hover/pressed state and small text links |
| Success | `#18794E` | Confirmations and published state |
| Warning | `#9A6700` | Warnings and draft state |
| Danger | `#B42318` | Destructive actions and errors |

### 3.3 Gradients

Use gradients only for high-impact brand areas:

```css
--gradient-brand: linear-gradient(135deg, #5A178F 0%, #7B2CBF 48%, #C77DFF 100%);
--gradient-night: linear-gradient(135deg, #0D0D11 0%, #1A1822 62%, #30103F 100%);
--gradient-soft: linear-gradient(135deg, #F8F9FA 0%, #F1E8FA 100%);
```

Do not put long text directly on the full violet-to-lilac gradient.

### 3.4 Contrast rules

- `Ink` on `Paper`: 18.40:1 - approved for all text.
- `Paper` on `Night`: 16.63:1 - approved for all text.
- `Paper` on `Violet`: 6.74:1 - approved for normal text and buttons.
- `Lilac` on `Night`: 6.52:1 - approved for normal text and focus states.
- `Ink` on `Lilac`: 7.21:1 - approved for normal text.
- Do not use `Lilac` text on `Paper` or `Violet` text on `Ink`; those combinations fail normal-text contrast.
- Status must always combine colour with an icon and text label.

Recommended colour balance on public pages:

- 65% Paper/White
- 20% Ink/Night
- 10% Violet
- 5% Lilac and supporting states

## 4. Typography

### 4.1 Type pairing

- **Display and article headings:** `Newsreader`, Georgia fallback. This gives the portfolio an editorial voice without competing with the angular logo.
- **Navigation, labels, body and admin:** `Inter`, system-ui fallback. This keeps controls and longer reading clean.

Fonts should be self-hosted as optimized WOFF2 files through Vercel, not loaded from a third-party font API.

### 4.2 Type scale

| Style | Desktop | Mobile | Weight/line height |
|---|---:|---:|---|
| Display XL | 72 px | 44 px | 600 / 0.98 |
| H1 | 56 px | 38 px | 600 / 1.05 |
| H2 | 40 px | 30 px | 600 / 1.12 |
| H3 | 28 px | 24 px | 600 / 1.2 |
| Lead | 21 px | 18 px | 400 / 1.55 |
| Body | 17 px | 16 px | 400 / 1.7 |
| Small | 14 px | 14 px | 500 / 1.5 |
| Label | 12 px | 12 px | 650 / 1.3; 0.08em tracking |

Article body width is 65-72 characters. Avoid full-width prose.

## 5. Spacing, grid and shape

### 5.1 Grid

- Maximum content shell: 1280 px.
- Wide media shell: up to 1440 px where appropriate.
- Desktop: 12 columns, 24 px gutters.
- Tablet: 8 columns, 20 px gutters.
- Mobile: 4 columns, 16 px gutters.
- Horizontal page padding: 64 px desktop, 32 px tablet, 20 px mobile.
- Section spacing: 112-144 px desktop, 72-96 px tablet, 56-72 px mobile.

### 5.2 Shape language

- Cards: 16 px radius.
- Inputs and small controls: 10-12 px radius.
- Pills/tags: fully rounded.
- Strong media frame: 20-24 px radius or one clipped diagonal corner.
- Do not use large pill shapes for ordinary rectangular buttons.
- Shadows remain subtle: a border plus low-opacity elevation, not floating glass panels.

## 6. Global public layout

### 6.1 Header

Desktop header:

```text
[Logo + Anugraha Pillai]   Work   Writing   Research   Services   About   [Let's talk]
```

- Sticky after the hero begins leaving the viewport.
- 76 px initial height; 64 px compact sticky height.
- Paper background with slight translucency and blur only while sticky.
- `Work` opens or links to Posters; `Writing` links to Blogs.
- Active navigation uses a Violet underline/flight-path stroke, not a filled pill.
- Contact is the single primary header action.

Mobile header:

- Logo/wordmark left, labelled menu button right.
- Full-height menu panel on `Night`, with large Paper links and Lilac active state.
- Contact action remains visible inside the menu.
- Menu traps focus, closes on Escape and restores focus to its trigger.

### 6.2 Footer

- `Night` background with Paper text.
- Large closing line: **"Ideas, stories and journeys worth sharing."**
- Contact CTA, navigation, social links, email and copyright.
- A restrained orbit line may frame the logo once.
- No multi-column clutter beyond four compact groups.

## 7. Home page

Recommended sequence:

```text
Header
Editorial hero
Featured story
Latest writing
Selected posters
Research and analysis
Services
About introduction
Contact call-to-action
Footer
```

### 7.1 Hero

Use an asymmetric split rather than a conventional centered portfolio hero.

Desktop:

```text
┌────────────────────────────────────────────────────────────────────┐
│ Eyebrow                                                            │
│ Ideas, journeys and              [Portrait or featured visual]     │
│ perspectives that move.          [with subtle orbit crop]          │
│                                                                    │
│ Short positioning statement                                        │
│ [Explore the work]  [About Anugraha]                               │
│                                      Latest dispatch / location     │
└────────────────────────────────────────────────────────────────────┘
```

- Left content occupies 7 columns; visual occupies 5.
- Use a Paper or soft-gradient background, not a dark full-screen hero.
- Display text in Ink with one Violet italic/emphasized phrase.
- The logo-inspired path enters behind the visual and exits at the section edge.
- Hero height should feel generous but keep the next section visible at 900 px desktop height.

Mobile:

- Copy first, visual second.
- CTAs stack only below approximately 380 px; otherwise remain side-by-side.
- Remove the large decorative orbit and retain one short curved accent.

### 7.2 Featured story

- One editorial feature at a time.
- Large landscape image with category, title, excerpt, reading time and arrow link.
- Alternate image/text position only when content supports it; do not create a carousel.

### 7.3 Latest writing

- Section heading plus link to all writing.
- One lead story across 7 columns and two compact stories stacked across 5 columns.
- Mobile becomes one vertical list with the lead image first.
- Avoid a repetitive three-identical-card grid on the Home page.

### 7.4 Selected posters

- Dark `Night` band creates a gallery pause between reading-heavy sections.
- Use a 12-column editorial collage: one large portrait poster and two or three supporting pieces.
- Preserve each poster's aspect ratio; do not crop artwork unless the admin explicitly selects a crop.
- Hover reveals title/tags; keyboard focus provides the same information persistently enough to operate.

### 7.5 Research

- Light section with numbered entries (`01`, `02`, `03`) rather than image-heavy cards.
- Show topic, title, short summary, date and sources/document indicator.
- This distinguishes analysis from blog content.

### 7.6 Services

- Maximum four services in a two-column grid.
- Each service uses a number, title, concise outcome and contact link.
- Use outlines and typography instead of generic stock icons.

### 7.7 About introduction

- Compact portrait plus personal statement and highlights.
- Keep the complete biography on the About page.

### 7.8 Contact CTA

- Violet background with Paper text or Night background with Lilac highlight.
- One sentence, email/contact button and optional location/time-zone note.
- Do not embed the entire contact form on Home.

## 8. Blogs / Writing

### Listing page

- Intro header with title, short description and total/updated context.
- Featured article spans the full content shell.
- Search input and horizontally scrollable category filters follow the feature.
- Remaining content uses a 3-column desktop grid, 2-column tablet grid and 1-column mobile list.
- Cards show cover, category, title, excerpt, date and reading time.
- Use a `Load more` button/cursor pagination rather than infinite scroll.
- Filters are reflected in the URL and have clear empty/reset states.

### Article detail

```text
Breadcrumb / category
Title
Deck/excerpt
Date · reading time · share
Hero media
Article body (8 columns)
Optional contents rail (3 columns, long articles only)
Sources / tags
Previous-next and related work
```

- Body stays on White/Paper; no gradient behind long text.
- First paragraph may use a lead style; no decorative drop cap by default.
- Headings have anchor links.
- Share controls use accessible labelled buttons.
- Sticky contents rail appears only when at least four meaningful headings exist.

## 9. Posters / Visual Work

### Gallery

- Page opens with a short editorial statement, not an oversized hero.
- Use a masonry-like visual rhythm implemented with stable CSS columns/grid and known dimensions to prevent layout shift.
- Filters: topic/tag and year only at launch.
- Artwork remains the dominant surface; metadata is minimal.
- Poster cards have no forced uniform crop.

### Poster detail/lightbox

- Dark viewing stage using `Ink`.
- Artwork centered with safe breathing room and zoom/full-view control where useful.
- Metadata panel contains title, caption, date, tags and alt description.
- Download appears only when explicitly enabled by the admin.
- Previous/next keyboard navigation must not override normal screen-reader commands.

## 10. Research and Analysis

### Listing

- Structured editorial index rather than blog-card duplication.
- Desktop row: index number, topic/title, summary, date, reading/document type.
- Optional cover image appears only on the featured item.
- Filters for topic and year; keyword search uses the shared local index.

### Detail

- Same readable article foundation as Blogs.
- Add a visible research metadata block: author, published date, updated date, topics and external/document link.
- Sources/footnotes receive numbered styling and a dedicated end section.
- External documents open with a clear label; never disguise a download as ordinary navigation.

## 11. Services

- Intro focuses on how Anugraha can help rather than a generic page title.
- Each service section contains outcome, scope, suitable audience and CTA.
- Use alternating light surfaces and one restrained Violet accent panel.
- Finish with enquiry guidance and the contact CTA.
- Do not present pricing unless the owner supplies and maintains it.

## 12. About

Desktop composition:

- Opening 7/5 split: statement left, portrait right.
- Biography uses a narrow editorial column.
- Highlights/milestones form a simple vertical timeline.
- Skills and interests use grouped text lists, not proficiency bars.
- Social/professional links and contact CTA close the page.

The aircraft logo suggests movement, but the page must explain the broader professional identity so visitors do not assume the portfolio is exclusively a travel brand.

## 13. Contact

- Two-column desktop layout: invitation/contact details left, form right.
- Mobile places invitation and expected response time before the form.
- Fields: name, email, subject, message and consent.
- Labels remain visible; placeholders are examples only.
- Inline validation appears after interaction or submit, never on initial render.
- Submit button shows idle, sending, success and retry states.
- Success replaces the form with a clear confirmation while preserving a `Send another` option.
- Include privacy/retention summary near consent.
- Do not expose the recipient address in source when avoiding scraping is important.

## 14. Search and utility states

- Desktop search opens as a focused overlay; mobile search can use a dedicated page/panel.
- Results are grouped into Writing, Posters and Research.
- Empty state offers reset filters and section shortcuts.
- Loading uses stable skeleton shapes matching final content.
- Errors explain the next action without exposing system details.
- 404 page uses a minimal flight-path illustration and links to Home, Writing and Posters.

## 15. Admin design

The admin should be quieter and denser than the public site. It uses the same tokens without reproducing the public editorial layouts.

### 15.1 Shell

Desktop:

```text
┌──────────────┬─────────────────────────────────────────────────────┐
│ Night sidebar│ Page title                         [Preview] [New]   │
│ Dashboard    ├─────────────────────────────────────────────────────┤
│ Writing      │ Content / table / editor                            │
│ Posters      │                                                     │
│ Research     │                                                     │
│ Services     │                                                     │
│ Pages        │                                                     │
│ Settings     │                                                     │
└──────────────┴─────────────────────────────────────────────────────┘
```

- Sidebar: 248 px expanded, `Night` background.
- Main surface: `Paper`; content max width around 1440 px.
- Tablet sidebar collapses; mobile uses a drawer.
- Persistent top action area shows save state and Preview/Publish actions.

### 15.2 Dashboard

- Primary quick actions: New Blog, New Poster, New Research and Edit Home.
- Show only useful summaries: drafts needing action, recent publications and failed contact-mail health if available.
- Avoid live counters that require full collection reads.

### 15.3 Content lists

- Desktop uses a compact table; mobile uses summary rows/cards.
- Columns: title, type/category, status, publish date, updated date and actions.
- Cursor pagination with 20 items per page.
- Filters are explicit and retained in the URL.
- Row menus contain duplicate/archive/delete. Permanent deletion is visually separated and available
  only after recent authentication, MFA and dependency checks; archival is the recommended default.

### 15.4 Editor

- Main editor occupies approximately 70%; settings rail 30%.
- Sticky action bar: save status, Preview, Save draft and Publish.
- Tabs/sections: Content, Media, SEO and Publishing.
- Slug, alt text and SEO previews are visible before publishing.
- Unsaved navigation opens an accessible confirmation dialog.
- Image upload reports pre-compression and final size so Storage use is transparent.
- Media shows quarantine, processing, approved and failed states. Publish stays disabled until trusted
  server processing approves every referenced asset.
- A published slug change explains redirect and link impact and requires explicit confirmation.
- Draft preview remains inside an authenticated session and is not presented as a shareable public URL.

### 15.5 Status styling

- Draft: Warning icon + `Draft`.
- Publication pending: progress icon + `Publication pending` and safe retry guidance.
- Live: Success icon + `Live` only after delivery verification.
- Publication failed: Danger icon + `Publication failed` and idempotent retry action.
- Archived: neutral icon + `Archived`.
- Failed/attention: Danger icon + descriptive label.

## 16. Components

Public component baseline:

- Header and mobile navigation
- Footer
- Primary, secondary, text and icon buttons
- Section heading
- Feature story
- Article card and compact story row
- Poster tile and accessible lightbox
- Research index row
- Service block
- Tag/category chip
- Search field, filter group and pagination/load-more
- Rich article renderer
- Contact form
- Empty, loading, error and 404 states

Admin component baseline:

- Admin shell/sidebar
- Data table and mobile content row
- Status badge
- Rich/structured editor
- Media uploader and image metadata form
- SEO preview
- Confirmation dialog
- Toast plus persistent inline error
- Save/publish action bar
- MFA enrollment/recovery and active-session controls

## 17. Interaction and motion

Motion communicates travel and editorial rhythm without delaying content.

### 17.1 Motion tokens

| Purpose | Duration | Easing |
|---|---:|---|
| Immediate feedback | 100 ms | ease-out |
| Hover/focus | 180 ms | ease-out |
| Component state | 280-320 ms | `cubic-bezier(.22, 1, .36, 1)` |
| Section reveal | 550-700 ms | `cubic-bezier(.22, 1, .36, 1)` |
| Full hero sequence | 700-1000 ms total | staged ease-out |

### 17.2 Entrance and scroll motion

- Header fades down by 8 px.
- Hero eyebrow, headline, text and actions reveal with a 70-100 ms stagger.
- The flight path draws once after the copy is readable; the aircraft may travel 18-24 px along it.
- Section headings reveal with opacity and no more than 20 px movement.
- Card groups use a maximum 60 ms stagger so later cards do not feel delayed.
- Large images may use a masked reveal and settle from scale 1.02 to 1.
- Scroll reveals trigger once rather than replaying during small scroll changes.

### 17.3 Micro-interactions

- Navigation underline follows the active or hovered item.
- Button arrows translate 3-4 px; primary buttons may use a restrained background sweep.
- Article pages show a thin reading-progress line.
- Filter changes cross-fade results without moving keyboard focus.
- Poster images scale no more than 1.02 while metadata reveals in a quiet bottom layer.
- Accordion icons rotate while panel height and opacity transition together.
- Card hover uses a colour/border change and at most 2 px lift.
- Poster hover never obscures the artwork completely.

### 17.4 Page transitions and limits

- Route content may fade/slide over 180-260 ms while preserving browser history and focus behavior.
- Shared-image transitions are optional and used only when stable.
- Animate transforms and opacity; avoid layout-heavy animation.
- Do not use scroll-jacking, autoplay background video, continuous WebGL/canvas effects or a trailing custom cursor.
- Do not use a blocking preloader. A loading mark appears only for genuine unresolved navigation.
- Never delay navigation for animation.

### 17.5 Reduced motion

Under `prefers-reduced-motion: reduce`, remove parallax, stagger, path travel and smooth scrolling; stop looping decoration; replace movement with immediate visibility or a short opacity change. State feedback remains available.

## 18. Responsive behavior

Primary test widths: 360, 768, 1024 and 1440 px.

- No essential interaction depends on hover.
- Touch targets are at least 44 by 44 px.
- Filters scroll horizontally only when wrapping would become confusing.
- Tables become labelled summary rows; they do not simply overflow the viewport.
- Article typography and media use fluid sizing with safe minimum/maximum values.
- Decorative logo motifs simplify or disappear below tablet width.
- Sticky elements must not consume excessive mobile height.

## 19. Accessibility requirements

- Meet WCAG 2.2 AA for applicable public and admin journeys.
- Provide one visible H1 and logical heading order per page.
- Include a skip-to-content link.
- Use a 2-3 px Lilac focus ring with sufficient offset on dark surfaces; Violet dark/Ink focus treatment on light surfaces.
- Keep visible labels for every form input.
- Dialogs trap focus and return it to their trigger.
- Lightbox, menu and search overlay close with Escape.
- Posters require meaningful alt text; decorative motifs use empty alt text.
- Do not put text inside the logo image as the only source of the brand name.
- Announce form and publishing states through appropriate live regions.

## 20. Design acceptance checklist

- All public and admin screens are represented at mobile and desktop widths.
- Palette usage follows the approved contrast pairings.
- Logo assets include transparent full mark, compact mark and monochrome dark-background version.
- Long article pages remain comfortable at 200% zoom.
- Keyboard navigation covers menus, filters, editor dialogs and poster lightbox.
- Reduced-motion mode removes decorative movement.
- Images have explicit aspect ratio/dimensions to prevent layout shift.
- Empty, loading, error, success and destructive-confirmation states are designed.
- Admin actions show save/publish state clearly.
- Security screens cover MFA, recovery codes, session revocation and non-enumerating reset feedback.
- Preview, media-processing, redirect-impact and pending/live/failed publication states are designed.
- Final implementation is checked at 360, 768, 1024 and 1440 px.

## 21. Layout decisions for approval

1. **Home hero:** asymmetric light editorial hero (recommended) or immersive dark hero.
2. **Home writing layout:** one lead plus two compact stories (recommended) or uniform three-card grid.
3. **Poster section:** dark editorial collage (recommended) or light masonry continuation.
4. **Primary navigation labels:** `Work / Writing / Research` (recommended) or literal `Posters / Blogs / Research`.
5. **Article typography:** Newsreader + Inter (recommended) or a single sans-serif family throughout.
6. **Logo use:** detailed logo with simplified favicon (recommended); final transparent and monochrome exports are still required.

## 22. Open discussion and pending inputs

Recommended baseline for approval:

1. Use the asymmetric light editorial hero because the supplied detailed logo is currently optimized for a white background.
2. Use one lead story plus two compact stories instead of a uniform card grid.
3. Use the dark editorial poster collage as the strongest immersive moment on Home.
4. Use literal navigation labels: Posters / Blogs / Research.
5. Use Newsreader + Inter and self-host both fonts.
6. Use alternating art-directed light/dark sections without a theme toggle in version one.

Inputs still needed:

- transparent full logo, simplified small mark and monochrome reverse mark;
- approved portrait and launch imagery;
- approved professional title/tagline;
- confirmation of whether poster downloads need higher-resolution files;
- screenshots or a description of any exact interaction from the requested inspiration site that must be reflected, because the live domain was unavailable in the current browser environment.
