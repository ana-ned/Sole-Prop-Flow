import { useCallback, useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import useAuth from "../../../hooks/useAuth"
import { useTracking } from "../../../hooks/useTracking"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import {
  ApplicationFlowControllerApi,
  ApplicationFlowStepRequestStatusEnum,
  ApplicationFlowStepRequestStepEnum,
  ApplicationFlowStepResponseStatusEnum,
  ApplicationFlowStepResponseStepEnum,
} from "../../../services/api/hubspot"
import { reportErrorLog } from "../../../utils/error-handling"
import { OnboardingMenuPaths } from "../constants"

const APPLICATION_FLOW_QUERY_KEY = "APPLICATION_FLOW"

const useApplicationSteps = ({
  enabled = true,
}: { enabled?: boolean } = {}) => {
  const { isAuthenticated, getToken, organisation, organisationData } =
    useAuth()
  const { trackEvent } = useTracking()
  const queryClient = useQueryClient()
  const { t } = useTranslation("onboarding", {
    keyPrefix: "informationRequired",
  })

  const flowQuery = useQuery({
    queryKey: [APPLICATION_FLOW_QUERY_KEY],
    queryFn: async () =>
      new ApplicationFlowControllerApi(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.HubSpot,
        })
      ).getApplicationFlow({
        xXORGID: organisation!.organisationId!,
      }),
    enabled: isAuthenticated && !!organisation?.organisationId && enabled,
  })

  const upsertStep = async (
    step: ApplicationFlowStepRequestStepEnum,
    status: ApplicationFlowStepRequestStatusEnum
  ) => {
    if (!flowQuery.data?.steps?.length) {
      reportErrorLog("Cannot upsert step: flow data not loaded", "warning", {
        step,
        status,
      })
      return
    }
    return new ApplicationFlowControllerApi(
      apiConfig({
        token: await getToken(),
        service: ApiServicesEnum.HubSpot,
      })
    ).upsertStepProgress({
      xXORGID: organisation!.organisationId!,
      applicationFlowStepRequest: { step, status },
    })
  }

  const onStepMutationSuccess = async (
    action: "completed" | "skipped",
    step: ApplicationFlowStepRequestStepEnum
  ) => {
    await queryClient.invalidateQueries({
      queryKey: [APPLICATION_FLOW_QUERY_KEY],
    })
    trackEvent({
      category: "application-step",
      name: step,
      action,
    })
  }

  const completeStepMutation = useMutation({
    mutationFn: (step: ApplicationFlowStepRequestStepEnum) =>
      upsertStep(step, ApplicationFlowStepRequestStatusEnum.Completed),
    onSuccess: (_, step) => onStepMutationSuccess("completed", step),
  })

  const skipStepMutation = useMutation({
    mutationFn: (step: ApplicationFlowStepRequestStepEnum) =>
      upsertStep(step, ApplicationFlowStepRequestStatusEnum.Skipped),
    onSuccess: (_, step) => onStepMutationSuccess("skipped", step),
  })

  const stepsByFlowStep = useMemo(
    () => new Map(flowQuery.data?.steps?.map((s) => [s.step!, s]) ?? []),
    [flowQuery.data?.steps]
  )

  const getStepStatus = useCallback(
    (step: ApplicationFlowStepResponseStepEnum) =>
      stepsByFlowStep.get(step)?.status,
    [stepsByFlowStep]
  )

  const hasCompletedStep = useCallback(
    (step: ApplicationFlowStepResponseStepEnum) => {
      const status = getStepStatus(step)
      return (
        status === ApplicationFlowStepResponseStatusEnum.Completed ||
        status === ApplicationFlowStepResponseStatusEnum.Autocompleted
      )
    },
    [getStepStatus]
  )

  const hasSkippedStep = useCallback(
    (step: ApplicationFlowStepResponseStepEnum) =>
      getStepStatus(step) === ApplicationFlowStepResponseStatusEnum.Skipped,
    [getStepStatus]
  )

  const hasAutocompletedStep = useCallback(
    (step: ApplicationFlowStepResponseStepEnum) =>
      getStepStatus(step) ===
      ApplicationFlowStepResponseStatusEnum.Autocompleted,
    [getStepStatus]
  )

  const missingSteps = useMemo(
    () =>
      [
        {
          step: ApplicationFlowStepResponseStepEnum.Offers,
          title: t("steps.offer"),
          link: OnboardingMenuPaths.Offers,
        },
        {
          step: ApplicationFlowStepResponseStepEnum.Signing,
          title: t("steps.signing"),
          link: OnboardingMenuPaths.Signing,
        },
        {
          step: ApplicationFlowStepResponseStepEnum.Owners,
          title: t("steps.owners"),
          link: OnboardingMenuPaths.Owners,
        },
        {
          step: ApplicationFlowStepResponseStepEnum.DirectDebit,
          title:
            organisationData?.countryCode === "USA"
              ? t("steps.achDebit")
              : organisationData?.countryCode === "CAN"
                ? t("steps.padAcc")
                : t("steps.directDebit"),
          link: OnboardingMenuPaths.DirectDebit,
        },
      ].filter((el) => hasSkippedStep(el.step)),
    [organisationData?.countryCode, t, hasSkippedStep]
  )

  return {
    hasCompletedStep,
    hasSkippedStep,
    hasAutocompletedStep,
    flowQuery,
    stepMutationPending:
      completeStepMutation.isPending || skipStepMutation.isPending,
    handleCompleteStep: completeStepMutation.mutateAsync,
    skipStep: skipStepMutation.mutateAsync,
    missingSteps,
  }
}

export default useApplicationSteps
