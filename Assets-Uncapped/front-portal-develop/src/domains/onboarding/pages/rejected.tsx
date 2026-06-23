import { useQuery } from "@tanstack/react-query"
import { Navigate } from "react-router"
import PageLoader from "../../../components/Collections/PageLoader"
import ApplicationBlocked from "../../../components/Content/Onboarding/ApplicationBlocked"
import { ReapplyFormData } from "../../../components/Content/Onboarding/ApplicationBlocked/reapplyFormSchema"
import useAuth from "../../../hooks/useAuth"
import useDeal from "../../../hooks/useDeal"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { ReApplicationControllerApi } from "../../../services/api/hubspot"
import { ONBOARDING_BASE_PATH } from "../constants"
import useAttributionReapply from "../hooks/useAttributionReapply"
import useCreateReengagementDeal from "../hooks/useCreateReengagementDeal"
import useOnboarding from "../hooks/useOnboarding"

const Rejected = () => {
  const auth = useAuth()
  const deal = useDeal()
  const onboarding = useOnboarding()

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
  })

  const attributionReapply = useAttributionReapply()
  const createDeal = useCreateReengagementDeal()

  if (deal.isLoading || canReApply.isLoading) {
    return <PageLoader />
  }

  if (onboarding.fullyCompleted) {
    return <Navigate to="/" />
  }

  if (!deal.shouldRedirectToRejection) {
    return <Navigate to={ONBOARDING_BASE_PATH} />
  }

  return (
    <ApplicationBlocked
      reason={deal.data?.reasonDetails?.message}
      type={deal.data?.reasonDetails?.type || "REJECTED"}
      canReapply={!!canReApply.data?.eligible}
      reapplyDate={canReApply.data?.notEligibleTill}
      onReapply={async (data?: ReapplyFormData) => {
        await attributionReapply.mutateAsync()
        await createDeal.mutateAsync(
          data
            ? {
                amount: Number(data.fundingAmount.amount),
                timeHorizon: data.applicationType,
              }
            : undefined
        )
      }}
      isReapplyLoading={createDeal.isPending || attributionReapply.isPending}
    />
  )
}

export default Rejected
