import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router"
import Switcher from "../../components/Basic/Switcher"
import ListItemContainer from "../../components/Collections/ListItemContainer"
import PageLoader from "../../components/Collections/PageLoader"
import Layout from "../../components/UI/Layout"
import PageBar from "../../components/UI/PageBar"
import PortalMenu from "../../components/UI/PortalMenu"
import DocumentListItem from "./documents/DocumentListItem"
import useMarcusDocuments from "./hooks/useMarcusDocuments"

type DocumentTypes = "LoanDocuments" | "AccountStatements"

const ProfileDocuments = () => {
  const { state }: { state?: { initialTab?: DocumentTypes } } = useLocation()
  const { t } = useTranslation("profile", { keyPrefix: "documents" })
  const [activeTab, setActiveTab] = useState<DocumentTypes>(
    state?.initialTab || "AccountStatements"
  )
  const marcusDocuments = useMarcusDocuments()

  if (marcusDocuments.isLoading) {
    return <PageLoader />
  }

  return (
    <Layout menu={<PortalMenu menuOnMobile />}>
      <Layout.Parent className="flex flex-col gap-y-4">
        <PageBar title={t("title")} desktopHeaderType="h4" />
        <Switcher
          defaultValue={activeTab}
          values={[
            {
              value: "AccountStatements",
              label: t("accountStatements"),
            },
            {
              value: "LoanDocuments",
              label: t("loanDocuments"),
            },
          ]}
          onChange={(newVal: string) => {
            setActiveTab(newVal as DocumentTypes)
          }}
        />
        {activeTab === "AccountStatements" &&
          (marcusDocuments.statements || []).length > 0 && (
            <ListItemContainer size="sm">
              {marcusDocuments.statements!.map((document) => (
                <DocumentListItem
                  key={document.documentId}
                  document={document}
                />
              ))}
            </ListItemContainer>
          )}
        {activeTab === "LoanDocuments" &&
          (marcusDocuments.loanDocuments || []).length > 0 && (
            <ListItemContainer size="sm">
              {marcusDocuments.loanDocuments!.map((document) => (
                <DocumentListItem
                  key={document.documentId}
                  document={document}
                />
              ))}
            </ListItemContainer>
          )}
      </Layout.Parent>
    </Layout>
  )
}

export default ProfileDocuments
