import { useState, useRef, useId, useEffect } from "react"
import { format, lastDayOfMonth } from "date-fns"
import { debounce, trimEnd } from "lodash-es"
import { Control, FieldPath, FieldValues, useController } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import FormHelpers from "../FormHelpers"

interface InputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName
  label: string
  disabled?: boolean
  readonly?: boolean
  control: Control<TFieldValues>
  helpText?: string
}

const DateMonthYearInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  disabled = false,
  readonly = false,
  control,
  helpText,
}: InputProps<TFieldValues, TName>) => {
  const {
    field: { onChange, onBlur, ...fieldProps },
    fieldState: { invalid, isTouched, error },
  } = useController({
    name,
    control,
  })

  const inputsRef = useRef<HTMLInputElement[]>([])
  const currentId = useId()
  const [currentDate, setCurrentDate] = useState(["", "", ""])
  const [isFocused, setFocused] = useState(false)
  const isFocusedRef = useRef(isFocused)
  isFocusedRef.current = isFocused

  useEffect(() => {
    if (fieldProps.value) {
      setCurrentDate(fieldProps.value?.split(/[./-]/))
    }
  }, [fieldProps.value])

  const handleChange = (
    value: unknown,
    index: number,
    maxLength: number,
    inputIndex: number
  ) => {
    if (typeof value === "string") {
      const newDate = [...currentDate]
      newDate[index] = value
      if (newDate[0] && newDate[1]) {
        newDate[2] = format(
          lastDayOfMonth(new Date(Number(newDate[0]), Number(newDate[1]) - 1)),
          "dd"
        )
      }

      setCurrentDate(newDate)
      onChange(
        newDate.length === 3
          ? trimEnd(newDate.join("-"), "-")
          : newDate.join("-")
      )
    }
    if (
      typeof value === "string" &&
      value.length >= maxLength &&
      inputsRef.current[inputIndex + 1]?.value.length === 0
    ) {
      inputsRef.current[inputIndex + 1].focus()
    }
  }

  const handleBlur = (
    value: unknown,
    index: number,
    maxLength: number,
    inputIndex: number
  ) => {
    setFocused(false)
    if (
      typeof value === "string" &&
      value.length > 0 &&
      value.length < maxLength &&
      maxLength <= 2
    ) {
      handleChange(value.padStart(maxLength, "0"), index, maxLength, inputIndex)
    }
    debounce(() => {
      if (!isFocusedRef.current) {
        onBlur()
      }
    }, 50)()
  }

  const inputClasses = twMerge(
    "h-11 w-full rounded-lg border border-(--color-input-border) bg-(--color-input-background) px-2.5 text-sm text-(--color-text-primary) transition-all",
    "placeholder:text-sm placeholder:text-(--color-text-disabled)",
    "focus:border-(--color-input-border-active) focus:ring-(--color-input-border-active) focus:outline-none focus:ring",
    "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
    "disabled:text-neutral-500 disabled:bg-(--color-input-background-disabled) disabled:border-(--color-input-border-disabled)",
    invalid && isTouched && "border-(--color-input-border-error)"
  )

  return (
    <div>
      {label && (
        <FormHelpers.Label htmlFor={`${currentId}-MM`} disabled={disabled}>
          {label}
        </FormHelpers.Label>
      )}
      <div className="max-w-[340px]">
        <div className="flex flex-row gap-3">
          {[
            { label: "MM", dateIndex: 1, length: 2 },
            { label: "YYYY", dateIndex: 0, length: 4 },
          ].map((field, inputIndex) => (
            <div
              className="max-w-[129px] flex-1"
              key={field.label}
              style={{ flexGrow: field.length }}
            >
              <input
                type="number"
                readOnly={readonly}
                disabled={disabled}
                placeholder={field.label}
                inputMode="numeric"
                id={`${currentId}-${field.label}`}
                data-testid={`${name}-${field.label}`}
                maxLength={field.length}
                value={currentDate[field.dateIndex]}
                aria-label={
                  field.label === "YYYY" ? `${label} year` : undefined
                }
                onChange={({ target: { value } }) => {
                  handleChange(value, field.dateIndex, field.length, inputIndex)
                }}
                onFocus={() => {
                  setFocused(true)
                  inputsRef.current[inputIndex].select()
                }}
                onBlur={({ target: { value } }) => {
                  handleBlur(value, field.dateIndex, field.length, inputIndex)
                }}
                ref={(el: HTMLInputElement) => {
                  inputsRef.current[inputIndex] = el
                }}
                className={inputClasses}
              />
            </div>
          ))}
        </div>
        <FormHelpers.Message
          error={error?.message?.replace(name, label)}
          helpText={helpText}
          isTouched={isTouched}
        />
      </div>
    </div>
  )
}

export default DateMonthYearInput
