import React, { isValidElement } from "react"
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"
import clsx from "clsx"
import BoxIcon from "../../Basic/BoxIcon"
import { BoxIconSize } from "../../Basic/BoxIcon/BoxIcon"

const Nudge = ({
  className,
  title,
  content,
  icon,
  layout,
  accent,
  size = 10,
}: {
  className?: string
  title?: string
  content: React.ReactNode
  icon: IconSvgElement | React.ReactElement
  layout: "horizontal" | "vertical"
  accent: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 9 | "brand"
  size?: BoxIconSize
}) => {
  const contentClasses =
    "[&_a]:font-bold [&_a]:text-brand-600 [&_a]:hover:underline"

  return (
    <div
      className={clsx(
        "shadow-light-sm border-card rounded-card-md bg-white p-4",
        className
      )}
    >
      <div className="flex gap-x-3">
        <BoxIcon
          icon={isValidElement(icon) ? icon : <HugeiconsIcon icon={icon} />}
          severity={accent === "brand" ? "accent-brand" : `accent-${accent}`}
          size={size}
        />

        <div>
          {title && <p className="text-text-secondary font-bold">{title}</p>}

          {layout === "horizontal" && (
            <p className={clsx("text-text-secondary text-sm", contentClasses)}>
              {content}
            </p>
          )}
        </div>
      </div>
      {layout === "vertical" && (
        <p className={clsx("text-text-secondary mt-3 text-sm", contentClasses)}>
          {content}
        </p>
      )}
    </div>
  )
}

export default Nudge
