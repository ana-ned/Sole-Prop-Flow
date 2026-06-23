import { useTranslation } from "react-i18next"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import PageLoader from "../../../../components/Collections/PageLoader/PageLoader"
import Layout from "../../../../components/UI/Layout"
import PageBar from "../../../../components/UI/PageBar"
import AmazonRegionCards from "../../components/AmazonRegionCards"
import useConnections from "../../hooks/useConnections"

const ManualConnectionAmazon = () => {
  const { t } = useTranslation("connections", { keyPrefix: "manual.amazon" })
  const { isLoading } = useConnections()

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <Layout menu={false}>
      <Layout.Parent>
        <PageBar
          title={t("header")}
          onClickBack={() => {
            globalThis.history.back()
          }}
          withChat
        />
        <Typography type="body">
          <SanitizedHtml as="span" content={t("copy")} />
        </Typography>
        <AmazonRegionCards />
      </Layout.Parent>
    </Layout>
  )
}

export default ManualConnectionAmazon
