import { Meta, StoryObj } from "@storybook/react-vite"
import FieldsSummary from "./FieldsSummary"

export default {
  title: "Collections/FieldsSummary",
  component: FieldsSummary,
  args: {
    data: [
      { th: "First Name", td: "John" },
      { th: "Last Name", td: "Doe" },
      { th: "Birth Date", td: "01/01/2000" },
    ],
  },
} satisfies Meta<typeof FieldsSummary>

type Story = StoryObj<typeof FieldsSummary>

export const Sandbox: Story = {}

export const Wrapped: Story = {
  args: {
    wrapped: true,
  },
}
