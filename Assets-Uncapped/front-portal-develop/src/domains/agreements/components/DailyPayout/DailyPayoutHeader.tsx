import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import Typography from "../../../../components/Basic/Typography"
import Loader from "../../../../components/UI/Loader/Loader"
import SimpleTable from "../../../../components/UI/SimpleTable"
import {
  DetailedAgreementDTO,
  DetailedAgreementDTOStatusEnum,
} from "../../../../services/api/agreements"
import { DEFAULT_CURRENCY } from "../../../../utils/currency"
import { format, separate } from "../../../../utils/money"
import useLedgerBalance from "../../hooks/useLedgerBalance"
import HeaderBanner from "../HeaderBanner"

const DailyPayoutHeader = ({
  agreement,
}: {
  agreement: DetailedAgreementDTO
}) => {
  const { t } = useTranslation("agreements", { keyPrefix: "common" })
  const { t: tBreakdown } = useTranslation("agreements", {
    keyPrefix: "InterestRate.Breakdown",
  })
  const ledgerBalance = useLedgerBalance({ agreementId: agreement.id! })

  const currency = agreement.currency ?? DEFAULT_CURRENCY
  const isClosed = agreement.status === DetailedAgreementDTOStatusEnum.Closed

  const displayAmount = useMemo(() => {
    const amount = isClosed
      ? (ledgerBalance.data?.totalAmount ?? 0)
      : (ledgerBalance.data?.currentAmount ?? 0)
    return separate(amount, currency)
  }, [
    isClosed,
    ledgerBalance.data?.totalAmount,
    ledgerBalance.data?.currentAmount,
    currency,
  ])

  const subtitle = isClosed ? t("totalRepaid") : t("totalOutstanding")

  return (
    <>
      <HeaderBanner
        agreement={agreement}
        title={
          ledgerBalance.isLoading ? (
            <Loader size="sm" />
          ) : (
            <Typography type="h2" color="white" className="text-center">
              {displayAmount.whole}
              <Typography type="h5" tag="span" color="white">
                {displayAmount.fraction}
              </Typography>
            </Typography>
          )
        }
        subtitle={subtitle}
      >
        {ledgerBalance.isLoading ? (
          <Loader size="sm" />
        ) : (
          <SimpleTable
            variant="simple"
            data={
              isClosed
                ? [
                    {
                      th: t("totalRepaid"),
                      td: format(
                        ledgerBalance.data?.totalAmount ?? 0,
                        currency
                      ),
                      fontWeight: "bold" as const,
                    },
                    {
                      th: tBreakdown("totalPrincipal"),
                      td: format(
                        ledgerBalance.data?.totalPrincipal || 0,
                        currency
                      ),
                      child: true,
                      propertyFontWeight: "normal" as const,
                      valueFontWeight: "normal" as const,
                    },
                    {
                      th: tBreakdown("totalFees"),
                      td: format(
                        ledgerBalance.data?.totalInterest || 0,
                        currency
                      ),
                      child: true,
                      propertyFontWeight: "normal" as const,
                      valueFontWeight: "normal" as const,
                    },
                  ]
                : [
                    {
                      th: t("totalOutstanding"),
                      td: format(
                        ledgerBalance.data?.currentAmount ?? 0,
                        currency
                      ),
                      fontWeight: "bold" as const,
                    },
                    {
                      th: tBreakdown("principalBalance"),
                      td: format(
                        ledgerBalance.data?.currentPrincipal || 0,
                        currency
                      ),
                      child: true,
                      propertyFontWeight: "normal" as const,
                      valueFontWeight: "normal" as const,
                    },
                    {
                      th: tBreakdown("feeBalance"),
                      td: format(
                        ledgerBalance.data?.currentInterest || 0,
                        currency
                      ),
                      child: true,
                      propertyFontWeight: "normal" as const,
                      valueFontWeight: "normal" as const,
                    },
                  ]
            }
          />
        )}
      </HeaderBanner>
    </>
  )
}

export default DailyPayoutHeader
