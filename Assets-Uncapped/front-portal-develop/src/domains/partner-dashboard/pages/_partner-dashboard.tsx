import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router"
import Button from "../../../components/Basic/Button"
import PageLoader from "../../../components/Collections/PageLoader"
import InviteMembersButton from "../../../components/UI/InviteMembersButton/InviteMembersButton"
import Layout from "../../../components/UI/Layout"
import PortalMenu from "../../../components/UI/PortalMenu"
import { ReactComponent as DvrIcon } from "../../../svgs/dvr.svg"
import ApplicationsTable from "../../partner-application/components/ApplicationsTable"
import useApplications from "../../partner-application/hooks/useApplications"
import IntroduceClientButton from "../components/IntroduceClientButton"
import NoResults from "../components/NoResults"
import IntroductionCompleteStory from "../components/stories/IntroductionComplete/IntroductionComplete"
import PartialIntroductionStory from "../components/stories/PartialIntroduction/PartialIntroduction"
import ProvideDetailsStory from "../components/stories/ProvideDetails/ProvideDetails"
import { DashboardStories } from "../constants"

const PartnerDashboard = () => {
  const applications = useApplications()
  const hasResults = (applications.data?.totalElements || 0) > 0
  const ComputedLayout = hasResults ? Layout.FullWidth : Layout.Parent
  const [searchParams] = useSearchParams()
  const { t } = useTranslation("partner-dashboard")

  return (
    <Layout menu={<PortalMenu menuOnMobile />}>
      <ComputedLayout>
        <>
          {applications.isLoading && <PageLoader />}
          <div className="mb-4 flex gap-4 overflow-x-auto lg:overflow-x-visible">
            <IntroduceClientButton />
            <InviteMembersButton />
            <Button
              variant="secondary"
              href="https://uncapped.notion.site/Info-Pack-for-Partners-f8a64140357a4f37accb5766e594e8df"
              target="_blank"
            >
              <DvrIcon className="mr-2" />
              {t("buttons.userGuide")}
            </Button>
          </div>
          {applications.isFetched &&
            (hasResults ? <ApplicationsTable /> : <NoResults />)}
        </>
      </ComputedLayout>
      {searchParams.get("story") === DashboardStories.IntroductionComplete && (
        <IntroductionCompleteStory />
      )}
      {searchParams.get("story") === DashboardStories.PartialIntroduction && (
        <PartialIntroductionStory />
      )}
      {searchParams.get("story") === DashboardStories.ProvideDetails && (
        <ProvideDetailsStory dealId={searchParams.get("dealId") || ""} />
      )}
    </Layout>
  )
}

export default PartnerDashboard
