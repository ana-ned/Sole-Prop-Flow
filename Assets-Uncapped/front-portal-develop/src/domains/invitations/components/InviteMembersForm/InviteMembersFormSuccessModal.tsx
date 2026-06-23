import { useTranslation } from "react-i18next"
import { useLocation } from "react-router"
import Button from "../../../../components/Basic/Button"
import FeatureContent from "../../../../components/Collections/FeatureContent"
import Modal from "../../../../components/UI/Modal"
import CheckedImg from "../../../../svgs/illustrations/confirmed.svg"

const InviteMembersSuccessModal = () => {
  const { t } = useTranslation("invitations", {
    keyPrefix: "invite-members",
  })
  const location = useLocation()

  return (
    <Modal isOpen shouldCloseOnOverlayClick={false}>
      <FeatureContent
        img={CheckedImg}
        title={t("success.title")}
        footerContent={
          <Button href="list" state={{ from: location.state?.from }}>
            {t("success.cta")}
          </Button>
        }
      />
    </Modal>
  )
}

export default InviteMembersSuccessModal
