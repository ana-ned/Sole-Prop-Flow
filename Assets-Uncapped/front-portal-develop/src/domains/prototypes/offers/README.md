# Offers library

Shared building blocks for the offer acceptance flow. The user picks one or more offers on the multi-offers screen and clicks Continue; the route that follows is composed from this library.

## The shape of an offer

Every offer is a single file that default-exports an `OfferModule`. See `_types.ts` for the full contract. At minimum a module owns:

- **`ConfigContent`** — the middle-column screen the user sees during that offer's config step (hero, controls, summary).
- **`RightPanel`** — the right-panel content for that step (chart, "Why we're better", etc.).
- **`agreementName`** — what the row in the sign-agreements list is called, e.g. `"Term Loan Agreement"`.
- **`summaryRows`** — static rows shown in the agreement summary card during the sign step.

The shell handles everything else: sidebar nav, sign-agreements progression, agreement summary, navigation buttons, mobile chrome, top-right CTAs.

## How to add a new offer

1. Create `offers/<your-offer>.tsx`. Default-export an `OfferModule`. Use `term-loan.tsx` or `cash-advance.tsx` as a template — they show the pattern for both a single-screen config (CA) and a multi-control config (TL).
2. Create a scenario page in `prototypes/pages/`:

   ```tsx
   // accept-your-offer.tsx
   import AcceptanceFlow from "../offers/_acceptance-flow"
   import yourOffer from "../offers/your-offer"

   export default () => <AcceptanceFlow offers={[yourOffer]} />
   ```

   Or compose with existing offers (e.g. `[yourOffer, dailyPayouts]`).

3. Register the route in `prototypes/routes.tsx`.
4. Wire the `multi-offers` Continue button to navigate to your new route when the user selects your offer.

## Shared building blocks (`_shared/`)

| File | What it gives you |
|---|---|
| `primitives.tsx` | `formatCurrency`, `PChip` (inline-styled chip), `SectionCardHeader` (icon + title card-header bar) |
| `hero-banner.tsx` | `OfferHeroBanner` (caption + amount) and `HeadlineHeroBanner` (headline only) |
| `notice.tsx` | `OfferExpiryNotice` (the orange "offer expires" banner) |
| `why-were-better.tsx` | `WhyWereBetter` + `WhyBetterBullet` type |
| `balance-chart.tsx`, `mca-bar-chart.tsx`, `dp-bar-chart.tsx` | Offer-specific charts ready to drop in a right panel |
| `marketplace-card.tsx` | DP marketplace card with Amazon logos |
| `agreement-summary.tsx` | The "Agreement summary" card; shell uses this on the sign step |
| `agreement-list-item.tsx` | One row in the "To sign" list |
| `chart-bits.tsx` | `stripeFill()` and `LegendSwatch` used by both bar charts |

## Conventions

- **Always use inline `style={{ color | backgroundColor | borderColor }}`** for design-system colours — never `bg-warning-100`, `text-green-600`, etc. The repo's Tailwind v4 dev safelist drops most of these silently. See `.claude/agents/_prototype-primitives.md` for the full reference and exact hex values.
- The first module in the `offers` array is the "main offer" — its agreement summary block gets the `Main offer` success chip. Subsequent modules get the `Additional` warning chip.
- The shell renders one config step per module, in order, then the sign step, then a placeholder for verify owners. Don't try to inject custom steps; if you need that, talk to me first.
- Module state lives inside the module's components (`useState` inside `ConfigContent`). The shell does not thread state across modules. Agreement-summary rows are static.

## File map

```
offers/
├── _types.ts                     Contract every offer satisfies
├── _acceptance-flow.tsx          Shared shell (sidebar, sign step, navigation)
├── _shared/                      Reusable building blocks (see table above)
├── term-loan.tsx                 Term Loan offer module
├── cash-advance.tsx              Cash Advance offer module
└── daily-payouts.tsx             Daily Payouts offer module
```

Pages live in `prototypes/pages/` and are now ~5 lines each — see `accept-term-loan-daily-payouts.tsx` for the pattern.
