import useAuth from "../../../hooks/useAuth"
import { pickBankLogo } from "../utils/bankLogo"
import useBanksList from "./useBanksList"

const useBankLogo = ({ bankName }: { bankName?: string }) => {
  const country = useAuth().organisation?.countryCode?.toUpperCase()

  return useBanksList<string | null>({
    country,
    name: bankName,
    staleTime: Infinity,
    select: (data) => {
      const banks = data.content ?? []
      const lowerName = bankName?.toLowerCase()
      if (!lowerName) return null
      const bank =
        banks.find((b) => b.name?.toLowerCase() === lowerName) ??
        banks.find((b) => b.name?.toLowerCase().includes(lowerName)) ??
        banks[0]
      return bank ? pickBankLogo(bank) : null
    },
  })
}

export default useBankLogo
