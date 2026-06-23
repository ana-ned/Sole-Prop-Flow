import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"
import {
  MoneyExchange03SolidStandard,
  ChartUpSolidStandard,
  Chart03SolidStandard,
  DiscountTag02SolidStandard,
  ZapSolidStandard,
  CalendarAdd01SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import {
  MoneySecuritySolidRounded,
  HourglassSolidRounded,
} from "@hugeicons-pro/core-solid-rounded"
import { useTranslation } from "react-i18next"
import useDeal from "../../../../hooks/useDeal"
import { format } from "../../../../utils/money"
import BoxIcon from "../../../Basic/BoxIcon"
import { BoxIconSeverity } from "../../../Basic/BoxIcon/BoxIcon"
import Typography from "../../../Basic/Typography"
import Gradient from "../../../UI/Gradient"

interface BulletConfig {
  icon: IconSvgElement
  severity: keyof typeof BoxIconSeverity
}

const FUNDING_TYPE_KEYS = ["lineOfCredit", "termLoan", "cashAdvance"] as const

type FundingTypeKey = (typeof FUNDING_TYPE_KEYS)[number]

interface FundingTypeConfig {
  key: FundingTypeKey
  bullets: BulletConfig[]
}

const FUNDING_TYPE_CONFIGS: FundingTypeConfig[] = [
  {
    key: "lineOfCredit",
    bullets: [
      { icon: MoneySecuritySolidRounded, severity: "accent-brand" },
      { icon: Chart03SolidStandard, severity: "accent-2" },
      { icon: DiscountTag02SolidStandard, severity: "accent-3" },
    ],
  },
  {
    key: "termLoan",
    bullets: [
      { icon: ZapSolidStandard, severity: "accent-10" },
      { icon: HourglassSolidRounded, severity: "accent-3" },
      { icon: CalendarAdd01SolidStandard, severity: "accent-7" },
    ],
  },
  {
    key: "cashAdvance",
    bullets: [
      { icon: MoneySecuritySolidRounded, severity: "accent-2" },
      { icon: MoneyExchange03SolidStandard, severity: "accent-4" },
      { icon: ChartUpSolidStandard, severity: "accent-3" },
    ],
  },
]

const FundingTypeCard = ({
  label,
  bulletTexts,
  bulletConfigs,
}: {
  label: string
  bulletTexts: string[]
  bulletConfigs: BulletConfig[]
}) => (
  <div className="shadow-dark-sm overflow-hidden rounded-xl border border-white/10 bg-white/10">
    <Typography
      type="bodyTitle"
      className="border-b border-white/5 bg-white/10 px-4 py-3"
      color="white"
    >
      {label}
    </Typography>
    <div className="p-2">
      {bulletConfigs.map((bullet, index) => (
        <div key={index} className="flex items-start gap-3 p-1.5">
          <BoxIcon
            variant="dark"
            severity={bullet.severity}
            icon={<HugeiconsIcon icon={bullet.icon} />}
          />
          <Typography type="smallCopy" className="pt-0.5" color="white">
            {bulletTexts[index]}
          </Typography>
        </div>
      ))}
    </div>
  </div>
)

const EligibilitySidebar = () => {
  const deal = useDeal()
  const { t } = useTranslation("onboarding", {
    keyPrefix: "ApplicationBlocked.reapplyForm",
  })

  return (
    <div className="sticky top-0 h-screen w-full overflow-y-auto">
      <Gradient className="flex min-h-full w-full items-start justify-center py-15">
        <div className="relative z-10 flex w-full max-w-[500px] flex-col gap-6 px-6">
          <div className="flex flex-col gap-6 text-center text-white">
            <div className="leading-[1.3]">
              <Typography type="h6" className="font-bold" color="white">
                {t("eligibility.heading")}
              </Typography>
              <Typography type="h1" className="font-extrabold" color="white">
                {format(
                  deal.data?.amount?.amount ?? 0,
                  deal.data?.amount?.currency ?? "USD",
                  {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }
                )}
              </Typography>
            </div>
            <Typography
              type="body"
              className="mx-auto max-w-[400px] leading-normal"
              color="white"
            >
              {t("eligibility.subtext")}
            </Typography>
          </div>

          <div className="space-y-4">
            {FUNDING_TYPE_CONFIGS.map((config) => (
              <FundingTypeCard
                key={config.key}
                label={t(`fundingTypes.${config.key}.label`)}
                bulletTexts={t(`fundingTypes.${config.key}.bullets`, {
                  returnObjects: true,
                })}
                bulletConfigs={config.bullets}
              />
            ))}
          </div>
        </div>
      </Gradient>
    </div>
  )
}

export default EligibilitySidebar
