import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { filesize } from "filesize"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useParams, useNavigate } from "react-router"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import Typography from "../../../../components/Basic/Typography"
import ListItemContainer from "../../../../components/Collections/ListItemContainer"
import PageLoader from "../../../../components/Collections/PageLoader"
import ApiErrorAlert from "../../../../components/Functional/ApiErrorAlert"
import FileUpload from "../../../../components/Functional/FileUpload"
import CardV2 from "../../../../components/UI/CardV2"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import ListItemLarge from "../../../../components/UI/ListItemLarge"
import { AdditionalInfo } from "../../../../services/api/organisation-users"
import { ReactComponent as AttachmentIcon } from "../../../../svgs/attachment.svg"
import { ReactComponent as BankIcon } from "../../../../svgs/bank.svg"
import AmericanExpressLogo from "../../../connections/components/BankAccountCountrySearchableList/assets/americanexpress.jpeg"
import BankOfAmericaLogo from "../../../connections/components/BankAccountCountrySearchableList/assets/bankofamerica.jpeg"
import BrexLogo from "../../../connections/components/BankAccountCountrySearchableList/assets/brex.jpeg"
import CapitalOneLogo from "../../../connections/components/BankAccountCountrySearchableList/assets/capitalone.jpeg"
import ChaseLogo from "../../../connections/components/BankAccountCountrySearchableList/assets/chase.svg"
import CitiLogo from "../../../connections/components/BankAccountCountrySearchableList/assets/citi.png"
import MercuryLogo from "../../../connections/components/BankAccountCountrySearchableList/assets/mercury.jpeg"
import PNCLogo from "../../../connections/components/BankAccountCountrySearchableList/assets/pnc.png"
import SVBLogo from "../../../connections/components/BankAccountCountrySearchableList/assets/svb.jpeg"
import TDBankLogo from "../../../connections/components/BankAccountCountrySearchableList/assets/tdbank.png"
import TruistLogo from "../../../connections/components/BankAccountCountrySearchableList/assets/truist.jpeg"
import USBankLogo from "../../../connections/components/BankAccountCountrySearchableList/assets/usbank.jpeg"
import WellsFargoLogo from "../../../connections/components/BankAccountCountrySearchableList/assets/wellsfargo.svg"
import WiseLogo from "../../../connections/components/BankAccountCountrySearchableList/assets/wise.jpeg"
import useDocumentUpload from "../../hooks/useDocumentUpload"
import DocumentCustomMessage from "./DocumentCustomMessage"
import DocumentsUploadLayout from "./DocumentsUploadLayout"

const BANK_ICONS_URLS: Record<string, string> = {
  "American Express": AmericanExpressLogo,
  "Capital One": CapitalOneLogo,
  Chase: ChaseLogo,
  "Bank of America": BankOfAmericaLogo,
  Mercury: MercuryLogo,
  "Wells Fargo": WellsFargoLogo,
  Brex: BrexLogo,
  "Silicon Valley Bank - SVB Online Banking": SVBLogo,
  "Wise (US)": WiseLogo,
  "U.S. Bank": USBankLogo,
  "TD Bank": TDBankLogo,
  Truist: TruistLogo,
  "Citibank Online": CitiLogo,
  PNC: PNCLogo,
}

const Sidebar = ({
  className,
  additionalInfo,
}: {
  className?: string
  additionalInfo: AdditionalInfo
}) => (
  <CardV2
    className={className}
    title={additionalInfo.note}
    icon={<HugeiconsIcon icon={Alert02SolidStandard} />}
    severity="accent-5"
  >
    <div className="shadow-light-sm border-card bg-surface-default rounded-card-md space-y-2 p-2">
      {additionalInfo.resources?.map((account) => {
        const icon = account.bankName
          ? BANK_ICONS_URLS[account.bankName]
          : undefined

        return (
          <div
            key={`${account.bankName}-${account.mask}`}
            className="flex items-center gap-2 rounded-lg px-1.5 py-1"
          >
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-neutral-300 bg-neutral-100 p-[2.5px]">
              {icon ? (
                <img src={icon} alt={account.bankName} />
              ) : (
                <BankIcon className="size-5" />
              )}
            </div>
            <span className="grow text-base font-semibold">
              {account.bankName}
            </span>
            <span className="shrink-0 text-sm font-bold">{account.mask}</span>
          </div>
        )
      })}
    </div>
  </CardV2>
)

