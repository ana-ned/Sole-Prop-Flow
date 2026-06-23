import { useQuery } from "@tanstack/react-query"
import CreditLimitCalculationWidget, {
  MerchantData,
} from "../../../../../components/Shared/CreditLimitCalculationWidget"
import useAuth from "../../../../../hooks/useAuth"
import {
  OfferResponse,
  RevenueByPlatformSnapshotControllerApi,
} from "../../../../../services/api/agreements"
import apiConfig, {
  ApiServicesEnum,
} from "../../../../../services/api/api-config"
import platforms from "../../../../connections/models/platforms"

const CreditLimitCalculationWidgetContainer = ({
  offer,
}: {
  offer: OfferResponse
}) => {
  const { getToken, organisation } = useAuth()
  const snapshotId =
    offer.offerDetails?.interestRateLocDetails?.revenueDataSnapshotId

  const { data: snapshot, isLoading } = useQuery({
    queryKey: ["revenue-snapshot", snapshotId],
    queryFn: async () => {
      return new RevenueByPlatformSnapshotControllerApi(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getSnapshot({
        id: snapshotId!,
        xXORGID: organisation?.organisationId!,
        onlySelectedPlatforms: true,
      })
    },
    enabled: !!snapshotId && !!organisation?.organisationId,
  })

  const currency =
    offer.offerDetails?.commonOfferDetails?.advanceCurrency || "USD"
  const multiplier =
    offer.offerDetails?.interestRateLocDetails?.availableCreditLimitMultiplier

  const merchantData: MerchantData[] =
    snapshot?.averageCashRevenueByMerchant?.map((merchant) => {
      const platform = Object.values(platforms).find((p) =>
        merchant.merchantName?.toLowerCase().includes(p.name.toLowerCase())
      )

      const currencyField = {
        USD: "monthlyAverageRevenueUSD",
        GBP: "monthlyAverageRevenueGBP",
        CAD: "monthlyAverageRevenueCAD",
        EUR: "monthlyAverageRevenueEUR",
      }[currency] as keyof typeof merchant

      return {
        name: merchant.merchantName || "",
        icon: platform && "iconUrl" in platform ? platform.iconUrl : undefined,
        amount: (merchant[currencyField] as number | undefined) || 0,
      }
    }) || []

  return (
    <CreditLimitCalculationWidget
      currency={currency}
      multiplier={multiplier}
      maximumCreditLimit={
        offer.offerDetails?.interestRateLocDetails?.maximumCreditLimit || 0
      }
      creditLimit={offer.offerDetails?.interestRateLocDetails?.creditLimit || 0}
      merchantData={merchantData}
      isLoading={isLoading}
    />
  )
}

export default CreditLimitCalculationWidgetContainer
