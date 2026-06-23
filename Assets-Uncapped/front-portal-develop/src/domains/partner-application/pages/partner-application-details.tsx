import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router"
import PageLoader from "../../../components/Collections/PageLoader"
import Layout from "../../../components/UI/Layout"
import PageBar from "../../../components/UI/PageBar"
import PortalMenu from "../../../components/UI/PortalMenu"
import SimpleTable from "../../../components/UI/SimpleTable"
import ErrorIndex from "../../../pages/error/_error"
import OfferAmount from "../components/OfferAmount"
import StatusBadge from "../components/StatusBadge"
import useApplicationDetails from "../hooks/useApplicationDetails"
import {
  formatPartnerApplicationDate,
  getPartnerApplicationTitle,
} from "../partner-application.utils"

const PartnerApplicationDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation("partner-application", {
    keyPrefix: "applicationDetails",
  })
  const { data, isLoading, error } = useApplicationDetails(id)

  if (error?.status === 404) {
    return <ErrorIndex type="404" />
  }

  if (isLoading || !data) {
    return <PageLoader />
  }

  return (
    <Layout menu={<PortalMenu />}>
      <Layout.Parent>
        <PageBar
          title={getPartnerApplicationTitle(data)}
          desktopHeaderType="h4"
          onClickBack={async () => {
            await navigate(-1)
          }}
        />
        <SimpleTable
          wrapped
          colorHeading="neutral-600"
          data={[
            { th: t("status"), td: <StatusBadge application={data} /> },
            {
              th: t("created"),
              td: formatPartnerApplicationDate(data.createDate),
            },
            {
              th: t("offer"),
              td: <OfferAmount application={data} />,
            },
          ]}
        />
      </Layout.Parent>
    </Layout>
  )
}

export default PartnerApplicationDetails
