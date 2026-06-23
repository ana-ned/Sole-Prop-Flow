import React, { useId, isValidElement, ReactNode } from "react"
import { Control, FieldPath, FieldValues, useController } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { twMerge } from "tailwind-merge"
import SanitizedHtml from "../../Basic/SanitizedHtml/SanitizedHtml"
import Typography from "../../Basic/Typography"
import Loader from "../../UI/Loader"
import FormHelpers from "../FormHelpers"

interface MultipleRadioProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName
  control: Control<TFieldValues>
  options?: {
    value: string
    label: ReactNode
    sub?: string
    disabled?: boolean
  }[]
  label?: string
  subtitle?: string
  className?: string
  variant?: "default" | "compact"
  disabled?: boolean
  loading?: boolean
}

const MultipleRadio = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  options = [],
  label,
  subtitle,
  className,
  variant = "default",
  disabled = false,
  loading = false,
}: MultipleRadioProps<TFieldValues, TName>) => {
  const currentId = useId()
  const { t } = useTranslation("common")

  const {
    field: { onChange, onBlur, ...inputProps },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  })

  if (options.length === 0) {
    options = [
      { value: "yes", label: t("multipleRadio.yes"), disabled },
      { value: "no", label: t("multipleRadio.no"), disabled },
    ]
  }

  return (
    <div>
      {label && (
        <FormHelpers.Label
          disabled={disabled}
          className={subtitle ? "mb-0" : undefined}
        >
          {label}
        </FormHelpers.Label>
      )}
      {subtitle && (
        <Typography color="neutral-600" className="mb-2">
          <SanitizedHtml as="span" content={subtitle} />
        </Typography>
      )}
      <fieldset
        className={twMerge(
          "relative mt-2 overflow-hidden rounded-xl bg-white p-2 shadow-[0_1px_4px_0_rgb(0_0_0_/0.02),0_1px_4px_0_rgb(0_0_0_/0.05)]",
          className
        )}
      >
        {options.map((item) => (
          <div
            key={item.value}
            className="relative cursor-pointer rounded-lg bg-white not-last:mb-2"
          >
            <input
              {...inputProps}
              onBlur={onBlur}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onChange(e)
                onBlur()
              }}
              type="radio"
              id={currentId + item.value}
              value={item.value}
              checked={item.value === inputProps.value}
              data-testid={`${inputProps.name}.${item.value}`}
              disabled={disabled || item.disabled}
              className="peer pointer-events-none absolute top-0 left-0 opacity-0"
            />
            <label
              htmlFor={currentId + item.value}
              className={twMerge(
                "relative flex cursor-pointer flex-col items-start rounded-xl border-2 border-transparent p-2 pr-[50px] text-neutral-800",
                "after:absolute after:top-1/2 after:right-2 after:block after:h-6 after:w-6 after:-translate-y-1/2 after:rounded-full after:border after:border-neutral-800 after:transition-all after:duration-300 after:ease-in-out after:content-['']",
                "before:bg-brand-600 before:absolute before:top-1/2 before:right-2 before:mr-3 before:h-3 before:w-3 before:translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:opacity-0 before:transition-all before:duration-300 before:ease-in-out before:content-['']",
                "peer-checked:after:border-brand-600 peer-checked:before:opacity-100",
                "peer-focus-visible:border-brand-400",
                invalid && "text-error-600 before:border-error-600",
                (disabled || item.disabled) &&
                  "after:border-neutral-300 [&_p]:text-neutral-300! [&_span]:text-neutral-300!",
                variant === "compact" &&
                  "flex-row! items-center! justify-between! pr-8! before:right-0! after:top-1/2! after:right-0!"
              )}
            >
              {variant === "default" && (
                <>
                  {isValidElement(item.label) ? (
                    item.label
                  ) : (
                    <Typography type="smallTitle" color="neutral-800">
                      {/* @ts-expect-error checked in isValidElement */}
                      <SanitizedHtml as="span" content={item.label} />
                    </Typography>
                  )}
                  {item.sub && (
                    <Typography type="smallCopy" color="neutral-700" tag="span">
                      {item.sub}
                    </Typography>
                  )}
                </>
              )}

              {variant === "compact" && (
                <>
                  <div className="flex items-center gap-2">
                    {isValidElement(item.label) ? (
                      item.label
                    ) : (
                      <Typography type="smallTitle" color="neutral-800">
                        {/* @ts-expect-error checked in isValidElement */}
                        <SanitizedHtml as="span" content={item.label} />
                      </Typography>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.sub && (
                      <Typography
                        type="smallCopy"
                        color="neutral-700"
                        className="text-right"
                      >
                        {item.sub}
                      </Typography>
                    )}
                  </div>
                </>
              )}
            </label>
          </div>
        ))}
        <FormHelpers.Message
          error={label ? error?.message?.replace(name, label) : error?.message}
        />
        {loading && <Loader size="xs" overlay />}
      </fieldset>
    </div>
  )
}

export default MultipleRadio
