import { Meta, StoryObj } from "@storybook/react-vite"
import {
  TransactionStatusEnum,
  TransactionTypeEnum,
} from "../../../services/api/agreements"
import { recentTransactionsStub } from "../../../stubs/transactions"
import TransactionListItem from "./TransactionListItem"

const TRANSACTION_TYPES = Object.values(TransactionTypeEnum)
const TRANSACTION_STATUSES = Object.values(TransactionStatusEnum)

export default {
  title: "Collections/TransactionListItem",
  component: TransactionListItem,
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-2">
        <Story />
      </div>
    ),
  ],
  args: {
    data: recentTransactionsStub[0],
  },
} as Meta<typeof TransactionListItem>

type Story = StoryObj<typeof TransactionListItem>

export const Sandbox: Story = {}

export const Types: Story = {
  render: (args) => (
    <>
      {TRANSACTION_TYPES.map((type) => (
        <TransactionListItem
          key={type}
          {...args}
          data={{
            ...args.data,
            type,
            name: `${args.data.name} (${type})`,
          }}
        />
      ))}
    </>
  ),
}

export const Statuses: Story = {
  render: (args) => (
    <>
      {TRANSACTION_STATUSES.map((status) => (
        <TransactionListItem
          key={status}
          {...args}
          data={{
            ...args.data,
            status,
            name: `${args.data.name} (${status})`,
          }}
        />
      ))}
    </>
  ),
}
