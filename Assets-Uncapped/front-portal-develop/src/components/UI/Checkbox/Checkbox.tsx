import React, { useId } from "react"
import { cva, VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { ReactComponent as CheckIcon } from "../../../svgs/check.svg"

const rootVariants = cva("block cursor-pointer", {
  variants: {
    stretch: {
      true: "after:absolute after:inset-0 after:cursor-pointer after:content-['']",
      false: "",
    },
    wrapped: {
      true: "flex rounded-xl border border-neutral-300 bg-white p-4",
      false: "",
    },
  },
  defaultVariants: {
    stretch: false,
    wrapped: false,
  },
})

const indicatorVariants = cva(
  "size-6 transition-all duration-300 ease-in-out",
  {
    variants: {
      renderStyle: {
        normal: [
          "flex items-center justify-center rounded-sm border border-neutral-800 bg-white text-white",
          "[&_svg]:size-4",
          "peer-checked:border-brand-600 peer-checked:bg-brand-600",
        ],
        radio: [
          "relative box-border rounded-full border border-neutral-800",
          "after:absolute after:top-1/2 after:left-1/2 after:size-3 after:-translate-1/2 after:rounded-full after:bg-brand-600 after:opacity-0 after:transition-all after:duration-300 after:ease-in-out after:content-['']",
          "peer-checked:border-brand-600 peer-checked:after:opacity-100",
        ],
        switch: [
          "relative h-6 w-11.25 rounded-full bg-neutral-300",
          "after:absolute after:top-1/2 after:left-0.75 after:size-4.5 after:-translate-y-1/2 after:rounded-full after:bg-white after:text-white after:shadow-[0_2px_4px_rgba(6,56,68,0.16)] after:transition-all after:duration-300 after:ease-in-out after:content-['']",
          "peer-checked:bg-brand-600 peer-checked:after:translate-x-5.25",
        ],
      },
    },
    defaultVariants: {
      renderStyle: "normal",
    },
  }
)

type RootVariants = VariantProps<typeof rootVariants>
type IndicatorVariants = VariantProps<typeof indicatorVariants>
type RenderStyle = NonNullable<IndicatorVariants["renderStyle"]>

interface CheckboxProps {
  renderStyle?: RenderStyle
  checked?: boolean
  name?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  stretch?: NonNullable<RootVariants["stretch"]>
  value?: string
  disabled?: boolean
  label?: string
  className?: string
  wrapped?: NonNullable<RootVariants["wrapped"]>
}

/** @deprecated Migrate to useForm() */
const Checkbox = ({
  renderStyle = "normal",
  checked = false,
  name,
  onChange,
  stretch = false,
  value,
  disabled,
  label,
  className,
  wrapped,
}: CheckboxProps) => {
  const currentId = useId()

  return (
    <label
      className={twMerge(
        rootVariants({ stretch, wrapped: !!wrapped }),
        className
      )}
      htmlFor={currentId}
    >
      {label && <p className={twMerge(wrapped && "flex-4")}>{label}</p>}
      <div className="relative">
        <input
          type="checkbox"
          role={renderStyle === "switch" ? "switch" : undefined}
          onChange={onChange}
          checked={checked}
          name={name}
          value={value}
          id={currentId}
          disabled={disabled}
          className="peer pointer-events-none absolute top-0 left-0 opacity-0"
        />
        <div
          data-render-style={renderStyle}
          className={indicatorVariants({ renderStyle })}
        >
          {renderStyle === "normal" && <CheckIcon />}
        </div>
      </div>
    </label>
  )
}

export default Checkbox
