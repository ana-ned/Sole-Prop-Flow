import { Meta, StoryObj } from "@storybook/react-vite"
import PartnerBlocked from "./PartnerBlocked"

export default {
  title: "Content/Onboarding/PartnerBlocked",
  component: PartnerBlocked,

  args: {
    redirectTo: "/",
  },
} satisfies Meta<typeof PartnerBlocked>

type Story = StoryObj<typeof PartnerBlocked>

export const ActiveCustomer: Story = {
  render: (args) => <PartnerBlocked {...args} active />,
}

export const ApplyingCustomer: Story = {
  render: (args) => <PartnerBlocked {...args} />,
}
