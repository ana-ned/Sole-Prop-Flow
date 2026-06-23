import { useTranslation } from "react-i18next"
import Typography from "../../../components/Basic/Typography"
import {
  DrawRepaymentPreviewResponse,
  DrawResponse,
  LineOfCreditResponse,
} from "../../../services/api/agreements"
import { format, formatAsPercentage } from "../../../utils/money"
import { titleCase } from "../../../utils/string"
import OfferDetailsCard from "../../onboarding/components/offers/OfferDetailsCard"
import { getFirstRepaymentDay } from "../../onboarding/utils/offers"

const DrawSummary = ({
  draw,
  lineOfCredit,
  deferredRepayments,
}: {
  draw: DrawResponse
  lineOfCredit: LineOfCreditResponse
  deferredRepayments?: DrawRepaymentPreviewResponse
}) => {
  const { t } = useTranslation("line-of-credit", { keyPrefix: "DrawSummary" })

  const totalRepayable =
    (draw.size?.amount || 0) * (1 + (draw.totalPercentFee ?? 0))
  const currency = lineOfCredit.limit?.currency!

  return (
    <>
      <Typography type="bodyTitle" className="mb-2">
        {t(`title`)}
      </Typography>
      {deferredRepayments ? (
        <OfferDetailsCard
          items={[
            {
              label: t("deferredRepayment.totalDrawFee"),
              value: formatAsPercentage((draw.totalPercentFee ?? 0) * 100, 2, {
                removeTrailingZeros: true,
              }),
            },
            {
              label: t("deferredRepayment.totalRepayable"),
              value: format(totalRepayable, currency, {
                minimumFractionDigits: 0,
              }),
            },
            {
              label: t("deferredRepayment.initialRepayment"),
              value: t("deferredRepayment.onDay", {
                value: getFirstRepaymentDay(
                  deferredRepayments.repaymentStartDate!
                ),
              }),
            },
            {
              label: t(
                `deferredRepayment.${lineOfCredit.repaymentTerms?.collectionFrequency!}`,
                {
                  count: deferredRepayments.numberOfRepayments || 0,
                }
              ),
              value: format(
                deferredRepayments.singleRepayment?.amount || 0,
                currency,
                {
                  minimumFractionDigits: 0,
                }
              ),
            },
          ]}
        />
      ) : (
        <OfferDetailsCard
          items={[
            {
              label: t("minTotalRepayable"),
              value: format(totalRepayable, currency, {
                minimumFractionDigits: 0,
              }),
            },
            {
              label: t("drawFee"),
              value: formatAsPercentage((draw.totalPercentFee ?? 0) * 100, 2, {
                removeTrailingZeros: true,
              }),
            },
            {
              label: t("repaymentsNumber"),
              value: draw.numberOfRepayments ?? "",
            },
            {
              label: t("repaymentSchedule", {
                value: titleCase(
                  lineOfCredit.repaymentTerms?.collectionFrequency
                ),
              }),
              value: format(
                totalRepayable / draw.numberOfRepayments!,
                currency,
                {
                  minimumFractionDigits: 0,
                }
              ),
            },
          ]}
        />
      )}
    </>
  )
}

export default DrawSummary
