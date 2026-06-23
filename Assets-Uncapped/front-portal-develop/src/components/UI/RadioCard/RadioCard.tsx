import { PropsWithChildren } from "react"
import { cva, VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import Typography from "../../Basic/Typography"

const radioCardVariants = cva(
  "shadow-light-sm border-card rounded-card-md flex w-full cursor-pointer flex-col items-start gap-2 bg-white p-4 text-left",
  {
    variants: {
      selected: {
        true: "border-brand-600",
        false: "border-transparent",
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
)

type RadioCardVariants = VariantProps<typeof radioCardVariants>

interface RadioCardProps extends PropsWithChildren<RadioCardVariants> {
  name: string
  value: string
  label: string
  checked: boolean
  disabled?: boolean
  onChange: (value: string) => void
  className?: string
}

const RadioCard = ({
  children,
  name,
  value,
  label,
  checked,
  disabled,
  onChange,
  className,
}: RadioCardProps) => {
  return (
    <label
      className={twMerge(
        radioCardVariants({ selected: checked }),
        disabled && "cursor-default",
        className
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={() => {
          onChange(value)
        }}
      />
      <Typography type="h5">{label}</Typography>
      {children}
    </label>
  )
}

export default RadioCard
