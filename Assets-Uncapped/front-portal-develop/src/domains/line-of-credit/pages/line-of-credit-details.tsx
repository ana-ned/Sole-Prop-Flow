import clsx from "clsx"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router"
import useDevice from "../../../hooks/useDevice"
import useLineOfCreditAgreements from "../../../hooks/useLineOfCreditAgreements"
import ErrorIndex from "../../../pages/error/_error"
import { formatDate } from "../../../utils/date"
import { format, formatAsPercentage } from "../../../utils/money"
import OfferDetailsCard from "../../onboarding/components/offers/OfferDetailsCard"

const LineOfCreditDetails = () => {
  const { isDesktop } = useDevice()
  const { t } = useTranslation("line-of-credit", { keyPrefix: "details" })
  const { id } = useParams()
  const { locAgreements } = useLineOfCreditAgreements()
  const lineOfCredit = locAgreements.data?.content?.find(
    (item) => item.id === id
  )

  if (locAgreements.isLoading) {
    return null
  }

  if (!lineOfCredit) {
    return <ErrorIndex type="404" />
  }

  return (
    <>
      <div className={clsx({ "mt-3": isDesktop })}>
        <OfferDetailsCard
          className="mb-4"
          items={[
            {
              label: t("drawFeeMonthly"),
              value: formatAsPercentage(
                ((lineOfCredit.fees?.drawPercentFee ?? 0) /
                  (lineOfCredit.drawParameters?.drawRepaymentDurationMaximum ??
                    1)) *
                  100,
                2,
                {
                  removeTrailingZeros: true,
                }
              ),
            },
            {
              label: t("repaymentsPerDraw"),
              value: t("repaymentsPerDrawValue", {
                range: [
                  ...new Set([
                    lineOfCredit.drawParameters?.drawRepaymentDurationMinimum,
                    lineOfCredit.drawParameters?.drawRepaymentDurationMaximum,
                  ]),
                ].join("-"),
              }),
            },
            {
              label: t("repaymentFrequency.title"),
              value: lineOfCredit.repaymentTerms?.collectionFrequency
                ? t(
                    `repaymentFrequency.${lineOfCredit.repaymentTerms.collectionFrequency}`
                  )
                : "--",
            },
            {
              label: t("minimumDraw"),
              value: format(
                lineOfCredit.drawParameters?.minimumDrawAmount?.amount ?? 0,
                lineOfCredit.limit!.currency!
              ),
            },
            {
              label: t("facilityFee", {
                percent: formatAsPercentage(
                  (lineOfCredit.fees?.facilityPercentFee ?? 0) * 100,
                  2,
                  {
                    removeTrailingZeros: true,
                  }
                ),
              }),
              value: format(
                lineOfCredit.fees?.facilityFeeOverallAmount?.amount ?? 0,
                lineOfCredit.limit!.currency!
              ),
            },
          ]}
        />
      </div>
      <OfferDetailsCard
        className="mb-4"
        items={[
          {
            label: t("activationDate"),
            value: lineOfCredit.creationDate
              ? formatDate(lineOfCredit.creationDate, {
                  customFormat: "dd MMM yyyy",
                })
              : "",
          },
          {
            label: t("drawUntil"),
            value: lineOfCredit.drawDownPeriodEndDate
              ? formatDate(lineOfCredit.drawDownPeriodEndDate, {
                  customFormat: "dd MMM yyyy",
                })
              : "",
          },
        ]}
      />
      <OfferDetailsCard
        title={t("fees")}
        items={[
          {
            label: t("billPayFee"),
            value: formatAsPercentage(
              (lineOfCredit.fees?.billPaymentOtherPercentFee ?? 0) * 100,
              2,
              {
                removeTrailingZeros: true,
                signDisplay: true,
              }
            ),
          },
          ...(lineOfCredit.fees?.cashPercentFee === undefined
            ? []
            : [
                {
                  label: t("cashFee"),
                  value: formatAsPercentage(
                    (lineOfCredit.fees.cashPercentFee ?? 0) * 100,
                    2,
                    {
                      removeTrailingZeros: true,
                      signDisplay: true,
                    }
                  ),
                },
              ]),
        ]}
      />
    </>
  )
}

export default LineOfCreditDetails
