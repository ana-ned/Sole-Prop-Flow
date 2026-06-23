import { useState, useEffect, useId } from "react"
import { twMerge } from "tailwind-merge"
import { isToday, parse, addDays, isTomorrow } from "date-fns"
import DayPickerInput from "react-day-picker/DayPickerInput"
import "react-day-picker/lib/style.css"
import {
  DayPickerInputProps,
  DayPickerProps,
} from "react-day-picker/types/Props"
import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ReactComponent as EventIcon } from "../../../svgs/event.svg"
import { formatDate, DateFormat } from "../../../utils/date"
import FormHelpers from "../FormHelpers"

interface DatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName
  label: string
  disabled?: boolean
  defaultValue?: PathValue<TFieldValues, TName>
  pastRestrict?: boolean
  restrictToday?: boolean
  futureDayLimit?: number
  defaultValueFormat?: string
  control: Control<TFieldValues>
  excludeWeekends?: boolean
}

const DatePicker = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  disabled = false,
  defaultValue,
  pastRestrict = false,
  restrictToday = false,
  futureDayLimit,
  defaultValueFormat = "dd-MM-yyyy",
  control,
  excludeWeekends = false,
}: DatePickerProps<TFieldValues, TName>) => {
  const currentId = useId()
  const [renderedDay, setRenderedDay] = useState<string | undefined>()
  const { t } = useTranslation()

  const {
    field: { ref, ...inputProps },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    defaultValue,
  })

  useEffect(() => {
    if (inputProps.value) {
      const date = parse(inputProps.value, defaultValueFormat, new Date())
      const formattedDate = formatDate(date, {
        format:
          isToday(date) || isTomorrow(date)
            ? DateFormat.SHORT
            : DateFormat.LONG,
      })
      setRenderedDay(formattedDate)
    } else {
      setRenderedDay(undefined)
    }
  }, [inputProps.value, defaultValueFormat, t])

  const dayPickerProps: DayPickerProps = {
    disabledDays: [
      {
        // @ts-expect-error: issues with lib typings
        before: pastRestrict ? new Date() : undefined,
        // @ts-expect-error: issues with lib typings
        after: futureDayLimit ? addDays(new Date(), futureDayLimit) : undefined,
      },
      {
        // @ts-expect-error: issues with lib typings
        daysOfWeek: excludeWeekends ? [0, 6] : undefined,
      },
      restrictToday ? new Date() : undefined,
    ],
    fixedWeeks: true,
    fromMonth: pastRestrict ? new Date() : undefined,
    toMonth: futureDayLimit ? addDays(new Date(), futureDayLimit) : undefined,
    firstDayOfWeek: 1,
  }

  const inputClasses = twMerge(
    "h-11 w-full cursor-pointer rounded-lg border border-(--color-input-border) bg-(--color-input-background) pr-10 pl-2.5 text-sm text-(--color-text-primary) transition-all",
    "placeholder:text-sm placeholder:text-(--color-text-disabled)",
    "focus:border-(--color-input-border-active) focus:ring-(--color-input-border-active) focus:outline-none focus:ring",
    "disabled:text-neutral-500 disabled:bg-(--color-input-background-disabled) disabled:border-(--color-input-border-disabled)",
    invalid && "border-(--color-input-border-error)"
  )

  return (
    <div>
      <FormHelpers.Label htmlFor={currentId} disabled={disabled}>
        {label}
      </FormHelpers.Label>
      <DayPickerInput
        inputProps={{ ref: null }}
        // eslint-disable-next-line react/no-unstable-nested-components
        component={(props: DayPickerInputProps) => (
          <>
            <div className="relative w-full">
              <input
                type="text"
                name={name}
                placeholder={label}
                id={currentId}
                onFocus={props.onFocus}
                onBlur={(e) => {
                  props.onBlur!(e)
                  inputProps.onBlur()
                }}
                value={renderedDay}
                disabled={disabled}
                ref={ref}
                readOnly
                className={inputClasses}
              />
              <EventIcon
                className={twMerge(
                  "text-brand-600 pointer-events-none absolute top-1/2 right-2.5 size-5 -translate-y-1/2",
                  disabled && "opacity-50"
                )}
              />
            </div>
            <FormHelpers.Message error={error?.message?.replace(name, label)} />
          </>
        )}
        value={inputProps.value}
        onDayChange={(value) => {
          inputProps.onChange(
            formatDate(value, { customFormat: defaultValueFormat })
          )
          setTimeout(() => {
            inputProps.onBlur()
          }, 100)
        }}
        style={{ width: "100%" }}
        dayPickerProps={dayPickerProps}
      />
    </div>
  )
}

export default DatePicker
