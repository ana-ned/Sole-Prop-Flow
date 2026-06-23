import { Meta } from "@storybook/react-vite"
import { addDays } from "date-fns"
import { useForm } from "react-hook-form"
import { formatDate } from "../../../utils/date"
import DatePicker from "./DatePicker"

export default {
  title: "Forms/DatePicker",
  component: DatePicker,
} as Meta<typeof DatePicker>

export const Default = () => {
  const { control } = useForm()

  return <DatePicker label="Date" name="date" control={control} />
}

export const DefaultWithoutWeekends = () => {
  const { control } = useForm()

  return (
    <DatePicker label="Date" name="date" control={control} excludeWeekends />
  )
}

export const Today = () => {
  const { control } = useForm()

  return (
    <DatePicker
      label="Date"
      name="date"
      control={control}
      defaultValue={formatDate(new Date())}
      defaultValueFormat="dd-MM-yyyy"
    />
  )
}

export const Tomorrow = () => {
  const { control } = useForm()

  return (
    <DatePicker
      label="Date"
      name="date"
      control={control}
      defaultValue={formatDate(addDays(new Date(), 1))}
      defaultValueFormat="dd-MM-yyyy"
    />
  )
}

export const ExceptToday = () => {
  const { control } = useForm()

  return (
    <DatePicker
      label="Date"
      name="date"
      control={control}
      defaultValueFormat="dd-MM-yyyy"
      restrictToday
    />
  )
}

export const SingleWeek = () => {
  const { control } = useForm()

  return (
    <DatePicker
      label="Date"
      name="date"
      control={control}
      pastRestrict
      futureDayLimit={7}
    />
  )
}

export const SingleWeekWithoutWeekends = () => {
  const { control } = useForm()

  return (
    <DatePicker
      label="Date"
      name="date"
      control={control}
      pastRestrict
      futureDayLimit={7}
      excludeWeekends
    />
  )
}

export const Disabled = () => {
  const { control } = useForm()

  return <DatePicker label="Date" name="date" control={control} disabled />
}
