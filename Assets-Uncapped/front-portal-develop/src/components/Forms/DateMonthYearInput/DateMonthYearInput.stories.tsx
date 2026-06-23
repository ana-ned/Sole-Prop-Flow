import { Meta } from "@storybook/react-vite"
import { useForm } from "react-hook-form"
import DateMonthYearInput from "./DateMonthYearInput"

export default {
  title: "Forms/DateMonthYearInput",
  component: DateMonthYearInput,
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-4">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof DateMonthYearInput>

export const Default = () => {
  const { watch, control } = useForm()

  return (
    <>
      <DateMonthYearInput
        label="Final repayment"
        name="finalRepayment"
        control={control}
      />
      {watch("finalRepayment")}
    </>
  )
}

export const Disabled = () => {
  const { watch, control } = useForm({
    defaultValues: { finalRepayment: "2137-01-31" },
  })

  return (
    <>
      <DateMonthYearInput
        label="Final repayment"
        name="finalRepayment"
        control={control}
        disabled
      />
      {watch("finalRepayment")}
    </>
  )
}

export const ReadOnly = () => {
  const { watch, control } = useForm({
    defaultValues: { finalRepayment: "2137-01-31" },
  })

  return (
    <>
      <DateMonthYearInput
        label="Final repayment"
        name="finalRepayment"
        control={control}
        readonly
      />
      {watch("finalRepayment")}
    </>
  )
}

export const WithHelpText = () => {
  const { watch, control } = useForm()

  return (
    <>
      <DateMonthYearInput
        label="Card expiry date"
        name="expiryDate"
        control={control}
        helpText="Enter the expiry date as shown on your card"
      />
      {watch("expiryDate")}
    </>
  )
}
