# Creative Web Design — Reference Patterns

Patterns extracted from this project's conventions. Adapt class names and values per project.

## Page shell

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="...">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="site-header" role="banner">...</header>
  <main>...</main>
  <footer>...</footer>
</body>
</html>
```

## Section block

```html
<section id="projects" aria-labelledby="projects-heading">
  <div class="container">
    <span class="section-label">Our Portfolio</span>
    <h2 id="projects-heading" class="section-title">Major Projects</h2>
    <p class="section-subtitle">Supporting one-liner centered, max ~600px.</p>
    <div class="projects-grid">...</div>
  </div>
</section>
```

```css
section { padding: var(--space-section, 5rem) 0; }
.container {
  width: 100%;
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 1.5rem;
}
.section-title { text-align: center; margin-bottom: 0.75rem; }
.section-subtitle {
  text-align: center;
  color: var(--color-text-muted);
  max-width: 600px;
  margin: 0 auto 3rem;
}
```

## Card grid

```html
<article class="project-card">
  <h3>Project Name</h3>
  <p>Description text.</p>
  <span class="badge badge-completed">Status</span>
</article>
```

```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}
.project-card {
  background: var(--color-white);
  border-radius: var(--radius);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition), box-shadow var(--transition);
}
.project-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}
```

## Button pair

```html
<a href="#about" class="btn btn-primary">Discover More</a>
<a href="#projects" class="btn btn-outline">Our Projects</a>
```

## Navigation hover

```css
.main-nav a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width var(--transition);
}
.main-nav a:hover::after { width: 100%; }
```

## Hero with texture overlay

```css
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary-light));
}
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.5;
  /* subtle SVG pattern at ~4% white opacity */
}
```

## Status badges

```css
.badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.85rem;
  border-radius: 100px;
  letter-spacing: 0.03em;
}
.badge-completed { background: #e8f5e9; color: #2e7d32; }
.badge-review    { background: #fff3e0; color: #e65100; }
.badge-design    { background: #e3f2fd; color: #1565c0; }
```

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Responsive breakpoints

| Breakpoint | Typical use |
|------------|-------------|
| `max-width: 768px` | Stack grids, show mobile nav toggle |
| `max-width: 480px` | Tighter padding, single-column cards |

## JSON-LD (local business)

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Company Name",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "...",
    "addressLocality": "...",
    "addressCountry": "MM"
  }
}
```

## Framework mapping

| Plain HTML/CSS | React / Vue | WordPress |
|----------------|-------------|-----------|
| `:root` tokens | CSS modules or global CSS | `theme.json` or block `style.css` |
| `.container` | Layout component | Group block + container class |
| `.section-label` | `<SectionLabel>` atom | Custom block attribute |
| Semantic `<section>` | Page section components | Block wrapper with `tagName` |
