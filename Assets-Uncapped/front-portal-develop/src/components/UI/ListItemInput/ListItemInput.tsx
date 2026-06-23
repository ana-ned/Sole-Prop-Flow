import { ReactElement, ReactNode } from "react"
import { cva, VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import Checkbox from "../Checkbox"

const rootVariants = cva(
  [
    "relative flex items-center min-h-18 px-4",
    "rounded-xl border border-neutral-300 bg-white transition-all duration-300 ease-in-out",
  ],
  {
    variants: {
      disabled: {
        true: "pointer-events-none select-none opacity-40",
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
)

const iconVariants = cva(
  [
    "mr-4 flex size-10 shrink-0 items-center justify-center rounded-lg",
    "bg-surface-canvas text-brand-600 [&_svg]:size-6",
  ],
  {
    variants: {
      full: {
        true: "overflow-hidden [&_svg]:size-full",
        false: "",
      },
    },
    defaultVariants: {
      full: false,
    },
  }
)

type RootVariants = VariantProps<typeof rootVariants>

export interface ListItemInputProps {
  type: "normal" | "radio" | "switch"
  title: string
  subtitle?: ReactNode
  icon?: ReactElement
  backgroundColor?: string
  color?: string
  checked: boolean
  onChange: () => any
  className?: string
  disabled?: NonNullable<RootVariants["disabled"]>
  isFullIcon?: boolean
  value?: string
  initialIcon?: string
}

const ListItemInput = ({
  type,
  title,
  subtitle,
  icon,
  backgroundColor,
  color,
  checked,
  className,
  onChange,
  disabled = false,
  isFullIcon = false,
  value,
  initialIcon,
}: ListItemInputProps) => {
  return (
    <div
      className={twMerge(rootVariants({ disabled: !!disabled }), className)}
      data-testid={title}
    >
      {(icon || initialIcon) && (
        <div
          className={iconVariants({ full: isFullIcon })}
          style={{ backgroundColor, color }}
        >
          {icon || initialIcon?.slice(0, 1)}
        </div>
      )}
      <div className="grow pr-4">
        <p className="font-bold text-neutral-800">{title}</p>
        {subtitle &&
          (typeof subtitle === "string" ? (
            <p className="text-sm text-neutral-700">{subtitle}</p>
          ) : (
            subtitle
          ))}
      </div>
      <div>
        <Checkbox
          name={title}
          renderStyle={type}
          onChange={onChange}
          checked={checked}
          value={value}
          stretch
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default ListItemInput
