import clsx from "clsx"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { useAsync } from "react-use"
import Button from "../../../../components/Basic/Button"
import Confirmation from "../../../../components/UI/Confirmation"
import Modal from "../../../../components/UI/Modal"
import useDevice from "../../../../hooks/useDevice"
import { ReactComponent as WarningIcon } from "../../../../svgs/illustrations/warning.svg"
import { OnboardingMenuPaths } from "../../constants"
import useApplicationSteps from "../../hooks/useApplicationSteps"

const ReadyToSubmit = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const { isMobile } = useDevice()
  const { handleCompleteStep } = useApplicationSteps()
  const navigate = useNavigate()
  const { t } = useTranslation("onboarding")

  useAsync(async () => {
    if (isOpen) {
      await handleCompleteStep("SUBMIT")
    }
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      className={clsx({ "pb-12": isMobile })}
      onClose={onClose}
    >
      <Confirmation
        type="custom"
        iconComponent={<WarningIcon />}
        title={t("readyToSubmit.header")}
        subtitle={t("readyToSubmit.subtitle")}
      >
        <Button fullWidth type="button" variant="secondary" onClick={onClose}>
          {t("readyToSubmit.cancel")}
        </Button>
        <Button
          fullWidth
          type="button"
          variant="primary"
          onClick={async () => {
            onClose()
            await navigate(OnboardingMenuPaths.Submit)
          }}
        >
          {t("readyToSubmit.continue")}
        </Button>
      </Confirmation>
    </Modal>
  )
}

export default ReadyToSubmit
