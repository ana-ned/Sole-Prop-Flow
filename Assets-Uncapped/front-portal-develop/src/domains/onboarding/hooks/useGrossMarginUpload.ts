import { useMutation } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { GrossMarginDocumentControllerApi } from "../../../services/api/organisation-users"
import { GrossMarginDocumentControllerApi as GrossMarginDocumentControllerApiPartners } from "../../../services/api/partners"

const useGrossMarginUpload = () => {
  const auth = useAuth()

  return useMutation({
    mutationFn: async ({
      grossMargin,
      id,
    }: {
      grossMargin: number
      id?: string
    }) =>
      auth.partnerId
        ? new GrossMarginDocumentControllerApiPartners(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.Partners,
            })
          ).uploadGrossMarginDocument({
            applicationId: id!,
            xXPARTNERID: auth.partnerId,
            grossMarginDocumentRequest: {
              grossMargin,
            },
          })
        : new GrossMarginDocumentControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.OrganisationUsers,
            })
          ).uploadGrossMargin({
            xXORGID: String(auth.organisation?.organisationId),
            grossMarginDocumentRequest: {
              grossMargin,
            },
          }),
  })
}

export default useGrossMarginUpload
