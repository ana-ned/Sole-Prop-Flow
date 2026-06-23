import { Meta } from "@storybook/react-vite"
import { useForm } from "react-hook-form"
import SliderInput from "./SliderInput"

export default {
  title: "Forms/SliderInput",
  component: SliderInput,
} as Meta<typeof SliderInput>

export const Default = () => {
  const { control } = useForm()

  return (
    <SliderInput
      label="Capital"
      currency="GBP"
      min={100}
      max={1000}
      name="sliderInput"
      control={control}
    />
  )
}

export const Compact = () => {
  const { control } = useForm()

  return (
    <SliderInput min={100} max={1000} name="sliderInput" control={control} />
  )
}

export const Disabled = () => {
  const { control } = useForm({
    defaultValues: { sliderInput: 500 },
  })

  return (
    <SliderInput
      label="Capital (Locked)"
      currency="GBP"
      min={100}
      max={1000}
      name="sliderInput"
      control={control}
      disabled
    />
  )
}

export const CustomStep = () => {
  const { control } = useForm({
    defaultValues: { sliderInput: 5000 },
  })

  return (
    <SliderInput
      label="Investment amount"
      currency="USD"
      min={1000}
      max={100000}
      name="sliderInput"
      control={control}
      customStep={1000}
    />
  )
}

export const NoCurrency = () => {
  const { control } = useForm({
    defaultValues: { sliderInput: 50 },
  })

  return (
    <SliderInput
      label="Percentage"
      min={0}
      max={100}
      name="sliderInput"
      control={control}
    />
  )
}

export const LargeRange = () => {
  const { control } = useForm({
    defaultValues: { sliderInput: 500000 },
  })

  return (
    <SliderInput
      label="Funding amount"
      currency="USD"
      min={10000}
      max={1000000}
      name="sliderInput"
      control={control}
    />
  )
}

export const SmallRange = () => {
  const { control } = useForm({
    defaultValues: { sliderInput: 5 },
  })

  return (
    <SliderInput
      label="Number of employees"
      min={1}
      max={10}
      name="sliderInput"
      control={control}
      roundedStep={false}
    />
  )
}
