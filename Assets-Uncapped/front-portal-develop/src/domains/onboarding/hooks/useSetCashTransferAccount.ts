import { useMutation } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import { OfferControllerV3Api } from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { displayErrorToast } from "../../../utils/error-handling"

const useSetCashTransferAccount = () => {
  const { getToken, organisation } = useAuth()

  return useMutation({
    mutationFn: async ({
      offerId,
      cashTransferAccountId,
    }: {
      offerId: string
      cashTransferAccountId?: string
    }) =>
      new OfferControllerV3Api(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).patch({
        offerId,
        xXORGID: organisation?.organisationId!,
        patchOfferRequest: {
          cashTransferAccountId,
        },
      }),
    onError: async (error: Response) => {
      await displayErrorToast(error)
    },
  })
}

export default useSetCashTransferAccount
