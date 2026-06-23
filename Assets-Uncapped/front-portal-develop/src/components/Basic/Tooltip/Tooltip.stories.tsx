import { StoryObj, Meta } from "@storybook/react-vite"
import Tooltip from "./Tooltip"

export default {
  title: "Basic/Tooltip",
  component: Tooltip,
  args: {
    content: "Tooltip content",
    children: "Hover me",
  },
} as Meta<typeof Tooltip>

type Story = StoryObj<typeof Tooltip>

export const Sandbox: Story = {}

export const HTML: Story = {
  args: {
    content: (
      <p>
        tooltip two line
        <br />
        <strong>HTML</strong> content
      </p>
    ),
  },
}
