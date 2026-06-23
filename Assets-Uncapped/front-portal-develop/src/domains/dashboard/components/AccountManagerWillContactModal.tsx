import clsx from "clsx"
import { useTranslation } from "react-i18next"
import Button from "../../../components/Basic/Button"
import Confirmation from "../../../components/UI/Confirmation"
import Modal from "../../../components/UI/Modal"
import useAuth from "../../../hooks/useAuth"
import useDevice from "../../../hooks/useDevice"
import { ReactComponent as ConfirmedIllustration } from "../../../svgs/illustrations/confirmed.svg"

const AccountManagerWillContactModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const { t } = useTranslation("dashboard", {
    keyPrefix: "modals.accountManagerWillContact",
  })
  const { isMobile } = useDevice()
  const auth = useAuth()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={clsx({ "pb-12": isMobile })}
    >
      <Confirmation
        title={t("title")}
        subtitle={t("subtitle", {
          email: auth.user?.email,
        })}
        type="custom"
        iconComponent={<ConfirmedIllustration />}
      >
        <Button type="button" onClick={onClose}>
          {t("cta")}
        </Button>
      </Confirmation>
    </Modal>
  )
}

export default AccountManagerWillContactModal
