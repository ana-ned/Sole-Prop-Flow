import { HugeiconsIcon } from "@hugeicons/react"
import {
  AnalyticsUpSolidStandard,
  CreditCardAddSolidStandard,
  DiscountTag02SolidStandard,
  UserShield01SolidStandard,
  Forward02SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import Typography from "../../../../components/Basic/Typography"
import Widget from "../../../../components/UI/Widget"

const iconConfig = [
  { icon: AnalyticsUpSolidStandard, color: "accent-11" as const },
  { icon: CreditCardAddSolidStandard, color: "accent-1" as const },
  { icon: DiscountTag02SolidStandard, color: "accent-6" as const },
  { icon: UserShield01SolidStandard, color: "accent-2" as const },
  { icon: Forward02SolidStandard, color: "accent-3" as const },
]

const WhyWeBetterCard = ({
  isLoCOffer,
  className,
}: {
  isLoCOffer: boolean
  className?: string
}) => {
  const { t } = useTranslation("onboarding")

  return (
    <Widget title={t("offers.whyWeBetter.title")} className={className}>
      <div className="flex flex-col gap-6">
        {t(`offers.whyWeBetter.${isLoCOffer ? "itemsLoc" : "items"}`, {
          returnObjects: true,
        }).map((item, index) => {
          const config = iconConfig[index] || iconConfig[0]
          return (
            <div key={index} className="flex items-start gap-4">
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
  )
}

export default WhyWeBetterCard
