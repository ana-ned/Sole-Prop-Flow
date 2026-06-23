import { Meta } from "@storybook/react-vite"
import { useForm } from "react-hook-form"
import GoogleAutocompleteInput from "./GoogleAutocompleteInput"

export default {
  title: "Forms/GoogleAutocompleteInput",
  component: GoogleAutocompleteInput,
} as Meta<typeof GoogleAutocompleteInput>

export const Default = () => {
  const { control } = useForm()

  return (
    <GoogleAutocompleteInput
      name="googleAutocomplete"
      label="Type to search"
      control={control}
      onSelect={(address) => {
        console.log(address)
      }}
    />
  )
}

export const OnlyUS = () => {
  const { control } = useForm()

  return (
    <GoogleAutocompleteInput
      name="googleAutocomplete"
      label="Type to search"
      control={control}
      country={["USA"]}
      onSelect={(address) => {
        console.log(address)
      }}
    />
  )
}

export const MultipleCountries = () => {
  const { control } = useForm()

  return (
    <GoogleAutocompleteInput
      name="googleAutocomplete"
      label="Search in US, UK, or Canada"
      control={control}
      country={["US", "GB", "CA"]}
      onSelect={(address) => {
        console.log(address)
      }}
    />
  )
}

export const Disabled = () => {
  const { control } = useForm({
    defaultValues: {
      googleAutocomplete: "123 Main Street, New York, NY 10001",
    },
  })

  return (
    <GoogleAutocompleteInput
      name="googleAutocomplete"
      label="Address (locked)"
      control={control}
      disabled
      onSelect={(address) => {
        console.log(address)
      }}
    />
  )
}

export const Prefilled = () => {
  const { control } = useForm({
    defaultValues: {
      googleAutocomplete: "1600 Amphitheatre Parkway, Mountain View, CA",
    },
  })

  return (
    <GoogleAutocompleteInput
      name="googleAutocomplete"
      label="Business address"
      control={control}
      onSelect={(address) => {
        console.log(address)
      }}
    />
  )
}
