import { useMutation } from "@tanstack/react-query"
import useAttribution from "../../../hooks/useAttribution"
import useAuth from "../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { AttributionControllerApi } from "../../../services/api/organisation-users"
import { displayErrorToast } from "../../../utils/error-handling"

const useAttributionReapply = () => {
  const auth = useAuth()
  const attribution = useAttribution()

  return useMutation({
    mutationFn: async () => {
      // We only need this for Amazon to create fresh attribution without offerId
      if (attribution.data?.partner !== "AMAZON") {
        return undefined
      }

      return new AttributionControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.OrganisationUsers,
        })
      ).reapplyAttribution({
        xXORGID: auth.organisation?.organisationId!,
      })
    },
    onError: displayErrorToast,
  })
}

export default useAttributionReapply
