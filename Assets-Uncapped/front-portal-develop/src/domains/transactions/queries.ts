interface TransactionFilters {
  agreementId?: string
}

export const transactionQueryKeys = {
  all: (filters: TransactionFilters = {}) => ["transactions", filters] as const,
  recent: () => [...transactionQueryKeys.all(), "recent"] as const,
  scheduled: (filters: TransactionFilters = {}) =>
    [...transactionQueryKeys.all(filters), "scheduled"] as const,
  scheduledAll: (filters: TransactionFilters = {}) =>
    [...transactionQueryKeys.scheduled(filters), "all"] as const,
  detail: (accountId: string, transactionId: string) =>
    [
      ...transactionQueryKeys.all(),
      "detail",
      accountId,
      transactionId,
    ] as const,
}

export const repaymentQueryKeys = {
  all: (filters?: TransactionFilters) => ["repayments", filters] as const,
  scheduled: (filters?: TransactionFilters) =>
    [...repaymentQueryKeys.all(filters), "scheduled"] as const,
  detail: (id: string) => [...repaymentQueryKeys.all(), "detail", id] as const,
  revenueSummary: (id: string) => ["revenueSummary", id] as const,
}
