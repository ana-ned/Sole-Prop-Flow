import { useTranslation } from "react-i18next"
import Typography from "../../../../../components/Basic/Typography"
import { TypographyTypes } from "../../../../../components/Basic/Typography/Typography"
import Accordion from "../../../../../components/UI/Accordion"
import SimpleTable from "../../../../../components/UI/SimpleTable"
import { OfferResponse } from "../../../../../services/api/agreements"
import { format, formatAsPercentage } from "../../../../../utils/money"
import useDeferredRepaymentsParametersFixedOffer from "../../../hooks/useDeferredRepaymentsParametersFixedOffer"
import { BusinessLoanOfferParams } from "../../../utils/offers"
import useAggregatedLedgerBalance from "../hooks/useAggregatedLedgerBalance"

const RefinancingSummary = ({
  offer,
  offerParams,
  baseFeeWithDeferredRepayment,
  isDeferredRepaymentVisible,
}: {
  offer: OfferResponse
  offerParams: BusinessLoanOfferParams
  baseFeeWithDeferredRepayment: number
  isDeferredRepaymentVisible: boolean
}) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers",
  })

  const deferredRepaymentsParameters =
    useDeferredRepaymentsParametersFixedOffer(offer)

  const aggregatedLedgerBalanceQuery = useAggregatedLedgerBalance({
    enabled: offer.offerDetails?.commonOfferDetails?.isMarcusRefinance,
  })

  const refinancingAmount =
    (aggregatedLedgerBalanceQuery.data?.currentFees || 0) +
    (aggregatedLedgerBalanceQuery.data?.currentPrincipal || 0) +
    (aggregatedLedgerBalanceQuery.data?.currentInterest || 0)

  if (aggregatedLedgerBalanceQuery.isLoading) {
    return null
  }

  const accordionItems = [
    ...(isDeferredRepaymentVisible
      ? [
          {
            customLabelName: "totalFixedFee",
            label: `${t("totalFixedFee")} (
                  ${formatAsPercentage(baseFeeWithDeferredRepayment * 100, 2, {
                    removeTrailingZeros: true,
                  })}
                  )`,
            valueType: "tableHeader" as TypographyTypes,
            value:
              offerParams.baseFee && offerParams.currency
                ? format(
                    baseFeeWithDeferredRepayment * offerParams.advance,
                    offerParams.currency,
                    {
                      minimumFractionDigits: 0,
                    }
                  )
                : "",
            content: (
              <SimpleTable
                color="neutral-600"
                data={[
                  {
                    th: (
                      <Typography
                        type="smallCopy"
                        color="neutral-700"
                      >{`${t("fixedFee")} (${formatAsPercentage(
                        offerParams.baseFee * 100,
                        2,
                        {
                          removeTrailingZeros: true,
                        }
                      )})`}</Typography>
                    ),
                    td: (
                      <Typography type="smallCopy" color="neutral-700">
                        {format(
                          offerParams.baseFee * offerParams.advance,
                          offerParams.currency!,
                          {
                            minimumFractionDigits: 0,
                          }
                        )}
                      </Typography>
                    ),
                    key: "fixedFee",
                  },
                  ...(deferredRepaymentsParameters.deferredRepaymentPeriod > 0
                    ? [
                        {
                          th: (
                            <Typography
                              type="smallCopy"
                              color="neutral-700"
                            >{`${t("paymentHolidayFee")} (${formatAsPercentage(
                              deferredRepaymentsParameters.customisationFee *
                                100,
                              2,
                              {
                                removeTrailingZeros: true,
                              }
                            )})`}</Typography>
                          ),
                          td: (
                            <Typography type="smallCopy" color="neutral-700">
                              {format(
                                (deferredRepaymentsParameters.customisationFee ||
                                  0) * offerParams.advance,
                                offerParams.currency!,
                                {
                                  minimumFractionDigits: 0,
                                }
                              )}
                            </Typography>
                          ),
                          key: "paymentHolidayFee",
                        },
                      ]
                    : []),
                ]}
              />
            ),
          },
        ]
      : [
          {
            label: `${t("fixedFee")} 
                  ${
                    offerParams.baseFee
                      ? `(${formatAsPercentage(
                          baseFeeWithDeferredRepayment * 100,
                          2,
                          {
                            removeTrailingZeros: true,
                          }
                        )})`
                      : ""
                  }`,
            valueType: "tableHeader" as TypographyTypes,
            value:
              offerParams.baseFee && offerParams.currency
                ? format(
                    baseFeeWithDeferredRepayment * offerParams.advance,
                    offerParams.currency,
                    {
                      minimumFractionDigits: 0,
                    }
                  )
                : "",
          },
        ]),
    {
      label: t("totalRepayable"),
      valueType: "tableHeader" as TypographyTypes,
      value: offerParams.currency
        ? format(
            refinancingAmount +
              offerParams.advance -
              refinancingAmount +
              baseFeeWithDeferredRepayment * offerParams.advance,
            offerParams.currency,
            {
              minimumFractionDigits: 0,
            }
          )
        : "--",
      content: (
        <SimpleTable
          data={[
            {
              th: (
                <Typography type="smallCopy" color="neutral-700">
                  {t("refinancingOfExistingGoldmanSachsLoan")}
                </Typography>
              ),
              td: (
                <Typography type="smallCopy" color="neutral-700">
                  {offerParams.currency
                    ? format(refinancingAmount, offerParams.currency, {
                        minimumFractionDigits: 0,
                      })
                    : "--"}
                </Typography>
              ),
            },
            {
              th: (
                <Typography type="smallCopy" color="neutral-700">
                  {t("additionalCapital")}
                </Typography>
              ),
              td: (
                <Typography type="smallCopy" color="neutral-700">
                  {offerParams.advance && offerParams.currency
                    ? format(
                        offerParams.advance - refinancingAmount,
                        offerParams.currency,
                        {
                          minimumFractionDigits: 0,
                        }
                      )
                    : "--"}
                </Typography>
              ),
            },
            {
              th: (
                <Typography type="smallCopy" color="neutral-700">
                  {t("totalFixedFee")}
                </Typography>
              ),
              td: (
                <Typography type="smallCopy" color="neutral-700">
                  {offerParams.baseFee && offerParams.currency
                    ? format(
                        baseFeeWithDeferredRepayment * offerParams.advance,
                        offerParams.currency,
                        {
                          minimumFractionDigits: 0,
                        }
                      )
                    : "--"}
                </Typography>
              ),
            },
          ]}
        />
      ),
    },
  ]

  return <Accordion items={accordionItems} className="mb-6" />
}

export default RefinancingSummary
