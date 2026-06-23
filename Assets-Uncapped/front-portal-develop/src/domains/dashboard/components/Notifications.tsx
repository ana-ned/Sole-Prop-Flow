import { HugeiconsIcon } from "@hugeicons/react"
import { Notification02SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useFlag } from "@unleash/proxy-client-react"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../components/Basic/BoxIcon"
import Widget from "../../../components/UI/Widget"
import useAgreements from "../../../hooks/useAgreements"
import useDeal from "../../../hooks/useDeal"
import useLateFeesSummary from "../../../hooks/useLateFeesSummary"
import useLineOfCreditAgreements from "../../../hooks/useLineOfCreditAgreements"
import useRepaymentPhaseAlert from "../../../hooks/useRepaymentPhaseAlert"
import {
  DetailedAgreementDTODebtProviderEnum,
  LineOfCreditResponseStatusEnum,
} from "../../../services/api/agreements"
import useMissingDocuments from "../hooks/useMissingDocuments"
import LateFeesAlert from "./Notifications/LateFeesAlert"
import LocMissingDocuments from "./Notifications/LocMissingDocuments"
import RepaymentPhaseAlert from "./Notifications/RepaymentPhaseAlert"
import SellersfiNotice from "./Notifications/SellersfiNotice"

const Notifications = () => {
  const { t } = useTranslation("dashboard", { keyPrefix: "notifications" })
  const sellersfiNoticeEnabled = useFlag("JKT-2799-sellersfi-notice")
  const { lateFeesApplicable } = useLateFeesSummary()
  const agreements = useAgreements()
  const { currentLocAgreement } = useLineOfCreditAgreements()
  const documents = useMissingDocuments({
    enabled: !!currentLocAgreement.data?.id,
  })
  const repaymentPhaseData = useRepaymentPhaseAlert()
  const deal = useDeal()

  const notifications = []

  if (lateFeesApplicable) {
    notifications.push(<LateFeesAlert key="late-fees-alert" />)
  }

  if (
    agreements.data?.some(
      (agreement) =>
        agreement.debtProvider === DetailedAgreementDTODebtProviderEnum.Fasanara
    ) &&
    sellersfiNoticeEnabled
  ) {
    notifications.push(<SellersfiNotice key="sellersfi-notice" />)
  }

  if (
    documents.data?.missingDocuments?.length &&
    currentLocAgreement.data?.id &&
    (currentLocAgreement.data.status !==
      LineOfCreditResponseStatusEnum.Paused ||
      deal.inPipeline)
  ) {
    notifications.push(<LocMissingDocuments key="loc-missing-documents" />)
  }

  if (repaymentPhaseData.isVisible) {
    notifications.push(
      <RepaymentPhaseAlert
        key="repayment-phase-alert"
        data={repaymentPhaseData}
      />
    )
  }

  if (notifications.length === 0) {
    return null
  }

  return (
    <Widget
      icon={
        <BoxIcon
          severity="accent-5"
          icon={<HugeiconsIcon icon={Notification02SolidStandard} />}
        />
      }
      title={t("title")}
    >
      <div className="flex flex-col gap-y-4">
        {notifications.map((notification) => notification)}
      </div>
    </Widget>
  )
}

export default Notifications
