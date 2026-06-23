import clsx from "clsx"
import { useTranslation } from "react-i18next"
import Button from "../../../../../components/Basic/Button"
import Confirmation from "../../../../../components/UI/Confirmation"
import Modal from "../../../../../components/UI/Modal"
import useDevice from "../../../../../hooks/useDevice"
import ModalImg from "../../../assets/verify-owners-sent.webp"

const ModalLinksSent = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "verifyOwners.modalLinksSent",
  })
  const { isMobile } = useDevice()
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={clsx({ "pb-12": isMobile })}
    >
      <Confirmation
        title={t("title")}
        subtitle={t("subtitle")}
        type="custom"
        iconComponent={<img src={ModalImg} alt={t("title")} />}
        fluidIcon
      >
        <Button type="button" onClick={onClose}>
          {t("button")}
        </Button>
      </Confirmation>
    </Modal>
  )
}

export default ModalLinksSent
