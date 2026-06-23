import { useMemo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnalyticsDownSolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import { useShallow } from "zustand/shallow"
import BoxIcon from "../../../components/Basic/BoxIcon"
import Typography from "../../../components/Basic/Typography"
import Alert from "../../../components/UI/Alert"
import GraphWidget from "../../../components/UI/GraphWidget"
import { GraphWidgetProps } from "../../../components/UI/GraphWidget/GraphWidget"
import Widget from "../../../components/UI/Widget"
import useStore from "../../../hooks/useStore"
import {
  CommonOfferDetailsRepaymentFrequencyEnum,
  LineOfCreditResponseCollectionFrequencyEnum,
  RepaymentParametersResponse,
} from "../../../services/api/agreements"
import { formatDate } from "../../../utils/date"
import WhyWeBetterCard from "../../onboarding/components/offers/WhyWeBetterCard"

const valueFormatter = (num: number) => {
  if (Math.abs(num) > 999999) {
    return `${+(Math.sign(num) * (Math.abs(num) / 1000000)).toFixed(2)}M`
  }
  return Math.abs(num) > 999
    ? `${+(Math.sign(num) * (Math.abs(num) / 1000)).toFixed(0)}k`
    : `${+(Math.sign(num) * Math.abs(num)).toFixed(0)}`
}

const DrawSchedule = ({
  values,
  firstDraw,
}: {
  firstDraw?: boolean
  values: {
    collectionFrequency:
      | LineOfCreditResponseCollectionFrequencyEnum
      | CommonOfferDetailsRepaymentFrequencyEnum
    numberOfRepayments: number
    singleRepaymentAmount: number
    totalRepaymentAmount: number
    currency: string
    deferredRepayments?: RepaymentParametersResponse
    amount?: number
    hasDeferredRepayments?: boolean
  }
}) => {
  const { t } = useTranslation("onboarding")
  const { offerSelectedDeferredRepayment } = useStore(
    useShallow((state) => ({
      offerSelectedDeferredRepayment: state.offerSelectedDeferredRepayment,
    }))
  )

  const {
    collectionFrequency,
    numberOfRepayments,
    singleRepaymentAmount,
    totalRepaymentAmount,
    deferredRepayments,
    amount,
  } = values

  const nameFormatter = (dateIsoString: string) => {
    return formatDate(new Date(dateIsoString), {
      customFormat:
        collectionFrequency ===
        LineOfCreditResponseCollectionFrequencyEnum.Monthly
          ? "MMM"
          : "dd MMM",
    })
  }

  const deferredRepaymentsNumber =
    deferredRepayments?.repaymentsNumber ??
    // @ts-expect-error api typing gg
    deferredRepayments?.numberOfRepayments ??
    0

  const deferredFirstRepaymentAmount =
    deferredRepayments?.firstRepaymentAmount ??
    // @ts-expect-error api typing gg
    deferredRepayments?.singleRepayment.amount ??
    0

  const repaymentsNumberDifferenceWhenDeferred =
    numberOfRepayments && deferredRepaymentsNumber
      ? numberOfRepayments - deferredRepaymentsNumber
      : 0

  const graphData = useMemo(() => {
    const data: GraphWidgetProps["data"] = []
    let currentRepaymentNumber = 0

    while (numberOfRepayments && currentRepaymentNumber <= numberOfRepayments) {
      const startDate = new Date()
      startDate.setUTCHours(0, 0, 0, 0)

      switch (collectionFrequency) {
        case LineOfCreditResponseCollectionFrequencyEnum.Daily: {
          startDate.setDate(startDate.getDate() + currentRepaymentNumber)
          break
        }
        case LineOfCreditResponseCollectionFrequencyEnum.Weekly: {
          startDate.setDate(startDate.getDate() + currentRepaymentNumber * 7)
          break
        }
        case LineOfCreditResponseCollectionFrequencyEnum.Every14Days: {
          startDate.setDate(startDate.getDate() + currentRepaymentNumber * 14)
          break
        }
        case LineOfCreditResponseCollectionFrequencyEnum.Every15Days: {
          startDate.setDate(startDate.getDate() + currentRepaymentNumber * 15)
          break
        }
        case LineOfCreditResponseCollectionFrequencyEnum.Monthly: {
          startDate.setMonth(startDate.getMonth() + currentRepaymentNumber)
          break
        }
        default:
      }
      const repaymentDate = startDate.toISOString()

      const totalRepaymentAmountAfterDefer =
        totalRepaymentAmount +
        (offerSelectedDeferredRepayment?.deferredRepaymentAdditionalFee || 0) *
          (amount || 0)

      const repaymentAmountAfterDefer =
        currentRepaymentNumber < repaymentsNumberDifferenceWhenDeferred
          ? 0
          : deferredFirstRepaymentAmount *
            (currentRepaymentNumber - repaymentsNumberDifferenceWhenDeferred)
      const firstRepaymentAmount = singleRepaymentAmount
      data.push({
        value: totalRepaymentAmount
          ? Math.max(
              offerSelectedDeferredRepayment?.deferredRepaymentPeriod
                ? totalRepaymentAmountAfterDefer - repaymentAmountAfterDefer
                : totalRepaymentAmount -
                    firstRepaymentAmount * currentRepaymentNumber,
              0
            )
          : 0,
        name: repaymentDate,
      })
      currentRepaymentNumber += 1
    }

    return data
  }, [
    amount,
    collectionFrequency,
    deferredFirstRepaymentAmount,
    numberOfRepayments,
    offerSelectedDeferredRepayment?.deferredRepaymentAdditionalFee,
    offerSelectedDeferredRepayment?.deferredRepaymentPeriod,
    repaymentsNumberDifferenceWhenDeferred,
    singleRepaymentAmount,
    totalRepaymentAmount,
  ])

  return (
    <div className="flex flex-col gap-8">
      {!firstDraw && (
        <Typography color="neutral-600">
          {t(`offers.collectionsDetails.fixedTerm.description`)}
        </Typography>
      )}

      <Widget
        title={t("offers.graph.title")}
        icon={
          <BoxIcon
            severity="accent-4"
            icon={<HugeiconsIcon icon={AnalyticsDownSolidStandard} />}
          />
        }
      >
        <GraphWidget
          data={graphData}
          height={161}
          type="stepAfter"
          valueFormatter={valueFormatter}
          nameFormatter={nameFormatter}
        />
      </Widget>

      <WhyWeBetterCard isLoCOffer />

      {!firstDraw && <Alert>{t("offers.collectionsDetails.alert")}</Alert>}
    </div>
  )
}

export default DrawSchedule
