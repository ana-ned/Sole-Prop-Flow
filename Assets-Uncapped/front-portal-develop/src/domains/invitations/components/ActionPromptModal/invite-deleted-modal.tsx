import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import FeatureContent from "../../../../components/Collections/FeatureContent"
import Modal from "../../../../components/UI/Modal"
import DeleteImg from "../../../../svgs/illustrations/delete.svg"

const InviteDeletedModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation("invitations", {
    keyPrefix: "invitations-list",
  })

  return (
    <Modal isOpen onClose={onClose}>
      <FeatureContent
        img={DeleteImg}
        title={t("modals.delete.title")}
        footerContent={
          <Button type="button" onClick={onClose}>
            {t("modals.delete.cta")}
          </Button>
        }
      />
    </Modal>
  )
}

export default InviteDeletedModal
