import { HugeiconsIcon } from "@hugeicons/react"
import { BubbleChatSolidRounded } from "@hugeicons-pro/core-solid-rounded"
import { useTranslation } from "react-i18next"
import Notice from "../../../../components/UI/Notice"

const DocumentCustomMessage = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation("onboarding")

  if (!children) {
    return null
  }

  return (
    <Notice
      title={t("documents.customMessageTitle")}
      icon={<HugeiconsIcon icon={BubbleChatSolidRounded} />}
      variant="info"
      className="whitespace-pre-wrap"
    >
      {children}
    </Notice>
  )
}

export default DocumentCustomMessage
