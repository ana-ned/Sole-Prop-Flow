import { useTranslation } from "react-i18next"
import Typography from "../../../../components/Basic/Typography"
import AmountBar from "../../../../components/UI/AmountBar"
import {
  BalanceWithAgreementStatusDTO,
  DetailedAgreementDTO,
} from "../../../../services/api/agreements"
import { format } from "../../../../utils/money"
import useAgreementBalance from "../../hooks/useAgreementBalance"
import HeaderBanner from "../HeaderBanner"
import RelatedAgreement from "../InterestRate/RelatedAgreement"

const FixedHeader = ({
  agreement,
  balance,
}: {
  agreement: DetailedAgreementDTO
  balance: BalanceWithAgreementStatusDTO
}) => {
  const { t } = useTranslation("agreements", {
    keyPrefix: "common",
  })

  const { currency, repaid, leftToRepay, outstanding } = useAgreementBalance(
    agreement,
    balance
  )

  const segments = [
    {
      amount: repaid,
      label: t("paid"),
      color: "brand-600",
      emphasis: true,
    },
    {
      amount: leftToRepay,
      label: t("leftToPay"),
      color: "brand-200",
      stripeColor: "brand-600",
    },
  ]

  return (
    <HeaderBanner
      agreement={agreement}
      title={
        <Typography type="h2" color="white" className="text-center">
          {format(outstanding, currency)}
        </Typography>
      }
      subtitle={t("totalOutstanding")}
    >
      <div className="flex flex-col gap-4">
        <AmountBar segments={segments} currency={currency} />
        <RelatedAgreement agreement={agreement} balance={balance} />
      </div>
    </HeaderBanner>
  )
}

export default FixedHeader
