import clsx from "clsx"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import Button from "../../../../components/Basic/Button"
import PageLoader from "../../../../components/Collections/PageLoader/PageLoader"
import Confirmation from "../../../../components/UI/Confirmation"
import Modal from "../../../../components/UI/Modal"
import useDevice from "../../../../hooks/useDevice"
import useLineOfCreditAgreements from "../../../../hooks/useLineOfCreditAgreements"
import ErrorIndex from "../../../../pages/error/_error"
import { ReactComponent as WorkingOnItIllustration } from "../../../../svgs/illustrations/working-on-it.svg"

const DocumentsSubmittedModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const { t } = useTranslation("line-of-credit", {
    keyPrefix: "missingDocuments.modals.DocumentsSubmittedModal",
  })
  const { currentLocAgreement } = useLineOfCreditAgreements()
  const { isMobile } = useDevice()
  const navigate = useNavigate()

  if (currentLocAgreement.isLoading) {
    return <PageLoader />
  }

  if (!currentLocAgreement.data) {
    return <ErrorIndex type="404" />
  }

  return (
    <Modal
      isOpen={isOpen}
      className={clsx({ "pb-12": isMobile })}
      onClose={onClose}
    >
      <Confirmation
        type="custom"
        iconComponent={<WorkingOnItIllustration />}
        title={t("title")}
      >
        <Button
          type="button"
          variant="secondary"
          onClick={async () => {
            await navigate("/")
          }}
        >
          {t("done")}
        </Button>
        <Button
          type="button"
          onClick={async () => {
            await navigate(
              `/line-of-credit/${currentLocAgreement.data.id}/draw`
            )
          }}
        >
          {t("newDraw")}
        </Button>
      </Confirmation>
    </Modal>
  )
}

export default DocumentsSubmittedModal
