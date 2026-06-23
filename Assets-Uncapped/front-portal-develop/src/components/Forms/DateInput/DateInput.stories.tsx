import { Meta } from "@storybook/react-vite"
import { useForm } from "react-hook-form"
import DateInput from "./DateInput"

export default {
  title: "Forms/DateInput",
  component: DateInput,
} as Meta<typeof DateInput>

export const Default = () => {
  const { control } = useForm()

  return (
    <div className="flex flex-col gap-4">
      {["US", "EU"].map((format) => (
        <DateInput
          key={format}
          label={`Date of incorporation (${format})`}
          name={`incorporationDate${format}`}
          control={control}
          inputFormat={format as "US" | "EU"}
        />
      ))}
    </div>
  )
}

export const IsoFormat = () => {
  const { control } = useForm()

  return (
    <DateInput
      label="Date of incorporation"
      name="incorporationDate"
      control={control}
      defaultValue="2000-12-31"
      inputFormat="US"
      outputSeparator="-"
    />
  )
}

export const Disabled = () => {
  const { control } = useForm()

  return (
    <DateInput
      label="Date of incorporation"
      name="incorporationDate"
      control={control}
      defaultValue="12-31-2000"
      disabled
    />
  )
}

export const ReadOnly = () => {
  const { control } = useForm()

  return (
    <DateInput
      label="Date of incorporation"
      name="incorporationDate"
      control={control}
      defaultValue="12-31-2000"
      readonly
    />
  )
}

export const WithHelpText = () => {
  const { control } = useForm()

  return (
    <DateInput
      label="Date of birth"
      name="dateOfBirth"
      control={control}
      helpText="Enter your date of birth as shown on your ID"
    />
  )
}

export const DotSeparator = () => {
  const { control, watch } = useForm()

  return (
    <>
      <DateInput
        label="Date with dot separator"
        name="dotDate"
        control={control}
        outputSeparator="."
      />
      <p className="mt-2">Value: {watch("dotDate")}</p>
    </>
  )
}

export const SlashSeparator = () => {
  const { control, watch } = useForm()

  return (
    <>
      <DateInput
        label="Date with slash separator"
        name="slashDate"
        control={control}
        outputSeparator="/"
      />
      <p className="mt-2">Value: {watch("slashDate")}</p>
    </>
  )
}
