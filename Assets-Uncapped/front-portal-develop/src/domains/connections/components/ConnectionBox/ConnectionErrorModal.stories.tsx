import type { Meta, StoryObj } from "@storybook/react-vite"
import { ConnectionResponse } from "../../../../services/api/connections"
import ConnectionErrorModal from "./ConnectionErrorModal"

const meta: Meta<typeof ConnectionErrorModal> = {
  title: "Domains/Connections/ConnectionErrorModal",
  component: ConnectionErrorModal,
  args: {
    isOpen: true,
  },
  argTypes: {
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
type Story = StoryObj<typeof ConnectionErrorModal>

export const Default: Story = {
  args: {
    connection: {
      systemId: "STRIPE",
      title: "Stripe",
      providerErrorMessage: "This is external error message from Stripe.",
    } satisfies ConnectionResponse,
  },
}

export const WithTroubleshooting: Story = {
  args: {
    connection: {
      systemId: "PLAID",
      title: "Chase Bank",
      providerErrorMessage: "This is external error message from Chase Bank.",
    } satisfies ConnectionResponse,
  },
}

export const WithoutReconnect: Story = {
  args: {
    connection: {
      systemId: "AMAZON_V2",
      title: "Amazon",
    } satisfies ConnectionResponse,
  },
}
