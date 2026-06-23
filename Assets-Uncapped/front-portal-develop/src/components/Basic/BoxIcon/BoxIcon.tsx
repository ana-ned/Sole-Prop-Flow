import clsx from "clsx"

export const BoxIconSeverity = {
  "accent-1": "accent-1",
  "accent-2": "accent-2",
  "accent-3": "accent-3",
  "accent-4": "accent-4",
  "accent-5": "accent-5",
  "accent-6": "accent-6",
  "accent-7": "accent-7",
  "accent-8": "accent-8",
  "accent-9": "accent-9",
  "accent-10": "accent-10",
  "accent-11": "accent-11",
  "accent-brand": "accent-brand",
} as const

export type BoxIconSize = 6 | 10
export const BoxIconSizes: BoxIconSize[] = [6, 10]

type BoxIconVariant = "light" | "dark"

const BoxIcon = ({
  icon,
  severity,
  size = 6,
  variant = "light",
  className,
}: {
  icon?: React.ReactNode
  severity: keyof typeof BoxIconSeverity
  size?: BoxIconSize
  variant?: BoxIconVariant
  className?: string
}) => {
  if (!icon) {
    return null
  }

  return (
    <div
      className={clsx(
        "flex shrink-0 items-center justify-center border [&_svg]:text-current",
        {
          "size-6 rounded-md [&_svg]:size-4": size === 6,
          "size-10 rounded-lg [&_svg]:size-6": size === 10,
        },
        variant === "light" && {
          "bg-accent-1-subtle border-accent-1-border text-accent-1-contrast":
            severity === "accent-1",
          "bg-accent-2-subtle border-accent-2-border text-accent-2-contrast":
            severity === "accent-2",
          "bg-accent-3-subtle border-accent-3-border text-accent-3-contrast":
            severity === "accent-3",
          "bg-accent-4-subtle border-accent-4-border text-accent-4-contrast":
            severity === "accent-4",
          "bg-accent-5-subtle border-accent-5-border text-accent-5-contrast":
            severity === "accent-5",
          "bg-accent-6-subtle border-accent-6-border text-accent-6-contrast":
            severity === "accent-6",
          "bg-accent-7-subtle border-accent-7-border text-accent-7-contrast":
            severity === "accent-7",
          "bg-accent-8-subtle border-accent-8-border text-accent-8-contrast":
            severity === "accent-8",
          "bg-accent-9-subtle border-accent-9-border text-accent-9-contrast":
            severity === "accent-9",
          "bg-accent-10-subtle border-accent-10-border text-accent-10-contrast":
            severity === "accent-10",
          "bg-accent-11-subtle border-accent-11-border text-accent-11-contrast":
            severity === "accent-11",
          "bg-accent-brand-subtle border-accent-brand-border text-accent-brand-contrast":
            severity === "accent-brand",
        },
        variant === "dark" && {
          "border-white/10 bg-black/25": true,
          "text-accent-1-contrast": severity === "accent-1",
          "text-accent-2-contrast": severity === "accent-2",
          "text-accent-3-contrast": severity === "accent-3",
          "text-accent-4-contrast": severity === "accent-4",
          "text-accent-5-contrast": severity === "accent-5",
          "text-accent-6-contrast": severity === "accent-6",
          "text-accent-7-contrast": severity === "accent-7",
          "text-accent-8-contrast": severity === "accent-8",
          "text-accent-9-contrast": severity === "accent-9",
          "text-accent-10-contrast": severity === "accent-10",
          "text-accent-11-contrast": severity === "accent-11",
          "text-accent-brand-contrast": severity === "accent-brand",
        },
        className
      )}
    >
      {icon}
    </div>
  )
}

export default BoxIcon
