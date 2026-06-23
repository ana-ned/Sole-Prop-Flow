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
import LineOfCreditInterestRateBreakdown from "./LineOfCreditInterestRateBreakdown"
import LineOfCreditInterestRateHeader from "./LineOfCreditInterestRateHeader"
import LineOfCreditInterestRatePaymentDetails from "./LineOfCreditInterestRatePaymentDetails"

interface LineOfCreditInterestRatePageProps {
  agreement: DetailedAgreementDTO
  balance: BalanceWithAgreementStatusDTO
  backUrl: string
}

const LineOfCreditInterestRatePage = ({
  agreement,
  balance,
  backUrl,
}: LineOfCreditInterestRatePageProps) => {
  const { t } = useTranslation("agreements", {
    keyPrefix: "common",
  })

  return (
    <Layout menu={<PortalMenu />}>
      <Layout.Parent>
        <div className="flex flex-col gap-8">
          <LineOfCreditInterestRateHeader
            agreement={agreement}
            balance={balance}
          />
          <LineOfCreditInterestRateBreakdown agreement={agreement} />
          <LineOfCreditInterestRatePaymentDetails agreement={agreement} />
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

export default LineOfCreditInterestRatePage
