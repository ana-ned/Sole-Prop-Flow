import { Meta } from "@storybook/react-vite"
import { useForm } from "react-hook-form"
import Select from "./Select"

export default {
  title: "Forms/Select",
  component: Select,
} as Meta<typeof Select>

export const Default = () => {
  const { control } = useForm()

  return (
    <Select
      label="Account Type"
      name="accountType"
      options={[
        { value: "checking", label: "Checking" },
        { value: "funding", label: "Funding" },
      ]}
      control={control}
    />
  )
}

export const Prefilled = () => {
  const { control } = useForm()

  return (
    <Select
      label="Account Type"
      name="accountType"
      options={[
        { value: "checking", label: "Checking" },
        { value: "funding", label: "Funding" },
      ]}
      control={control}
      defaultValue="checking"
    />
  )
}

export const Multiple = () => {
  const { control } = useForm()

  return (
    <Select
      placeholder="Select multiple"
      name="accountType"
      options={[
        { value: "checking", label: "Checking" },
        { value: "funding", label: "Funding" },
        { value: "loc", label: "Line of credit" },
      ]}
      control={control}
      isMulti
    />
  )
}

export const Disabled = () => {
  const { control } = useForm()

  return (
    <Select
      label="Account Type"
      name="accountType"
      options={[
        { value: "checking", label: "Checking" },
        { value: "funding", label: "Funding" },
      ]}
      control={control}
      defaultValue="checking"
      disabled
    />
  )
}

export const Searchable = () => {
  const { control } = useForm()

  return (
    <Select
      label="Select a country"
      name="country"
      options={[
        { value: "us", label: "United States" },
        { value: "uk", label: "United Kingdom" },
        { value: "ca", label: "Canada" },
        { value: "au", label: "Australia" },
        { value: "de", label: "Germany" },
        { value: "fr", label: "France" },
        { value: "jp", label: "Japan" },
      ]}
      control={control}
      searchable
    />
  )
}

export const WithHelpText = () => {
  const { control } = useForm()

  return (
    <Select
      label="Payment frequency"
      name="frequency"
      options={[
        { value: "weekly", label: "Weekly" },
        { value: "biweekly", label: "Bi-weekly" },
        { value: "monthly", label: "Monthly" },
      ]}
      control={control}
      helpText="Select how often you'd like to receive payments"
    />
  )
}

export const WithSubtitles = () => {
  const { control } = useForm()

  return (
    <Select
      label="Select an account"
      name="account"
      options={[
        { value: "checking", label: "Business Checking", sub: "**** 1234" },
        { value: "savings", label: "Business Savings", sub: "**** 5678" },
        { value: "funding", label: "Funding Account", sub: "**** 9012" },
      ]}
      control={control}
    />
  )
}

export const SmallSize = () => {
  const { control } = useForm()

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm">Currency:</span>
      <div className="w-24">
        <Select
          name="currency"
          options={[
            { value: "USD", label: "USD" },
            { value: "EUR", label: "EUR" },
            { value: "GBP", label: "GBP" },
          ]}
          control={control}
          defaultValue="USD"
          size="small"
        />
      </div>
    </div>
  )
}

export const DarkTheme = () => {
  const { control } = useForm()

  return (
    <div className="rounded-lg bg-neutral-100 p-4">
      <Select
        label="Select currency"
        name="currency"
        options={[
          { value: "USD", label: "USD" },
          { value: "EUR", label: "EUR" },
          { value: "GBP", label: "GBP" },
        ]}
        control={control}
        defaultValue="USD"
        theme="dark"
      />
    </div>
  )
}

export const CustomPlaceholder = () => {
  const { control } = useForm()

  return (
    <Select
      label="Industry"
      name="industry"
      options={[
        { value: "tech", label: "Technology" },
        { value: "finance", label: "Finance" },
        { value: "healthcare", label: "Healthcare" },
        { value: "retail", label: "Retail" },
      ]}
      control={control}
      placeholder="Choose your industry..."
    />
  )
}

export const MultiplePrefilled = () => {
  const { control } = useForm({
    defaultValues: {
      tags: ["tech", "finance"],
    },
  })

  return (
    <Select
      label="Select tags"
      name="tags"
      options={[
        { value: "tech", label: "Technology" },
        { value: "finance", label: "Finance" },
        { value: "healthcare", label: "Healthcare" },
        { value: "retail", label: "Retail" },
      ]}
      control={control}
      isMulti
    />
  )
}
