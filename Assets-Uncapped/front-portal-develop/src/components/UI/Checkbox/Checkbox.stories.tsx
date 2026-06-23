import { StoryFn, Meta } from "@storybook/react-vite"
import Checkbox from "./Checkbox"

export default {
  title: "Basic/Checkbox",
  component: Checkbox,
} as Meta<typeof Checkbox>

const Template: StoryFn<typeof Checkbox> = (args) => {
  return <Checkbox {...args} />
}

export const Normal = {
  render: Template,
  args: {},
}

export const NormalChecked = {
  render: Template,

  args: {
    checked: true,
  },
}

export const Radio = {
  render: Template,

  args: {
    renderStyle: "radio",
  },
}

export const RadioChecked = {
  render: Template,

  args: {
    renderStyle: "radio",
    checked: true,
  },
}

export const Switch = {
  render: Template,

  args: {
    renderStyle: "switch",
  },
}

export const SwitchChecked = {
  render: Template,

  args: {
    renderStyle: "switch",
    checked: true,
  },
}

export const Wrapped = {
  render: Template,

  args: {
    wrapped: true,
    label: "Checkbox label",
    stretch: true,
  },
}

export const WrappedChecked = {
  render: Template,

  args: {
    wrapped: true,
    checked: true,
    label: "Checkbox label  I own 25% or more of the business",
    stretch: true,
  },
}
