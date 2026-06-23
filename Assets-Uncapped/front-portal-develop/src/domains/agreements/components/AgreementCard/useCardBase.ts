import { useTranslation } from "react-i18next"
import useAgreementDetails from "../../../../hooks/useAgreementDetails"
import {
  DetailedAgreementDTO,
  DetailedAgreementDTODebtProviderEnum,
  DetailedAgreementDTOProductTypeEnum,
  DetailedAgreementDTOStatusEnum,
} from "../../../../services/api/agreements"
import { DEFAULT_CURRENCY } from "../../../../utils/currency"
import { titleCase } from "../../../../utils/string"

export const useTransferTitle = (agreement: DetailedAgreementDTO) => {
  const { t } = useTranslation("agreements", { keyPrefix: "AgreementCard" })

  if (agreement.debtProvider === DetailedAgreementDTODebtProviderEnum.Marcus) {
    return t("fromGoldman")
  }

  if (
    agreement.debtProvider === DetailedAgreementDTODebtProviderEnum.Fasanara
  ) {
    let sourceType: string
    if (
      agreement.productType === DetailedAgreementDTOProductTypeEnum.InterestRate
    ) {
      sourceType = t("sellersfiAccountType.termLoan")
    } else if (
      agreement.productType === DetailedAgreementDTOProductTypeEnum.Rbf
    ) {
      sourceType = t("sellersfiAccountType.commercePay")
    } else {
      sourceType = t("sellersfiAccountType.capitalLoan")
    }

    const transferLabel = t("transferredFrom", { sourceType })

    if (
      agreement.productType ===
        DetailedAgreementDTOProductTypeEnum.InterestRate ||
      agreement.productType === DetailedAgreementDTOProductTypeEnum.Fixed
    ) {
      return `${transferLabel} – ${t("balanceTransfer")}`
    }

    if (!agreement.advanceAmount || agreement.advanceAmount === 0) {
      return `${transferLabel} – ${t("balanceTransfer")}`
    }

    return transferLabel
  }

  return null
}

const useCardBase = (agreement: DetailedAgreementDTO) => {
  const { t: tAgreements } = useTranslation("agreements")
  const agreementDetails = useAgreementDetails(agreement)

  const isClosed = agreement.status === DetailedAgreementDTOStatusEnum.Closed
  const { amount: repayAmount, currency } = isClosed
    ? agreementDetails.getTotalRepaid()
    : agreementDetails.getLeftToRepay()
  const repayCurrency = currency ?? agreement.currency ?? DEFAULT_CURRENCY

  const frequency = agreement.repayments?.frequency
  const paymentFrequency = frequency
    ? tAgreements(`frequency.${frequency}` as "frequency.DAILY") ||
      titleCase(frequency)
    : ""

  return {
    isClosed,
    repayAmount,
    repayCurrency,
    paymentFrequency,
    viewHref: `/loans/${agreement.id}`,
  }
}

export default useCardBase
