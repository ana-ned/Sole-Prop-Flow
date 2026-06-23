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
import RbfBreakdown from "./RbfBreakdown"
import RbfHeader from "./RbfHeader"
import RbfPaymentDetails from "./RbfPaymentDetails"

interface RbfPageProps {
  agreement: DetailedAgreementDTO
  balance: BalanceWithAgreementStatusDTO
  backUrl: string
}

const RbfPage = ({ agreement, balance, backUrl }: RbfPageProps) => {
  const { t } = useTranslation("agreements", {
    keyPrefix: "common",
  })

  return (
    <Layout menu={<PortalMenu />}>
      <Layout.Parent>
        <div className="flex flex-col gap-8">
          <RbfHeader agreement={agreement} balance={balance} />
          <RbfBreakdown agreement={agreement} balance={balance} />
          <RbfPaymentDetails agreement={agreement} />
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

export default RbfPage
