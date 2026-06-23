import { Meta, StoryObj } from "@storybook/react-vite"
import PageLoader from "./PageLoader"

export default {
  title: "Collections/PageLoader",
  component: PageLoader,
  decorators: [
    (Story) => (
      <div style={{ minHeight: 300 }}>
        <Story />
      </div>
    ),
  ],
} as Meta<typeof PageLoader>

type Story = StoryObj<typeof PageLoader>

export const Sandbox: Story = {}
