import { useParams } from "react-router"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import Layout from "../../../../components/UI/Layout"
import PortalMenu from "../../../../components/UI/PortalMenu"
import useAgreement from "../../hooks/useAgreement"
import DailyPayoutBreakdown from "./DailyPayoutBreakdown"
import DailyPayoutHeader from "./DailyPayoutHeader"
import AgreementTransactions from "../AgreementTransactions/AgreementTransactions"
import Payments from "../Payments/Payments"

interface DailyPayoutPageProps {
  backUrl: string
}

const DailyPayoutPage = ({ backUrl }: DailyPayoutPageProps) => {
  const { t } = useTranslation("agreements", {
    keyPrefix: "common",
  })
  const { agreementId } = useParams()
  const { data: agreement } = useAgreement(agreementId!)

  return (
    <Layout menu={<PortalMenu />}>
      <Layout.Parent>
        <div className="flex flex-col gap-8">
          <DailyPayoutHeader agreement={agreement!} />
          <DailyPayoutBreakdown agreement={agreement!} />
          <Payments agreement={agreement!} />
          <AgreementTransactions agreement={agreement!} />
          <div>
            <Button variant="secondary" href={backUrl}>
              {t("goBack")}
            </Button>
          </div>
        </div>
      </Layout.Parent>
    </Layout>
  )
}

export default DailyPayoutPage
