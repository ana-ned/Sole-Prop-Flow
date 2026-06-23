import { useState, useRef, useId, useEffect } from "react"
import { debounce, trimEnd } from "lodash-es"
import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form"
import { twMerge } from "tailwind-merge"
import FormHelpers from "../FormHelpers"

interface InputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  defaultValue?: PathValue<TFieldValues, TName>
  name: TName
  label?: string
  disabled?: boolean
  readonly?: boolean
  control: Control<TFieldValues>
  className?: string
  helpText?: string
  outputSeparator?: "/" | "-" | "."
  inputFormat?: "US" | "EU"
  outputFormat?: string[]
}

const DateInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  defaultValue,
  name,
  label = "",
  disabled = false,
  readonly = false,
  inputFormat = "EU",
  outputFormat = ["YYYY", "MM", "DD"],
  outputSeparator = "-",
  control,
  className,
  helpText,
}: InputProps<TFieldValues, TName>) => {
  const placeholders =
    inputFormat === "EU" ? ["DD", "MM", "YYYY"] : ["MM", "DD", "YYYY"]

  const {
    field: { onChange, onBlur, ...fieldProps },
    fieldState: { invalid, isTouched, error },
  } = useController({
    name,
    control,
    defaultValue,
  })

  const inputsRef = useRef<HTMLInputElement[]>([])
  const currentId = useId()
  const [currentDate, setCurrentDate] = useState(
    typeof defaultValue === "string" && defaultValue
      ? defaultValue.split(/[./-]/)
      : ["", "", ""]
  )
  const [isFocused, setFocused] = useState(false)
  const isFocusedRef = useRef(isFocused)
  isFocusedRef.current = isFocused

  useEffect(() => {
    if (fieldProps.value) {
      setCurrentDate(fieldProps.value?.split(/[./-]/))
    }
  }, [fieldProps.value])

  const handleChange = (value: unknown, index: number, maxLength: number) => {
    if (typeof value === "string") {
      const newDate = [...currentDate]
      newDate[index] = value
      setCurrentDate(newDate)
      onChange(
        newDate.length === 3
          ? trimEnd(newDate.join(outputSeparator), "-")
          : newDate.join(outputSeparator)
      )
    }

    const layoutByIndex = inputFormat === "US" ? [2, 0, 1] : [0, 1, 2]
    const nextInputIndex = layoutByIndex[index - 1]

    if (
      typeof value === "string" &&
      value.length >= maxLength &&
      inputsRef.current[nextInputIndex]?.value.length === 0
    ) {
      inputsRef.current[nextInputIndex].focus()
    }
  }

  const handleBlur = (value: unknown, index: number, maxLength: number) => {
    setFocused(false)
    if (
      typeof value === "string" &&
      value.length > 0 &&
      value.length < maxLength &&
      maxLength <= 2
    ) {
      handleChange(value.padStart(maxLength, "0"), index, maxLength)
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
        <FormHelpers.Label
          htmlFor={`${currentId}-${placeholders[0]}`}
          disabled={disabled}
        >
          {label}
        </FormHelpers.Label>
      )}
      <div className={twMerge("max-w-[340px]", className)}>
        <div className="flex flex-row gap-3">
          {placeholders.map((placeholder) => {
            const indexOfControl = outputFormat.indexOf(placeholder)
            return (
              <div
                className="max-w-[129px] flex-1"
                key={`${indexOfControl}-${placeholder}`}
                style={{ flexGrow: placeholder.length }}
              >
                <input
                  type="number"
                  readOnly={readonly}
                  disabled={disabled}
                  placeholder={placeholder}
                  inputMode="numeric"
                  id={`${currentId}-${placeholder}`}
                  data-testid={`${name}-${placeholder}`}
                  maxLength={placeholder.length}
                  value={currentDate[indexOfControl]}
                  aria-label={
                    placeholder === placeholders[0]
                      ? undefined
                      : `${label} ${placeholder.toLowerCase()}`
                  }
                  onChange={({ target: { value } }) => {
                    handleChange(value, indexOfControl, placeholder.length)
                  }}
                  onFocus={() => {
                    setFocused(true)
                    inputsRef.current[indexOfControl].select()
                  }}
                  onBlur={({ target: { value } }) => {
                    handleBlur(value, indexOfControl, placeholder.length)
                  }}
                  ref={(el: HTMLInputElement) => {
                    inputsRef.current[indexOfControl] = el
                  }}
                  className={inputClasses}
                />
              </div>
            )
          })}
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

export default DateInput
