import clsx from "clsx"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import Confirmation from "../../../../components/UI/Confirmation"
import Modal from "../../../../components/UI/Modal"
import useDevice from "../../../../hooks/useDevice"

const ConnectionDeleteModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}) => {
  const { isMobile } = useDevice()
  const { t } = useTranslation("connections", {
    keyPrefix: "modals.ConnectionDelete",
  })

  return (
    <Modal
      isOpen={isOpen}
      className={clsx({ "pb-12": isMobile })}
      onClose={onClose}
    >
      <Confirmation title={t("title")}>
        <Button type="button" variant="secondary" onClick={onClose} fullWidth>
          {t("cancel")}
        </Button>
        <Button type="button" variant="primary" onClick={onSubmit} fullWidth>
          {t("submit")}
        </Button>
      </Confirmation>
    </Modal>
  )
}

export default ConnectionDeleteModal
