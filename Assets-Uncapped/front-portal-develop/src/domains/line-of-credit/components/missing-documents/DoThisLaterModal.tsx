import clsx from "clsx"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import Confirmation from "../../../../components/UI/Confirmation"
import Modal from "../../../../components/UI/Modal"
import useDevice from "../../../../hooks/useDevice"
import { ReactComponent as ExclamationIllustration } from "../../../../svgs/illustrations/exclamation.svg"
import useMissingDocuments from "../../../dashboard/hooks/useMissingDocuments"

const DoThisLaterModal = ({
  isOpen,
  onClose,
  onClick,
}: {
  isOpen: boolean
  onClose: () => void
  onClick: () => void
}) => {
  const { t } = useTranslation("line-of-credit", {
    keyPrefix: "missingDocuments.modals.DoThisLaterModal",
  })
  const { data } = useMissingDocuments()
  const { isMobile } = useDevice()

  return (
    <Modal
      isOpen={isOpen}
      className={clsx({ "pb-12": isMobile })}
      onClose={onClose}
    >
      <Confirmation
        type="custom"
        iconComponent={<ExclamationIllustration />}
        title={t("title", { count: (data?.missingDocuments || []).length })}
        subtitle={t("copy")}
      >
        <Button type="button" variant="secondary" onClick={onClose}>
          {t("supply")}
        </Button>
        <Button type="button" onClick={onClick}>
          {t("later")}
        </Button>
      </Confirmation>
    </Modal>
  )
}

export default DoThisLaterModal
