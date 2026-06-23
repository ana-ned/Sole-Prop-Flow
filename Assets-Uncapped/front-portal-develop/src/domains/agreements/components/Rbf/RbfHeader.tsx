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

const RbfHeader = ({
  agreement,
  balance,
}: {
  agreement: DetailedAgreementDTO
  balance: BalanceWithAgreementStatusDTO
}) => {
  const { t } = useTranslation("agreements", {
    keyPrefix: "common",
  })

  const { currency, repaid, pending, leftToRepay, outstanding } =
    useAgreementBalance(agreement, balance)

  const segments = [
    {
      amount: pending,
      label: t("pending"),
      color: "neutral-200",
      stripeColor: "neutral-500",
    },
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
      <AmountBar segments={segments} currency={currency} />
    </HeaderBanner>
  )
}

export default RbfHeader
