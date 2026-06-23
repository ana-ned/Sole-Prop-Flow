import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import FeatureContent from "../../../../components/Collections/FeatureContent"
import Modal from "../../../../components/UI/Modal"
import ConfirmedImg from "../../../../svgs/illustrations/confirmed.svg"

const InviteResentModal = ({
  email,
  onClose,
}: {
  email: string
  onClose: () => void
}) => {
  const { t } = useTranslation("invitations", {
    keyPrefix: "invitations-list",
  })

  return (
    <Modal isOpen onClose={onClose}>
      <FeatureContent
        img={ConfirmedImg}
        title={t("modals.resend.title")}
        content={t("modals.resend.copy", { email })}
        footerContent={
          <Button type="button" onClick={onClose}>
            {t("modals.resend.cta")}
          </Button>
        }
      />
    </Modal>
  )
}

export default InviteResentModal
