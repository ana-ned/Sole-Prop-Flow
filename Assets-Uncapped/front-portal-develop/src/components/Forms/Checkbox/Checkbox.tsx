import React, { useId } from "react"
import { Check } from "@material-ui/icons"
import { cva } from "class-variance-authority"
import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form"
import { twMerge } from "tailwind-merge"
import FormHelpers from "../FormHelpers"

interface CheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName
  disabled?: boolean
  label?: React.ReactNode
  className?: string
  control: Control<TFieldValues>
  defaultValue?: PathValue<TFieldValues, TName>
}

const checkboxVariants = cva(["flex cursor-pointer gap-2"])

const labelVariants = cva(
  ["order-last text-sm leading-[1.5] text-neutral-800"],
  {
    variants: {
      disabled: {
        true: "text-text-disabled",
        false: "",
      },
    },
  }
)

const controlVariants = cva(
  [
    "size-4 flex items-center justify-center text-white rounded border border-neutral-400 bg-white",
    "transition-all peer-checked/checkbox:border-brand-600 peer-checked/checkbox:bg-brand-600",
  ],
  {
    variants: {
      disabled: {
        true: "cursor-not-allowed bg-neutral-200 border-neutral-300",
        false: "cursor-pointer",
      },
      invalid: {
        true: "border-error-600 peer-checked/checkbox:border-error-600",
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
      invalid: false,
    },
  }
)

const Checkbox = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  disabled,
  label = "",
  className,
  defaultValue = false as PathValue<TFieldValues, TName>,
  control,
}: CheckboxProps<TFieldValues, TName>) => {
  const currentId = useId()
  const {
    field: inputProps,
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    defaultValue,
  })

  return (
    <>
      <label
        className={twMerge(checkboxVariants(), className)}
        htmlFor={currentId}
      >
        {label && <p className={labelVariants({ disabled })}>{label}</p>}
        <div className="relative mt-0.5">
          <input
            type="checkbox"
            id={currentId}
            disabled={disabled}
            {...inputProps}
            checked={!!inputProps.value}
            data-testid={inputProps.name}
            className="peer/checkbox pointer-events-none absolute top-0 left-0 opacity-0"
          />
          <div className={twMerge(controlVariants({ disabled, invalid }))}>
            <Check className="size-3!" />
          </div>
        </div>
      </label>
      <FormHelpers.Message
        error={
          typeof label === "string"
            ? error?.message?.replace(name, label)
            : error?.message
        }
      />
    </>
  )
}

export default Checkbox
