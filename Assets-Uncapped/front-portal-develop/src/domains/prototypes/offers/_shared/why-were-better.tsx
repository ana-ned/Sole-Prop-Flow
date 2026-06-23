// "Why we're better" card — bulleted list with coloured icon containers.
// Bullet data passed in by the offer module (they vary per offer).

import { HugeiconsIcon } from "@hugeicons/react"
import type { ChartUpSolidStandard } from "@hugeicons-pro/core-solid-standard"
import Typography from "../../../../components/Basic/Typography"

export type WhyBetterBullet = {
  /** Hugeicons icon (any icon component from @hugeicons-pro). */
  icon: typeof ChartUpSolidStandard
  /** Background hex for the icon container (accent-*-subtle). */
  accentBg: string
  /** Border hex for the icon container (accent-*-border). */
  accentBorder: string
  /** Icon colour hex (accent-*-contrast). */
  iconColor: string
  /** Bullet text. */
  text: string
}

export const WhyWereBetter = ({ bullets }: { bullets: WhyBetterBullet[] }) => (
  <div className="overflow-hidden rounded-xl shadow-light-sm">
    <div className="flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3">
      <Typography type="bodyTitle" color="neutral-800">Why we&rsquo;re better</Typography>
    </div>
    <div className="px-6 py-5" style={{ backgroundColor: "#fbfaf9" }}>
      <div className="flex flex-col gap-5">
        {bullets.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-md border"
              style={{ backgroundColor: item.accentBg, borderColor: item.accentBorder }}
            >
              <HugeiconsIcon icon={item.icon} size={14} style={{ color: item.iconColor }} />
            </span>
            <Typography type="smallCopy" color="neutral-800" className="flex-1">{item.text}</Typography>
          </div>
        ))}
      </div>
    </div>
  </div>
)
