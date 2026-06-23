import { useTranslation } from "react-i18next"
import FeatureContent from "../../../../components/Collections/FeatureContent"
import Modal from "../../../../components/UI/Modal"
import ExclamationImg from "../../../../svgs/illustrations/exclamation.svg"

const StatusModalsDenied = () => {
  const { t } = useTranslation("kyc", {
    keyPrefix: "StatusModalsDenied",
  })
  return (
    <Modal isOpen>
      <FeatureContent
        img={ExclamationImg}
        title={t("header")}
        content={t("copy")}
      />
    </Modal>
  )
}

export default StatusModalsDenied
