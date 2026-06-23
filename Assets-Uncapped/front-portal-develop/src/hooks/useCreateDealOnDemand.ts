import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import { DealControllerApi } from "../services/api/hubspot"
import useAuth from "./useAuth"
import { getDealQueryKey } from "./useDeal"
import useTrackedQueryParams from "./useTrackedQueryParams"

const useCreateDealOnDemand = () => {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { trackedUTMs } = useTrackedQueryParams()

  return useMutation({
    mutationFn: async () =>
      new DealControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.HubSpot,
        })
      ).createOnDemandDeal({
        xXORGID: auth.organisation?.organisationId!,
        ...(trackedUTMs && {
          dealCreationRequest: { utmTags: trackedUTMs },
        }),
      }),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: getDealQueryKey() })
    },
  })
}

export default useCreateDealOnDemand
