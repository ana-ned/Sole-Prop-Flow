import { cva } from "class-variance-authority"
import { useTranslation } from "react-i18next"
import Tooltip from "../../../components/Basic/Tooltip"
import {
  ApplicationDetailsResponse,
  ApplicationDetailsResponseStatusEnum,
  DealDetailsResponseStatusEnum,
} from "../../../services/api/partners"

enum STATUS_VARIANTS {
  DEFAULT = "default",
  INFO = "info",
  WARNING = "warning",
  SUCCESS = "success",
}

const statusBadgeVariants = cva(
  [
    "inline-block py-2 px-4 font-bold",
    "leading-none rounded-full text-neutral-800",
  ],
  {
    variants: {
      variant: {
        [STATUS_VARIANTS.DEFAULT]: ["bg-neutral-300"],
        [STATUS_VARIANTS.INFO]: ["bg-info-300"],
        [STATUS_VARIANTS.WARNING]: ["bg-secondary-300"],
        [STATUS_VARIANTS.SUCCESS]: ["bg-brand-300"],
      },
    },
    defaultVariants: {
      variant: STATUS_VARIANTS.DEFAULT,
    },
  }
)

const statuses = {
  [STATUS_VARIANTS.DEFAULT]: [
    ApplicationDetailsResponseStatusEnum.Draft,
    ApplicationDetailsResponseStatusEnum.NotEligible,
    DealDetailsResponseStatusEnum.ClosedLost,
    DealDetailsResponseStatusEnum.Other,
  ],
  [STATUS_VARIANTS.INFO]: [
    ApplicationDetailsResponseStatusEnum.Submitted,
    DealDetailsResponseStatusEnum.MeetingBooked,
    DealDetailsResponseStatusEnum.Underwriting,
    DealDetailsResponseStatusEnum.RiskDecision,
  ],
  [STATUS_VARIANTS.WARNING]: [DealDetailsResponseStatusEnum.AwaitingData],
  [STATUS_VARIANTS.SUCCESS]: [
    DealDetailsResponseStatusEnum.Offer,
    DealDetailsResponseStatusEnum.DueDiligence,
    DealDetailsResponseStatusEnum.FundsDisbursed,
  ],
}

const getStatusVariant = (status: string): STATUS_VARIANTS => {
  for (const [variant, list] of Object.entries(statuses)) {
    if (list.includes(status as never)) {
      return variant as STATUS_VARIANTS
    }
  }
  return STATUS_VARIANTS.DEFAULT
}

const StatusBadge = ({
  application,
}: {
  application: ApplicationDetailsResponse
}) => {
  const { t } = useTranslation("partner-application", {
    keyPrefix: "statusBadge",
  })

  const status =
    application.dealsDetailsResponse?.at(-1)?.status || application.status

  if (!status) {
    return null
  }

  return (
    <Tooltip place="bottom" content={t(`tooltips.${status}`)}>
      <span
        className={statusBadgeVariants({ variant: getStatusVariant(status) })}
      >
        {t(`statuses.${status}`)}
      </span>
    </Tooltip>
  )
}

export default StatusBadge
