import { useQueryClient, useMutation } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import useTrackedQueryParams from "../../../hooks/useTrackedQueryParams"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { DealControllerApi, Funding } from "../../../services/api/hubspot"
import { displayErrorToast } from "../../../utils/error-handling"

const useCreateReengagementDeal = () => {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { trackedUTMs } = useTrackedQueryParams()

  const createDeal = useMutation({
    mutationFn: async (funding?: Funding) =>
      new DealControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.HubSpot,
        })
      ).createOnDemandDeal({
        xXORGID: auth.organisation?.organisationId!,
        dealOnDemandCreationRequest: {
          ...(trackedUTMs && { utmTags: trackedUTMs }),
          ...(funding && { funding }),
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries()
    },
    onError: displayErrorToast,
  })

  return createDeal
}

export default useCreateReengagementDeal
