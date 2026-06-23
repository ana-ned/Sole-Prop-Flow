const payQueryKeys = {
  _: ["pay"] as const,
  vendors: () => [...payQueryKeys._, "vendors"] as const,
  fees: () => [...payQueryKeys._, "fees"] as const,
  exchangeRates: (currency: string) =>
    [...payQueryKeys._, "rates", currency] as const,
}

export default payQueryKeys
