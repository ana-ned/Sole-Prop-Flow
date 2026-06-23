import { useTranslation } from "react-i18next"
import Button from "../../../components/Basic/Button"

const SkipStepButton = ({
  onClick,
  ctaCopy,
}: {
  onClick: () => Promise<void> | void
  ctaCopy?: string
}) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "SkipStepButton",
  })

  return (
    <Button
      type="button"
      variant="link"
      onClick={async () => {
        await onClick()
      }}
    >
      {ctaCopy || t("cta")}
    </Button>
  )
}

export default SkipStepButton
