import { useTranslation } from "react-i18next"
import Button from "../../../components/Basic/Button/Button"
import Alert from "../../../components/UI/Alert/Alert"
import {
  LineOfCreditResponse,
  LineOfCreditResponseStatusEnum,
} from "../../../services/api/agreements"
import { LINE_OF_CREDIT_DOCUMENTS_PATH } from "../constants"

const MissingDocumentsAlert = ({
  lineOfCredit,
  className,
}: {
  lineOfCredit: LineOfCreditResponse
  className?: string
}) => {
  const { t } = useTranslation("line-of-credit", {
    keyPrefix: "MissingDocumentsAlert",
  })

  if (
    lineOfCredit.status !== LineOfCreditResponseStatusEnum.WaitingForDocuments
  ) {
    return null
  }

  return (
    <Alert type="warning" className={className}>
      {t("message")}
      <div>
        <Button
          variant="link"
          href={LINE_OF_CREDIT_DOCUMENTS_PATH}
          className="mt-2"
        >
          {t("link")}
        </Button>
      </div>
    </Alert>
  )
}

export default MissingDocumentsAlert
