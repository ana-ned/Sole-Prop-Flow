import clsx from "clsx"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import Button from "../../../components/Basic/Button"
import SanitizedHtml from "../../../components/Basic/SanitizedHtml/SanitizedHtml"
import Confirmation from "../../../components/UI/Confirmation"
import Modal from "../../../components/UI/Modal"
import useDevice from "../../../hooks/useDevice"
import { DrawResponse } from "../../../services/api/agreements"
import WorkingOnItIcon from "../../../svgs/illustrations/working-on-it.svg"

const DrawEmailSentModal = ({
  isOpen,
  draw,
}: {
  isOpen: boolean
  draw: DrawResponse
}) => {
  const { isMobile } = useDevice()
  const { t } = useTranslation("line-of-credit", {
    keyPrefix: "DrawEmailSentModal",
  })
  const navigate = useNavigate()
  const backUrl = `/line-of-credit/${draw.lineOfCreditId}`

  return (
    <Modal
      isOpen={isOpen}
      className={clsx({ "pb-12": isMobile })}
      onClose={async () => {
        await navigate(backUrl)
      }}
    >
      <Confirmation
        iconComponent={<WorkingOnItIcon />}
        type="success"
        title={t("title")}
        subtitle={
          <SanitizedHtml
            as="span"
            content={t("copy", { email: draw.drawSigningDetails?.signerEmail })}
          />
        }
      >
        <Button href={backUrl}>{t("cta")}</Button>
      </Confirmation>
    </Modal>
  )
}

export default DrawEmailSentModal
