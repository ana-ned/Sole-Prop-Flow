import React from "react"
import { cva, VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

const noticeVariants = cva(["flex gap-3 rounded-xl border p-3 items-start"], {
  variants: {
    variant: {
      warning: ["bg-warning-100", "border-warning-300"],
      danger: ["bg-error-100", "border-error-300"],
      info: ["bg-info-100", "border-info-300"],
      brand: ["bg-brand-100", "border-brand-300"],
    },
  },
})

const iconContainerVariants = cva(
  [
    "flex shrink-0 items-center justify-center rounded-md border size-6 [&_svg]:size-4",
  ],
  {
    variants: {
      variant: {
        warning: ["bg-warning-200", "border-warning-300", "text-warning-500"],
        danger: ["bg-error-200", "border-error-300", "text-error-500"],
        info: ["bg-info-200", "border-info-300", "text-info-500"],
        brand: ["bg-brand-200", "border-brand-300", "text-brand-500"],
      },
    },
  }
)

interface NoticeProps extends Required<VariantProps<typeof noticeVariants>> {
  title?: string
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

const Notice = ({
  title,
  children,
  className,
  icon,
  action,
  variant,
}: NoticeProps) => {
  return (
    <div
      className={twMerge(
        noticeVariants({ variant }),
        "items-center",
        className
      )}
    >
      {icon && <div className={iconContainerVariants({ variant })}>{icon}</div>}

      <div className="text-text-secondary min-w-0 flex-1">
        {title && <p className="font-bold">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export default Notice
