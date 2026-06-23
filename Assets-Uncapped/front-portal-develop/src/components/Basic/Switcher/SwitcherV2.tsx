import { useState, useEffect } from "react"
import clsx from "clsx"
import useDevice from "../../../hooks/useDevice"
import Chip from "../../UI/Chip"

const SwitcherV2 = ({
  values,
  onChange,
  defaultValue,
  className,
  dataTestId = "",
}: {
  values: { value: string; label: string; chip?: string }[]
  onChange: (value: string) => void
  defaultValue?: string
  className?: string
  dataTestId?: string
}) => {
  const [selected, setSelected] = useState(defaultValue || values[0].value)
  const { isMobile } = useDevice()

  useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue)
    }
  }, [defaultValue])

  return (
    <div
      className={clsx(
        "rounded-button-lg inline-flex items-center gap-1.75 bg-black/3 p-1",
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
          className={clsx(
            "rounded-button-sm flex h-9.5 items-center justify-center gap-1 px-4 py-2 text-sm font-semibold transition-all duration-200",
            {
              "text-on-secondary shadow-light-sm bg-white":
                selected === item.value,
              "text-text-secondary hover:bg-black/2": selected !== item.value,
              "flex-1": !isMobile,
            }
          )}
          type="button"
          key={item.value}
        >
          {item.label}
          {item.chip && (
            <Chip color="danger" animated className="ml-2" label={item.chip} />
          )}
        </button>
      ))}
    </div>
  )
}

export default SwitcherV2
