import { HugeiconsIcon } from "@hugeicons/react"
import { AnalyticsUpSolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../../components/Basic/BoxIcon"
import Button from "../../../../../components/Basic/Button"
import Widget from "../../../../../components/UI/Widget"
import BalanceBox from "../../../../transactions/components/BalanceBox"

const LoansWidget = () => {
  const { t } = useTranslation("dashboard", { keyPrefix: "widgets.balances" })

  return (
    <Widget
      icon={
        <BoxIcon
          severity="accent-3"
          icon={<HugeiconsIcon icon={AnalyticsUpSolidStandard} />}
        />
      }
      title={t("loans.title")}
    >
      <div className="flex grow flex-col justify-center text-center">
        <BalanceBox summary />
      </div>

      <Button href="/loans" variant="secondary" className="mt-4">
        {t("loans.button")}
      </Button>
    </Widget>
  )
}

export default LoansWidget
