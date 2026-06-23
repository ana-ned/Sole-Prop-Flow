import Decimal from "decimal.js"
import {
  DetailedAgreementDTO,
  DetailedAgreementDTOReasonForClosingEnum,
  DetailedAgreementDTOStatusEnum,
} from "../services/api/agreements"
import useAgreements from "./useAgreements"
import useBalances from "./useBalances"

const useAgreementDetails = (agreement: DetailedAgreementDTO) => {
  const agreements = useAgreements()
  const balances = useBalances()

  return {
    hasSimplifiedPricing: () => {
      return agreements.hasSimplifiedPricing(agreement)
    },
    hasActiveAgreements: agreements.data?.some(
      (item) => item.status === DetailedAgreementDTOStatusEnum.Active
    ),

    isFromRestructuredAgreement: () => {
      const parentId = agreement.agreementParentIds?.[0]

      return (
        !!parentId &&
        agreements.data?.find((item) => item.id === parentId)
          ?.reasonForClosing ===
          DetailedAgreementDTOReasonForClosingEnum.Restructured
      )
    },
    getTotalRepaid: () => {
      const balance = balances.data?.balances?.find(
        (item) => item.agreementId === agreement.id
      )

      return {
        amount: balance?.values!.COLLECTION_COMPLETED || 0,
        currency: balance?.currency!,
      }
    },
    getLeftToRepay: () => {
      const balance = balances.data?.balances?.find(
        (item) => item.agreementId === agreement.id
      )

      return {
        amount: new Decimal(balance?.values!.REPAYABLE_TOTAL || 0)
          .minus(new Decimal(balance?.values!.COLLECTION_COMPLETED || 0))
          .minus(new Decimal(balance?.values!.COLLECTION_PENDING || 0))
          .toNumber(),
        currency: balance?.currency!,
      }
    },
  }
}

export default useAgreementDetails
