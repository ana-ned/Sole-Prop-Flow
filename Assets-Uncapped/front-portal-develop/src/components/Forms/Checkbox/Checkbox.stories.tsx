import { Meta } from "@storybook/react-vite"
import { useForm } from "react-hook-form"
import Checkbox from "./Checkbox"

export default {
  title: "Forms/Checkbox",
  component: Checkbox,
} as Meta<typeof Checkbox>

export const Normal = () => {
  const { control } = useForm()

  return (
    <Checkbox
      control={control}
      label="I confirm that all owners who own 25% or more of the business are listed above."
      name="name"
    />
  )
}

export const Checked = () => {
  const { control } = useForm({
    defaultValues: {
      name: true,
    },
  })

  return (
    <Checkbox
      control={control}
      label="I confirm that all owners who own 25% or more of the business are listed above."
      name="name"
    />
  )
}

export const Disabled = () => {
  const { control } = useForm()

  return (
    <Checkbox
      control={control}
      label="This checkbox is disabled"
      name="name"
      disabled
    />
  )
}

export const DisabledChecked = () => {
  const { control } = useForm({
    defaultValues: {
      name: true,
    },
  })

  return (
    <Checkbox
      control={control}
      label="This checkbox is disabled and checked"
      name="name"
      disabled
    />
  )
}

export const NoLabel = () => {
  const { control } = useForm()

  return <Checkbox control={control} name="name" />
}
