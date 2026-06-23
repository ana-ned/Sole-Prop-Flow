import type { Meta, StoryObj } from "@storybook/react-vite"
import { ConnectionResponse } from "../../../../services/api/connections"
import ConnectionDetailsModal from "./ConnectionDetailsModal"

const meta: Meta<typeof ConnectionDetailsModal> = {
  title: "Domains/Connections/ConnectionDetailsModal",
  component: ConnectionDetailsModal,
  args: {
    isOpen: true,
  },
  argTypes: {
    isOpen: { control: "boolean" },
    onClose: { action: "onClose" },
    onDelete: { action: "onDelete" },
  },
  parameters: {
    docs: {
      disable: true,
    },
  },
}

export default meta
type Story = StoryObj<typeof ConnectionDetailsModal>

export const Default: Story = {
  args: {
    connection: {
      systemId: "STRIPE",
      title: "Stripe",
    } satisfies ConnectionResponse,
  },
}

export const WithBankAccounts: Story = {
  args: {
    connection: {
      systemId: "PLAID",
      title: "Chase Bank",
      items: [
        { id: "item1", displayName: "Checking Account" },
        { id: "item2", displayName: "Savings Account" },
      ],
    } satisfies ConnectionResponse,
  },
}
