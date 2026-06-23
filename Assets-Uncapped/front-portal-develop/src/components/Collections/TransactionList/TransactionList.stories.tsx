import { Meta } from "@storybook/react-vite"
import { recentTransactionsStub } from "../../../stubs/transactions"
import TransactionList from "./TransactionList"

export default {
  title: "Collections/TransactionList",
  component: TransactionList,
} as Meta<typeof TransactionList>

export const Default = {
  args: {
    name: "Recent transactions",
    data: recentTransactionsStub,
    seeAll: {
      href: "#",
    },
  },
}
