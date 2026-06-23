import { useTranslation } from "react-i18next"
import Typography from "../../../../components/Basic/Typography"
import AmountBar from "../../../../components/UI/AmountBar"
import {
  BalanceWithAgreementStatusDTO,
  DetailedAgreementDTO,
  DetailedAgreementDTOStatusEnum,
} from "../../../../services/api/agreements"
import { separate } from "../../../../utils/money"
import useAgreementBalance from "../../hooks/useAgreementBalance"
import useLedgerBalance from "../../hooks/useLedgerBalance"
import HeaderBanner from "../HeaderBanner"
import RelatedAgreement from "./RelatedAgreement"

const InterestRateHeader = ({
  agreement,
  balance,
}: {
  agreement: DetailedAgreementDTO
  balance: BalanceWithAgreementStatusDTO
}) => {
  const { t } = useTranslation("agreements")

  const { currency, repaid, leftToRepay } = useAgreementBalance(
    agreement,
    balance
  )
  const ledgerBalance = useLedgerBalance({ agreementId: agreement.id! })

  const isClosed = agreement.status === DetailedAgreementDTOStatusEnum.Closed
  const isTransferred = isClosed && leftToRepay > 0

  const outstandingAmount =
    (ledgerBalance.data?.currentFees || 0) +
    (ledgerBalance.data?.currentInterest || 0) +
    (ledgerBalance.data?.currentPrincipal || 0)

  const principalPaid =
    (ledgerBalance.data?.totalPrincipal || 0) -
    (ledgerBalance.data?.currentPrincipal || 0)

  const displayAmount = isClosed
    ? separate(repaid, currency)
    : separate(outstandingAmount, currency)

  const subtitle = isClosed
    ? t("common.totalRepaid")
    : t("common.totalOutstanding")

  const segments = isTransferred
    ? [
        {
          amount: repaid,
          label: t("common.paid"),
          color: "brand-600",
          emphasis: true,
        },
        {
          amount: leftToRepay,
          label: t("common.transferred"),
          color: "brand-400",
        },
      ]
    : isClosed
      ? [
          {
            amount: repaid,
            label: t("common.paid"),
            color: "brand-600",
            emphasis: true,
          },
        ]
      : [
          {
            amount: principalPaid,
            label: t("common.paid"),
            color: "brand-600",
            emphasis: true,
          },
          {
            amount: outstandingAmount,
            label: t("common.leftToPay"),
            color: "brand-200",
            stripeColor: "brand-600",
          },
        ]

  return (
    <HeaderBanner
      agreement={agreement}
      title={
        <Typography type="h2" color="white" className="text-center">
          {displayAmount.whole}
          <Typography type="h5" tag="span" color="white">
            {displayAmount.fraction}
          </Typography>
        </Typography>
      }
      subtitle={subtitle}
    >
      <div className="flex flex-col gap-4">
        <AmountBar segments={segments} currency={currency} />
        <RelatedAgreement agreement={agreement} balance={balance} />
      </div>
    </HeaderBanner>
  )
}

export default InterestRateHeader
