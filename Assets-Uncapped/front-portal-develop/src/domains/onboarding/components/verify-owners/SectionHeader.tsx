import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import Typography from "../../../../components/Basic/Typography"

const SectionHeader = ({
  title,
  onEdit,
  editTitle,
}: {
  title: string
  onEdit?: () => void
  editTitle?: string
}) => {
  const { t } = useTranslation("onboarding")

  return (
    <div className="mt-4 mb-2 flex gap-x-4">
      <div className="flex-1">
        <Typography type="bodyTitle" color="neutral-600">
          {title}
        </Typography>
      </div>
      <div className="w-auto">
        {onEdit && (
          <Button type="button" variant="link" onClick={onEdit}>
            {editTitle ?? t("verifyOwners.reviewForm.edit")}
          </Button>
        )}
      </div>
    </div>
  )
}

export default SectionHeader
