import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar02SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../../components/Basic/BoxIcon"
import Button from "../../../../../components/Basic/Button"
import Widget from "../../../../../components/UI/Widget"
import useHubSpotChat from "../../../../../hooks/useHubSpotChat"
import OverdueBox from "../../../../transactions/components/OverdueBox"

const OverdueRepaymentsWidget = () => {
  const { t } = useTranslation("dashboard", { keyPrefix: "widgets.balances" })
  const { openChat } = useHubSpotChat()

  return (
    <Widget
      icon={
        <BoxIcon
          severity="accent-5"
          icon={<HugeiconsIcon icon={Calendar02SolidStandard} />}
        />
      }
      title={t("overdueRepayments.title")}
    >
      <div className="flex grow flex-col items-center gap-y-1 text-center">
        <OverdueBox summary />
      </div>
      <Button
        type="button"
        variant="secondary"
        className="mt-4"
        onClick={() => {
          openChat()
        }}
      >
        {t("overdueRepayments.button")}
      </Button>
    </Widget>
  )
}

export default OverdueRepaymentsWidget
