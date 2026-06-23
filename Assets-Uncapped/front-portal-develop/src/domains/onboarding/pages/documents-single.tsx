import { useParams } from "react-router"
import DocumentsDebt from "../components/documents-single/documents-debt/DocumentsDebt"
import DocumentsBalanceSheet from "../components/documents-single/DocumentsBalanceSheet"
import DocumentsBankStatements from "../components/documents-single/DocumentsBankStatements"
import DocumentsGrossMargin from "../components/documents-single/DocumentsGrossMargin"
import DocumentsProfitLossReport from "../components/documents-single/DocumentsProfitLossReport"
import DocumentsTotalCashBalance from "../components/documents-single/DocumentsTotalCashBalance"
import DocumentsUploadDefault from "../components/documents-single/DocumentsUploadDefault"
import VirtualDocumentsApplicantInformation from "../components/documents-single/VirtualDocumentsApplicantInformation"
import { UploadDocumentType } from "../constants"
import { VirtualDocumentTypesEnum } from "../hooks/useVirtualDocuments"

const DocumentsSingle = ({ backUrl }: { backUrl: string }) => {
  const { slug = "", id = "" } = useParams<{
    slug: UploadDocumentType | VirtualDocumentTypesEnum
    id: string
  }>()

  const isPartner = globalThis.location.pathname.includes("partner")

  const backUrlWithId = isPartner ? backUrl + id : backUrl

  if (slug === UploadDocumentType.TotalCashBalance) {
    return <DocumentsTotalCashBalance backUrl={backUrlWithId} />
  }

  if (slug === UploadDocumentType.GrossMargin) {
    return <DocumentsGrossMargin backUrl={backUrlWithId} />
  }

  if (slug === UploadDocumentType.OutstandingDebt) {
    return <DocumentsDebt backUrl={backUrlWithId} />
  }

  if (slug === UploadDocumentType.ProfitLossReport && !isPartner) {
    return <DocumentsProfitLossReport backUrl={backUrl} />
  }

  if (slug === UploadDocumentType.BalanceSheet && !isPartner) {
    return <DocumentsBalanceSheet backUrl={backUrl} />
  }

  if (slug === UploadDocumentType.BankStatement && !isPartner) {
    return <DocumentsBankStatements backUrl={backUrl} />
  }

  if (slug === VirtualDocumentTypesEnum.APPLICANT_INFORMATION && !isPartner) {
    return <VirtualDocumentsApplicantInformation backUrl={backUrl} />
  }

  return <DocumentsUploadDefault backUrl={backUrlWithId} />
}

export default DocumentsSingle
