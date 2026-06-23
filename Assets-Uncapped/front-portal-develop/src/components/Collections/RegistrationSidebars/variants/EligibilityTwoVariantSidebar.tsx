import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserShield01Icon,
  CursorMagicSelection04Icon,
  MoneyBag02SolidRounded,
} from "@hugeicons-pro/core-solid-rounded"
import {
  ChartUpSolidStandard,
  DiscountTag02SolidStandard,
  SquareUnlock02SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import clsx from "clsx"
import { useTranslation } from "react-i18next"
import { format } from "../../../../utils/money"
import Typography from "../../../Basic/Typography"
import Gradient from "../../../UI/Gradient"

const EligibilityTwoVariantSidebar = ({
  amount,
  currency,
  belowExpectations = false,
  isPreQualified = false,
}: {
  amount: number
  currency: string
  belowExpectations?: boolean
  isPreQualified?: boolean
}) => {
  const { t } = useTranslation("common", {
    keyPrefix: "sidebars.EligibilityTwoVariant",
  })

  const featureTexts = belowExpectations
    ? t("belowExpectations.features", { returnObjects: true })
    : t("features", { returnObjects: true })

  const featureIcons = [
    belowExpectations ? ChartUpSolidStandard : CursorMagicSelection04Icon,
    belowExpectations ? MoneyBag02SolidRounded : ChartUpSolidStandard,
    SquareUnlock02SolidStandard,
    DiscountTag02SolidStandard,
    UserShield01Icon,
  ]

  const featureAccentClasses = [
    belowExpectations
      ? "bg-accent-11-subtle border-accent-11-border text-accent-11-contrast"
      : "bg-accent-3-subtle border-accent-3-border text-accent-3-contrast",
    belowExpectations
      ? "bg-accent-3-subtle border-accent-3-border text-accent-3-contrast"
      : "bg-accent-11-subtle border-accent-11-border text-accent-11-contrast",
    "bg-accent-1-subtle border-accent-1-border text-accent-1-contrast",
    "bg-accent-6-subtle border-accent-6-border text-accent-6-contrast",
    "bg-accent-2-subtle border-accent-2-border text-accent-2-contrast",
  ]

  const features = featureTexts.map((text, index) => ({
    icon: featureIcons[index],
    text,
    accentClass: featureAccentClasses[index],
  }))

  return (
    <Gradient className="flex w-full justify-center py-30">
      <div className="relative z-10 flex w-full max-w-[400px] flex-col gap-10">
        <div className="flex flex-col gap-6 text-center">
          <div className="flex flex-col items-center">
            <Typography type="h5" className="font-heading font-bold text-white">
              {t(isPreQualified ? "titlePreQualified" : "title")}
            </Typography>
            <Typography className="font-heading text-[56px] font-extrabold! text-white">
              {format(amount, currency, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </Typography>
          </div>
          <Typography type="body" className="text-white">
            {t("subtitle")}
          </Typography>
        </div>

        {belowExpectations && (
          <Typography type="h6" className="text-center text-white">
            {t("belowExpectations.title")}
          </Typography>
        )}

        <ul className="flex flex-col gap-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-4">
              <div
                className={clsx(
                  "flex size-6 shrink-0 items-center justify-center rounded-md border p-1",
                  feature.accentClass
                )}
              >
                <HugeiconsIcon icon={feature.icon} size={16} />
              </div>
              <Typography color="white" className="font-semibold">
                {feature.text}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    </Gradient>
  )
}

export default EligibilityTwoVariantSidebar
