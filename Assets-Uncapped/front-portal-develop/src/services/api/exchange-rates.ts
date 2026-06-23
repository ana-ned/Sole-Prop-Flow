import queryString from "query-string"
import client from "./_client"

const ExchangeRates = {
  retrieve: ({
    token,
    organisation,
    body,
  }: {
    token: string
    organisation: string
    body: {
      dateFrom: string
      dateTo: string
      baseCurrency: string
      currencies?: string[]
      amount: number
    }
  }): Promise<
    {
      base: string
      date: string
      rates: Record<string, number>
    }[]
  > =>
    client(`exchangerates/retrieve?${queryString.stringify(body)}`, {
      token,
      organisation,
    }),
  snapshot: ({
    token,
    organisation,
    body,
  }: {
    token: string
    organisation: string
    body: {
      baseCurrency: string
      targetCurrency?: string[]
      amount: number
    }
  }): Promise<
    {
      base: string
      date: string
      rates: Record<string, number>
    }[]
  > =>
    client(`exchangerates/snapshot/latest?${queryString.stringify(body)}`, {
      token,
      organisation,
    }),
}

export default ExchangeRates
