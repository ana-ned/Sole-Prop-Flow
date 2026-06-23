import { Meta, StoryObj } from "@storybook/react-vite"
import AddressSummary from "./AddressSummary"

const ADDRESSES = [
  {
    country: "POL",
    addressLine1: "Złota 4",
    addressLine2: "",
    locality: "Warszawa",
    region: "mazowieckie",
    postalCode: "02-104",
  },
  {
    country: "USA",
    addressLine1: "123 Main St",
    addressLine2: "Apt. 1",
    locality: "New York",
    region: "New York",
    postalCode: "10001",
  },
]

export default {
  title: "Collections/AddressSummary",
  component: AddressSummary,
  args: {
    address: ADDRESSES[0],
  },
} satisfies Meta<typeof AddressSummary>

type Story = StoryObj<typeof AddressSummary>

export const Sandbox: Story = {}

export const Examples: Story = {
  render: (args) => (
    <>
      {ADDRESSES.map((item, index) => (
        <AddressSummary key={index} {...args} address={item} />
      ))}
    </>
  ),
}
