# SpinRec - Design System & Visual Guidelines

## Brand Identity

- **Product**: SpinRec - Artist promotion and DJ pool platform
- **Vibe**: Premium, modern, music-tech
- **Audience**: Independent artists seeking DJ exposure

## Color Palette

| Role | Light Mode | Dark Mode |
|------|-----------|-----------|
| Primary | #7c3aed (violet-600) | #7c3aed |
| Secondary | #4f46e5 (indigo-600) | #4f46e5 |
| Accent | #8b5cf6 (violet-500) | #8b5cf6 |
| Background | #ffffff | #0a0a0a |
| Surface | #fafafa (zinc-50) | #09090b (zinc-950) |
| Text Primary | #18181b (zinc-900) | #fafafa |
| Text Muted | #71717a (zinc-500) | #a1a1aa (zinc-400) |
| Border | #e4e4e7 (zinc-200) | #27272a (zinc-800) |

## Typography

- **Font**: Geist Sans (via next/font/google)
- **Headings**: Bold, tight tracking
- **Body**: Regular weight, relaxed line-height
- **Captions**: Uppercase, wide tracking

## Component Patterns

### Cards
- Rounded corners: rounded-2xl (16px)
- Border: 1px zinc-200 / zinc-800
- Hover: subtle violet border tint
- Background: white / zinc-950

### Buttons
- Pill shape: rounded-full
- Primary: gradient violet to indigo, white text
- Secondary: zinc-900 bg, white text
- Outline: zinc border, transparent bg

### Sections
- Padding: py-24 sm:py-32
- Max width: max-w-6xl mx-auto
- Alternating bg: white / zinc-50 / zinc-950

### Gradients
- Hero glow: from-violet-600 to-indigo-600
- CTA block: from-violet-600 via-indigo-600 to-purple-700
- Accent blobs: bg-violet-300/20 rounded-full blur-3xl

## Layout Principles

- Mobile-first: All grids start single-column, expand on md/lg breakpoints
- Centered content: max-width containers, centered text in hero/CTA sections
- Whitespace: Generous padding between sections (96px+)
- Contrast: Dark text on light bg, light text on dark bg sections alternating

## Accessibility

- All interactive elements have visible hover/focus states
- WCAG AA contrast ratios on all text
- Semantic HTML: sections, headings h1-h3, footer
- ARIA labels on icon-only links
