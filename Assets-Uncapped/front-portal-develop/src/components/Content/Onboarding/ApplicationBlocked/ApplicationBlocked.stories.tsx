import { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import ApplicationBlocked from "./ApplicationBlocked"
import ReapplicationScreen from "./ReapplicationScreen"

export default {
  title: "Content/Onboarding/ApplicationBlocked",
  component: ApplicationBlocked,
  args: {
    onReapply: fn(),
  },
} satisfies Meta<typeof ApplicationBlocked>

type Story = StoryObj<typeof ApplicationBlocked>
type ReapplicationStory = StoryObj<typeof ReapplicationScreen>

export const Rejected: Story = {
  render: () => (
    <ApplicationBlocked
      reason="Your current trading performance does not meet our underwriting requirements."
      type="REJECTED"
      reapplyDate={new Date()}
    />
  ),
}

export const RejectedNoReason: Story = {
  render: () => <ApplicationBlocked type="REJECTED" reapplyDate={new Date()} />,
}

export const RejectedForever: Story = {
  render: () => (
    <ApplicationBlocked
      reason="Your current trading performance does not meet our underwriting requirements."
      type="REJECTED"
    />
  ),
}

export const ReapplicationVersionA: Story = {
  render: (args) => (
    <ApplicationBlocked
      {...args}
      reason="Your current trading performance does not meet our underwriting requirements."
      type="REJECTED"
      reapplyDate={new Date()}
      canReapply
    />
  ),
}

export const OfferExpired: Story = {
  render: (args) => (
    <ApplicationBlocked
      {...args}
      type="EXPIRED"
      reapplyDate={new Date()}
      canReapply
    />
  ),
}

export const Lost: Story = {
  render: (args) => <ApplicationBlocked {...args} type="LOST" canReapply />,
}

export const ReapplicationVersionB: ReapplicationStory = {
  render: (args) => (
    <ReapplicationScreen {...args} variant="B" title="Welcome back!" />
  ),
}
