# DESIGN.md — affexaiFactory Design Language

Based on Google's design.md principles, adapted for Solo Founder Engineering OS.

## Design Principles

1. **Clarity over cleverness** — Code is read 10x more than written
2. **Consistency over novelty** — Use existing patterns before inventing new ones
3. **Composition over inheritance** — Compose in apps, not in core packages
4. **Explicit over implicit** — No magic, no surprise side effects
5. **Small over large** — Prefer many small, focused packages over large do-everything ones

## Color Palette

Defined in `@affex/design-tokens/tailwind/preset.ts` and `@affex/design-tokens/css/variables.css`.

### Primary (Affex Blue)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-primary-50` | `#eff6ff` | `#1e3a5f` | Backgrounds |
| `--color-primary-500` | `#3b82f6` | `#3b82f6` | Primary actions |
| `--color-primary-700` | `#1d4ed8` | `#60a5fa` | Primary text |
| `--color-primary-900` | `#1e3a8a` | `#93c5fd` | Headings |

### Neutral

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-neutral-50` | `#f8fafc` | `#0f172a` | Page background |
| `--color-neutral-100` | `#f1f5f9` | `#1e293b` | Card background |
| `--color-neutral-500` | `#64748b` | `#94a3b8` | Secondary text |
| `--color-neutral-900` | `#0f172a` | `#f1f5f9` | Primary text |

### Semantic

| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#10b981` | Success states |
| `--color-warning` | `#f59e0b` | Warning states |
| `--color-error` | `#ef4444` | Error states |
| `--color-info` | `#3b82f6` | Info states |

## Typography

| Role | Font | Size | Weight | Line Height |
|------|------|------|--------|-------------|
| Heading 1 | Inter | 2rem (32px) | 700 | 1.2 |
| Heading 2 | Inter | 1.5rem (24px) | 600 | 1.3 |
| Heading 3 | Inter | 1.25rem (20px) | 600 | 1.4 |
| Body | Inter | 1rem (16px) | 400 | 1.6 |
| Small | Inter | 0.875rem (14px) | 400 | 1.5 |
| Code | JetBrains Mono | 0.875rem (14px) | 400 | 1.5 |

## Spacing

Uses 4px base unit. All spacing must be a multiple of 4px.

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-1` | 4px | Inline gaps |
| `--spacing-2` | 8px | Tight padding |
| `--spacing-3` | 12px | Compact gaps |
| `--spacing-4` | 16px | Standard padding |
| `--spacing-6` | 24px | Section gaps |
| `--spacing-8` | 32px | Large gaps |
| `--spacing-12` | 48px | Page sections |
| `--spacing-16` | 64px | Major sections |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Tags, badges |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards |
| `--radius-xl` | 16px | Modals |
| `--radius-full` | 9999px | Pills, avatars |

## Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `--transition-fast` | 150ms | ease-out | Hover, focus |
| `--transition-normal` | 250ms | ease-in-out | Expand, collapse |
| `--transition-slow` | 400ms | ease-in-out | Page transitions |

## Accessibility

- All interactive elements MUST have visible focus rings
- Color contrast ratio minimum 4.5:1 (AA)
- All form inputs MUST have associated labels
- All images MUST have alt text
- All pages MUST pass Lighthouse accessibility audit >90
- Keyboard navigation MUST work for all interactive elements
- Motion MUST respect `prefers-reduced-motion`