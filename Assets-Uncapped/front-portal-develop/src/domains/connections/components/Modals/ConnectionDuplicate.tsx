import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router"
import Button from "../../../../components/Basic/Button"
import Confirmation from "../../../../components/UI/Confirmation"
import useDevice from "../../../../hooks/useDevice"
import useHubSpotChat from "../../../../hooks/useHubSpotChat"
import { useModal } from "../../../../hooks/useModal"
import useStore from "../../../../hooks/useStore"
import { ONBOARDING_BASE_PATH } from "../../../onboarding/constants"
import useApplicationSteps from "../../../onboarding/hooks/useApplicationSteps"
import {
  findCurrentStepBasedOnPlatform,
  findNextStepPathBasedOnCurrentPlatform,
} from "../../../onboarding/utils/steps"
import { Platform, PlatformCategory } from "../../models/platforms"

const ConnectionDuplicate = ({ platform }: { platform: Platform }) => {
  const { t } = useTranslation("connections", {
    keyPrefix: "modals.ConnectionDuplicate",
  })
  const { closeModalAndThen, closeModal } = useModal()
  const location = useLocation()
  const navigate = useNavigate()
  const { openChat } = useHubSpotChat()
  const { isMobile } = useDevice()
  const { handleCompleteStep } = useApplicationSteps()
  const isOnboarding = location.pathname.includes(ONBOARDING_BASE_PATH)
  const customNextOnboardingPath = useStore(
    (state) => state.customNextOnboardingPath
  )

  useEffect(() => {
    if (!isMobile) {
      openChat()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Confirmation
      type="warning"
      title={t("title", {
        platform:
          platform.category === PlatformCategory.banking
            ? t("bank")
            : platform.name,
      })}
      subtitle={t(`subtitle`)}
    >
      <Button
        type="button"
        onClick={async () => {
          const state = location.state as
            | {
                backUrl: string | undefined
              }
            | undefined

          if (!isOnboarding) {
            await navigate("/connections")
          } else if (customNextOnboardingPath) {
            closeModalAndThen(async () => {
              await navigate(customNextOnboardingPath)
            })
          } else if (state?.backUrl) {
            closeModalAndThen(async () => {
              await navigate(state.backUrl!)
            })
          } else if (platform.category === PlatformCategory.sales) {
            await handleCompleteStep(
              findCurrentStepBasedOnPlatform(platform.category),
              {
                onSuccess: () => {
                  closeModalAndThen(async () => {
                    await navigate(
                      findNextStepPathBasedOnCurrentPlatform(platform.category)
                    )
                  })
                },
              }
            )
          } else {
            closeModal()
          }
        }}
        variant="secondary"
      >
        {t(`connectAnother`)}
      </Button>
      <Button
        type="button"
        variant="primary"
        onClick={async () => {
          await handleCompleteStep(
            findCurrentStepBasedOnPlatform(platform.category)
          )
          closeModalAndThen(async () => {
            await navigate(
              isOnboarding
                ? customNextOnboardingPath ||
                    findNextStepPathBasedOnCurrentPlatform(platform.category)
                : "/connections"
            )
          })
        }}
      >
        {t("addedAll")}
      </Button>
    </Confirmation>
  )
}

export default ConnectionDuplicate
