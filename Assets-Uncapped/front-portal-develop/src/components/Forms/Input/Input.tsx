import React, { useId, useState } from "react"
import "intl-tel-input/styles"
import { VisibilityOutlined, VisibilityOffOutlined } from "@material-ui/icons"
import { cva, VariantProps } from "class-variance-authority"
import { Iso2 } from "intl-tel-input/data"
import IntlTelInput from "intl-tel-input/reactWithUtils"
import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form"
import { IMaskInput } from "react-imask"
import { twMerge } from "tailwind-merge"
import FormHelpers from "../FormHelpers"

interface InputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  type?: "text" | "email" | "password" | "number"
  defaultValue?: PathValue<TFieldValues, TName>
  name: TName
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  control: Control<TFieldValues>
  currency?: string
  maxLength?: number
  charCount?: number
  charCountAlertOver?: number
  helpText?: React.ReactNode
  renderType?: "normal" | "currency" | "mask" | "phone"
  padFractionalZeros?: boolean
  mask?: string
  country?: string
  onChange?: (selected: string) => void
  className?: string
  inputClassName?: string
  pattern?: string
  inputMode?: "numeric" | "decimal"
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  icon?: React.ReactNode
  renderError?: boolean
  hideLabel?: boolean
}

const ToggleVisibility = ({
  isOpen,
  toggle,
}: {
  isOpen: boolean
  toggle: (newState: boolean) => void
}) => {
  const className =
    "absolute top-1/2 -translate-y-1/2 right-2.5 text-brand-600 cursor-pointer"

  if (isOpen) {
    return (
      <VisibilityOffOutlined
        className={className}
        onClick={() => {
          toggle(false)
        }}
      />
    )
  }

  return (
    <VisibilityOutlined
      className={className}
      onClick={() => {
        toggle(true)
      }}
    />
  )
}

const inputVariants = cva(
  [
    "w-full h-11 px-2.5",
    "text-sm text-(--color-text-primary) bg-(--color-input-background) border",
    "rounded-lg transition-all",
    "placeholder:text-sm placeholder:text-(--color-text-disabled)",
    "[type='number']:appearance-[textfield]",
    "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
    "[&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0",
    "focus:outline-none focus:ring",
    "disabled:text-neutral-500 disabled:bg-(--color-input-background-disabled) disabled:border-(--color-input-border-disabled)",
  ],
  {
    variants: {
      invalid: {
        true: [
          "border-(--color-input-border-error) focus:border-(--color-input-border-error) focus:ring-(--color-input-border-error)",
        ],
        false:
          "border-(--color-input-border) focus:border-(--color-input-border-active) focus:ring-(--color-input-border-active)",
      },
    },
  }
)

