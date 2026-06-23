import { useMemo } from "react"
import {
  DetailedAgreementDTO,
  DetailedAgreementDTODetailedProductTypeEnum,
} from "../../../services/api/agreements"

const useProductType = (agreement: DetailedAgreementDTO | undefined) => {
  return useMemo(() => {
    const detailedProductType = agreement?.detailedProductType

    return {
      isInterestRate:
        detailedProductType ===
        DetailedAgreementDTODetailedProductTypeEnum.InterestRate,

      // LOC v2
      isLineOfCreditInterestRate:
        detailedProductType ===
        DetailedAgreementDTODetailedProductTypeEnum.LineOfCreditInterestRate,

      // LOC v1
      isLineOfCreditFixed:
        detailedProductType ===
          DetailedAgreementDTODetailedProductTypeEnum.LineOfCreditFixedFrame ||
        detailedProductType ===
          DetailedAgreementDTODetailedProductTypeEnum.LineOfCreditFixedDraw,

      isRbf:
        detailedProductType === DetailedAgreementDTODetailedProductTypeEnum.Rbf,

      isDailyPayout:
        detailedProductType ===
        DetailedAgreementDTODetailedProductTypeEnum.DailyPayout,

      isFixed:
        detailedProductType ===
        DetailedAgreementDTODetailedProductTypeEnum.Fixed,
    }
  }, [agreement?.detailedProductType])
}

export default useProductType
