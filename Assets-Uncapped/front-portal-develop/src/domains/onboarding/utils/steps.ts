import { ApplicationFlowStepResponseStepEnum } from "../../../services/api/hubspot"
import { ApplicationStepMap, OnboardingMenuPaths } from "../constants"

export const findCurrentStepBasedOnPlatform = (
  platformCategory: string
): ApplicationFlowStepResponseStepEnum => {
  const onboardingStepBasedOnPlatformCategory: number =
    Object.values(OnboardingMenuPaths).findIndex((path) =>
      path.includes(platformCategory)
    ) || 0
  const currentOnboardingMenuPath =
    Object.values(OnboardingMenuPaths)[onboardingStepBasedOnPlatformCategory]
  return ApplicationStepMap[currentOnboardingMenuPath]
}

export const findNextStepPathBasedOnCurrentPlatform = (
  platformCategory: string
): string => {
  const onboardingStepBasedOnPlatformCategory: number =
    Object.values(OnboardingMenuPaths).findIndex((path) =>
      path.includes(platformCategory)
    ) || 0
  return Object.values(OnboardingMenuPaths)[
    onboardingStepBasedOnPlatformCategory + 1
  ]
}
