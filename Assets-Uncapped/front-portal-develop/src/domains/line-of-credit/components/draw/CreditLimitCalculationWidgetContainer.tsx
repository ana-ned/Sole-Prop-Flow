import CreditLimitCalculationWidget, {
  MerchantData,
} from "../../../../components/Shared/CreditLimitCalculationWidget"
import useRevenueRecalculation from "../../../../hooks/useRevenueRecalculation"
import platforms from "../../../connections/models/platforms"

interface CreditLimitCalculationWidgetContainerProps {
  agreementId: string
  currency: string
  multiplier?: number
  maximumCreditLimit: number
  creditLimit: number
}

const CreditLimitCalculationWidgetContainer = ({
  agreementId,
  currency,
  multiplier,
  maximumCreditLimit,
  creditLimit,
}: CreditLimitCalculationWidgetContainerProps) => {
  const { data: revenueData, isLoading } = useRevenueRecalculation({
    agreementId,
  })

  const merchantData: MerchantData[] =
    revenueData?.fetchedRevenueGroupedByPlatform
      ? Object.entries(revenueData.fetchedRevenueGroupedByPlatform).map(
          ([platformName, revenue]) => {
            const platform = Object.values(platforms).find((p) =>
              platformName.toLowerCase().includes(p.name.toLowerCase())
            )

            return {
              name: platformName,
              icon:
                platform && "iconUrl" in platform
                  ? platform.iconUrl
                  : undefined,
              amount: revenue,
            }
          }
        )
      : []

  return (
    <CreditLimitCalculationWidget
      currency={currency}
      multiplier={multiplier}
      maximumCreditLimit={maximumCreditLimit}
      creditLimit={creditLimit}
      merchantData={merchantData}
      isLoading={isLoading}
    />
  )
}

export default CreditLimitCalculationWidgetContainer
