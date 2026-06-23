import { cva, VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

const chipVariants = cva(
  "relative z-1 flex w-fit items-center justify-center whitespace-nowrap rounded-full border px-2 py-1 text-xs leading-none",
  {
    variants: {
      color: {
        danger:
          "text-[var(--color-text-error)] bg-[var(--color-status-background-error)] border-[var(--color-status-border-error)]",
        success:
          "text-[var(--color-text-success)] bg-[var(--color-status-background-success)] border-[var(--color-status-border-success)]",
        warning:
          "text-[var(--color-text-warning)] bg-[var(--color-status-background-warning)] border-[var(--color-status-border-warning)]",
        disabled:
          "text-[var(--color-text-disabled)] bg-[var(--color-status-background-disabled)] border-[var(--color-status-border-disabled)]",
        default:
          "text-neutral-600 bg-[var(--color-status-background)] border-[var(--color-status-border)]",
      },
      animated: {
        true: [
          "overflow-hidden",
          "after:absolute after:top-1/2 after:-left-[30px] after:h-full after:w-[30px] after:-translate-y-1/2 after:content-['']",
          "after:bg-linear-to-r after:from-transparent after:via-white/50 after:to-transparent after:mix-blend-overlay",
          "after:animate-[chip-shimmer_1.6s_ease-out_infinite]",
        ],
        false: null,
      },
    },
    defaultVariants: {
      animated: false,
    },
  }
)

export type ChipColor = NonNullable<VariantProps<typeof chipVariants>["color"]>

const Chip = ({
  label,
  className,
  animated,
  color,
}: {
  label: React.ReactNode
  className?: string
  animated?: boolean
  color: ChipColor
}) => (
  <span className={twMerge(chipVariants({ color, animated }), className)}>
    {label}
  </span>
)

export default Chip
