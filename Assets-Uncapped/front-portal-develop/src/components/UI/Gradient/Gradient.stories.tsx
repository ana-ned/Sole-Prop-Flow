import { Meta, StoryObj } from "@storybook/react-vite"
import Gradient from "./Gradient"

export default {
  title: "UI/Gradient",
  component: Gradient,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Gradient>

type Story = StoryObj<typeof Gradient>

export const Sandbox: Story = {
  render: (args) => (
    <div className="flex gap-4">
      <Gradient {...args} className="h-[800px] w-[800px]" />
      <Gradient {...args} className="h-[200px] w-[350px]" />
    </div>
  ),
}
