import { Meta } from "@storybook/react-vite"
import { useForm } from "react-hook-form"
import MultipleRadio from "./MultipleRadio"

export default {
  title: "Forms/MultipleRadio",
  component: MultipleRadio,
} as Meta<typeof MultipleRadio>

export const Default = () => {
  const { control } = useForm()

  return (
    <MultipleRadio
      label="Are you the CEO?"
      subtitle="This is a subtitle"
      name="ceo"
      options={[
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ]}
      control={control}
    />
  )
}

export const Preselected = () => {
  const { control } = useForm({ defaultValues: { ceo: "yes" } })

  return (
    <MultipleRadio
      label="Are you the CEO?"
      name="ceo"
      options={[
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ]}
      control={control}
    />
  )
}

export const WithSub = () => {
  const { control } = useForm({ defaultValues: { ceo: "yes" } })

  return (
    <MultipleRadio
      label="Are you the CEO?"
      name="ceo"
      options={[
        { value: "yes", label: "Yes", sub: "some sub text" },
        { value: "no", label: "No", sub: "some sub text" },
      ]}
      control={control}
    />
  )
}

export const WithSubtitle = () => {
  const { control } = useForm()

  return (
    <MultipleRadio
      label="Select repayment method"
      subtitle="Choose how you'd like to repay your funding"
      name="repayment"
      options={[
        {
          value: "fixed",
          label: "Fixed payments",
          sub: "Same amount each week",
        },
        {
          value: "revenue",
          label: "Revenue share",
          sub: "Percentage of daily sales",
        },
      ]}
      control={control}
    />
  )
}

export const Compact = () => {
  const { control } = useForm()

  return (
    <MultipleRadio
      label="Select payment frequency"
      name="frequency"
      variant="compact"
      options={[
        { value: "weekly", label: "Weekly", sub: "Every 7 days" },
        { value: "biweekly", label: "Bi-weekly", sub: "Every 14 days" },
        { value: "monthly", label: "Monthly", sub: "Every 30 days" },
      ]}
      control={control}
    />
  )
}

export const CompactPreselected = () => {
  const { control } = useForm({ defaultValues: { plan: "yearly" } })

  return (
    <MultipleRadio
      label="Select subscription plan"
      name="plan"
      variant="compact"
      options={[
        { value: "monthly", label: "Monthly", sub: "$10/mo" },
        { value: "yearly", label: "Yearly", sub: "$100/yr (save 17%)" },
      ]}
      control={control}
    />
  )
}

export const Disabled = () => {
  const { control } = useForm({ defaultValues: { disabled: "yes" } })

  return (
    <MultipleRadio
      label="This option is locked"
      name="disabled"
      options={[
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ]}
      control={control}
      disabled
    />
  )
}

export const DisabledOptions = () => {
  const { control } = useForm()

  return (
    <MultipleRadio
      label="Select account type"
      name="accountType"
      options={[
        { value: "personal", label: "Personal", sub: "For individuals" },
        {
          value: "business",
          label: "Business",
          sub: "For companies",
          disabled: true,
        },
        {
          value: "enterprise",
          label: "Enterprise",
          sub: "Contact sales",
          disabled: true,
        },
      ]}
      control={control}
    />
  )
}

export const Loading = () => {
  const { control } = useForm()

  return (
    <MultipleRadio
      label="Fetching options..."
      name="loading"
      options={[
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
      ]}
      control={control}
      loading
    />
  )
}

export const DefaultYesNo = () => {
  const { control } = useForm()

  return (
    <MultipleRadio
      label="Is this your primary business?"
      name="primaryBusiness"
      control={control}
    />
  )
}

export const ManyOptions = () => {
  const { control } = useForm()

  return (
    <MultipleRadio
      label="Select your industry"
      name="industry"
      options={[
        { value: "tech", label: "Technology", sub: "Software, hardware, IT" },
        {
          value: "finance",
          label: "Finance",
          sub: "Banking, investments, insurance",
        },
        {
          value: "healthcare",
          label: "Healthcare",
          sub: "Medical, pharmaceutical",
        },
        {
          value: "retail",
          label: "Retail",
          sub: "E-commerce, brick and mortar",
        },
        {
          value: "manufacturing",
          label: "Manufacturing",
          sub: "Production, assembly",
        },
      ]}
      control={control}
    />
  )
}
