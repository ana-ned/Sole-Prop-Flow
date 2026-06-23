import { useTranslation } from "react-i18next"

const NextSteps = () => {
  const { t } = useTranslation("onboarding")

  return (
    <ol className="ol-primary text-neutral-800">
      {t("signing.nextSteps", {
        returnObjects: true,
      }).map((item) => (
        <li className="mt-4" key={item}>
          {item}
        </li>
      ))}
    </ol>
  )
}

export default NextSteps
