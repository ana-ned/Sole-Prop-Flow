import {
  BalanceWithAgreementStatusDTO,
  DetailedAgreementDTO,
  DetailedAgreementDTODebtProviderEnum,
  DetailedAgreementDTOStatusEnum,
} from "../../../../services/api/agreements"
import useAgreementBalance from "../../hooks/useAgreementBalance"
import DefaultBreakdown from "./DefaultBreakdown"
import FasanaraActiveBreakdown from "./FasanaraActiveBreakdown"
import MarcusActiveBreakdown from "./MarcusActiveBreakdown"
import MarcusClosedBreakdown from "./MarcusClosedBreakdown"

const InterestRateBreakdown = ({
  agreement,
  balance,
}: {
  agreement: DetailedAgreementDTO
  balance: BalanceWithAgreementStatusDTO
}) => {
  const { currency } = useAgreementBalance(agreement, balance)

  const isMarcus =
    agreement.debtProvider === DetailedAgreementDTODebtProviderEnum.Marcus
  const isFasanara =
    agreement.debtProvider === DetailedAgreementDTODebtProviderEnum.Fasanara
  const isClosed = agreement.status === DetailedAgreementDTOStatusEnum.Closed

  if (isMarcus && isClosed) {
    return <MarcusClosedBreakdown agreement={agreement} currency={currency} />
  }

  if (isMarcus) {
    return <MarcusActiveBreakdown agreement={agreement} currency={currency} />
  }

  if (isFasanara) {
    return <FasanaraActiveBreakdown agreement={agreement} currency={currency} />
  }

  return <DefaultBreakdown agreement={agreement} currency={currency} />
}

export default InterestRateBreakdown
