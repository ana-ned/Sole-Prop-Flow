import { useEffect, useMemo, useState } from "react"
import { cva, VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

const segmentVariants = cva("relative flex w-full bg-neutral-300", {
  variants: {
    color: {
      default: "",
      orange: "",
      error: "bg-error-200",
      paused: "bg-brand-100",
    },
    filled: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      filled: true,
      color: "default",
      className: "bg-brand-600",
    },
    {
      filled: true,
      color: "orange",
      className: "bg-error-300",
    },
    {
      filled: true,
      color: "error",
      className: [
        "[--stripe-width:1.5px] [--stripe-gap:3px]",
        "[background-image:repeating-linear-gradient(-45deg,var(--color-error-600)_0_var(--stripe-width),transparent_var(--stripe-width)_calc(var(--stripe-width)+var(--stripe-gap)))]",
      ],
    },
    {
      filled: true,
      color: "paused",
      className: [
        "[--stripe-width:1.5px] [--stripe-gap:3px]",
        "[background-image:repeating-linear-gradient(-45deg,var(--color-accent-1-contrast)_0_var(--stripe-width),transparent_var(--stripe-width)_calc(var(--stripe-width)+var(--stripe-gap)))]",
      ],
    },
  ],
  defaultVariants: {
    color: "default",
    filled: false,
  },
})

const progressVariants = cva(
  [
    "absolute left-0 h-full w-full overflow-hidden bg-brand-600",
    "origin-[0%_50%] backface-hidden will-change-transform",
    "animate-[progress-stretch_2s_infinite]",
  ],
  {
    variants: {
      color: {
        default: "",
        orange:
          "[background:linear-gradient(to_right,var(--color-error-300)_0%,var(--color-warning-300)_66%)]",
        error: [
          "w-1/2 bg-error-200 animate-none",
          "[--stripe-width:1.5px] [--stripe-gap:3px]",
          "[background-image:repeating-linear-gradient(-45deg,var(--color-error-600)_0_var(--stripe-width),transparent_var(--stripe-width)_calc(var(--stripe-width)+var(--stripe-gap)))]",
        ],
        paused: [
          "w-1/2 bg-brand-100 animate-none",
          "[--stripe-width:1.5px] [--stripe-gap:3px]",
          "[background-image:repeating-linear-gradient(-45deg,var(--color-accent-1-contrast)_0_var(--stripe-width),transparent_var(--stripe-width)_calc(var(--stripe-width)+var(--stripe-gap)))]",
        ],
      },
      raw: {
        true: "transform-[scaleX(0)] [transition:transform_1s_cubic-bezier(0.4,0,0.2,1)] animate-none",
        false: "",
      },
      stopped: {
        true: "bg-neutral-300 animate-none",
        false: "",
      },
    },
    defaultVariants: {
      color: "default",
      raw: false,
      stopped: false,
    },
  }
)

type ProgressBarColor = NonNullable<
  VariantProps<typeof segmentVariants>["color"]
>

const ProgressBar = ({
  total,
  current,
  color = "default",
  timeout,
  max,
  min,
  className,
  stop,
}: {
  total: number
  current: number
  color?: ProgressBarColor
  timeout?: number
  max?: number
  min?: number
  className?: string
  stop?: boolean
}) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (typeof timeout !== "number") return

    const interval = 100
    const steps = timeout / interval
    const increment = 100 / steps

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(timer)
          return 100
        }
        return next
      })
    }, interval)

    return () => {
      clearInterval(timer)
    }
  }, [timeout])

  const computedProgress = useMemo(() => {
    if (typeof max === "number" && typeof min === "number") {
      return Math.min(Math.max(progress, min), max)
    }
    return progress
  }, [max, min, progress])

  return (
    <div
      className={twMerge(
        "relative flex h-2.5 w-full flex-1 gap-1 overflow-hidden rounded-xl",
        className
      )}
    >
      {Array.from({ length: total })
        .fill(0)
        .map((_, index) => {
          return (
            <div
              key={`item-${index}`}
              className={twMerge(
                segmentVariants({
                  filled: index < current,
                  color,
                })
              )}
            >
              {index === current && (
                <div
                  style={
                    typeof timeout === "number"
                      ? { transform: `scaleX(${computedProgress / 100})` }
                      : undefined
                  }
                  className={twMerge(
                    progressVariants({
                      color,
                      raw: typeof timeout === "number",
                      stopped: !!stop,
                    })
                  )}
                />
              )}
            </div>
          )
        })}
    </div>
  )
}

export default ProgressBar
