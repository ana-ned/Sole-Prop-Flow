import { Meta, StoryObj } from "@storybook/react-vite"
import ProgressBar from "./ProgressBar"

const COLORS = [undefined, "orange", "error", "paused"] as const

export default {
  title: "UI/ProgressBar",
  component: ProgressBar,
  args: {
    total: 10,
    current: 5,
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
  ],
} as Meta<typeof ProgressBar>

type Story = StoryObj<typeof ProgressBar>

export const Sandbox: Story = {}

export const Colors: Story = {
  render: (args) => (
    <div className="flex flex-col gap-y-4">
      {COLORS.map((color) => (
        <ProgressBar key={color} {...args} color={color} />
      ))}
    </div>
  ),
}

export const Empty: Story = {
  args: {
    current: 0,
  },
}

export const Full: Story = {
  args: {
    current: 10,
  },
}

export const FixedTimeout: Story = {
  args: {
    current: 0,
    total: 1,
    timeout: 10000,
  },
}

export const Range: Story = {
  args: {
    current: 0,
    total: 1,
    timeout: 5000,
    min: 30,
    max: 90,
  },
}
