import { useMemo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ChartDownSolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import { useShallow } from "zustand/shallow"
import BoxIcon from "../../../components/Basic/BoxIcon"
import GraphWidget from "../../../components/UI/GraphWidget"
import { GraphWidgetProps } from "../../../components/UI/GraphWidget/GraphWidget"
import Widget from "../../../components/UI/Widget"
import useStore from "../../../hooks/useStore"
import {
  CommonOfferDetailsRepaymentFrequencyEnum,
  OfferResponse,
  OfferResponseOfferTypeEnum,
} from "../../../services/api/agreements"
import { formatDate } from "../../../utils/date"
import { format, formatAsPercentage } from "../../../utils/money"
import { RepaymentSidebar } from "../components/offers/components/RepaymentSidebar"
import usePricing from "../components/offers/hooks/usePricing"
import OfferDetailsCard from "../components/offers/OfferDetailsCard"
import { useVariantQueryState } from "../components/offers/RevenueBasedFinancingTabContent"
import WhyWeBetterCard from "../components/offers/WhyWeBetterCard"
import useDeferredRepayments from "../hooks/useDeferredRepayments"
import useDeferredRepaymentsParametersFixedOffer from "../hooks/useDeferredRepaymentsParametersFixedOffer"
import useOffers from "../hooks/useOffers"
import useRepaymentSummary from "../hooks/useRepaymentSummary"
import { getBusinessLoanOfferParams } from "../utils/offers"

// These values are provided by the business
const frequencyToMonthlyFactor: Record<
  CommonOfferDetailsRepaymentFrequencyEnum,
  number
> = {
  DAILY: 30,
  WEEKLY: 4.3,
  EVERY_14_DAYS: 2.17,
  MONTHLY: 1,
  EVERY_15_DAYS: 2,
  ON_DEMAND: 1,
  UNKNOWN: 1,
}

// These values are provided by the business
const SALES_MULTIPLIERS = [1, 1.3, 0, 0.3, 0.6]

const roundToOne = (value: number) => Math.ceil(value)
const roundToHundred = (value: number) => Math.round(value / 100) * 100

/**
 * Calculates example repayment scenarios for RBF (Revenue-Based Financing) offers.
 * Uses predefined sales multipliers to show how repayments vary based on different sales levels.
 *
 * @param advance - The advance amount (principal) provided to the customer
 * @param repaymentRate - Revenue share percentage as a decimal (e.g., 0.1 for 10%)
 * @param frequency - How often repayments are collected (daily, weekly, etc.)
 * @returns Array of { value, repayment } objects representing different sales scenarios
 */
const calculateRepayments = (
  advance: number,
  repaymentRate: number,
  frequency: CommonOfferDetailsRepaymentFrequencyEnum
) => {
  const factor = frequencyToMonthlyFactor[frequency] || 1
  const baseSales = advance / factor

  return SALES_MULTIPLIERS.map((multiplier) => {
    const value = roundToHundred(baseSales * multiplier)
    return { value, repayment: roundToOne(value * repaymentRate) }
  })
}

const valueFormatter = (num: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
  }).format(num)
}

