import { Meta, StoryObj } from "@storybook/react-vite"
import OfferAmount from "./OfferAmount"

export default {
  title: "UI/OfferAmount",
  component: OfferAmount,
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-16">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OfferAmount>

type Story = StoryObj<typeof OfferAmount>

export const Default: Story = {
  args: {
    amount: 25000,
    currency: "USD",
  },
}

export const Large: Story = {
  args: {
    amount: 150000,
    currency: "USD",
  },
}

export const Small: Story = {
  args: {
    amount: 500,
    currency: "EUR",
  },
}
