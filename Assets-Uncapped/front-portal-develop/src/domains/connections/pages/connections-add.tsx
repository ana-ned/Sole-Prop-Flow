import { useTranslation } from "react-i18next"
import { useLocation, useParams } from "react-router"
import Layout from "../../../components/UI/Layout"
import PageBar from "../../../components/UI/PageBar"
import ErrorIndex from "../../../pages/error/_error"
import { url } from "../../../utils/url"
import AmazonRegionCards from "../components/AmazonRegionCards"
import BankAccountCountrySearchableList from "../components/BankAccountCountrySearchableList"
import ConnectionsSearchableList from "../components/ConnectionsSearchableList"
import { accountingPlatforms, salesPlatforms } from "../models/platforms"

const BACK_URL = "/connections"
const ALLOWED_TYPES = new Set([
  "amazon",
  "sales",
  "bank",
  "accounting",
  "bank-search",
])

const ConnectionsAdd = () => {
  const { t } = useTranslation("connections", { keyPrefix: "add" })
  const params = useParams<{ type: string }>()
  const location = useLocation()
  const type = (params.type || "").toLowerCase()

  if (type && !ALLOWED_TYPES.has(type)) {
    return <ErrorIndex type="404" />
  }

  return (
    <Layout menu={false}>
      <Layout.Parent>
        <PageBar
          backUrl={location.state?.backUrl || BACK_URL}
          title={t(
            // @ts-expect-error dynamic translation
            `title-${type}`
          )}
          withChat
        />

        {type === "amazon" && <AmazonRegionCards />}

        {type === "sales" && (
          <ConnectionsSearchableList
            platforms={salesPlatforms()}
            backUrl={BACK_URL}
          />
        )}

        {type === "accounting" && (
          <ConnectionsSearchableList
            platforms={accountingPlatforms}
            backUrl={BACK_URL}
          />
        )}

        {type === "bank-search" && (
          <BankAccountCountrySearchableList
            plaidFallback={url(`/connections/plaid`, true)}
          />
        )}
      </Layout.Parent>
    </Layout>
  )
}

export default ConnectionsAdd
