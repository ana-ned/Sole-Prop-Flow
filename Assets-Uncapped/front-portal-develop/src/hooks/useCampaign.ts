import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router"
import { useSessionStorage } from "usehooks-ts"
import { getQueryKeyForBankVerification } from "../domains/onboarding/hooks/useBankVerification"
import { documentQueryKeys } from "../domains/onboarding/queries"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import {
  CampaignInteractionControllerApi,
  ImpressionInteractionRequest,
  ImpressionInteractionRequestImpressionInteractionTypeEnum,
  PortalImpressionUIResponseCampaignTypeEnum,
} from "../services/api/reengagement"
import { displayErrorToast } from "../utils/error-handling"
import useAuth from "./useAuth"
import { getDealQueryKey } from "./useDeal"

const getCurrentlyActiveCampaignQueryKey = () => [
  "reengagement:CampaignInteractionControllerApi@findCurrentlyActive",
]

const getImpressionCampaignQueryKey = (impressionId?: string) => [
  "reengagement:CampaignInteractionControllerApi@findImpression",
  impressionId,
]

const useCampaign = () => {
  const auth = useAuth()
  const params = useParams()
  const [
    referenceImpressionId,
    setReferenceImpressionId,
    deleteReferenceImpressionId,
  ] = useSessionStorage("referenceImpressionId", params.referenceImpressionId)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (params.referenceImpressionId) {
      setReferenceImpressionId(params.referenceImpressionId)
    }
  }, [params.referenceImpressionId])

  const current = useQuery({
    queryKey: getCurrentlyActiveCampaignQueryKey(),
    queryFn: async () =>
      new CampaignInteractionControllerApi(
        apiConfig({
          service: ApiServicesEnum.Reengagement,
          token: await auth.getToken(),
        })
      ).findCurrentlyActive({
        xXORGID: auth.organisation?.organisationId!,
      }),
    enabled: !!auth.organisation?.organisationId && !referenceImpressionId,
    retry: false,
  })

  const impression = useQuery({
    queryKey: getImpressionCampaignQueryKey(referenceImpressionId),
    queryFn: async () =>
      new CampaignInteractionControllerApi(
        apiConfig({
          service: ApiServicesEnum.Reengagement,
          token: await auth.getToken(),
        })
      ).findImpression({
        impressionId: referenceImpressionId!,
        xXORGID: auth.organisation?.organisationId!,
      }),
    enabled: !!referenceImpressionId && !!auth.organisation?.organisationId,
    retry: false,
  })

  const data = impression.data || current.data
  const isLoading = impression.isLoading || current.isLoading

  const recordInteraction = useMutation({
    mutationFn: async ({
      impressionId,
      impressionInteractionRequest,
    }: {
      impressionId: string
      impressionInteractionRequest: ImpressionInteractionRequest
    }) => {
      await new CampaignInteractionControllerApi(
        apiConfig({
          service: ApiServicesEnum.Reengagement,
          token: await auth.getToken(),
        })
      ).recordImpressionInteraction({
        impressionId,
        xXORGID: auth.organisation?.organisationId!,
        impressionInteractionRequest,
      })

      if (
        impressionInteractionRequest.impressionInteractionType ===
        ImpressionInteractionRequestImpressionInteractionTypeEnum.Accepted
      ) {
        deleteReferenceImpressionId()

        if (
          data?.campaignType ===
          PortalImpressionUIResponseCampaignTypeEnum.TopUp
        ) {
          await new Promise((resolve) => setTimeout(resolve, 3000))
          await queryClient.invalidateQueries({
            queryKey: getDealQueryKey(),
          })
          await queryClient.invalidateQueries({
            queryKey: getCurrentlyActiveCampaignQueryKey(),
          })
          await queryClient.invalidateQueries({
            queryKey: getImpressionCampaignQueryKey(),
          })
          await queryClient.invalidateQueries({
            queryKey: documentQueryKeys.required(),
          })
          await queryClient.invalidateQueries({
            queryKey: getQueryKeyForBankVerification(),
          })
        }
      }
    },
    onError: displayErrorToast,
  })

  return {
    referenceImpressionId,
    data,
    recordInteraction,
    isLoading,
  }
}

export default useCampaign
