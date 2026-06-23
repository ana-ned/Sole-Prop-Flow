import clsx from "clsx"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import Button from "../../../components/Basic/Button"
import SanitizedHtml from "../../../components/Basic/SanitizedHtml/SanitizedHtml"
import Confirmation from "../../../components/UI/Confirmation"
import Modal from "../../../components/UI/Modal"
import useAuth from "../../../hooks/useAuth"
import useDevice from "../../../hooks/useDevice"
import { DrawResponse } from "../../../services/api/agreements"
import SignIcon from "../../../svgs/illustrations/sign.svg"

const DrawSignedModal = ({
  draw,
  isOpen,
}: {
  draw: DrawResponse
  isOpen: boolean
}) => {
  const { isMobile } = useDevice()
  const { t } = useTranslation("line-of-credit", {
    keyPrefix: "DrawSignedModal",
  })
  const navigate = useNavigate()
  const backUrl = `/line-of-credit/${draw.lineOfCreditId}`
  const auth = useAuth()

  return (
    <Modal
      isOpen={isOpen}
      className={clsx({ "pb-12": isMobile })}
      onClose={async () => {
        await navigate(backUrl)
      }}
    >
      <Confirmation
        iconComponent={<SignIcon />}
        type="success"
        title={t("title")}
        subtitle={
          <SanitizedHtml
            as="span"
            content={t("copy", { email: auth.user?.email })}
          />
        }
      >
        <Button href={backUrl}>{t("cta")}</Button>
      </Confirmation>
    </Modal>
  )
}

export default DrawSignedModal
