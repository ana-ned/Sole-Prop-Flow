# Layout integrity & UX judgment — the professional self-check

The tokens, components and archetypes make a screen *look* like Uncapped. This
file is the layer that makes it *hold together* — correct proportion, sound
hierarchy, robust layout. Most "this looks off / amateur / broken" reactions are
failures here, not token violations. **Run every check below before delivering.**

A token can be perfectly correct and the screen still be wrong: a giant CTA, a
hero number bigger than its card, two things fighting to be primary, text spilling
out of a column. Those are judgment mistakes — catch them here.

---

## 1. Proportion — size things *relative to what contains them*

The #1 cause of fake/broken renders is sizing elements by the viewport or
"big = important" instinct instead of by their container. Use ratios, not vibes.

| Element | The rule (proportion, not just a number) |
|---|---|
| **Logo** | A fixed **~28px-tall** element. It never scales with its column, never `width:100%`, never "fills" a flex cell. If it looks like a heading, it's wrong. |
| **Primary CTA** | Sized to its **content**, not its container. Height is **always 44px** — importance is shown by colour (teal) + position (bottom-right), **never by making it taller or full-bleed**. A button may be `fullWidth` *only* inside a narrow form column (≤440px), never across a full-width page. |
| **The big figure** | Appears **only inside a gradient hero card** (h1/h2, ~48–56px, white, centred) — and **only on screens that have one** (offer, application review, dashboard, underwriting). **Never a large number bare on the canvas**, never forced onto a form screen. All other amounts share one smaller consistent size (~28px). |
| **Page title** | `h4` = **32px** when shown — and **omitted** when the screen leads with a gradient card or section cards. Don't default a 48px title onto everything. |
| **Icons** | Menu/section icons live in a **24px or 40px BoxIcon tile** — never a loose 64px icon. An icon should never be larger than the text it labels by more than ~1.5×. |
| **Cards** | Width comes from the grid/column, not hard-coded huge. Inner padding is consistent (16–24px) on all four sides. |
| **Avatars** | Small fixed discs (24–40px), accent-filled. Never a large image-sized circle. |

**Quick test:** if any single element is the first thing you notice purely
because of its *size* (and it isn't the one hero number), it's out of proportion.

---

## 2. Hierarchy — the squint / scan test

Before delivering, mentally **squint** at the screen:

- **One thing should dominate** — usually the gradient hero card or the primary
  CTA. If two elements compete for "most prominent", hierarchy is broken. Fix by
  demoting one (size, weight, or colour), not by enlarging the other.
- **Scanning order matches importance** — eye should land on: page title →
  primary metric → primary action. If it lands on a logo, an icon, or a
  secondary card first, something is over-weighted.
- **One primary action, visually obvious** — everything else is secondary
  (outline) or link. Two teal buttons = no spine.
- **Weight is earned** — bold, large, coloured, and filled are *limited
  resources*. If everything is bold, nothing is.

---

## 3. Layout robustness — what breaks when content isn't ideal

Real data is messy. A layout that only works with perfect placeholder text is
fragile. Design for the awkward cases:

- **Long content** — long business names, long amounts (`£1,250,000.00`), long
  email addresses, long button labels must **wrap or truncate with ellipsis**,
  never overflow the container or push the layout sideways. Give text containers
  `min-width:0` so they can shrink in a flex row.
- **Min-widths** — every column has a sensible min-width; the centre content
  column never drops below ~520–600px. Nothing should collapse to a sliver.
- **No overflow / no clipping** — content never spills past a card edge, sits
  under a sticky element, or gets cut off. Scroll containers are intentional.
- **Alignment is consistent** — sibling sections of the same container share the
  **same left edge and the same horizontal padding**. A row that's indented 4px
  more than its neighbour reads as broken even if nobody can name why.
- **Nothing touches an edge it shouldn't** — content keeps its padding from card
  and viewport edges; only intentional full-bleed elements (a hero gradient
  band) reach the edge.
- **Empty / loading / error** still hold the layout — a skeleton or empty state
  occupies the same footprint as the loaded content; the page doesn't jump.

---

## 4. Balance & rhythm — density and whitespace

- **Consistent gaps** — 24px between cards, one spacing scale throughout. Mixed
  gaps (16px here, 31px there) make a screen feel unstable.
- **Not cramped, not barren** — related things grouped close, unrelated things
  separated; no element marooned in a sea of whitespace, no wall of dense rows
  with no breathing room.
- **Aligned to a grid** — elements line up into visible columns/rows. Ragged,
  off-grid placement is the difference between "designed" and "assembled".
- **Symmetry where expected** — a row of metric cards is equal width and equal
  height; a 2-up comparison is balanced. Unintentional asymmetry reads as a bug.

---

## 5. Final 8-point gate (don't ship if any fails)

1. Is exactly **one** element the clear focal point (squint test)?
2. Is the CTA **44px**, colour-led, and **not** oversized or full-bleed on a wide page?
3. Is the **logo ~28px** and not scaled up?
4. If there's a big figure, is it **inside a gradient hero card** (not bare on the canvas), with all other amounts a consistent ~28px? Form screens have no big figure.
5. Would **long names / large amounts** wrap or truncate instead of overflowing?
6. Do sibling sections **share the same left edge and padding**?
7. Are **gaps consistent** (24px between cards, one spacing scale)?
8. Does nothing **touch an edge, clip, or overflow** unintentionally?

If a check fails, fix it silently before delivering. These are not optional
polish — they are the difference between a mockup teammates trust and one that
looks broken.
