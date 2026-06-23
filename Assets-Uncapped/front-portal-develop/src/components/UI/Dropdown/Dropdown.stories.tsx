import { useState } from "react"
import { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import Dropdown from "./Dropdown"

export default {
  title: "UI/Dropdown",
  component: Dropdown,
  args: {
    label: "Selected option",
    options: [
      { label: "Option 1", value: "option-1" },
      { label: "Option 2", value: "option-2" },
      { label: "Option 3", value: "option-3" },
      { label: "Option 4", value: "option-4" },
    ],
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof Dropdown>

type Story = StoryObj<typeof Dropdown>

export const Sandbox: Story = {
  render: (args) => {
    return <Dropdown {...args} />
  },
}

export const Prefilled: Story = {
  render: (args) => {
    const [selected, setSelected] = useState(args.options[0])
    return <Dropdown {...args} value={selected} onChange={setSelected} />
  },
}

export const Disabled: Story = {
  render: (args) => {
    return <Dropdown {...args} disabled />
  },
}
