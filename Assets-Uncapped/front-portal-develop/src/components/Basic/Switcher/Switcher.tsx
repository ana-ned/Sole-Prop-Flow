import { useState, useEffect } from "react"
import { cva, cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import useDevice from "../../../hooks/useDevice"
import Chip from "../../UI/Chip"
import Typography from "../Typography"

const switcherButtonVariants = cva(
  [
    "flex",
    "grow",
    "items-center",
    "justify-center",
    "h-8",
    "p-0",
    "m-0.75",
    "bg-neutral-200",
    "border-none",
    "rounded-full",
    "transition-all",
    "duration-300",
  ],
  {
    variants: {
      active: {
        true: ["bg-white", "shadow-[0_6px_12px_rgba(117,47,1,0.08)]"],
        false: null,
      },
      mobile: {
        true: null,
        false: ["max-w-1/2"],
      },
    },
  }
)

interface SwitcherProps {
  values: { value: string; label: string; chip?: string }[]
  onChange: (value: string) => void
  defaultValue?: string
  className?: string
  dataTestId?: string
}

const Switcher = ({
  values,
  onChange,
  defaultValue,
  className,
  dataTestId = "",
}: SwitcherProps) => {
  const [selected, setSelected] = useState(defaultValue || values[0].value)
  const { isMobile } = useDevice()

  useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue)
    }
  }, [defaultValue])

  return (
    <div
      className={twMerge(
        "flex rounded-full border border-neutral-300 bg-neutral-200 p-1.25",
        className
      )}
      data-testid={dataTestId}
    >
      {values.map((item) => (
        <button
          onClick={() => {
            onChange(item.value)
            setSelected(item.value)
          }}
          className={switcherButtonVariants({
            active: selected === item.value,
            mobile: isMobile,
          })}
          type="button"
          key={item.value}
        >
          <Typography
            tag="span"
            type="smallTitle"
            className={cx({
              "text-neutral-800": selected === item.value,
            })}
          >
            {item.label}
          </Typography>
          {item.chip && (
            <Chip color="danger" animated className="ml-2" label={item.chip} />
          )}
        </button>
      ))}
    </div>
  )
}

export default Switcher
