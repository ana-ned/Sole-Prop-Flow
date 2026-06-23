import { useId, useState } from "react"
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"
import {
  MoneyExchange03SolidStandard,
  Calendar02SolidStandard,
  ChartUpSolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { KeyboardArrowDown } from "@material-ui/icons"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../Basic/BoxIcon"
import { BoxIconSeverity } from "../../../Basic/BoxIcon/BoxIcon"
import Typography from "../../../Basic/Typography"
import Card from "../../../UI/Card/Card"

const FUNDING_TYPE_KEYS = ["lineOfCredit", "termLoan", "cashAdvance"] as const

type FundingTypeKey = (typeof FUNDING_TYPE_KEYS)[number]

interface FundingTypeConfig {
  key: FundingTypeKey
  icon: IconSvgElement
  severity: keyof typeof BoxIconSeverity
}

const FUNDING_TYPE_CONFIGS: FundingTypeConfig[] = [
  {
    key: "lineOfCredit",
    icon: MoneyExchange03SolidStandard,
    severity: "accent-brand",
  },
  {
    key: "termLoan",
    icon: Calendar02SolidStandard,
    severity: "accent-3",
  },
  {
    key: "cashAdvance",
    icon: ChartUpSolidStandard,
    severity: "accent-2",
  },
]

const FundingTypeItem = ({
  icon,
  severity,
  label,
  bullets,
  closeLabel,
  learnMoreLabel,
}: {
  icon: IconSvgElement
  severity: keyof typeof BoxIconSeverity
  label: string
  bullets: string[]
  closeLabel: string
  learnMoreLabel: string
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const regionId = useId()

  return (
    <div className="px-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={regionId}
        className="flex w-full items-center gap-2 border-none bg-transparent p-0"
      >
        <BoxIcon icon={<HugeiconsIcon icon={icon} />} severity={severity} />
        <Typography type="smallCopy" className="grow text-left font-semibold">
          {label}
        </Typography>
        <span className="text-brand-600 text-sm font-semibold">
          {isOpen ? closeLabel : learnMoreLabel}
        </span>
        <span
          className="text-brand-600 inline-flex transition-transform duration-200"
          style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` }}
        >
          <KeyboardArrowDown fontSize="small" />
        </span>
      </button>
      <div
        id={regionId}
        role="region"
        aria-label={label}
        className={`text-text-secondary max-h-0 overflow-hidden text-sm transition-all duration-200 ${
          isOpen ? "max-h-[500px] pt-1" : "pt-0"
        }`}
      >
        <ul className="list-disc space-y-0.5 py-2 pl-9">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const FundingTypesCard = ({ title }: { title: string }) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "ApplicationBlocked.reapplyForm",
  })

  return (
    <div className="shadow-card-small overflow-hidden rounded-xl">
      <div className="border-b border-neutral-200 bg-white py-3 pr-3 pl-4">
        <Typography type="bodyTitle">{title}</Typography>
      </div>
      <div className="bg-surface-elevated-2 p-3">
        <Card spacing="small" className="space-y-3">
          {FUNDING_TYPE_CONFIGS.map((config) => (
            <FundingTypeItem
              key={config.key}
              icon={config.icon}
              severity={config.severity}
              label={t(`fundingTypes.${config.key}.label`)}
              bullets={
                t(`fundingTypes.${config.key}.bullets`, {
                  returnObjects: true,
                }) as unknown as string[]
              }
              closeLabel={t("fundingTypes.close")}
              learnMoreLabel={t("fundingTypes.learnMore")}
            />
          ))}
        </Card>
      </div>
    </div>
  )
}

export default FundingTypesCard
