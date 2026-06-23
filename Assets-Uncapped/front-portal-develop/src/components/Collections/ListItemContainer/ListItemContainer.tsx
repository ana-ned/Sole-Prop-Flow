import React from "react"
import clsx from "clsx"

const ListItemContainer = ({
  children,
  className,
  size = "md",
}: {
  className?: string
  children: React.ReactNode
  size?: "sm" | "md"
}) => (
  <div
    className={clsx(
      "shadow-light-sm border-card rounded-card-md bg-white p-2",
      "[&>:not([class*='error'])]:!border-none",
      size === "sm" &&
        "[&>*]:!min-h-12 [&>*]:!px-2 [&>*]:!py-1 [&>*:not(:last-child)]:mb-1",
      size === "md" && "[&>*]:!min-h-14 [&>*]:!p-2 [&>*:not(:last-child)]:mb-2",
      className
    )}
  >
    {children}
  </div>
)

export default ListItemContainer
