import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import Button from "../../../components/Basic/Button"
import FeatureContent from "../../../components/Collections/FeatureContent"
import Modal from "../../../components/UI/Modal"
import WorkingOnItImg from "../../../svgs/illustrations/working-on-it.svg"

const VerifyingDocumentsModal = ({ isOpen }: { isOpen: boolean }) => {
  const navigate = useNavigate()
  const { t } = useTranslation("withdraw", {
    keyPrefix: "VeryfingDocumentsModal",
  })
  return (
    <Modal
      isOpen={isOpen}
      onClose={async () => {
        await navigate("/")
      }}
    >
      <FeatureContent
        img={WorkingOnItImg}
        title={t("title")}
        content={t("copy")}
        footerContent={
          <Button
            type="button"
            variant="primary"
            onClick={async () => {
              await navigate("/")
            }}
          >
            {t("cta")}
          </Button>
        }
      />
    </Modal>
  )
}

export default VerifyingDocumentsModal
