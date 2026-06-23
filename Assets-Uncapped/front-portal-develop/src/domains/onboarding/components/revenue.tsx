import { HugeiconsIcon } from "@hugeicons/react"
import { ChartUpSolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../components/Basic/BoxIcon"
import { OrganisationOverview } from "../../../services/api/organisation-users"
import { format } from "../../../utils/money"

const Revenue = ({
  isAmazonPartnership,
  organisationData,
}: {
  isAmazonPartnership: boolean
  organisationData?: OrganisationOverview
}) => {
  const { t } = useTranslation("onboarding")
  const revenue = organisationData?.averageMonthlyRevenue

  return (
    <div className="shadow-light-sm border-brand-400 rounded-card-md bg-surface-default flex gap-3 border p-3.5">
      <BoxIcon
        severity="accent-brand"
        icon={<HugeiconsIcon icon={ChartUpSolidStandard} />}
      />
      <p>
        {t("salesConnections.revenue")}
        {!isAmazonPartnership && !!revenue?.amount && !!revenue.currency && (
          <>
            :&nbsp;
            <span className="font-bold">
              {format(revenue.amount, revenue.currency, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </>
        )}
      </p>
    </div>
  )
}

export default Revenue
