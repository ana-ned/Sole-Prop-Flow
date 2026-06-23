import { useTranslation } from "react-i18next"
import SanitizedHtml from "../../../components/Basic/SanitizedHtml"
import Typography from "../../../components/Basic/Typography"
import ClipboardBox from "../../../components/UI/ClipboardBox"
import Layout from "../../../components/UI/Layout"
import PageBar from "../../../components/UI/PageBar"
import PortalMenu from "../../../components/UI/PortalMenu"
import usePartnerInfo from "../../../hooks/usePartnerInfo"
import { url } from "../../../utils/url"

const PartnerReferrals = () => {
  const { t } = useTranslation("partner-dashboard", { keyPrefix: "referrals" })
  const partner = usePartnerInfo()

  return (
    <Layout menu={<PortalMenu menuOnMobile />}>
      <Layout.Parent>
        <PageBar title={t("title")} desktopHeaderType="h4" />

        <ClipboardBox
          variant="branded"
          title={t("copyTitle")}
          value={url(
            `/registration?referral=${partner.data?.partner?.referralId}`,
            true
          )}
        />

        <Typography type="h5" className="mt-6 mb-4">
          <SanitizedHtml as="span" content={t("subtitle")} />
        </Typography>

        <ol className="ol-primary">
          {t("points", {
            returnObjects: true,
          }).map((item) => (
            <li key={item}>
              <Typography>{item}</Typography>
            </li>
          ))}
        </ol>
      </Layout.Parent>
    </Layout>
  )
}

export default PartnerReferrals
