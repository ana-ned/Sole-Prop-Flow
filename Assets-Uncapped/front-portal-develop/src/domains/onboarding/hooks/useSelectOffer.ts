import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import useAuth from "../../../hooks/useAuth"
import {
  OfferControllerV3Api,
  SelectRequest,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { OnboardingMenuPaths } from "../constants"
import useApplicationSteps from "./useApplicationSteps"
import { AGREEMENTS_OFFERS_QUERY_KEY } from "./useOffers"

const useSelectOffer = () => {
  const { getToken, organisation } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { handleCompleteStep } = useApplicationSteps()
  const { t } = useTranslation("common")

  return useMutation({
    mutationFn: async (
      selectRequest: Pick<SelectRequest, "offerId" | "selectOfferRequest">
    ) =>
      new OfferControllerV3Api(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).select({
        ...selectRequest,
        xXORGID: organisation?.organisationId!,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [AGREEMENTS_OFFERS_QUERY_KEY],
        refetchType: "all",
      })
      await handleCompleteStep("OFFERS")
      await navigate(OnboardingMenuPaths.Signing)
    },
    onError: () => {
      toast.error(t("defaultErrorMessage"))
    },
  })
}

export default useSelectOffer
