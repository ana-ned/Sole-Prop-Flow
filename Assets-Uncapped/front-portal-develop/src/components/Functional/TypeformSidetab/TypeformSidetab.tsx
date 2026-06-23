import { Sidetab, SidetabProps } from "@typeform/embed-react"
import { useTranslation } from "react-i18next"

const TypeformSidetab = ({
  id,
  onSubmit,
  open,
  hidden,
}: Pick<SidetabProps, "id" | "onSubmit" | "open" | "hidden">) => {
  const { t } = useTranslation()

  return (
    <Sidetab
      id={id}
      onSubmit={onSubmit}
      hidden={hidden}
      open={open}
      autoClose={10000}
      buttonText={t("provideFeedbackCta")}
      buttonColor="var(--color-brand-600)"
      buttonTextColor="var(--color-white)"
    />
  )
}

export default TypeformSidetab
