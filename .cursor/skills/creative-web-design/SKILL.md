---
name: creative-web-design
description: Guides creative yet minimal web design for landing pages and application UIs—typography, layout, color systems, motion, accessibility, and SEO-ready structure. Use when building or refining websites, landing pages, hero sections, page layouts, UI components, visual hierarchy, or when the user mentions web design, UI polish, or creative front-end work.
---

# Creative Web Design

## Design philosophy

**Minimal first.** Whitespace, clear hierarchy, and restraint beat decoration. Creativity comes from composition, typography, and purposeful detail—not clutter.

| Principle | Do | Avoid |
|-----------|-----|-------|
| Hierarchy | One focal point per section; 2–3 type sizes per block | Competing headlines, dense walls of text |
| Color | 1 primary + 1 accent + neutrals; 60-30-10 rule | Rainbow palettes, low-contrast text |
| Motion | Subtle transitions (200–400ms); respect `prefers-reduced-motion` | Auto-playing carousels, parallax overload |
| Layout | Generous padding; max-width containers (~1100–1200px) | Edge-to-edge cramped content |
| Imagery | High-quality, purposeful, lazy-loaded | Stock-photo filler, unoptimized assets |

Adapt tone to brand (corporate, editorial, product) but keep the minimal baseline.

## Before writing code

1. **Read existing code** — match file structure, naming, CSS approach (plain CSS, Tailwind, modules), and component patterns.
2. **Identify intent** — marketing page, dashboard, form flow, or component library piece.
3. **Define hierarchy** — primary action, secondary info, supporting detail.
4. **Choose type pairing** — serif display + sans body, or single sans family with weight contrast. Limit to 2 font families.
5. **Set tokens** — define CSS custom properties before styling components.

## Design tokens (start here)

```css
:root {
  /* Color — derive from brand; ensure WCAG AA contrast (4.5:1 body, 3:1 large text) */
  --color-primary: #4F7954;
  --color-primary-dark: #3d5f42;
  --color-accent: #c8a96e;
  --color-bg: #ffffff;
  --color-bg-alt: #f7f5f0;
  --color-text: #2c2c2c;
  --color-text-muted: #666666;

  /* Typography */
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'Lato', system-ui, sans-serif;

  /* Spacing & rhythm */
  --space-section: clamp(4rem, 8vw, 6rem);
  --container: 1200px;
  --radius: 8px;

  /* Elevation & motion */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --transition: 0.3s ease;
}
```

Replace values per project. Never hardcode colors/fonts in components when tokens exist.

## Typography

- **Headings**: `clamp()` for fluid scale; `line-height: 1.2–1.3`
- **Body**: `line-height: 1.6–1.75`; max line length ~65ch
- **Labels**: uppercase + letter-spacing for section labels (subtle, not shouty)
- **Load fonts**: `preconnect` to Google Fonts or self-host; `font-display: swap`

```css
h1 { font-size: clamp(2rem, 5vw, 3rem); }
h2 { font-size: clamp(1.75rem, 4vw, 2.5rem); }
.section-label {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
```

## Layout patterns

### Landing page sections

Standard flow: Hero → About → Features/Projects → Social proof → CTA → Contact → Footer.

Each section uses:
```html
<section id="about" aria-labelledby="about-heading">
  <div class="container">
    <span class="section-label">Who We Are</span>
    <h2 id="about-heading" class="section-title">About Us</h2>
    <p class="section-subtitle">One-line value proposition.</p>
    <!-- content -->
  </div>
</section>
```

### Grids

- Cards: CSS Grid with `repeat(auto-fit, minmax(280px, 1fr))`
- Two-column split: `grid-template-columns: 1fr 1fr` → stack at `max-width: 768px`
- Consistent gap: `1.5rem` mobile, `2rem` desktop

### Hero

- Full viewport height (`min-height: 100vh`) or 70vh for app UIs
- Centered content, max-width ~800px
- Primary + secondary CTA; clear headline under 10 words when possible

## Component guidelines

| Component | Minimal approach |
|-----------|------------------|
| Buttons | Solid primary + outline secondary; 2px border; padding `0.85rem 2rem` |
| Cards | Light shadow or border; no heavy gradients; badge for status |
| Navigation | Fixed header, subtle shadow on scroll; underline hover (not background pills) |
| Forms | Large touch targets (44px min); visible focus rings; inline validation |
| Images | `width`/`height` attributes; `loading="lazy"`; meaningful `alt` text |

## Accessibility (non-negotiable)

- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- `aria-labelledby` on sections; `aria-label` on icon-only controls
- Keyboard-navigable; visible `:focus-visible` styles
- Color is never the only indicator of state
- `prefers-reduced-motion: reduce` disables animations

## SEO & performance

Include on every page:
- `<title>`, `<meta name="description">`, Open Graph tags
- JSON-LD structured data when applicable (Organization, LocalBusiness, etc.)
- `lang` attribute on `<html>`; `hreflang` for multi-region sites

Performance:
- Preconnect font origins; subset fonts
- Lazy-load below-fold images
- Avoid layout shift: explicit image dimensions
- Minimize custom JS; prefer CSS for interactions

## Application UIs

Same minimal principles apply:
- **Dashboard**: sidebar + content area; muted backgrounds; accent only on active states
- **Forms**: single-column on mobile; grouped fields with clear labels
- **Tables**: zebra optional; prioritize scanability over decoration
- **Empty states**: illustration or icon + one-line message + action
- **Frameworks** (React, Vue, WP blocks): extract reusable tokens; keep components small

## Creative touches (use sparingly)

Allowed when they serve hierarchy or brand:
- Subtle gradient backgrounds (2-stop, same hue family)
- SVG texture overlays at low opacity (~4%)
- Micro-interactions: nav underline grow, card lift on hover (`translateY(-4px)`)
- Stat blocks or pull quotes for emphasis
- Serif/sans contrast for editorial feel

Not allowed in minimal mode:
- Glassmorphism stacks, neon glows, 3D transforms
- Multiple animation libraries on one page
- Decorative elements with no informational purpose

## Workflow

```
Design task received
  → Read codebase & brand context
  → Define tokens (if missing)
  → Structure HTML semantically
  → Style mobile-first
  → Add subtle motion + focus states
  → Verify contrast, SEO meta, performance
  → Test at 375px, 768px, 1200px
```

## Quality checklist

Before finishing:

- [ ] Visual hierarchy is obvious in a 3-second scan
- [ ] No horizontal scroll on mobile
- [ ] Text contrast passes WCAG AA
- [ ] All images have alt text; decorative images use `aria-hidden`
- [ ] Focus states visible for keyboard users
- [ ] Section spacing is consistent (`--space-section`)
- [ ] No inline styles unless truly one-off
- [ ] Meta tags and semantic structure in place
- [ ] Changes match existing project conventions

## Additional resources

- Section HTML/CSS patterns: [reference.md](reference.md)
- Project example: `index.html` + `css/style.css` in this repo
