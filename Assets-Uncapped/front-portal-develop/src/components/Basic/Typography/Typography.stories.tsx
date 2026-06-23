import { Meta, StoryObj } from "@storybook/react-vite"
import { COLORS } from "../../../types/Color.types"
import Typography, { TYPOGRAPHY_TYPES } from "./Typography"

export default {
  title: "Basic/Typography",
  component: Typography,
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-4">
        <Story />
      </div>
    ),
  ],
  args: {
    children: "Hello world",
  },
} as Meta<typeof Typography>

type Story = StoryObj<typeof Typography>

export const Sandbox: Story = {}

export const Types: Story = {
  render: (args) => (
    <>
      {TYPOGRAPHY_TYPES.map((type) => (
        <Typography key={type} type={type} {...args}>
          {type}
        </Typography>
      ))}
    </>
  ),
}

export const Colors: Story = {
  render: (args) => (
    <>
      {COLORS.map((color) => (
        <Typography key={color} color={color} {...args}>
          {color}
        </Typography>
      ))}
    </>
  ),
}
