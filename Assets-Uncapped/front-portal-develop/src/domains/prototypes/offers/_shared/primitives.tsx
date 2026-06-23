// Small shared building blocks used across offer modules and the acceptance shell.
// Inline-style only — see .claude/agents/_prototype-primitives.md for why.

import type { ReactNode } from "react"
import Typography from "../../../../components/Basic/Typography"
import type { ChipTone } from "../_types"

// ---------------------------------------------------------------------------
// Currency
// ---------------------------------------------------------------------------

export const formatCurrency = (val: number) =>
  "$" + val.toLocaleString("en-US", { maximumFractionDigits: 2 })

// ---------------------------------------------------------------------------
// PChip — inline-styled chip (replaces <Chip> for prototype safety)
// ---------------------------------------------------------------------------

const CHIP_TONES: Record<ChipTone, { bg: string; border: string; text: string }> = {
  default: { bg: "#ffffff", border: "#d7dee0", text: "#6b7780" },
  success: { bg: "#f1f9f9", border: "#c1e5e6", text: "#128081" },
  warning: { bg: "#fff6e5", border: "#ffd68f", text: "#9e5700" },
  error:   { bg: "#fde7e7", border: "#f4b6b6", text: "#c41818" },
}

export const PChip = ({ tone, children }: { tone: ChipTone; children: ReactNode }) => {
  const t = CHIP_TONES[tone]
  return (
    <span
      className="inline-flex h-5 items-center rounded-full border px-2 font-primary text-[12px] leading-none"
      style={{ backgroundColor: t.bg, borderColor: t.border, color: t.text }}
    >
      {children}
    </span>
  )
}

// ---------------------------------------------------------------------------
// SectionCardHeader — card header with coloured icon container + title
// ---------------------------------------------------------------------------

export const SectionCardHeader = ({
  icon,
  title,
  accentBg,
  accentBorder,
}: {
  icon: ReactNode
  title: string
  accentBg: string
  accentBorder: string
}) => (
  <div className="flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-4">
    <span
      className="flex size-6 shrink-0 items-center justify-center rounded-md border"
      style={{ backgroundColor: accentBg, borderColor: accentBorder }}
    >
      {icon}
    </span>
    <Typography type="bodyTitle" color="neutral-800">
      {title}
    </Typography>
  </div>
)
