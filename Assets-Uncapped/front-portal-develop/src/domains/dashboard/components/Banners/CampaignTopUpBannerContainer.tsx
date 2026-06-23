import { useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import useCampaign from "../../../../hooks/useCampaign"
import useDeal from "../../../../hooks/useDeal"
import { CustomerFacingDealDetailsResponseTierEnum } from "../../../../services/api/hubspot"
import { ImpressionInteractionRequestImpressionInteractionTypeEnum } from "../../../../services/api/reengagement"
import useMissingDataChecks from "../../hooks/useMissingDataChecks"
import EligibleMissingDataBanner from "./EligibleMissingDataBanner"
import TopUpBanner from "./TopUpBanner"

const CampaignTopUpBannerContainer = () => {
  const deal = useDeal()
  const campaign = useCampaign()
  const hasRecordedView = useRef(false)
  const missingData = useMissingDataChecks()
  const navigate = useNavigate()

  useEffect(() => {
    if (!hasRecordedView.current && campaign.data?.impressionId) {
      hasRecordedView.current = true
      campaign.recordInteraction.mutate({
        impressionId: campaign.data.impressionId,
        impressionInteractionRequest: {
          impressionInteractionType:
            ImpressionInteractionRequestImpressionInteractionTypeEnum.Viewed,
          referenceImpressionId: campaign.referenceImpressionId,
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign.data?.impressionId, campaign.referenceImpressionId])

  if (missingData.checks.length > 0) {
    return (
      <EligibleMissingDataBanner
        title={campaign.data?.header}
        content={campaign.data?.content}
        amount={campaign.data?.variables?.topUpAmount?.amount ?? 0}
        currency={campaign.data?.variables?.topUpAmount?.currency ?? "USD"}
        checks={missingData.checks}
      />
    )
  }

  return (
    <TopUpBanner
      title={campaign.data?.header}
      content={campaign.data?.content}
      amount={campaign.data?.variables?.topUpAmount?.amount ?? 0}
      currency={campaign.data?.variables?.topUpAmount?.currency ?? "USD"}
      tier={deal.data?.tier ?? CustomerFacingDealDetailsResponseTierEnum.Small}
      onSubmit={async () => {
        await campaign.recordInteraction.mutateAsync({
          impressionId: campaign.data?.impressionId!,
          impressionInteractionRequest: {
            impressionInteractionType:
              ImpressionInteractionRequestImpressionInteractionTypeEnum.Accepted,
            referenceImpressionId: campaign.referenceImpressionId!,
          },
        })
        await navigate("/")
      }}
      isPending={
        campaign.recordInteraction.isPending &&
        campaign.recordInteraction.variables.impressionInteractionRequest
          .impressionInteractionType ===
          ImpressionInteractionRequestImpressionInteractionTypeEnum.Accepted
      }
    />
  )
}

export default CampaignTopUpBannerContainer
