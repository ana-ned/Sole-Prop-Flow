import { PropsWithChildren } from "react"
import { cva, VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import cardImage from "./assets/backgroundPattern.svg"

const cardVariants = cva(
  "shadow-light-sm rounded-card-lg relative overflow-hidden border-card",
  {
    variants: {
      variant: {
        default: "bg-white",
        background:
          "[background-image:var(--card-background)] bg-no-repeat bg-center bg-cover",
        tertiary: "bg-surface-elevated-2",
      },
      spacing: {
        default: "px-4 py-4",
        big: "px-6 py-6",
        small: "px-2 py-2",
      },
    },
  }
)

type CardVariants = VariantProps<typeof cardVariants>

interface CardProps extends PropsWithChildren<CardVariants> {
  className?: string
}

const Card = ({
  children,
  className,
  variant = "default",
  spacing = "default",
}: CardProps) => {
  return (
    <div
      className={twMerge(cardVariants({ variant, spacing }), className)}
      style={
        variant === "background"
          ? ({
              "--card-background": `url(${cardImage})`,
            } as React.CSSProperties)
          : {}
      }
    >
      {children}
    </div>
  )
}

export default Card
