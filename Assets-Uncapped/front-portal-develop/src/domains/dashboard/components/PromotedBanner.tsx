import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { isFuture } from "date-fns"
import PageLoader from "../../../components/Collections/PageLoader"
import useAllTransactions from "../../../hooks/useAllTransactions"
import useAuth from "../../../hooks/useAuth"
import useCampaign from "../../../hooks/useCampaign"
import useCreateDealOnDemand from "../../../hooks/useCreateDealOnDemand"
import useDeal, { getDealQueryKey } from "../../../hooks/useDeal"
import useLineOfCreditAgreements from "../../../hooks/useLineOfCreditAgreements"
import useTrackedQueryParams from "../../../hooks/useTrackedQueryParams"
import {
  GetAllTransactionsExecutionTypesEnum,
  LineOfCreditResponseStatusEnum,
  TransactionTypeEnum,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import {
  CustomerFacingDealDetailsResponseSourceEnum,
  CustomerFacingDealDetailsResponseStageEnum,
  CustomerFacingDealDetailsResponseTierEnum,
  DealControllerApi,
  ReApplicationControllerApi,
} from "../../../services/api/hubspot"
import { OrganisationOverviewOrganisationSourceEnum } from "../../../services/api/organisation-users"
import { PortalImpressionUIResponseCampaignTypeEnum } from "../../../services/api/reengagement"
import { displayErrorToast } from "../../../utils/error-handling"
import { getOfferAmount } from "../../agreements/utils"
import PreOfferContainer from "../../onboarding/components/offers/components/NoOffers/PreOfferContainer"
import useApplicationSteps from "../../onboarding/hooks/useApplicationSteps"
import useOffers from "../../onboarding/hooks/useOffers"
import { documentQueryKeys } from "../../onboarding/queries"
import useMissingDataChecks from "../hooks/useMissingDataChecks"
import useMissingDocuments from "../hooks/useMissingDocuments"
import useTopUpEligibility from "../hooks/useTopUpEligibility"
import ApplyFromPartnershipBanner from "./Banners/ApplyFromPartnershipBanner"
import AwaitingDisbursementBanner from "./Banners/AwaitingDisbursementBanner"
import CampaignTopUpBannerContainer from "./Banners/CampaignTopUpBannerContainer"
import ContinueOnboardingBanner from "./Banners/ContinueOnboardingBanner"
import EligibleMissingDataBanner from "./Banners/EligibleMissingDataBanner"
import MissingDataBanner from "./Banners/MissingDataBanner"
import MissingMonthlyFinancialDataBanner from "./Banners/MissingMonthlyFinancialDataBanner"
import OfferAvailableBanner from "./Banners/OfferAvailableBanner"
import RejectedBanner from "./Banners/RejectedBanner"
import TopUpBanner from "./Banners/TopUpBanner"
import WelcomeBanner from "./Banners/WelcomeBanner"

const PromotedBanner = () => {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const deal = useDeal()
  const offers = useOffers()
  const { currentLocAgreement } = useLineOfCreditAgreements()
  const documents = useMissingDocuments({
    enabled: !!currentLocAgreement.data?.id,
  })
  const createDealOnDemand = useCreateDealOnDemand()
  const lastRepayment = useAllTransactions({
    params: {
      size: 1,
      transactionTypes: new Set([TransactionTypeEnum.Repayment]),
      executionTypes: new Set([GetAllTransactionsExecutionTypesEnum.Executed]),
    },
  })
  const missingData = useMissingDataChecks()
  const campaign = useCampaign()
  const { trackedUTMs } = useTrackedQueryParams()

  const canReApply = useQuery({
    queryKey: ["HubSpot-ReApplicationController@canReApply"],
    queryFn: async () =>
      new ReApplicationControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.HubSpot,
        })
      ).canReApply({
        xXORGID: auth.organisation?.organisationId!,
      }),
    enabled:
      deal.data?.stage === CustomerFacingDealDetailsResponseStageEnum.Rejected,
  })

  const isNewPartnership =
    (
      [
        OrganisationOverviewOrganisationSourceEnum.Marcus,
        OrganisationOverviewOrganisationSourceEnum.Sellersfi,
      ] as OrganisationOverviewOrganisationSourceEnum[]
    ).includes(auth.organisationData?.organisationSource!) &&
    !auth.organisationData?.onboardingFinished

  const applicationSteps = useApplicationSteps({
    enabled: isNewPartnership,
  })

  const wasRecentlyRejected =
    deal.data?.stage === CustomerFacingDealDetailsResponseStageEnum.Rejected &&
    canReApply.data?.notEligibleTill &&
    isFuture(canReApply.data.notEligibleTill)

  const isEligibleForRefinance = useTopUpEligibility({
    enabled: !(
      campaign.data?.campaignType ===
        PortalImpressionUIResponseCampaignTypeEnum.TopUp ||
      deal.inPipeline ||
      deal.awaitingForDisbursement ||
      wasRecentlyRejected ||
      isNewPartnership
    ),
  })

  const requestTopUp = useMutation({
    mutationFn: async () => {
      await new DealControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.HubSpot,
        })
      ).topUpInterested({
        xXORGID: auth.organisation?.organisationId!,
        ...(trackedUTMs && {
          dealCreationRequest: { utmTags: trackedUTMs },
        }),
      })

      // This is required to avoid issue with asynchronously created document requests
      await new Promise((resolve) => setTimeout(resolve, 2000))
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: documentQueryKeys.required(),
        type: "all",
      })
      await queryClient.invalidateQueries({
        queryKey: documentQueryKeys.v2(),
        type: "all",
      })
      await queryClient.invalidateQueries({
        queryKey: getDealQueryKey(),
        type: "all",
      })
    },
    onError: displayErrorToast,
  })

  if (
    deal.isLoading ||
    offers.isLoading ||
    documents.isLoading ||
    currentLocAgreement.isLoading ||
    applicationSteps.flowQuery.isLoading ||
    campaign.isLoading
  ) {
    return <PageLoader overlay />
  }

  if (
    documents.data?.missingDocuments?.length &&
    currentLocAgreement.data?.status === LineOfCreditResponseStatusEnum.Paused
  ) {
    return (
      <MissingMonthlyFinancialDataBanner
        documents={documents.data.missingDocuments}
      />
    )
  }

  if (wasRecentlyRejected) {
    return (
      <RejectedBanner
        reason={deal.data?.reasonDetails?.message ?? ""}
        reapplyDate={canReApply.data?.notEligibleTill}
      />
    )
  }

  const isApplyingForFirstTime =
    !deal.data ||
    (deal.data.stage ===
      CustomerFacingDealDetailsResponseStageEnum.LoanRepayment &&
      deal.data.source ===
        CustomerFacingDealDetailsResponseSourceEnum.Sellersfi) ||
    (canReApply.data?.eligible &&
      deal.data.stage ===
        CustomerFacingDealDetailsResponseStageEnum.Rejected) ||
    deal.data.stage === CustomerFacingDealDetailsResponseStageEnum.Lost

  if (
    isNewPartnership &&
    isApplyingForFirstTime &&
    auth.organisationData?.preliminaryOffer?.amount &&
    auth.organisationData.preliminaryOffer.currency &&
    auth.organisationData.preliminaryOffer.amount > 1000
  ) {
    return (
      <ApplyFromPartnershipBanner
        amount={auth.organisationData.preliminaryOffer.amount}
        currency={auth.organisationData.preliminaryOffer.currency}
        mutation={createDealOnDemand}
      />
    )
  }

  if (
    isNewPartnership &&
    !applicationSteps.hasCompletedStep("REVIEW") &&
    deal.data?.amount?.currency &&
    deal.inPipeline
  ) {
    return (
      <ContinueOnboardingBanner
        variant="pre-offer"
        amount={deal.data.amount.amount || 0}
        currency={deal.data.amount.currency}
      />
    )
  }

  if (offers.signeableOffers.length > 0) {
    return <OfferAvailableBanner offers={offers.signeableOffers} />
  }

  if (
    isNewPartnership &&
    offers.selectedOffer &&
    !applicationSteps.hasCompletedStep("SUBMIT") &&
    deal.data?.amount?.currency
  ) {
    return (
      <ContinueOnboardingBanner
        variant="post-offer"
        amount={getOfferAmount(offers.selectedOffer) || 0}
        currency={
          offers.selectedOffer.offerDetails?.commonOfferDetails
            ?.advanceCurrency!
        }
      />
    )
  }

  if (offers.selectedOffer && deal.awaitingForDisbursement) {
    return <AwaitingDisbursementBanner offer={offers.selectedOffer} />
  }

  if (deal.inPipeline) {
    return <PreOfferContainer layout={false} />
  }

  if (missingData.checks.length > 0) {
    if (
      campaign.data?.campaignType ==
        PortalImpressionUIResponseCampaignTypeEnum.TopUp &&
      campaign.data.variables?.topUpAmount?.amount &&
      campaign.data.variables.topUpAmount.currency
    ) {
      return <CampaignTopUpBannerContainer />
    }

    if (isEligibleForRefinance && deal.data?.amount?.currency) {
      return (
        <EligibleMissingDataBanner
          amount={deal.data.amount.amount || 0}
          currency={deal.data.amount.currency}
          checks={missingData.checks}
        />
      )
    }

    return <MissingDataBanner checks={missingData.checks} />
  }

  if (
    campaign.data?.campaignType ==
      PortalImpressionUIResponseCampaignTypeEnum.TopUp &&
    campaign.data.variables?.topUpAmount?.amount &&
    campaign.data.variables.topUpAmount.currency
  ) {
    return <CampaignTopUpBannerContainer />
  }

  if (isEligibleForRefinance && deal.data?.amount?.currency) {
    return (
      <TopUpBanner
        amount={deal.data.amount.amount || 0}
        currency={deal.data.amount.currency}
        tier={deal.data.tier ?? CustomerFacingDealDetailsResponseTierEnum.Small}
        onSubmit={() => {
          requestTopUp.mutate()
        }}
        isPending={requestTopUp.isPending}
      />
    )
  }

  if (lastRepayment.data?.content?.length === 0) {
    return <WelcomeBanner />
  }

  return null
}

export default PromotedBanner
