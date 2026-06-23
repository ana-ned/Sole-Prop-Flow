import { Meta } from "@storybook/react-vite"
import { useForm } from "react-hook-form"
import CheckboxGroup from "./CheckboxGroup"

export default {
  title: "Forms/CheckboxGroup",
  component: CheckboxGroup,
} as Meta<typeof CheckboxGroup>

export const Normal = () => {
  const { register } = useForm()

  return (
    <CheckboxGroup
      register={register}
      options={[
        { label: "value a", value: "a" },
        { label: "value b", value: "b" },
        { label: "value c", value: "c" },
      ]}
      name="name"
    />
  )
}

export const Disabled = () => {
  const { register } = useForm()

  return (
    <CheckboxGroup
      register={register}
      options={[
        { label: "value a", value: "a" },
        { label: "value b", value: "b", disabled: true },
        { label: "value c", value: "c" },
      ]}
      name="name"
    />
  )
}

export const Preselected = () => {
  const { register } = useForm({ defaultValues: { preselected: ["b"] } })

  return (
    <CheckboxGroup
      register={register}
      options={[
        { label: "value a", value: "a" },
        { label: "value b", value: "b" },
        { label: "value c", value: "c" },
      ]}
      name="preselected"
    />
  )
}

export const WithLabel = () => {
  const { register } = useForm()

  return (
    <CheckboxGroup
      register={register}
      label="Select your interests"
      options={[
        { label: "Technology", value: "tech" },
        { label: "Finance", value: "finance" },
        { label: "Healthcare", value: "health" },
      ]}
      name="interests"
    />
  )
}

export const WithHelpText = () => {
  const { register } = useForm()

  return (
    <CheckboxGroup
      register={register}
      label="Product features"
      helpText="Select the features you need for your plan"
      options={[
        { label: "Analytics Dashboard", value: "analytics" },
        { label: "Custom Reports", value: "reports" },
        { label: "API Access", value: "api" },
      ]}
      name="features"
    />
  )
}

export const Reverse = () => {
  const { register } = useForm()

  return (
    <CheckboxGroup
      register={register}
      label="Notification preferences"
      options={[
        { label: "Email notifications", value: "email" },
        { label: "SMS notifications", value: "sms" },
        { label: "Push notifications", value: "push" },
      ]}
      name="notifications"
      reverse
    />
  )
}

export const AllDisabled = () => {
  const { register } = useForm({ defaultValues: { disabled: ["a", "c"] } })

  return (
    <CheckboxGroup
      register={register}
      label="Unavailable options"
      options={[
        { label: "value a", value: "a" },
        { label: "value b", value: "b" },
        { label: "value c", value: "c" },
      ]}
      name="disabled"
      disabled
    />
  )
}

export const MixedDisabled = () => {
  const { register } = useForm()

  return (
    <CheckboxGroup
      register={register}
      label="Subscription tiers"
      helpText="Some options require a premium plan"
      options={[
        { label: "Basic features", value: "basic" },
        { label: "Advanced analytics", value: "advanced", disabled: true },
        { label: "Priority support", value: "support", disabled: true },
        { label: "Standard reports", value: "reports" },
      ]}
      name="tiers"
    />
  )
}
