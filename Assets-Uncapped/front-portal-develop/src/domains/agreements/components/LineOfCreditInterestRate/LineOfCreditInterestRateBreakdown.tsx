import { HugeiconsIcon } from "@hugeicons/react"
import { Wallet03SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { isPast, subMonths } from "date-fns"
import { useTranslation } from "react-i18next"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import Card from "../../../../components/UI/Card"
import Chip from "../../../../components/UI/Chip"
import {
  DetailedAgreementDTO,
  DetailedAgreementDTOStatusEnum,
} from "../../../../services/api/agreements"
import { DEFAULT_CURRENCY } from "../../../../utils/currency"
import { DateFormat, formatDate } from "../../../../utils/date"
import { format, formatAsPercentage } from "../../../../utils/money"
import useLocAgreement from "../../hooks/useLocAgreement"
import CardTable from "../CardTable/CardTable"

const LineOfCreditInterestRateBreakdown = ({
  agreement,
}: {
  agreement: DetailedAgreementDTO
}) => {
  const { t: tCommon } = useTranslation("agreements", {
    keyPrefix: "common",
  })
  const { t } = useTranslation("agreements", {
    keyPrefix: "LineOfCreditInterestRate.Breakdown",
  })
  const { t: tPayment } = useTranslation("agreements", {
    keyPrefix: "LineOfCreditInterestRate.PaymentDetails",
  })
  const { t: tBreakdown } = useTranslation("agreements", {
    keyPrefix: "Breakdown",
  })

  const locAgreement = useLocAgreement(agreement.id)

  if (!locAgreement) return null

  const drawEndDate = locAgreement.drawDownPeriodEndDate!
  const drawMonths = locAgreement.drawParameters!.drawDownTermInMonths!
  const repaymentMonths = locAgreement.repaymentTerms!.repaymentPhaseDuration!
  const isClosed = agreement.status === DetailedAgreementDTOStatusEnum.Closed
  const isDrawPhaseActive = !isClosed && !isPast(drawEndDate)
  const drawStartDate = subMonths(drawEndDate, drawMonths)

  const minimumDraw = format(
    locAgreement.drawParameters!.minimumDrawAmount!.amount!,
    locAgreement.drawParameters!.minimumDrawAmount!.currency!
  )

  const repaymentRatio = formatAsPercentage(
    locAgreement.repaymentTerms!.principalToRepaymentRatioInDrawTerm! * 100,
    0,
    { removeTrailingZeros: true }
  )

  const interestRate = locAgreement.fees?.interestRate ?? 0
  const limitCurrency =
    locAgreement.limit?.currency ?? agreement.currency ?? DEFAULT_CURRENCY
  const creditLimit = locAgreement.limit?.amount ?? 0

  return (
    <CardTable
      title={tBreakdown("title", { product: t("product") })}
      icon={<HugeiconsIcon icon={Wallet03SolidStandard} />}
      severity="accent-11"
      data={[
        {
          th: tCommon("interestRate"),
          td: formatAsPercentage(interestRate * 100, 2),
        },
        {
          th: tPayment("maximumCreditLimit"),
          td: format(creditLimit, limitCurrency),
        },
        ...(agreement.activationDate
          ? [
              {
                th: tCommon("activationDate"),
                td: formatDate(new Date(agreement.activationDate), {
                  format: DateFormat.LONG,
                }),
              },
            ]
          : []),
      ]}
    >
      <div className="mt-3 flex flex-col gap-3">
        <Card className="!p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Typography type="bodyTitle" color="neutral-800">
                {t("drawPhase")} (
                {t("started", {
                  date: formatDate(drawStartDate, {
                    customFormat: "dd MMMM yyyy",
                  }),
                })}
                )
              </Typography>
              <Chip
                label={isDrawPhaseActive ? t("active") : t("inactive")}
                color={isDrawPhaseActive ? "success" : "disabled"}
              />
            </div>
            <Typography
              type="bodyTitle"
              color="neutral-800"
              className="shrink-0"
            >
              {tCommon("month", { count: drawMonths })}
            </Typography>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <Typography type="body" color="neutral-700">
              {t("drawDescription", { minimumDraw })}
            </Typography>
            <SanitizedHtml
              as="p"
              content={t("drawRepaymentDescription", {
                percentage: repaymentRatio,
              })}
              className="text-base text-neutral-700"
            />
          </div>
        </Card>

        <Card className="!p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Typography type="bodyTitle" color="neutral-800">
                {t("repaymentPhase")} (
                {isPast(drawEndDate)
                  ? t("started", {
                      date: formatDate(drawEndDate, {
                        customFormat: "dd MMMM yyyy",
                      }),
                    })
                  : t("startsOn", {
                      date: formatDate(drawEndDate, {
                        customFormat: "dd MMMM yyyy",
                      }),
                    })}
                )
              </Typography>
              <Chip
                label={
                  !isClosed && isPast(drawEndDate) ? t("active") : t("inactive")
                }
                color={
                  !isClosed && isPast(drawEndDate) ? "success" : "disabled"
                }
              />
            </div>
            <Typography
              type="bodyTitle"
              color="neutral-800"
              className="shrink-0"
            >
              {tCommon("month", { count: repaymentMonths })}
            </Typography>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <Typography type="body" color="neutral-700">
              {t("repaymentNoDrawDescription")}
            </Typography>
            <Typography type="body" color="neutral-700">
              {t("repaymentAmortizedDescription")}
            </Typography>
          </div>
        </Card>
      </div>
    </CardTable>
  )
}

export default LineOfCreditInterestRateBreakdown
