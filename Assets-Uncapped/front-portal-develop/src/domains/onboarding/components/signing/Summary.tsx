import { HugeiconsIcon } from "@hugeicons/react"
import { Invoice02SolidSharp } from "@hugeicons-pro/core-solid-sharp"
import {
  BookmarkCheck02SolidStandard,
  DiscountTag02SolidStandard,
  MoneySend02SolidStandard,
  MoneyReceive02SolidStandard,
  File01SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import useDeal from "../../../../hooks/useDeal"
import {
  CommonOfferDetailsRepaymentFrequencyEnum,
  InterestRateLocDetailsSetupFeeTypeEnum,
  OfferResponse,
  OfferResponseOfferTypeEnum,
} from "../../../../services/api/agreements"
import { formatAsPercentage, format } from "../../../../utils/money"
import { titleCase } from "../../../../utils/string"
import useDeferredRepayments from "../../hooks/useDeferredRepayments"
import useDeferredRepaymentsParametersFixedOffer from "../../hooks/useDeferredRepaymentsParametersFixedOffer"
import { useRefinanceBalanceCalculations } from "../../hooks/useRefinanceBalanceCalculations"
import useRepaymentSummary from "../../hooks/useRepaymentSummary"
import {
  BusinessLoanOfferParams,
  getBusinessLoanOfferParams,
  getFirstRepaymentDay,
  getLineOfCreditOfferParams,
  getRepaymentFrequencyDays,
} from "../../utils/offers"
import OfferDetailsCardV2 from "../offers/OfferDetailsCardV2"
import FirstDrawSummary from "./FirstDrawSummary"

const Summary = ({ offer }: { offer: OfferResponse }) => {
  const { t } = useTranslation("onboarding")
  const repaymentSummary = useRepaymentSummary(offer)
  const deferredRepaymentParameters =
    useDeferredRepaymentsParametersFixedOffer(offer)
  const deferredRepayments = useDeferredRepayments(deferredRepaymentParameters)
  const deal = useDeal()
  const offerParams =
    offer.offerType === OfferResponseOfferTypeEnum.LineOfCredit
      ? getLineOfCreditOfferParams(offer)
      : getBusinessLoanOfferParams(offer)

  const hasDeferredRepayments =
    ![
      OfferResponseOfferTypeEnum.LineOfCredit,
      OfferResponseOfferTypeEnum.InterestRateLineOfCredit,
    ].includes(offer.offerType as any) &&
    (offerParams as BusinessLoanOfferParams).deferredRepaymentPeriod > 0

  const isRefinance =
    (offer.offerDetails?.refinanceDetails?.refinancedAgreementsIds?.length ||
      0) > 0
  const { balanceToPayOffNet } = useRefinanceBalanceCalculations(
    offer,
    isRefinance
  )

  if (offer.offerType === OfferResponseOfferTypeEnum.InterestRateLineOfCredit) {
    const loc = offer.offerDetails?.interestRateLocDetails
    const common = offer.offerDetails?.commonOfferDetails

    const creditLimitItems = [
      {
        label: t("signing.summary.locV2.creditLimit.maximumCreditLimit"),
        value: format(loc?.maximumCreditLimit!, common?.advanceCurrency!, {
          minimumFractionDigits: 0,
        }),
      },
      {
        label: t("signing.summary.locV2.creditLimit.availableCreditLimit"),
        value: t(
          "signing.summary.locV2.creditLimit.availableCreditLimitValue",
          {
            multiplier: loc?.availableCreditLimitMultiplier || 0,
          }
        ),
      },
    ]

    const isSetupFeeConditional =
      loc?.setupFeeType === InterestRateLocDetailsSetupFeeTypeEnum.Conditional

    const pricingDetailsItems = [
      ...(loc?.setupFeeMaxCreditLimitPercent &&
      loc.setupFeeMaxCreditLimitPercent > 0
        ? [
            {
              label: isSetupFeeConditional
                ? t("signing.summary.locV2.pricingDetails.setupFeeConditional")
                : t("signing.summary.locV2.pricingDetails.setupFee"),
              value: formatAsPercentage(
                loc.setupFeeMaxCreditLimitPercent * 100,
                2,
                {
                  removeTrailingZeros: true,
                }
              ),
            },
          ]
        : []),
      {
        label: t("signing.summary.locV2.pricingDetails.interestRate"),
        value: formatAsPercentage(loc?.interestRate! * 100, 2, {
          removeTrailingZeros: true,
        }),
      },
    ]

    const repaymentDetailsItems = [
      {
        label: t("signing.summary.locV2.repaymentDetails.drawPeriod"),
        value: t("signing.summary.locV2.month", {
          count: loc?.drawPhaseDuration,
        }),
      },
      {
        label: t("signing.summary.locV2.repaymentDetails.repaymentPeriod"),
        value: t("signing.summary.locV2.repaymentMonth", {
          count: loc?.repaymentPhaseDuration,
        }),
      },
    ]

    return (
      <div className="flex flex-col gap-4">
        <OfferDetailsCardV2
          title={t("signing.summary.locV2.creditLimit.title")}
          items={creditLimitItems}
          icon={
            <BoxIcon
              severity="accent-4"
              icon={<HugeiconsIcon icon={DiscountTag02SolidStandard} />}
            />
          }
        />

        <OfferDetailsCardV2
          title={t("signing.summary.locV2.pricingDetails.title")}
          items={pricingDetailsItems}
          icon={
            <BoxIcon
              severity="accent-6"
              icon={<HugeiconsIcon icon={Invoice02SolidSharp} />}
            />
          }
        />

        <OfferDetailsCardV2
          title={t("signing.summary.locV2.repaymentDetails.title")}
          items={repaymentDetailsItems}
          icon={
            <BoxIcon
              severity="accent-3"
              icon={<HugeiconsIcon icon={MoneySend02SolidStandard} />}
            />
          }
        />

        {!!loc?.firstDrawAmount && loc.firstDrawAmount > 0 && (
          <OfferDetailsCardV2
            title={t("signing.summary.locV2.firstDraw.title")}
            items={[
              {
                label: t("signing.summary.locV2.firstDraw.amount"),
                value: format(loc.firstDrawAmount, common?.advanceCurrency!, {
                  minimumFractionDigits: 0,
                }),
              },
              {
                label: t("signing.summary.locV2.firstDraw.initialRepayment"),
                value: t("signing.summary.locV2.firstDraw.onDay", {
                  day: getRepaymentFrequencyDays(common?.repaymentFrequency!),
                }),
              },
              {
                label: t("signing.summary.locV2.firstDraw.firstRepayment"),
                value: format(
                  (isRefinance
                    ? loc.firstDrawAmount + balanceToPayOffNet
                    : loc.firstDrawAmount) *
                    loc.principalRatePerInstallmentInDrawPhase!,
                  common?.advanceCurrency!,
                  {
                    minimumFractionDigits: 0,
                  }
                ),
              },
            ]}
            icon={
              <BoxIcon
                severity="accent-4"
                icon={<HugeiconsIcon icon={MoneyReceive02SolidStandard} />}
              />
            }
          />
        )}
      </div>
    )
  }

  if (offer.offerType === OfferResponseOfferTypeEnum.LineOfCredit) {
    return (
      <div className="flex flex-col gap-4">
        <OfferDetailsCardV2
          title={t(`signing.summary.loc.title`, {
            type: deal.isAmazonPartnership
              ? t("signing.summary.loc.flexibleCreditLine")
              : t("signing.summary.loc.loc"),
          })}
          icon={
            <BoxIcon
              severity="accent-4"
              icon={<HugeiconsIcon icon={DiscountTag02SolidStandard} />}
            />
          }
          items={[
            {
              label: t("signing.summary.loc.drawdownPeriod"),
              value: t("offers.month", {
                count:
                  "drawdownPeriod" in offerParams
                    ? offerParams.drawdownPeriod
                    : undefined,
              }),
            },
            {
              label: t("signing.summary.loc.facilityLimit"),
              value: format(offerParams.advance, offerParams.currency!, {
                minimumFractionDigits: 0,
              }),
            },
            // @ts-expect-error: Property 'setupFee' does not exist on type 'BusinessLoanOfferParams'.ts(2339)
            ...(offerParams.setupFee === 0
              ? []
              : [
                  {
                    label: t("signing.summary.loc.setupFee"),
                    // @ts-expect-error: Property 'setupFee' does not exist on type 'BusinessLoanOfferParams'.ts(2339)
                    value: formatAsPercentage(offerParams.setupFee * 100, 2, {
                      removeTrailingZeros: true,
                    }),
                  },
                ]),
            // @ts-expect-error: Property 'facilityFee' does not exist on type 'BusinessLoanOfferParams'.ts(2339)
            ...(offerParams.facilityFee === 0
              ? []
              : [
                  {
                    label: t("signing.summary.loc.facilityFee"),
                    value: formatAsPercentage(
                      // @ts-expect-error: Property 'facilityFee' does not exist on type 'BusinessLoanOfferParams'.ts(2339)
                      offerParams.facilityFee * 100,
                      2,
                      {
                        removeTrailingZeros: true,
                      }
                    ),
                  },
                ]),
            {
              label: t("signing.summary.loc.repaymentTermPerDraw"),
              value: t("signing.summary.loc.repaymentTermPerDrawValue", {
                value: offerParams.repaymentLength
                  ? `${
                      "repaymentLengthMinimum" in offerParams &&
                      offerParams.repaymentLengthMinimum &&
                      offerParams.repaymentLengthMinimum !==
                        offerParams.repaymentLength
                        ? `${offerParams.repaymentLengthMinimum}-`
                        : ""
                    }${offerParams.repaymentLength}`
                  : "--",
              }),
            },
            {
              label: t("signing.summary.loc.drawFee"),
              value: formatAsPercentage(
                (offerParams.baseFee * 100) / offerParams.repaymentLength,
                2,
                {
                  removeTrailingZeros: true,
                }
              ),
            },
            {
              label: t("signing.summary.loc.repaymentFrequency"),
              value: offerParams.repaymentFrequency
                ? t(
                    `offers.collectionSchedule.${offerParams.repaymentFrequency}`
                  )
                : "--",
            },
          ]}
        />

        {"firstDrawAmount" in offerParams &&
        offerParams.firstDrawAmount &&
        offerParams.firstDrawAmount > 0 ? (
          <FirstDrawSummary offer={offer} />
        ) : null}
      </div>
    )
  }

  if (offer.offerType === OfferResponseOfferTypeEnum.Rbf) {
    const currency = offerParams.currency || "USD"
    const amount = offer.offerDetails?.rbfOfferDetails?.advanceAmount || 0
    const fee = offer.offerDetails?.rbfOfferDetails?.flatBaseFee || 0
    const feeAmount = amount * fee
    const totalAmount = amount + feeAmount
    const revenueShare =
      offer.offerDetails?.rbfOfferDetails?.revenueSharePercentage || 0
    const revenueSharePercentage = revenueShare * 100
    const frequencyText =
      offer.offerDetails?.commonOfferDetails?.repaymentFrequency ===
      CommonOfferDetailsRepaymentFrequencyEnum.Every14Days
        ? "Biweekly"
        : titleCase(
            offer.offerDetails?.commonOfferDetails?.repaymentFrequency || ""
          )
    const repaymentAmountValueTranslationKey =
      offer.offerDetails?.commonOfferDetails?.repaymentFrequency ===
      CommonOfferDetailsRepaymentFrequencyEnum.Every15Days
        ? "signing.summary.rbf.repaymentAmountValueAlternative"
        : "signing.summary.rbf.repaymentAmountValue"
    return (
      <OfferDetailsCardV2
        title={t(`signing.summary.businessLoan.title`)}
        icon={
          <BoxIcon
            severity="accent-6"
            icon={<HugeiconsIcon icon={File01SolidStandard} />}
          />
        }
        items={[
          {
            label: t("signing.summary.rbf.capitalYouReceive"),
            value: format(amount, currency, {
              minimumFractionDigits: 0,
            }),
          },
          {
            label: t("signing.summary.rbf.fixedFee"),
            value: format(feeAmount, currency, {
              minimumFractionDigits: 0,
            }),
          },
          {
            label: t("signing.summary.rbf.totalRepayable"),
            value: format(totalAmount, currency, {
              minimumFractionDigits: 0,
            }),
          },
          {
            label: t("signing.summary.rbf.repaymentFrequency"),
            value: frequencyText,
          },
          {
            label: t("signing.summary.rbf.repaymentAmount"),
            value: t(repaymentAmountValueTranslationKey, {
              percentage: formatAsPercentage(revenueSharePercentage, 0),
              frequency: frequencyText.toLocaleLowerCase(),
            }),
          },
        ]}
      />
    )
  }

  if (offer.offerType === OfferResponseOfferTypeEnum.DailyPayout) {
    const dp = offer.offerDetails?.dailyPayoutOfferDetails

    return (
      <OfferDetailsCardV2
        title={t("signing.summary.dailyPayout.title")}
        icon={
          <BoxIcon
            severity="accent-3"
            icon={<HugeiconsIcon icon={BookmarkCheck02SolidStandard} />}
          />
        }
        items={[
          {
            label: t("signing.summary.dailyPayout.advanceRate"),
            value: formatAsPercentage(dp?.principalBalanceRate! * 100, 4, {
              removeTrailingZeros: true,
            }),
          },
          {
            label: t("signing.summary.dailyPayout.dailyFee"),
            value: formatAsPercentage(dp?.dailyFeeRate! * 100, 6, {
              removeTrailingZeros: true,
            }),
          },
          {
            label: t("signing.summary.dailyPayout.repayments"),
            value: t("signing.summary.dailyPayout.repaymentsValue"),
          },
        ]}
      />
    )
  }

  return (
    <OfferDetailsCardV2
      title={t(`signing.summary.businessLoan.title`)}
      icon={
        <BoxIcon
          severity="accent-4"
          icon={<HugeiconsIcon icon={DiscountTag02SolidStandard} />}
        />
      }
      items={[
        {
          label: t("signing.summary.businessLoan.advanceAmount"),
          value: format(offerParams.advance, offerParams.currency!, {
            minimumFractionDigits: 0,
          }),
        },
        {
          label: t("signing.summary.businessLoan.fixedFee", {
            fee: formatAsPercentage(offerParams.baseFee * 100, 2, {
              removeTrailingZeros: true,
            }),
          }),
          value: format(
            offerParams.baseFee * offerParams.advance,
            offerParams.currency!,
            {
              minimumFractionDigits: 0,
            }
          ),
        },
        ...(offer.offerType === OfferResponseOfferTypeEnum.Fixed ||
        offer.offerType === OfferResponseOfferTypeEnum.FixedCustomizable
          ? [
              {
                label: t("signing.summary.businessLoan.term"),
                value: t("signing.summary.businessLoan.termMonths", {
                  length: offerParams.repaymentLength,
                }),
              },
              {
                label: t(
                  "offers.collectionsDetails.repaymentSchedule.initialRepayment"
                ),
                value: t("offers.collectionsDetails.repaymentSchedule.onDay", {
                  value: getFirstRepaymentDay(
                    hasDeferredRepayments
                      ? deferredRepayments.data?.repaymentStartDate!
                      : repaymentSummary.data?.repaymentStartDate!
                  ),
                }),
              },
              ...(offerParams.repaymentFrequency
                ? [
                    {
                      label: t(
                        `offers.collectionsDetails.repaymentSchedule.${offerParams.repaymentFrequency}`,
                        {
                          count: hasDeferredRepayments
                            ? deferredRepayments.data?.repaymentsNumber || 0
                            : repaymentSummary.data?.repaymentsNumber || 0,
                        }
                      ),
                      value: format(
                        hasDeferredRepayments
                          ? deferredRepayments.data?.firstRepaymentAmount || 0
                          : repaymentSummary.data?.firstRepaymentAmount || 0,
                        offerParams.currency!,
                        {
                          minimumFractionDigits: 0,
                        }
                      ),
                    },
                  ]
                : []),
            ]
          : []),
        ...(offer.offerType === OfferResponseOfferTypeEnum.Flat
          ? [
              {
                label: t(`signing.summary.businessLoan.revenueShare`),
                value: formatAsPercentage(
                  // @ts-expect-error: Property 'revenueShare' does not exist on type 'LineOfCreditOfferParams'.ts(2339)
                  offerParams.revenueShare * 100,
                  0
                ),
              },
              {
                label: t("signing.summary.businessLoan.repaymentSchedule"),
                value: titleCase(offerParams.repaymentFrequency || ""),
              },
            ]
          : []),
      ]}
    />
  )
}

export default Summary
