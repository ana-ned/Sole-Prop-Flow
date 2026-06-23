import { HugeiconsIcon } from "@hugeicons/react"
import { Rocket01SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import RegistrationLayout from "../../../../domains/registration/components/RegistrationLayout/RegistrationLayout"
import { useTracking } from "../../../../hooks/useTracking"
import useTrackExperiment from "../../../../hooks/useTrackExperiment"
import SanitizedHtml from "../../../Basic/SanitizedHtml"
import Typography from "../../../Basic/Typography"
import Notice from "../../../UI/Notice"
import EligibilitySidebar from "./EligibilitySidebar"
import ReapplyForm from "./ReapplyForm"
import { ReapplyFormData } from "./reapplyFormSchema"
import ReapplySidebar from "./ReapplySidebar"

interface ReapplicationScreenProps {
  variant: "A" | "B"
  title: string
  onReapply?: (data: ReapplyFormData) => void
  isReapplyLoading?: boolean
}

const ReapplicationScreen = ({
  variant,
  title,
  onReapply,
  isReapplyLoading,
}: ReapplicationScreenProps) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "ApplicationBlocked",
  })
  const { trackEvent } = useTracking()
  const { trackExperimentConverted } = useTrackExperiment()

  const handleReapply = (data: ReapplyFormData) => {
    trackEvent({
      category: "onboarding",
      name: "reapplication",
      action: "submit",
      customFields: { variant },
    })
    trackExperimentConverted(
      "ROME-1672-eligibility-sidebar-reapplication-screens",
      variant
    )
    onReapply?.(data)
  }

  const sidebar = variant === "A" ? <ReapplySidebar /> : <EligibilitySidebar />

  const header =
    variant === "A" ? (
      <div className="mb-6">
        <Typography type="h4">{title}</Typography>
        <Typography
          type="body"
          className="text-text-secondary mt-3 leading-normal"
        >
          <SanitizedHtml as="span" content={t("reapplyForm.description")} />
        </Typography>
      </div>
    ) : (
      <div className="mb-6">
        <Typography type="h4">{title}</Typography>

        <div className="mt-6">
          <Notice
            variant="brand"
            className="items-start"
            icon={<HugeiconsIcon icon={Rocket01SolidStandard} size={16} />}
          >
            <SanitizedHtml as="span" content={t("reapplyForm.description")} />
          </Notice>
        </div>
      </div>
    )

  return (
    <RegistrationLayout sidebar={sidebar}>
      <ReapplyForm
        header={header}
        onReapply={handleReapply}
        isReapplyLoading={isReapplyLoading}
        showFundingTypesCard={variant === "A"}
      />
    </RegistrationLayout>
  )
}

export default ReapplicationScreen
