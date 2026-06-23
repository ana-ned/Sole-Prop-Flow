import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router"
import Button from "../../../components/Basic/Button"
import Typography from "../../../components/Basic/Typography"
import PageLoader from "../../../components/Collections/PageLoader"
import ApiErrorAlert from "../../../components/Functional/ApiErrorAlert"
import DocumentsList from "../../../components/Shared/DocumentsList"
import Layout from "../../../components/UI/Layout"
import LogoOnlyMenu from "../../../components/UI/LogoOnlyMenu"
import PageBar from "../../../components/UI/PageBar"
import { useTracking } from "../../../hooks/useTracking"
import useRequiredDocuments from "../../onboarding/hooks/useRequiredDocuments"
import { DashboardStories } from "../../partner-dashboard/constants"
import { DOCUMENTS_INDEX_PATH } from "../constants"

const PartnerApplicationDocuments = () => {
  const { t } = useTranslation("partner-application", {
    keyPrefix: "documentsUpload",
  })
  const { id } = useParams()
  const navigate = useNavigate()
  const { trackEvent } = useTracking()
  const { data, isLoading, isError, error } = useRequiredDocuments({
    id,
  })

  useEffect(() => {
    if (data?.requiredDocuments?.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      navigate(`/?story=${DashboardStories.IntroductionComplete}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <Layout menu={<LogoOnlyMenu />}>
      <Layout.Parent>
        <PageBar
          title={t("header")}
          backUrl={`/partner/application/business-details/${id}`}
          withChat
          desktopHeaderType="h4"
        />
        <div>
          <Typography type="body">{t("copy")}</Typography>

          {isError && (
            <ApiErrorAlert
              className="mt-5"
              error={error as unknown as Response}
            />
          )}

          <DocumentsList
            data={data?.requiredDocuments}
            path={`${DOCUMENTS_INDEX_PATH}/${id}`}
            category="partner-application"
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          className="mt-6"
          onClick={async () => {
            trackEvent({
              category: "partner-application",
              name: "eligible",
              action: "proceed-to-dashboard",
            })
            await navigate(`/?story=${DashboardStories.IntroductionComplete}`)
          }}
        >
          {t("skip")}
        </Button>
      </Layout.Parent>
    </Layout>
  )
}

export default PartnerApplicationDocuments
