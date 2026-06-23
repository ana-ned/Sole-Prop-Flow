import { useTranslation } from "react-i18next"
import SimpleBarChart, {
  BASE_SEGMENT_CLASS,
  BarColumn,
  LegendItem,
  PRIMARY_SEGMENT_CLASS,
  SegmentConfig,
} from "../../../../../components/UI/SimpleBarChart"
import Widget from "../../../../../components/UI/Widget"
import { CommonOfferDetailsRepaymentFrequencyEnum } from "../../../../../services/api/agreements"
import { format, formatAsPercentage } from "../../../../../utils/money"

interface PeriodData {
  value: number
  repayment: number
}

interface RepaymentChartProps {
  data: PeriodData[]
  chartHeight?: number
  className?: string
  frequency: CommonOfferDetailsRepaymentFrequencyEnum
  repaymentPercentage: number
  currency: string
}

const SEGMENT_CONFIGS: SegmentConfig[] = [
  { className: PRIMARY_SEGMENT_CLASS, withOverlay: true },
  { className: BASE_SEGMENT_CLASS },
]

export const RepaymentSidebar = ({
  data,
  chartHeight = 151,
  className,
  frequency,
  repaymentPercentage,
  currency,
}: RepaymentChartProps) => {
  const { t } = useTranslation("onboarding")

  const columns: BarColumn[] = data.map((period, index) => {
    const hasRepayment = period.repayment > 0

    return {
      key: `${period.value}-${period.repayment}-${repaymentPercentage}-${frequency}-${currency}-${index}`,
      segments: hasRepayment
        ? [
            { amount: period.repayment, configIndex: 0 },
            { amount: period.value - period.repayment, configIndex: 1 },
          ]
        : [],
      topLabel: hasRepayment
        ? format(period.repayment, currency, { minimumFractionDigits: 0 })
        : undefined,
      bottomLabel: (
        <>
          {t(`offers.rbf.sidebar.period.${frequency}`)} {index + 1}
          <br />
          {format(period.value, currency, { minimumFractionDigits: 0 })}
        </>
      ),
    }
  })

  const legend: LegendItem[] = [
    {
      segmentIndex: 0,
      label: (
        <>
          {t("offers.rbf.sidebar.repayments")}:{" "}
          {t("offers.rbf.summary.details.amountValue", {
            percentage: formatAsPercentage(repaymentPercentage * 100, 0),
            frequency,
          })}
        </>
      ),
    },
  ]

  return (
    <Widget title={t("offers.rbf.sidebar.title")} className={className}>
      <div className="mt-6">
        <SimpleBarChart
          segmentConfigs={SEGMENT_CONFIGS}
          columns={columns}
          chartHeight={chartHeight}
          emptyLabel={t("offers.rbf.sidebar.noRepayment")}
          legend={legend}
          ariaLabel={t("offers.rbf.sidebar.title")}
        />
      </div>
    </Widget>
  )
}
