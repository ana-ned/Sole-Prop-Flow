import React from "react"
import clsx from "clsx"
import { ReactComponent as ConfirmedIcon } from "../../../svgs/illustrations/confirmed.svg"
import { ReactComponent as DeletedIcon } from "../../../svgs/illustrations/delete.svg"
import { ReactComponent as WarningIcon } from "../../../svgs/illustrations/warning.svg"

interface ConfirmationProps {
  title?: string
  subtitle?: React.ReactNode
  type?: "success" | "danger" | "warning" | "custom"
  children: React.ReactNode
  iconComponent?: React.ReactNode
  className?: string
  fluidIcon?: boolean
}

const Confirmation = ({
  title,
  subtitle = "",
  type,
  children,
  iconComponent,
  className,
  fluidIcon = false,
}: ConfirmationProps) => {
  return (
    <div className={clsx("flex min-h-full flex-col text-center", className)}>
      <div className="flex grow flex-col justify-center">
        {!!type && (
          <div
            className={clsx(
              "mx-auto flex items-center justify-center rounded-full [&>img]:w-full [&>svg]:w-full",
              fluidIcon ? "h-auto w-auto" : "h-[164px] w-[164px]"
            )}
          >
            {type === "success" && <ConfirmedIcon />}
            {type === "danger" && <DeletedIcon />}
            {type === "warning" && <WarningIcon />}
            {type === "custom" && iconComponent}
          </div>
        )}
        {!!title && (
          <p
            className={clsx(
              "font-heading text-2xl font-bold text-neutral-900",
              type && "mt-8"
            )}
          >
            {title}
          </p>
        )}
        {!!subtitle && <div className="mt-4 text-neutral-900">{subtitle}</div>}
      </div>
      {children && (
        <div className="mt-6 lg:mt-8 [&>*:not(:last-child)]:mb-4">
          {children}
        </div>
      )}
    </div>
  )
}

export default Confirmation
