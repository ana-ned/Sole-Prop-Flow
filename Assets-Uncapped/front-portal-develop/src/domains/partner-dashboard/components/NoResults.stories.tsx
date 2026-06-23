import { Meta, StoryObj } from "@storybook/react-vite"
import NoResults from "./NoResults"

export default {
  title: "Domains/PartnerDashboard/NoResults",
  component: NoResults,
  decorators: [
    (Story) => (
      <div className="max-w-lg p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NoResults>

type Story = StoryObj<typeof NoResults>

export const Default: Story = {}
