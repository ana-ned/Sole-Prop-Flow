import { PropsWithChildren } from "react"
import { cva, VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

const radioCardGroupVariants = cva("flex", {
  variants: {
    gap: {
      sm: "gap-1",
      md: "gap-2",
      lg: "gap-4",
    },
    direction: {
      row: "flex-row",
      column: "flex-col",
    },
  },
  defaultVariants: {
    gap: "md",
    direction: "row",
  },
})

type RadioCardGroupVariants = VariantProps<typeof radioCardGroupVariants>

interface RadioCardGroupProps extends PropsWithChildren<RadioCardGroupVariants> {
  className?: string
  label?: string
}

const RadioCardGroup = ({
  children,
  className,
  label,
  gap,
  direction,
}: RadioCardGroupProps) => {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={twMerge(radioCardGroupVariants({ gap, direction }), className)}
    >
      {children}
    </div>
  )
}

export default RadioCardGroup