const messageVariants = cva(["mt-1 text-xs"], {
  variants: {
    variant: {
      default: "text-neutral-600",
      error: "text-(--color-text-error)",
      info: "text-neutral-800",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface MessageProps extends React.PropsWithChildren<
  VariantProps<typeof messageVariants>
> {
  className?: string
}

const Message = ({ variant, className, children }: MessageProps) => {
  return (
    <p className={twMerge(messageVariants({ variant }), className)}>
      {children}
    </p>
  )
}

function getFormattedErrorMessage(
  errorMessage: string | undefined,
  name: string,
  label: string | undefined,
  renderError: boolean
): string | undefined {
  if (!renderError || !errorMessage) return undefined
  const firstWord = errorMessage.split(" ")[0]
  if (firstWord === name && label) {
    return errorMessage.replace(name, label)
  }
  return errorMessage
}

const Input = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  type = "text",
  defaultValue = "" as PathValue<TFieldValues, TName>,
  name,
  label,
  placeholder,
  disabled = false,
  readonly = false,
  control,
  currency = "$",
  padFractionalZeros = true,
  maxLength,
  mask = "",
  charCount,
  charCountAlertOver,
  helpText,
  renderType = "normal",
  country = "US",
  onChange = () => null,
  className,
  inputClassName,
  pattern,
  inputMode,
  onBlur = () => null,
  onFocus = () => null,
  onKeyDown = () => null,
  icon,
  renderError = true,
  hideLabel = false,
}: InputProps<TFieldValues, TName>) => {
  const currentId = useId()
  const [showPassword, setShowPassword] = useState(false)
  const shouldRenderLabel = label && !hideLabel

  const {
    field: { ref, ...inputProps },
    fieldState: { invalid, isTouched, error },
  } = useController({
    name,
    control,
    defaultValue,
  })

  const isInvalid = invalid && isTouched

  const inputClasses = inputVariants({
    invalid: isInvalid,
  })

  return (
    <div className={twMerge(className)}>
      {shouldRenderLabel && (
        <FormHelpers.Label htmlFor={currentId} disabled={disabled}>
          {label}
        </FormHelpers.Label>
      )}
      <div className="relative">
        {renderType === "currency" && (
          <IMaskInput
            placeholder={placeholder || label}
            id={currentId}
            disabled={disabled}
            readOnly={readonly}
            mask={`${currency}num`}
            unmask
            blocks={{
              num: {
                mask: Number,
                thousandsSeparator: ",",
                padFractionalZeros,
                radix: ".",
              },
            }}
            value={String(inputProps.value)}
            onAccept={(value) => {
              inputProps.onChange(value)
            }}
            data-testid={inputProps.name}
            onBlur={inputProps.onBlur}
            inputRef={ref}
            inputMode="decimal"
            className={twMerge(inputClasses, inputClassName)}
          />
        )}

        {renderType === "mask" && (
          <IMaskInput
            placeholder={label}
            id={currentId}
            disabled={disabled}
            readOnly={readonly}
            mask={mask}
            unmask
            pattern={pattern}
            value={inputProps.value}
            onAccept={inputProps.onChange}
            onBlur={inputProps.onBlur}
            data-testid={inputProps.name}
            inputRef={ref}
            inputMode={inputMode || "numeric"}
            className={twMerge(inputClasses, inputClassName)}
          />
        )}

        {type === "password" && (
          <>
            <input
              type={showPassword ? "text" : "password"}
              placeholder={label}
              id={currentId}
              disabled={disabled}
              readOnly={readonly}
              {...inputProps}
              className={twMerge(inputClasses, inputClassName)}
              maxLength={maxLength}
              data-testid={inputProps.name}
              ref={ref}
            />

            {inputProps.value && (
              <ToggleVisibility
                isOpen={showPassword}
                toggle={setShowPassword}
              />
            )}
          </>
        )}

        {renderType === "normal" && type !== "password" && (
          <input
            type={type}
            placeholder={placeholder || label}
            id={currentId}
            disabled={disabled}
            readOnly={readonly}
            {...inputProps}
            className={twMerge(inputClasses, inputClassName)}
            maxLength={maxLength}
            data-testid={inputProps.name}
            ref={ref}
            pattern={pattern}
            inputMode={inputMode}
            onBlur={(e) => {
              onBlur(e)
              inputProps.onBlur()
            }}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
          />
        )}

        {renderType === "phone" && (
          <IntlTelInput
            initOptions={{
              initialCountry: country.toLowerCase() as Iso2,
              strictMode: true,
              containerClass: "block w-full u-phone-input",
              formatOnDisplay: false,
              formatAsYouType: false,
            }}
            {...inputProps}
            inputProps={{
              id: currentId,
              className: twMerge(inputClasses),
              onBlur: inputProps.onBlur,
              autoComplete: "tel",
            }}
            disabled={disabled}
            initialValue={inputProps.value}
            onChangeNumber={(value: string) => {
              // If this is the same value, don't call onChange otherwise it re-renders infinitely
              if (inputProps.value === value) {
                return
              }

              inputProps.onChange(value)
              inputProps.onBlur()
              onChange(value)
            }}
          />
        )}
        {icon && (
          <div className="[&_svg]:absolute [&_svg]:top-1/2 [&_svg]:right-2.5 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:-translate-y-1/2 [&_svg]:text-neutral-800">
            {icon}
          </div>
        )}
      </div>
      {(error || charCount || helpText) && (
        <div className="flex gap-x-4">
          <div className="flex-1">
            <FormHelpers.Message
              error={getFormattedErrorMessage(
                error?.message,
                name,
                label,
                renderError
              )}
              helpText={helpText}
              isTouched={isTouched}
            />
          </div>
          <div className="w-auto">
            {charCount && (
              <Message
                variant={
                  !!charCountAlertOver &&
                  inputProps.value.length > charCountAlertOver
                    ? "error"
                    : "default"
                }
                className="text-right"
              >
                {inputProps.value.length} / {charCount}
              </Message>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Input
