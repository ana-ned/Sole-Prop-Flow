import i18n from "../../../inits/i18next"
import { Account } from "../../../services/api/loan-operations"

const formatBankAccountNumber = (
  bankingAccount?: Account,
  options?: {
    skipMask?: boolean
  }
) => {
  if (bankingAccount?.mask && !options?.skipMask) {
    return `${"*".repeat(10)}${bankingAccount.mask}`
  }

  if (bankingAccount?.number) {
    return bankingAccount.number.replaceAll(/.(?=.{4})/g, "*")
  }

  if (bankingAccount?.iban) {
    return bankingAccount.iban.replaceAll(/.(?=.{4})/g, "*")
  }

  return i18n.t("onboarding:bankAccount")
}

export default formatBankAccountNumber
