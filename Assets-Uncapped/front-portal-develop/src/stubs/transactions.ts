import {
  Transaction,
  TransactionStatusEnum,
  TransactionTypeEnum,
} from "../services/api/agreements"

export const recentTransactionsStub: Transaction[] = [
  {
    id: "39322",
    name: "Uncapped Ltd",
    createdAt: new Date("2021-07-23T18:57:37.327Z"),
    type: TransactionTypeEnum.Invoice,
    status: TransactionStatusEnum.Received,
    account: {
      id: "606be996-6f88-4aa9-89da-7dbc7c6db776",
    },
    operationScheduledDate: new Date(),
    transactionAmount: { amount: 100, currency: "USD" },
    totalAmount: { amount: 10, currency: "USD" },
  },
  {
    id: "48138",
    name: "SANDBOX",
    createdAt: new Date("2021-08-11T16:06:36.036Z"),
    type: TransactionTypeEnum.Invoice,
    status: TransactionStatusEnum.Received,
    account: {
      id: "606be996-6f88-4aa9-89da-7dbc7c6db776",
    },
    operationScheduledDate: new Date(),
    transactionAmount: { amount: 100, currency: "USD" },
    totalAmount: { amount: 5000, currency: "USD" },
  },
  {
    id: "48139",
    name: "Fee",
    createdAt: new Date("2021-08-11T16:06:36.036Z"),
    type: TransactionTypeEnum.Invoice,
    status: TransactionStatusEnum.Received,
    account: {
      id: "606be996-6f88-4aa9-89da-7dbc7c6db776",
    },
    operationScheduledDate: new Date(),
    transactionAmount: { amount: 100, currency: "USD" },
    totalAmount: { amount: 0.05, currency: "USD" },
  },
]
