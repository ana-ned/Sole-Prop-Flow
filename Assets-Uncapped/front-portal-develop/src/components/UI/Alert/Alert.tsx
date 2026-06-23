import React from "react"
import { cva, VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { ReactComponent as CheckCircleIcon } from "../../../svgs/check-circle.svg"
import { ReactComponent as ClockIcon } from "../../../svgs/clock-filled.svg"
import { ReactComponent as ErrorIcon } from "../../../svgs/error.svg"
import { ReactComponent as InfoIcon } from "../../../svgs/info-filled.svg"
import SanitizedHtml from "../../Basic/SanitizedHtml"
import Typography from "../../Basic/Typography"

const alertVariants = cva(
  [
    "flex rounded-lg p-4 text-left text-neutral-700",
    "[box-shadow:0_1px_0.5px_0_rgba(255,255,255,0.25)_inset,0_-1px_0.5px_0_rgba(0,0,0,0.05)_inset,0_0_1px_0_rgba(0,0,0,0.07),0_1px_2px_0_rgba(0,0,0,0.03),0_1px_5px_0_rgba(0,0,0,0.03)]",
  ],
  {
    variants: {
      type: {
        normal: "border border-neutral-300 bg-neutral-50",
        info: "border border-info-300 bg-info-100",
        danger: "border border-error-300 bg-error-100 text-error-700",
        success: "border border-success-300 bg-success-100",
        warning: "border border-warning-300 bg-warning-100",
        waiting: "border border-neutral-300 bg-neutral-50",
      },
    },
    defaultVariants: {
      type: "normal",
    },
  }
)

const accentVariants = cva("", {
  variants: {
    type: {
      normal: "",
      info: "text-info-700",
      danger: "text-error-700",
      success: "text-success-700",
      warning: "text-warning-700",
      waiting: "text-neutral-600",
    },
  },
  defaultVariants: {
    type: "normal",
  },
})

const contentVariants = cva("flex", {
  variants: {
    layout: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    layout: "vertical",
  },
})

const buttonWrapperVariants = cva("", {
  variants: {
    layout: {
      horizontal: "ml-4 self-end",
      vertical: "mt-2",
    },
  },
  defaultVariants: {
    layout: "vertical",
  },
})

type AlertVariants = VariantProps<typeof alertVariants>
type AlertType = NonNullable<AlertVariants["type"]>
type AlertLayout = NonNullable<VariantProps<typeof contentVariants>["layout"]>

interface AlertProps {
  type?: AlertType
  title?: string
  children: React.ReactNode
  className?: string
  button?: React.ReactNode
  layout?: AlertLayout
  showIcon?: boolean
}

const iconByType: Record<AlertType, React.FC<{ className?: string }>> = {
  normal: ErrorIcon,
  danger: ErrorIcon,
  warning: ErrorIcon,
  info: InfoIcon,
  success: CheckCircleIcon,
  waiting: ClockIcon,
}

const Alert = ({
  title,
  children,
  type,
  className,
  button,
  layout,
  showIcon = true,
}: AlertProps) => {
  const Icon = type ? iconByType[type] : iconByType.normal
  const iconClassName = twMerge(
    "mt-[3px] mr-2 shrink-0 size-4",
    accentVariants({ type })
  )

  return (
    <div className={twMerge(alertVariants({ type }), className)}>
      {!title && showIcon && <Icon className={iconClassName} />}
      <div className="grow">
        {!!title && (
          <div className="mb-1 flex">
            {showIcon && <Icon className={iconClassName} />}
            <Typography type="bodyTitle" className={accentVariants({ type })}>
              <SanitizedHtml as="span" content={title} />
            </Typography>
          </div>
        )}
        <div className={contentVariants({ layout })}>
          <div className="[&_a]:text-brand-600 grow [&_a]:font-bold [&_a]:no-underline">
            {children}
          </div>
          {button && (
            <div className={buttonWrapperVariants({ layout })}>{button}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Alert
