# Prototype primitives — required reading for every agent building or reviewing prototypes

This is a shared reference for `ui-designer`, `design-keeper`, `accessibility-edge-reviewer`, and `ux-motion`. Read it before doing any prototype work in `Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/`.

The file lives in `.claude/agents/` so it ships with the agent definitions — any future contributor or freshly-spawned agent finds it immediately.

---

## The single most important rule

**Prototypes in this repo run on Tailwind v4 with a strict `@source inline()` safelist in `src/styles/app.css`. Classes outside that list silently fail to compile in dev mode.** No build error, no console warning — the class just doesn't render.

Symptoms a user will see when this happens:
- Icons that "don't show up" (actually rendering at `currentColor` = transparent or inherited grey)
- Notice / Chip components with no background or border colour (default white-on-white)
- Mysterious lavender or navy tints where amber or teal should be

**Default rule for prototypes**: for any design-system colour, use inline `style={{ color | backgroundColor | borderColor }}` with an explicit hex (table below). Reserve Tailwind utilities for layout (`flex`, `gap-*`, `px-*`, `rounded-*`) — they always work because they're commonly seen.

Production code can still use the utility classes — production builds purge differently. But prototypes only ever run in dev mode, so prototypes pay the safelist cost.

---

## Uncapped colour hex reference

Source of truth: `src/styles/themes/uncapped.css`.

### Brand / success (they are the same teal — "success" in this design system is brand, not green)

| Token | Hex | Use |
|---|---|---|
| brand-100 / status-background-success | `#eaf6f6` | Success chip bg, success container bg, "What happens next?" header bg |
| brand-300 / status-border-success | `#c1e5e6` | Success chip border, brand container border |
| brand-400 | `#a5d3d4` | Light teal — chart "Daily Payout" stripe |
| brand-500 / accent-brand-contrast | `#1ebdc0` | Brand cyan — icon-on-light, chart line |
| brand-600 / text-link / text-success | `#128081` | Darker teal — success-state checkmark icons, link text |
| brand-800 | `#004b4d` | Hero gradient base |

### Accents (icon container family — bg / border / icon)

| Accent | -subtle (bg) | -border | -contrast (icon) |
|---|---|---|---|
| accent-2 (amber/orange) | `#fff0d6` | `#ffd68f` | `#ffac30` |
| accent-3 (blue) | `#e5f5ff` | `#c0e4fc` | `#37a7f1` |
| accent-4 (green) | `#e7f8eb` | `#c9e9d0` | `#33c655` |
| accent-6 (violet) | `#f4f0fe` | `#e0d5fb` | `#9a73f6` |
| accent-9 (indigo) | `#f0f2fe` | `#d5dbfb` | `#7286f6` |
| accent-11 (magenta) | `#fbecfd` | `#f4ccfa` | `#cf5be1` |

### Status (chip / notice)

| Token | Hex |
|---|---|
| status-background-warning / warning-100 | `#fff6e5` |
| status-border-warning / warning-300 | `#ffd68f` |
| text-warning / warning-700 | `#9e5700` |
| status-background (default chip bg) | `#ffffff` |
| status-border (default chip border) | `#d7dee0` |

### Neutrals / surface / text

| Token | Hex | Use |
|---|---|---|
| surface-canvas | `#f7f4f2` | Page background |
| surface-default | `#ffffff` | Card body |
| surface-elevated-2 | `#fbfaf9` | Nested-card cream wrapper |
| neutral-100 | `#f0f3f4` | Inside-card divider |
| neutral-200 | `#f0f3f4` | Card-header bottom border |
| neutral-300 | `#d7dee0` | Default border, dashed grid lines |
| neutral-400 | `#c1cacd` | X-axis baseline, sidebar to-do circle |
| text-primary | `#193a43` | Headings and body |
| text-secondary | `#374d53` | Secondary text |
| text-disabled | `#879092` | Disabled label, locked-state icon |

---

## Patterns proven to render correctly in dev

### Section header icon container
```jsx
<span
  className="flex size-6 shrink-0 items-center justify-center rounded-md border"
  style={{ backgroundColor: "#fff0d6", borderColor: "#ffd68f" }}
>
  <HugeiconsIcon icon={MyIcon} size={14} style={{ color: "#ffac30" }} />
</span>
```

