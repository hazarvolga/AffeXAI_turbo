# @affex/design-tokens

Design tokens — Tailwind preset, CSS variables, and font config for affexaiFactory.

## Usage

### Tailwind Config

In your `tailwind.config.ts`:

```typescript
import affexPreset from "@affex/design-tokens/tailwind";

export default {
  presets: [affexPreset],
  content: ["./src/**/*.{ts,tsx}"],
};
```

### CSS Variables

In your global CSS:

```css
@import "@affex/design-tokens/css";
```