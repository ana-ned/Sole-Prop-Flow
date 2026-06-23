import { Meta, StoryObj } from "@storybook/react-vite"
import Chip from "./Chip"

const CHIP_COLORS = [
  "default",
  "success",
  "warning",
  "danger",
  "disabled",
] as const

export default {
  title: "Basic/Chip",
  component: Chip,
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-4">
        <Story />
      </div>
    ),
  ],
  args: {
    label: "Chip",
  },
} as Meta<typeof Chip>

type Story = StoryObj<typeof Chip>

export const Sandbox: Story = {}

export const Colors: Story = {
  render: (args) => (
    <>
      {CHIP_COLORS.map((color) => (
        <Chip key={color} {...args} color={color} label={`Chip ${color}`} />
      ))}
    </>
  ),
}

export const Animated: Story = {
  render: (args) => (
    <>
      {CHIP_COLORS.map((color) => (
        <Chip
          key={color}
          {...args}
          color={color}
          label={`Chip ${color}`}
          animated
        />
      ))}
    </>
  ),
}
