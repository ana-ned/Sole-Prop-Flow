import clsx from "clsx"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { LINE_OF_CREDIT_DOCUMENTS_PATH } from "../../../domains/line-of-credit/constants"
import useDevice from "../../../hooks/useDevice"
import { useTracking } from "../../../hooks/useTracking"
import { LineOfCreditResponse } from "../../../services/api/agreements"
import { ReactComponent as DocumentIllustration } from "../../../svgs/illustrations/document-3.svg"
import Button from "../../Basic/Button"
import Confirmation from "../../UI/Confirmation"
import Modal from "../../UI/Modal"

const MissingLocDocumentsModal = ({
  isOpen,
  onClose,
  lineOfCredit,
  daysLeft,
}: {
  isOpen: boolean
  onClose: () => void
  lineOfCredit: LineOfCreditResponse
  daysLeft?: number
}) => {
  const { isMobile } = useDevice()
  const { t } = useTranslation("line-of-credit", {
    keyPrefix: "missingLocDocumentsModal",
  })
  const { trackEvent } = useTracking()
  const navigate = useNavigate()

  return (
    <Modal
      isOpen={isOpen}
      className={clsx({ "pb-12": isMobile })}
      onClose={onClose}
    >
      <Confirmation
        type="custom"
        iconComponent={<DocumentIllustration />}
        title={t("title", { count: daysLeft })}
      >
        <Button
          type="button"
          variant="secondary"
          onClick={async () => {
            trackEvent({
              category: "dashboard",
              name: "modal-line-of-credit-missing-documents-not-now-button",
              action: "click",
            })
            await navigate(`/line-of-credit/${lineOfCredit.id}/draw`)
          }}
        >
          {t("skipForNow")}
        </Button>
        <Button variant="primary" href={LINE_OF_CREDIT_DOCUMENTS_PATH}>
          {t("uploadDocuments")}
        </Button>
      </Confirmation>
    </Modal>
  )
}

export default MissingLocDocumentsModal
