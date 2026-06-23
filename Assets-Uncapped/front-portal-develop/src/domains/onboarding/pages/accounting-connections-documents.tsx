import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import Button from "../../../components/Basic/Button"
import Typography from "../../../components/Basic/Typography"
import Layout from "../../../components/UI/Layout"
import LogoOnlyMenu from "../../../components/UI/LogoOnlyMenu"
import PageBar from "../../../components/UI/PageBar"
import { useTracking } from "../../../hooks/useTracking"
import AccountingHelpChild from "../components/accounting/help-child"
import DocumentsBalanceSheet from "../components/documents-single/DocumentsBalanceSheet"
import DocumentsProfitLossReport from "../components/documents-single/DocumentsProfitLossReport"
import OnboardingGuard from "../components/OnboardingGuard"
import OnboardingLayout from "../components/OnboardingLayout"
import { OnboardingMenuPaths, UploadDocumentType } from "../constants"
import useAccountingDocuments from "../hooks/useAccountingDocuments"
import useApplicationSteps from "../hooks/useApplicationSteps"
import useOnboardingNavigation from "../hooks/useOnboardingNavigation"

const AccountingConnectionsDocuments = () => {
  const { t } = useTranslation("onboarding")
  const {
    accountingDocumentsRequests,
    canSubmit,
    isUploading,
    isLoading,
    confirmUpload,
  } = useAccountingDocuments()
  const { trackEvent } = useTracking()
  const { handleCompleteStep } = useApplicationSteps()
  const navigation = useOnboardingNavigation()

  useEffect(() => {
    if (accountingDocumentsRequests.length === 0 && !isLoading) {
      navigation.next()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountingDocumentsRequests, isLoading])

  return (
    <OnboardingGuard step="ACCOUNTING">
      <OnboardingLayout menu={<LogoOnlyMenu />}>
        <Layout.Parent>
          <PageBar
            title={t("accountingConnections.documents.pageTitle")}
            backUrl={`${OnboardingMenuPaths.Accounting}/all`}
            withChat
            desktopHeaderType="h4"
          />
          <div className="flex flex-col gap-y-6">
            {accountingDocumentsRequests.map((document) => (
              <div
                className="bg-surface-elevated-2 shadow-light-sm border-card rounded-card-md p-6"
                key={document.documentType}
              >
                <Typography type="h6" className="mb-4">
                  {document.title}
                </Typography>
                {document.documentType ===
                  UploadDocumentType.ProfitLossReport && (
                  <DocumentsProfitLossReport layoutless />
                )}
                {document.documentType === UploadDocumentType.BalanceSheet && (
                  <DocumentsBalanceSheet layoutless />
                )}
              </div>
            ))}

            <Button
              type="button"
              disabled={!canSubmit}
              loading={isUploading}
              onClick={async () => {
                await confirmUpload()
                await handleCompleteStep("ACCOUNTING")
                trackEvent({
                  category: "onboarding",
                  name: "accounting",
                  action: "document-upload-submit",
                })
              }}
            >
              {t("accountingConnections.documents.continue")}
            </Button>
          </div>
        </Layout.Parent>
        <AccountingHelpChild />
      </OnboardingLayout>
    </OnboardingGuard>
  )
}

export default AccountingConnectionsDocuments
