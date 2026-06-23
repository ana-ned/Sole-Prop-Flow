import { HugeiconsIcon } from "@hugeicons/react"
import {
  MoneySecuritySolidRounded,
  EyeSolidRounded,
} from "@hugeicons-pro/core-solid-rounded"
import {
  DiscountTag02SolidStandard,
  ChartUpSolidStandard,
  SlidersVerticalSolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import Typography from "../../../../components/Basic/Typography"
import Widget from "../../../../components/UI/Widget"

const iconConfig = [
  { icon: DiscountTag02SolidStandard, color: "accent-10" as const },
  { icon: MoneySecuritySolidRounded, color: "accent-3" as const },
  { icon: ChartUpSolidStandard, color: "accent-11" as const },
  { icon: SlidersVerticalSolidStandard, color: "accent-4" as const },
  { icon: EyeSolidRounded, color: "accent-8" as const },
]

const RefinanceOfferSidebar = () => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers.RefinanceOfferSidebar",
  })

  return (
    <div className="flex w-full flex-col gap-10 text-left">
      <Widget title={t("title")}>
        <div className="flex flex-col gap-6">
          {t("items", {
            returnObjects: true,
          }).map((item, index) => {
            const config = iconConfig[index] || iconConfig[0]
            return (
              <div
                key={`sidebar-item-${item}`}
                className="flex items-start gap-4"
              >
                <BoxIcon
                  severity={config.color}
                  icon={<HugeiconsIcon icon={config.icon} />}
                />
                <Typography type="body" className="flex-1">
                  {item}
                </Typography>
              </div>
            )
          })}
        </div>
      </Widget>
    </div>
  )
}

export default RefinanceOfferSidebar
