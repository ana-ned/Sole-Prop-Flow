import clsx from "clsx"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import Button from "../../../components/Basic/Button"
import Confirmation from "../../../components/UI/Confirmation"
import Modal from "../../../components/UI/Modal"
import useAuth from "../../../hooks/useAuth"
import useDevice from "../../../hooks/useDevice"
import i18n from "../../../inits/i18next"
import env from "../../../utils/runtime-env"

const ResetPasswordModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const { t } = useTranslation("profile")
  const auth = useAuth()
  const { isMobile } = useDevice()

  const requestPasswordReset = async () =>
    fetch(
      `https://${env("REACT_APP_AUTH0_DOMAIN")}/dbconnections/change_password`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: auth.user?.email,
          connection: "Username-Password-Authentication",
        }),
      }
    )

  return (
    <Modal
      isOpen={isOpen}
      className={clsx({ "pb-12": isMobile })}
      onClose={onClose}
    >
      <Confirmation
        type="warning"
        title={t("resetPasswordModal.title")}
        subtitle={t("resetPasswordModal.subtitle")}
      >
        <Button type="button" variant="secondary" onClick={onClose} fullWidth>
          {t("resetPasswordModal.cancel")}
        </Button>
        <Button
          type="button"
          variant="primary"
          fullWidth
          onClick={async () => {
            const res = await requestPasswordReset()

            if (res.ok) {
              toast.success(t("resetPasswordModal.confirmation"))
              onClose()
            } else {
              toast.error(i18n.t("common:defaultErrorMessage"))
            }
          }}
        >
          {t("resetPasswordModal.submit")}
        </Button>
      </Confirmation>
    </Modal>
  )
}

export default ResetPasswordModal
