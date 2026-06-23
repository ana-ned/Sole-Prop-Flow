import { Control, FieldPath, FieldValues, useController } from "react-hook-form"
import ReactSlider from "react-slider"
import { twMerge } from "tailwind-merge"
import { currencyToSymbol } from "../../../utils/money"
import Typography from "../../Basic/Typography"
import FormHelpers from "../FormHelpers"
import Input from "../Input"

interface SliderInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName
  control: Control<TFieldValues>
  min: number
  max: number
  label?: string
  currency?: string
  className?: string
  roundedStep?: boolean
  customStep?: number
  disabled?: boolean
}

const SliderInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  min,
  max,
  label,
  currency,
  className,
  roundedStep = true,
  customStep,
  disabled = false,
}: SliderInputProps<TFieldValues, TName>) => {
  const { field, fieldState } = useController({
    name,
    control,
  })

  if (min === max) {
    return null
  }

  const step =
    customStep ||
    (roundedStep
      ? Math.min(Math.round((max - min) / 20), 10000)
      : Math.round((max - min) / 20))

  return (
    <div>
      {label && (
        <div className="mb-3 flex items-center gap-x-4">
          <div className="flex-1">
            <Typography type="bodyMedium" className="text-xl">
              {label}
            </Typography>
          </div>
          <div className="w-auto">
            <Input
              className="!mt-0 [&_input]:h-10 [&_input]:max-w-[175px] [&_input]:text-center [&_input]:font-semibold"
              name={name}
              control={control}
              renderType={currency ? "currency" : undefined}
              currency={currency ? currencyToSymbol(currency) : undefined}
              renderError={false}
              padFractionalZeros={false}
              disabled={disabled}
            />
          </div>
        </div>
      )}
      <ReactSlider
        value={field.value}
        min={min}
        max={max}
        step={step > 0 ? step : 1}
        onChange={(selected) => {
          if (selected < min) {
            field.onChange(min)
          } else if (selected > max) {
            field.onChange(max)
          } else {
            field.onChange(selected)
          }
          field.onBlur()
        }}
        className={twMerge(
          "slider-input",
          className,
          disabled && "slider-disabled"
        )}
        thumbClassName="sliderThumb"
        trackClassName="sliderTrack"
        disabled={disabled}
      />
      <FormHelpers.Message error={fieldState.error?.message} />
    </div>
  )
}

export default SliderInput
