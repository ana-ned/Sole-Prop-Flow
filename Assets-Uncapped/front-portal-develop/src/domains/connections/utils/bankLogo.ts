import { Bank } from "../../../services/api/connections"
import ChaseLogo from "../components/BankAccountCountrySearchableList/assets/chase.svg"
import CitiLogo from "../components/BankAccountCountrySearchableList/assets/citi.png"
import PNCLogo from "../components/BankAccountCountrySearchableList/assets/pnc.png"
import TDBankLogo from "../components/BankAccountCountrySearchableList/assets/tdbank.png"
import WellsFargoLogo from "../components/BankAccountCountrySearchableList/assets/wellsfargo.svg"

const FALLBACK_LOGOS: Record<string, string> = {
  ins_56: ChaseLogo,
  ins_127991: WellsFargoLogo,
  ins_5: CitiLogo,
  ins_13: PNCLogo,
  ins_14: TDBankLogo,
}

export const pickBankLogo = (bank: Bank): string | null => {
  if (bank.iconUrl) return bank.iconUrl
  if (bank.logoUrl) return bank.logoUrl
  if (bank.icon?.url) return bank.icon.url
  if (bank.logo?.url) return bank.logo.url
  if (bank.id && FALLBACK_LOGOS[bank.id]) return FALLBACK_LOGOS[bank.id]
  if (bank.icon?.base64) return `data:image/jpeg;base64,${bank.icon.base64}`
  if (bank.logo?.base64) return `data:image/jpeg;base64,${bank.logo.base64}`
  return null
}