const DocumentsBankStatements = ({ backUrl }: { backUrl: string }) => {
  const { t } = useTranslation("onboarding")
  const navigate = useNavigate()
  const { slug = "", id } = useParams<{ slug: string; id?: string }>()
  const [disabledRows, setDisabledRows] = useState<string[]>([])
  const { query, fileUpload, fileDelete, fileUploadLock, handleFilesUpload } =
    useDocumentUpload({ slug, dealId: id })
  const { data, isError, error, isLoading } = query

  const { handleSubmit } = useForm()

  if (isLoading || !data) {
    return <PageLoader />
  }

  const additionalInfo =
    "additionalInfo" in query.data.requiredDocument &&
    query.data.requiredDocument.additionalInfo?.resources?.length
      ? query.data.requiredDocument.additionalInfo
      : undefined

  return (
    <DocumentsUploadLayout
      title={t("documents.titleSingle", {
        title: data.requiredDocument.title,
      })}
      backUrl={backUrl}
      sidebarBackground={false}
      sidebar={additionalInfo && <Sidebar additionalInfo={additionalInfo} />}
    >
      <FormLayout>
        <form
          onSubmit={handleSubmit(async () => {
            await fileUploadLock.mutateAsync({})
            await navigate(backUrl)
          })}
        >
          <FormLayout.Content className="space-y-6">
            {!!data.requiredDocument.instructions?.length && (
              <div>
                {data.requiredDocument.instructions.map((instruction) => (
                  <Typography key={instruction}>{instruction}</Typography>
                ))}
              </div>
            )}

            <DocumentCustomMessage>
              {data.requiredDocument.additionalInfo?.customMessage}
            </DocumentCustomMessage>

            {additionalInfo && (
              <Sidebar className="lg:hidden" additionalInfo={additionalInfo} />
            )}

            <FileUpload
              extensions={data.requiredDocument.allowedFileFormats || []}
              handleUpload={handleFilesUpload}
              loading={fileUpload.isPending}
              title={t("documents.titleSingle", {
                title: data.requiredDocument.title?.toLowerCase(),
              })}
              subtitle={data.requiredDocument.description}
            />

            {(isError || fileUpload.isError) && (
              <ApiErrorAlert
                className="my-5"
                error={(error || fileUpload.error) as unknown as Response}
              />
            )}

            {!!data.uploadedDocuments?.length && (
              <ListItemContainer className="mb-8">
                {data.uploadedDocuments.map((item) => (
                  <ListItemLarge
                    key={item.id}
                    title={item.fileName}
                    subtitle={filesize(item.fileSize!)}
                    truncate
                    more={{
                      type: "delete",
                      onClick: () => {
                        setDisabledRows([...disabledRows, item.id!])
                        fileDelete.mutate(item.id!, {
                          onSettled() {
                            setDisabledRows(
                              disabledRows.filter(
                                (disabledRow) => disabledRow !== item.id!
                              )
                            )
                          },
                        })
                      },
                    }}
                    disabled={disabledRows.includes(item.id!)}
                    icon={<AttachmentIcon />}
                  />
                ))}
              </ListItemContainer>
            )}
          </FormLayout.Content>
          <FormLayout.Footer>
            <ButtonGroup>
              <Button
                type="submit"
                loading={fileUploadLock.isPending}
                disabled={data.uploadedDocuments?.length === 0}
              >
                {t("documents.submitSingle")}
              </Button>
            </ButtonGroup>
          </FormLayout.Footer>
        </form>
      </FormLayout>
    </DocumentsUploadLayout>
  )
}

export default DocumentsBankStatements
