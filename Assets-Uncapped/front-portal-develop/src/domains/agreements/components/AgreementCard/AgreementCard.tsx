import {
  DetailedAgreementDTO,
  DetailedAgreementDTODebtProviderEnum,
  DetailedAgreementDTODetailedProductTypeEnum,
  DetailedAgreementDTOProductTypeEnum,
} from "../../../../services/api/agreements"
import DefaultCard from "./DefaultCard"
import FasanaraFixedCard from "./FasanaraFixedCard"
import FasanaraInterestRateCard from "./FasanaraInterestRateCard"
import LineOfCreditFixedDrawCard from "./LineOfCreditFixedDrawCard"
import LineOfCreditInterestRateCard from "./LineOfCreditInterestRateCard"
import DailyPayoutCard from "./DailyPayoutCard"
import RbfCard from "./RbfCard"

const DetailedProductType = DetailedAgreementDTODetailedProductTypeEnum

const AgreementCard = ({ agreement }: { agreement: DetailedAgreementDTO }) => {
  const productType = agreement.detailedProductType ?? agreement.productType
  const isFasanara =
    agreement.debtProvider === DetailedAgreementDTODebtProviderEnum.Fasanara

  if (isFasanara) {
    if (
      agreement.productType === DetailedAgreementDTOProductTypeEnum.InterestRate
    ) {
      return <FasanaraInterestRateCard agreement={agreement} />
    }
    if (agreement.productType === DetailedAgreementDTOProductTypeEnum.Fixed) {
      return <FasanaraFixedCard agreement={agreement} />
    }
  }

  if (productType === DetailedProductType.LineOfCreditInterestRate) {
    return <LineOfCreditInterestRateCard agreement={agreement} />
  }

  if (productType === DetailedProductType.LineOfCreditFixedDraw) {
    return <LineOfCreditFixedDrawCard agreement={agreement} />
  }

  if (productType === DetailedProductType.Rbf) {
    return <RbfCard agreement={agreement} />
  }

  if (productType === DetailedProductType.DailyPayout) {
    return <DailyPayoutCard agreement={agreement} />
  }

  return <DefaultCard agreement={agreement} />
}

export default AgreementCard
