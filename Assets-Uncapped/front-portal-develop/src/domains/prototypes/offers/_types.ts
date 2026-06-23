// ---------------------------------------------------------------------------
// OfferModule — the contract every offer must satisfy.
//
// To add a new offer (e.g. Invoice Financing) for the multi-offers
// acceptance flow:
//
//   1. Create `offers/invoice-financing.tsx`, default-export an OfferModule
//   2. Create or extend a scenario page in `pages/`:
//
//        export default () => <AcceptanceFlow offers={[invoiceFinancing]} />
//
//   3. Register the route in `prototypes/routes.tsx`
//
// The acceptance-flow shell renders the sidebar nav, sign-agreements,
// agreement summary, navigation, and chrome from the module list.
// Your module only owns:
//   - the middle-column config screen
//   - the right-panel content for the config step
//   - the agreement metadata (name, summary block, chip)
// ---------------------------------------------------------------------------

import type { FC, ReactNode } from "react"

export type ChipTone = "default" | "success" | "warning" | "error"

export type SummaryRowData = {
  label: string
  value: string
  subLabel?: string
}

export type OfferModule = {
  // Identity
  /** Stable, kebab-case id. Used as the step key in the sidebar nav. */
  id: string
  /** Sidebar label. Title case. */
  navLabel: string
  /** Name shown on the sign-agreement row, e.g. "Term Loan Agreement". */
  agreementName: string

  // Config step content
  /** Middle column for this offer's config step (hero, notice, controls, chart). */
  ConfigContent: FC
  /**
   * Optional supplementary content for the right panel during this offer's
   * config step, rendered *above* the auto-generated agreement summary.
   * Most offers won't need this — the agreement summary alone is usually
   * enough on the right panel.
   */
  RightPanel?: FC

  // Agreement-summary block (shown in the right panel during config + sign steps)
  /** Block title, e.g. "Term Loan", "Daily Payout". */
  summaryTitle: string
  /** Chip next to the title. Convention: first module "Main offer" (success), rest "Additional" (warning). */
  summaryChip: { tone: ChipTone; label: string }
  /** Static rows (label + value, optional sub-label) shown when the block is expanded. */
  summaryRows: SummaryRowData[]
  /**
   * One-line teaser shown when the block is collapsed.
   * Example: "$100K, 12 months, 12% fee" or "80% advance rate, 0.3% daily fee".
   */
  summaryTeaser: string

  // Optional contributions
  /**
   * Optional sentence the module wants added to "What happens next?" on the
   * sign-agreements step. Position-aware bullets ("first / then / once both")
   * are owned by the shell.
   */
  whatHappensNextBullet?: ReactNode
}
