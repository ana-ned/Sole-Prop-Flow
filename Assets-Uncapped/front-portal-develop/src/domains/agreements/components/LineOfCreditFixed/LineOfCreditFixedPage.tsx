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
import LineOfCreditFixedBreakdown from "./LineOfCreditFixedBreakdown"
import LineOfCreditFixedDetails from "./LineOfCreditFixedDetails"
import LineOfCreditFixedHeader from "./LineOfCreditFixedHeader"

interface LineOfCreditFixedPageProps {
  agreement: DetailedAgreementDTO
  balance: BalanceWithAgreementStatusDTO
  repaymentSchedule: RepaymentScheduleResponse[] | undefined
  backUrl: string
}

const LineOfCreditFixedPage = ({
  agreement,
  balance,
  repaymentSchedule,
  backUrl,
}: LineOfCreditFixedPageProps) => {
  const { t } = useTranslation("agreements", {
    keyPrefix: "common",
  })

  return (
    <Layout menu={<PortalMenu />}>
      <Layout.Parent>
        <div className="flex flex-col gap-8">
          <LineOfCreditFixedHeader agreement={agreement} balance={balance} />
          <LineOfCreditFixedBreakdown
            agreement={agreement}
            balance={balance}
            repaymentSchedule={repaymentSchedule}
          />
          <LineOfCreditFixedDetails agreement={agreement} />
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

export default LineOfCreditFixedPage
