import React from "react"
import { twMerge } from "tailwind-merge"

/** @deprecated Please migrate to `<Card />` instead. */
const ContentDivider = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={twMerge(
        "mt-2 rounded-xl bg-white p-4 shadow-[0_1px_4px_0_rgb(0_0_0_/_0.02),0_1px_4px_0_rgb(0_0_0_/_0.05)]",
        className
      )}
    >
      {children}
    </div>
  )
}

export default ContentDivider
