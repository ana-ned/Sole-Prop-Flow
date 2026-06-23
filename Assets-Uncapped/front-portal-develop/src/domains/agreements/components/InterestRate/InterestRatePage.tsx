import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import Layout from "../../../../components/UI/Layout"
import PortalMenu from "../../../../components/UI/PortalMenu"
import {
  BalanceWithAgreementStatusDTO,
  DetailedAgreementDTO,
} from "../../../../services/api/agreements"
import AgreementTransactions from "../AgreementTransactions/AgreementTransactions"
import Payments from "../Payments/Payments"
import InterestRateBreakdown from "./InterestRateBreakdown"
import InterestRateHeader from "./InterestRateHeader"
import InterestRatePaymentDetails from "./InterestRatePaymentDetails"

interface InterestRatePageProps {
  agreement: DetailedAgreementDTO
  balance: BalanceWithAgreementStatusDTO
  backUrl: string
}

const InterestRatePage = ({
  agreement,
  balance,
  backUrl,
}: InterestRatePageProps) => {
  const { t } = useTranslation("agreements", {
    keyPrefix: "common",
  })

  return (
    <Layout menu={<PortalMenu />}>
      <Layout.Parent>
        <div className="flex flex-col gap-8">
          <InterestRateHeader agreement={agreement} balance={balance} />
          <InterestRateBreakdown agreement={agreement} balance={balance} />
          <InterestRatePaymentDetails agreement={agreement} />
          <Payments agreement={agreement} />
          <AgreementTransactions agreement={agreement} />
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

export default InterestRatePage
