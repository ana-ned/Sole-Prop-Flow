import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import Layout from "../../../../components/UI/Layout"
import PortalMenu from "../../../../components/UI/PortalMenu"
import {
  BalanceWithAgreementStatusDTO,
  DetailedAgreementDTO,
  RepaymentScheduleResponse,
} from "../../../../services/api/agreements"
import AgreementTransactions from "../AgreementTransactions/AgreementTransactions"
import Payments from "../Payments/Payments"
import FixedBreakdown from "./FixedBreakdown"
import FixedHeader from "./FixedHeader"
import FixedPaymentDetails from "./FixedPaymentDetails"

interface FixedPageProps {
  agreement: DetailedAgreementDTO
  balance: BalanceWithAgreementStatusDTO
  repaymentSchedule: RepaymentScheduleResponse[] | undefined
  backUrl: string
}

const FixedPage = ({
  agreement,
  balance,
  repaymentSchedule,
  backUrl,
}: FixedPageProps) => {
  const { t } = useTranslation("agreements", {
    keyPrefix: "common",
  })

  return (
    <Layout menu={<PortalMenu />}>
      <Layout.Parent>
        <div className="flex flex-col gap-8">
          <FixedHeader agreement={agreement} balance={balance} />
          <FixedBreakdown agreement={agreement} balance={balance} />
          <FixedPaymentDetails
            agreement={agreement}
            repaymentSchedule={repaymentSchedule}
          />
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

export default FixedPage
