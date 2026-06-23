import { HugeiconsIcon } from "@hugeicons/react"
import { WavingHand02SolidSharp } from "@hugeicons-pro/core-solid-sharp"
import {
  DiscountTag02SolidStandard,
  ChartUpSolidStandard,
  SquareUnlock02SolidStandard,
  MoneySecuritySolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import Typography from "../../../../components/Basic/Typography"
import Widget from "../../../../components/UI/Widget"
import { OfferResponse } from "../../../../services/api/agreements"

const EARLY_REPAYMENT_ITEM_INDEX = 4

const iconConfig = [
  { icon: ChartUpSolidStandard, color: "accent-11" as const },
  { icon: SquareUnlock02SolidStandard, color: "accent-1" as const },
  { icon: DiscountTag02SolidStandard, color: "accent-6" as const },
  { icon: WavingHand02SolidSharp, color: "accent-2" as const },
  { icon: MoneySecuritySolidStandard, color: "accent-3" as const },
]

const LocV2OfferSidebar = ({ offer }: { offer: OfferResponse }) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers.LocV2OfferSidebar",
  })

  const earlyRepaymentAllowed =
    offer.offerDetails?.commonOfferDetails?.earlyRepaymentAllowed

  const items = t("items", { returnObjects: true })
    .map((item, index) => ({ item, icon: iconConfig[index] || iconConfig[0] }))
    .filter((_, index) => {
      if (index === EARLY_REPAYMENT_ITEM_INDEX) return earlyRepaymentAllowed
      return true
    })

  return (
    <div className="flex w-full flex-col gap-10 text-left">
      <Widget title={t("title")}>
        <div className="flex flex-col gap-6">
          {items.map(({ item, icon }, index) => (
            <div key={index} className="flex items-start gap-4">
              <BoxIcon
                severity={icon.color}
                icon={<HugeiconsIcon icon={icon.icon} />}
              />
              <Typography type="body" className="flex-1">
                {item}
              </Typography>
            </div>
          ))}
        </div>
      </Widget>
    </div>
  )
}

export default LocV2OfferSidebar