const CollectionsDetails = ({ offer }: { offer: OfferResponse }) => {
  const { t } = useTranslation("onboarding")
  const { isLoading } = useOffers()
  const { offerCustomizations, offerSelectedDeferredRepayment } = useStore(
    useShallow((state) => ({
      offerCustomizations: state.offerCustomizations,
      offerSelectedDeferredRepayment: state.offerSelectedDeferredRepayment,
    }))
  )
  const repaymentSummary = useRepaymentSummary(offer)
  const deferredRepaymentsParameters =
    useDeferredRepaymentsParametersFixedOffer(offer)
  const deferredRepayments = useDeferredRepayments(deferredRepaymentsParameters)
  const offerParams = getBusinessLoanOfferParams(offer, offerCustomizations)
  const pricing = usePricing({ offer })

  const nameFormatter = (dateIsoString: string) => {
    return formatDate(new Date(dateIsoString), {
      customFormat:
        offerParams.repaymentFrequency ===
        CommonOfferDetailsRepaymentFrequencyEnum.Monthly
          ? "MMM"
          : "dd MMM",
    })
  }
  const baseFee = Number(pricing.data?.baseFee) || offerParams.baseFee
  const minTotalRepayable = offerParams.advance * (1 + baseFee)
  const repaymentsNumberDifferenceWhenDeferred =
    repaymentSummary.data?.repaymentsNumber &&
    deferredRepayments.data?.repaymentsNumber
      ? repaymentSummary.data.repaymentsNumber -
        deferredRepayments.data.repaymentsNumber
      : 0

  const graphData = useMemo(() => {
    const data: GraphWidgetProps["data"] = []
    let currentRepaymentNumber = 0
    const firstRepaymentAmount =
      repaymentSummary.data?.firstRepaymentAmount ?? 0
    while (
      repaymentSummary.data?.repaymentsNumber &&
      currentRepaymentNumber <= repaymentSummary.data.repaymentsNumber
    ) {
      const startDate = new Date()
      startDate.setUTCHours(0, 0, 0, 0)
      let repaymentDate = startDate.toISOString()
      if (offer.expirationDate && offerParams.repaymentFrequency) {
        switch (offerParams.repaymentFrequency) {
          case CommonOfferDetailsRepaymentFrequencyEnum.Daily: {
            startDate.setDate(startDate.getDate() + currentRepaymentNumber)
            break
          }
          case CommonOfferDetailsRepaymentFrequencyEnum.Weekly: {
            startDate.setDate(startDate.getDate() + currentRepaymentNumber * 7)
            break
          }
          case CommonOfferDetailsRepaymentFrequencyEnum.Every14Days: {
            startDate.setDate(startDate.getDate() + currentRepaymentNumber * 14)
            break
          }
          case CommonOfferDetailsRepaymentFrequencyEnum.Every15Days: {
            startDate.setDate(startDate.getDate() + currentRepaymentNumber * 15)
            break
          }
          case CommonOfferDetailsRepaymentFrequencyEnum.Monthly: {
            startDate.setMonth(startDate.getMonth() + currentRepaymentNumber)
            break
          }
          default:
        }
        repaymentDate = startDate.toISOString()
      }

      const repaymentAmount = firstRepaymentAmount * currentRepaymentNumber
      const minTotalRepayableAfterDefer =
        minTotalRepayable +
        (offerSelectedDeferredRepayment?.deferredRepaymentAdditionalFee ||
          offerParams.deferredRepaymentAdditionalFee) *
          offerParams.advance
      const repaymentAmountAfterDefer =
        currentRepaymentNumber < repaymentsNumberDifferenceWhenDeferred
          ? 0
          : (deferredRepayments.data?.firstRepaymentAmount || 0) *
            (currentRepaymentNumber - repaymentsNumberDifferenceWhenDeferred)

      data.push({
        value: minTotalRepayable
          ? Math.max(
              offerSelectedDeferredRepayment?.deferredRepaymentPeriod ||
                offerParams.deferredRepaymentPeriod > 0
                ? minTotalRepayableAfterDefer - repaymentAmountAfterDefer
                : minTotalRepayable - repaymentAmount,
              0
            )
          : 0,
        name: repaymentDate,
      })
      currentRepaymentNumber += 1
    }
    return data
  }, [
    offer,
    repaymentSummary.data?.firstRepaymentAmount,
    repaymentSummary.data?.repaymentsNumber,
    offerParams.repaymentFrequency,
    offerParams.deferredRepaymentAdditionalFee,
    offerParams.advance,
    minTotalRepayable,
    offerSelectedDeferredRepayment?.deferredRepaymentAdditionalFee,
    offerSelectedDeferredRepayment?.deferredRepaymentPeriod,
    repaymentsNumberDifferenceWhenDeferred,
    deferredRepayments.data?.firstRepaymentAmount,
    offerParams.deferredRepaymentPeriod,
  ])

  const [variant] = useVariantQueryState()

  const offerVariant = offer.offerDetails?.rbfOfferDetails?.variants?.find(
    (v) => v.name === variant
  )

  if (isLoading) {
    return null
  }

  const isFixedOffer =
    offer.offerType === OfferResponseOfferTypeEnum.Fixed ||
    offer.offerType === OfferResponseOfferTypeEnum.FixedCustomizable
  const isLoCOffer = offer.offerType === OfferResponseOfferTypeEnum.LineOfCredit
  const isRefinance =
    (offer.offerDetails?.refinanceDetails?.refinancedAgreementsIds || [])
      .length > 0
  const isRBFOffer = offer.offerType === OfferResponseOfferTypeEnum.Rbf

  return (
    <>
      {isFixedOffer && !isRefinance && (
        <div className="mb-4">
          <Widget
            title={t("offers.graph.title")}
            icon={
              <BoxIcon
                severity="accent-3"
                icon={<HugeiconsIcon icon={ChartDownSolidStandard} />}
              />
            }
          >
            <GraphWidget
              data={graphData}
              height={170}
              type="stepAfter"
              valueFormatter={valueFormatter}
              nameFormatter={nameFormatter}
              isLoading={
                repaymentSummary.isLoading || deferredRepayments.isLoading
              }
            />
          </Widget>
        </div>
      )}
      {isLoCOffer && (
        <OfferDetailsCard
          title={t(`offers.collectionsDetails.howCalculated`)}
          items={[
            {
              label: t("offers.collectionsDetails.loc.example.minimumDraw"),
              value:
                offerParams.advance && offerParams.currency
                  ? format(offerParams.advance, offerParams.currency, {
                      minimumFractionDigits: 0,
                    })
                  : "--",
            },
            {
              label: t("offers.collectionsDetails.loc.example.drawFee"),
              value: baseFee
                ? formatAsPercentage(baseFee * 100, 2, {
                    removeTrailingZeros: true,
                  })
                : "--",
            },
            {
              label: t(
                `offers.collectionsDetails.fixedTerm.example.minTotalRepayable`
              ),
              value:
                minTotalRepayable && offerParams.currency
                  ? format(minTotalRepayable, offerParams.currency, {
                      minimumFractionDigits: 0,
                    })
                  : "--",
            },
            {
              label: t(
                `offers.collectionsDetails.fixedTerm.example.NoOfRepayments`
              ),
              value: repaymentSummary.data?.repaymentsNumber || "--",
            },
            {
              label: offerParams.repaymentFrequency
                ? t(`offers.repayment.${offerParams.repaymentFrequency}`)
                : "--",
              value:
                offerParams.currency &&
                repaymentSummary.data?.firstRepaymentAmount
                  ? format(
                      repaymentSummary.data.firstRepaymentAmount,
                      offerParams.currency
                    )
                  : "--",
            },
          ]}
        />
      )}
      {isRBFOffer && offerVariant && (
        <RepaymentSidebar
          data={calculateRepayments(
            offer.offerDetails?.rbfOfferDetails?.advanceAmount!,
            offerVariant.revenueSharePercentage!,
            offer.offerDetails?.commonOfferDetails?.repaymentFrequency!
          )}
          frequency={
            offer.offerDetails?.commonOfferDetails?.repaymentFrequency!
          }
          currency={offer.offerDetails?.commonOfferDetails?.advanceCurrency!}
          repaymentPercentage={offerVariant.revenueSharePercentage!}
          className="mb-4"
        />
      )}
      <WhyWeBetterCard isLoCOffer={isLoCOffer} />
    </>
  )
}

export default CollectionsDetails
