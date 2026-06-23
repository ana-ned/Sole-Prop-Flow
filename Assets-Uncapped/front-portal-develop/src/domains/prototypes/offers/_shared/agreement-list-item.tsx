// One row in the "To sign" list. Title + chip + right-side action (Sign button / Lock / Checkmark).

import type { ReactNode } from "react"
import { PChip } from "./primitives"
import type { ChipTone } from "../_types"

export const AgreementListItem = ({
  title,
  chipLabel,
  chipTone,
  action,
  disabled = false,
}: {
  title: string
  chipLabel: string
  chipTone: ChipTone
  action: ReactNode
  disabled?: boolean
}) => (
  <div className="flex items-center gap-3 rounded-lg pl-1.5 pr-2 py-1">
    <div className="flex flex-1 flex-col items-start gap-1">
      <span
        className="font-primary text-[16px] font-semibold leading-[1.5]"
        style={{ color: disabled ? "#879092" : "#193a43" }}
      >
        {title}
      </span>
      <PChip tone={chipTone}>{chipLabel}</PChip>
    </div>
    <div className="shrink-0">{action}</div>
  </div>
)
