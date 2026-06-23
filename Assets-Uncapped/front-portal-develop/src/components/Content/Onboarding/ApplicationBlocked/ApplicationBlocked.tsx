import { useFlag, useFlagsStatus } from "@unleash/proxy-client-react"
import { useTranslation } from "react-i18next"
import PageLoader from "../../../../components/Collections/PageLoader"
import OnboardingLayout from "../../../../domains/onboarding/components/OnboardingLayout"
import { useTrackExperimentViewed } from "../../../../hooks/useTrackExperiment"
import { ReasonDetailsTypeEnum } from "../../../../services/api/hubspot"
import { formatDate } from "../../../../utils/date"
import { lowerCaseFirstLetter } from "../../../../utils/string"
import Button from "../../../Basic/Button"
import ButtonGroup from "../../../Basic/ButtonGroup"
import SanitizedHtml from "../../../Basic/SanitizedHtml"
import Typography from "../../../Basic/Typography"
import LogoOnlyMenu from "../../../UI/LogoOnlyMenu"
import PageBar from "../../../UI/PageBar"
import ReapplicationScreen from "./ReapplicationScreen"
import { ReapplyFormData } from "./reapplyFormSchema"
import RejectedImage from "./assets/rejected.webp"

const VARIANT_CONFIG = {
  expired: {
    titleKey: "expired.title",
    contentKey: "expired.content",
  },
  rejectedWithReapply: {
    titleKey: "rejectedWithReapply.title",
    contentKey: "rejectedWithReapply.content",
  },
  lost: {
    titleKey: "lost.title",
    contentKey: "lost.content",
  },
  rejected: {
    titleKey: "rejected.title",
    contentKey: "rejected.content",
  },
} as const

const getVariant = (type: ReasonDetailsTypeEnum, canReapply?: boolean) => {
  if (type === ReasonDetailsTypeEnum.Expired) return "expired"
  if (type === ReasonDetailsTypeEnum.Rejected && canReapply)
    return "rejectedWithReapply"
  if (type === ReasonDetailsTypeEnum.Lost) return "lost"
  return "rejected"
}

const RejectedView = ({
  reason,
  type,
  reapplyDate,
  canReapply,
  onReapply,
  isReapplyLoading,
}: ApplicationBlockedProps) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "ApplicationBlocked",
  })

  const config = VARIANT_CONFIG[getVariant(type, canReapply)]
  const title = t(config.titleKey)

  return (
    <OnboardingLayout menu={<LogoOnlyMenu withLogout />}>
      <OnboardingLayout.Parent
        pageBar={<PageBar title={title} withChat desktopHeaderType="h4" />}
      >
        <img src={RejectedImage} alt={title} className="mx-auto mb-4" />

        <div className="flex flex-col gap-y-4">
          {t(config.contentKey, {
            returnObjects: true,
          }).map((item) => {
            if (!reapplyDate && item.includes("{{reapplyDate}}")) {
              return null
            }

            if (!reason && item.includes("{{reason}}")) {
              item = item.replace(" because {{reason}}", "")
            }

            return (
              <Typography key={item}>
                <SanitizedHtml
                  as="span"
                  content={item
                    .replace(
                      "{{reason}}",
                      reason
                        ? lowerCaseFirstLetter(reason).replace(/\.+$/, "")
                        : ""
                    )
                    .replace(
                      "{{reapplyDate}}",
                      reapplyDate ? formatDate(reapplyDate) : ""
                    )}
                />
              </Typography>
            )
          })}
        </div>

        {canReapply && (
          <ButtonGroup withMargin>
            <Button
              type="button"
              onClick={() => onReapply?.()}
              loading={isReapplyLoading}
            >
              {t("reapplyButton")}
            </Button>
          </ButtonGroup>
        )}
      </OnboardingLayout.Parent>
    </OnboardingLayout>
  )
}

interface ApplicationBlockedProps {
  reason?: string
  type: ReasonDetailsTypeEnum
  reapplyDate?: Date
  canReapply?: boolean
  onReapply?: (data?: ReapplyFormData) => void
  isReapplyLoading?: boolean
}

const ApplicationBlocked = (props: ApplicationBlockedProps) => {
  const { type, canReapply, onReapply, isReapplyLoading } = props
  const { t } = useTranslation("onboarding", {
    keyPrefix: "ApplicationBlocked",
  })
  const isEligibilitySidebar = useFlag(
    "ROME-1672-eligibility-sidebar-reapplication-screens"
  )
  const { flagsReady } = useFlagsStatus()

  const variant = getVariant(type, canReapply)

  useTrackExperimentViewed({
    name: "ROME-1672-eligibility-sidebar-reapplication-screens",
    variant: isEligibilitySidebar ? "B" : "A",
    enabled: variant !== "rejected",
  })

  if (variant === "rejected") {
    return <RejectedView {...props} />
  }

  if (!flagsReady) {
    return <PageLoader />
  }

  const config = VARIANT_CONFIG[variant]
  const title = t(config.titleKey)

  return (
    <ReapplicationScreen
      variant={isEligibilitySidebar ? "B" : "A"}
      title={title}
      onReapply={onReapply}
      isReapplyLoading={isReapplyLoading}
    />
  )
}

export default ApplicationBlocked
