import { Meta, StoryObj } from "@storybook/react-vite"
import Typography from "../../Basic/Typography"
import OfferAmount from "../OfferAmount/OfferAmount"
import Card from "./Card"

export default {
  title: "UI/Card",
  component: Card,
  args: {
    children: "Card",
  },
  decorators: [
    (Story) => (
      <div style={{ margin: "0 auto", maxWidth: "600px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>

type Story = StoryObj<typeof Card>

export const Sandbox: Story = {}

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="text-center">
      <Typography type="h6">We’re reviewing your application for</Typography>
      <OfferAmount className="mt-4 mb-8" amount={100000} currency="USD" />
      <Typography>
        We’ll be in touch <b>within 24 hours</b> about the next steps.
      </Typography>
    </Card>
  ),
}

export const Background: Story = {
  render: (args) => (
    <Card {...args} className="text-center" variant="background">
      <Typography type="bodyTitle" color="white">
        Sit back and relax…
      </Typography>
      <Typography type="h4" className="mt-2" color="white">
        Offers should be ready in 24 hours
      </Typography>
    </Card>
  ),
}
