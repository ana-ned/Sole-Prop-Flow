import { useLayoutEffect, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShoppingCart01Icon as SolidShoppingCart01Icon } from "@hugeicons-pro/core-solid-standard"
import { ShoppingCart01Icon as StrokeShoppingCart01Icon } from "@hugeicons-pro/core-stroke-standard"
import clsx from "clsx"
import Chip from "../Chip/Chip"
import { NavLink } from "react-router"
import { OnboardingStep } from "../../../domains/onboarding/hooks/useOnboarding"
import { ReactComponent as CheckSmallIcon } from "../../../svgs/check-small.svg"
import { ReactComponent as PriorityHighIcon } from "../../../svgs/priority-high.svg"
import Typography from "../../Basic/Typography"

interface StepperMenuProps {
  steps: OnboardingStep[]
}

const Icon = ({
  completed,
  skipped,
  error,
  custom,
  disabled,
  active,
  icon,
}: {
  completed?: boolean
  skipped?: boolean
  error?: boolean
  custom?: OnboardingStep["custom"]
  disabled?: boolean
  active?: boolean
  icon?: React.ReactNode
}) => {
  if (icon) {
    return icon
  }

  const commonClasses =
    "flex-shrink-0 size-4 rounded-full flex items-center justify-center border-1"

  if (custom === "offer") {
    return (
      <div className="flex items-center justify-center">
        <HugeiconsIcon
          icon={disabled ? StrokeShoppingCart01Icon : SolidShoppingCart01Icon}
          className={clsx("size-[18px]", {
            "text-neutral-500": disabled,
            "text-brand-600": !disabled,
          })}
        />
      </div>
    )
  }

  if (error || skipped) {
    return (
      <div
        className={clsx(
          commonClasses,
          "bg-error-200 border-error-300 !border-2"
        )}
      >
        <PriorityHighIcon className="text-error-600 size-2" />
      </div>
    )
  }

  if (completed) {
    return (
      <div
        className={clsx(
          commonClasses,
          "bg-nav-item-icon-done border-nav-item-icon-done"
        )}
      >
        <CheckSmallIcon className="size-2 text-white" />
      </div>
    )
  }

  if (active) {
    return (
      <div className={clsx(commonClasses, "border-nav-item-icon-todo")}>
        <div
          className={clsx(
            "to-nav-item-icon-todo size-[10px] rounded-full bg-gradient-to-r from-transparent from-50% to-50%"
          )}
        ></div>
      </div>
    )
  }

  return (
    <div className={clsx(commonClasses, "border-dashed border-neutral-500")} />
  )
}

function getStepColor(
  custom: OnboardingStep["custom"],
  disabled?: boolean,
  error?: boolean
): "neutral-500" | "error-600" | "neutral-800" {
  if (custom === "offer" && disabled) return "neutral-500"
  if (error) return "error-600"
  return "neutral-800"
}

const StepperMenu = ({ steps }: StepperMenuProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeElementRef = useRef<HTMLAnchorElement>(null)

  // Scroll to active element on mount
  useLayoutEffect(() => {
    if (containerRef.current && activeElementRef.current) {
      containerRef.current.scrollTo({
        left: Math.max(0, activeElementRef.current.offsetLeft - 20),
      })
    }
  }, [])

  return (
    <nav
      ref={containerRef}
      className="flex overflow-x-auto px-3 pb-3 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.02),0px_4px_2px_-2px_rgba(0,0,0,0.08)] lg:flex-col lg:gap-y-2 lg:overflow-x-visible lg:px-0 lg:pb-0 lg:shadow-none"
    >
      {steps.map(
        ({
          caption,
          href,
          completed,
          active,
          skipped,
          disabled,
          error,
          count,
          custom,
          icon,
        }) => {
          const className = clsx(
            "flex items-center max-w-[240px] gap-x-2 rounded-lg py-2 px-3 transition-all whitespace-nowrap hover:bg-surface-elevated-2 hover:border-nav-item-active border-nav-item",
            {
              "bg-surface-elevated-2 shadow-light-sm border-nav-item-active":
                active,
              "pointer-events-none": disabled,
            }
          )

          return (
            <NavLink
              key={href}
              ref={active ? activeElementRef : null}
              to={disabled ? "#" : href}
              className={className}
              aria-disabled={disabled ? "true" : "false"}
            >
              <Icon
                completed={completed}
                skipped={skipped}
                error={error}
                custom={custom}
                disabled={disabled}
                active={active}
                icon={icon}
              />
              <Typography
                className="flex min-w-0 items-center gap-x-[10px]"
                type="body"
                color={getStepColor(custom, disabled, error)}
              >
                <span className="truncate">{caption}</span>
                {count !== undefined && (
                  <Chip
                    label={count}
                    color={disabled ? "disabled" : "success"}
                  />
                )}
              </Typography>
            </NavLink>
          )
        }
      )}
    </nav>
  )
}

export default StepperMenu
