// "Agreement summary" card — one block per offer with expand/collapse.
//
// Layout rule:
//   - When the active step is configuring an offer, that offer's block is
//     expanded by default; the others are collapsed (showing a one-line teaser).
//   - On the sign step (no offer being configured), all blocks are collapsed
//     by default.
//   - Either way, the user can click any block header to toggle it.

import { useState } from "react"
import type { ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  GoogleDocSolidStandard,
  ArrowDown01Icon,
  ArrowUp01Icon,
} from "@hugeicons-pro/core-solid-standard"
import { SectionCardHeader, PChip } from "./primitives"
import type { OfferModule, SummaryRowData } from "../_types"

const SummaryItemRow = ({ label, value, subLabel }: SummaryRowData) => (
  <div className="flex items-center gap-3 rounded-lg pl-1.5 pr-2 py-1">
    <div className="flex flex-1 flex-col">
      <span className="font-primary text-[16px] font-semibold leading-[1.5]" style={{ color: "#193a43" }}>
        {label}
      </span>
      {subLabel && (
        <span className="font-primary text-[16px] leading-[1.5]" style={{ color: "#374d53" }}>
          {subLabel}
        </span>
      )}
    </div>
    <span
      className="shrink-0 font-primary text-[16px] font-bold leading-[1.5] text-right"
      style={{ color: "#193a43" }}
    >
      {value}
    </span>
  </div>
)

const SummaryBlock = ({
  title,
  chip,
  teaser,
  rows,
  initialExpanded,
}: {
  title: string
  chip: ReactNode
  teaser: string
  rows: SummaryRowData[]
  initialExpanded: boolean
}) => {
  const [expanded, setExpanded] = useState(initialExpanded)
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white px-2 py-2 shadow-light-sm">
      {/* Header — title + chip (not part of the toggle so click target is the teaser row) */}
      <div className="flex items-center gap-1 rounded-lg pl-1.5 pr-2 py-1">
        <span className="font-primary text-[16px] font-bold leading-[1.5]" style={{ color: "#193a43" }}>
          {title}
        </span>
        {chip}
      </div>

      <div className="h-px w-full" style={{ backgroundColor: "#f0f3f4" }} aria-hidden />

      {/* Teaser row — always visible, doubles as the toggle button */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center gap-3 rounded-lg pl-1.5 pr-2 py-1 text-left transition-colors hover:bg-neutral-50 focus-visible:shadow-focus focus:outline-none"
        aria-expanded={expanded}
        aria-label={expanded ? `Collapse ${title}` : `Expand ${title}`}
      >
        <span
          className="flex-1 font-primary text-[16px] leading-[1.5]"
          style={{ color: "#374d53" }}
        >
          {teaser}
        </span>
        <HugeiconsIcon
          icon={expanded ? ArrowUp01Icon : ArrowDown01Icon}
          size={20}
          style={{ color: "#128081" }}
        />
      </button>

      {/* Detail rows — only when expanded */}
      {expanded && rows.map((row) => <SummaryItemRow key={row.label} {...row} />)}
    </div>
  )
}

export const AgreementSummaryCard = ({
  offers,
  activeOfferId,
  footer,
}: {
  offers: OfferModule[]
  /** When provided, that offer's block is expanded by default. Pass null/undefined to start with everything collapsed. */
  activeOfferId?: string | null
  /**
   * Optional content rendered inside the card body, below the offer blocks
   * and flush against them. Used by the shell to embed the "Add Daily
   * Payouts" upsell banner on single-offer flows so it reads as part of
   * the agreement summary rather than a separate card.
   */
  footer?: React.ReactNode
}) => (
  <div className="overflow-hidden rounded-xl shadow-light-sm">
    <SectionCardHeader
      icon={<HugeiconsIcon icon={GoogleDocSolidStandard} size={14} style={{ color: "#33c655" }} />}
      title="Agreement summary"
      accentBg="#e7f8eb"
      accentBorder="#c9e9d0"
    />
    <div className="flex flex-col gap-2 px-4 py-4" style={{ backgroundColor: "#fbfaf9" }}>
      {offers.map((offer) => (
        <SummaryBlock
          key={offer.id}
          title={offer.summaryTitle}
          chip={<PChip tone={offer.summaryChip.tone}>{offer.summaryChip.label}</PChip>}
          teaser={offer.summaryTeaser}
          rows={offer.summaryRows}
          initialExpanded={offer.id === activeOfferId}
        />
      ))}
      {footer}
    </div>
  </div>
)