### Chip (replacement for `<Chip color="...">` which can fail in dev)
```jsx
const tones = {
  default: { bg: "#ffffff", border: "#d7dee0", text: "#6b7780" },
  success: { bg: "#eaf6f6", border: "#c1e5e6", text: "#128081" },
  warning: { bg: "#fff6e5", border: "#ffd68f", text: "#9e5700" },
}
<span
  className="inline-flex h-5 items-center rounded-full border px-2 font-primary text-[12px] leading-none"
  style={{ backgroundColor: tones[t].bg, borderColor: tones[t].border, color: tones[t].text }}
>
  Label
</span>
```

### Notice (replacement for `<Notice variant="warning">` which can fail in dev)
```jsx
<div
  className="flex items-center gap-2 rounded-xl border px-3 py-2"
  style={{ backgroundColor: "#fff6e5", borderColor: "#ffd68f" }}
>
  <span
    className="flex size-6 shrink-0 items-center justify-center rounded-md border"
    style={{ backgroundColor: "#fff0d6", borderColor: "#ffd68f" }}
  >
    <HugeiconsIcon icon={DateTimeSolidStandard} size={14} style={{ color: "#ffac30" }} />
  </span>
  <p className="text-[14px] leading-[1.5]" style={{ color: "#374d53" }}>
    Notice content
  </p>
</div>
```

### Partner logos (Amazon, etc.)
Real SVGs live in `src/svgs/partners/connections/`. Import via Vite's `?url` suffix:
```jsx
import amazonConnectionUrl from "../../../svgs/partners/connections/amazon.svg?url"
<div
  className="flex size-10 shrink-0 items-center justify-center rounded-lg border"
  style={{ backgroundColor: "#fbfaf9", borderColor: "#d7dee0" }}
>
  <img src={amazonConnectionUrl} alt="" className="size-7" />
</div>
```

Never use a placeholder letter ("a", "S", etc.) — the SVGs already exist.

---

## Pre-flight checklist for any prototype build

Run through this before declaring a prototype "done":

1. **Read `src/styles/app.css`** and note which `bg-*`, `text-*`, `border-*` token-named classes appear in `@source inline()`. Anything not in that list = must use inline style.
2. **Open `src/styles/themes/uncapped.css`** if you need a token value not already in the table above.
3. **For every coloured element**, ask: does this class string appear verbatim in `app.css` or in another file Tailwind scans? If unsure → inline style.
4. **For every Figma colour reference** (`color/accent/2-contrast`, etc.), translate to hex via the table above. Never paste a Tailwind named colour (`text-green-600`) as a "close enough" substitute — Uncapped's accents are noticeably lighter than Tailwind defaults.
5. **For every Figma spacing/padding metadata value** (e.g. `pl-1.5 pr-2 py-1`), use that exact value, not a "reasonable" alternative.
6. **Boot the dev server and load the page in a browser** before saying the build is done. Type-check passing ≠ rendering correctly.

---

## "It looks broken" debugging checklist

When a user reports a prototype looks wrong, in order:

1. **Is there an icon that's not showing or appears grey?** → Probably `text-<tailwind-color>-NNN` not in safelist. Replace with inline `style={{ color: "#hex" }}`.
2. **Does a Notice/Chip have no colour?** → Same root cause. Replace with inline-styled version above.
3. **Is the colour wrong (purple instead of brand teal, etc.)?** → I might have used a Tailwind default hex instead of the Uncapped token. Look up the correct hex in the table.
4. **Is layout cramped or sparse vs Figma?** → Re-read the Figma metadata for `pl-*`, `pr-*`, `py-*`, `gap-*` values and copy them literally.
5. **Is the right icon shape?** → Figma's icon name (`square-lock-02-solid-standard`) maps to the Hugeicons-pro export (`SquareLock02SolidStandard`). The mapping is the dash-separated name turned into PascalCase, minus the trailing variant suffix. Don't swap `square-lock-02` for the more familiar `lock` — they're different icons.
