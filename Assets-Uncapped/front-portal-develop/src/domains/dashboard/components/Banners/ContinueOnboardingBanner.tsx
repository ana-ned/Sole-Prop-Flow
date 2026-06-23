import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import Typography from "../../../../components/Basic/Typography"
import MainBanner from "../../../../components/UI/MainBanner"
import { format } from "../../../../utils/money"
import { ONBOARDING_BASE_PATH } from "../../../onboarding/constants"

const ContinueOnboarding = ({
  variant,
  amount,
  currency,
}: {
  variant: "pre-offer" | "post-offer"
  amount: number
  currency: string
}) => {
  const { t } = useTranslation("dashboard", {
    keyPrefix: "banners.continueOnboarding",
  })

  return (
    <MainBanner
      title={
        <>
          <Typography color="white" type="smallCopy">
            {t(`${variant}.title`)}
          </Typography>
          <p className="font-heading my-1 text-5xl font-bold text-white">
            {format(amount, currency, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <Typography type="body" className="grow">
          {t(`${variant}.content`)}
        </Typography>
        <Button
          className="!w-full md:!w-auto md:min-w-60"
          href={ONBOARDING_BASE_PATH}
          variant="tertiary"
        >
          {t("button")}
        </Button>
      </div>
    </MainBanner>
  )
}

export default ContinueOnboarding
