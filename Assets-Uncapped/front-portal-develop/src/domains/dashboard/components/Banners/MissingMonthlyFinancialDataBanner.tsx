import { useTranslation } from "react-i18next"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import ListItem from "../../../../components/UI/ListItem"
import MainBanner from "../../../../components/UI/MainBanner"
import { MissingDocumentResponse } from "../../../../services/api/organisation-users"
import { lowerCaseFirstLetter } from "../../../../utils/string"
import { LINE_OF_CREDIT_DOCUMENTS_PATH } from "../../../line-of-credit/constants"

const MissingMonthlyFinancialDataBanner = ({
  documents,
}: {
  documents: MissingDocumentResponse[]
}) => {
  const { t } = useTranslation("dashboard", {
    keyPrefix: "banners.missingMonthlyFinancialData",
  })

  return (
    <MainBanner
      theme="dark"
      title={
        <div className="text-left">
          <Typography type="h4" color="white" className="mb-4">
            {t("title")}
          </Typography>
          <Typography color="white">
            <SanitizedHtml as="span" content={t("content")} />
          </Typography>
        </div>
      }
    >
      <div className="bg-surface-elevated-1 shadow-light-sm border-card rounded-card-md p-2">
        <div className="rounded-card-md flex flex-col gap-2 bg-white p-2">
          {documents.map((document) => (
            <ListItem
              to={`${LINE_OF_CREDIT_DOCUMENTS_PATH}/type/${document.documentType}`}
              key={document.documentRequestId}
            >
              {document.title}{" "}
              {document.subtitle
                ? ` (${lowerCaseFirstLetter(document.subtitle)})`
                : ""}
            </ListItem>
          ))}
        </div>
      </div>
    </MainBanner>
  )
}

export default MissingMonthlyFinancialDataBanner
