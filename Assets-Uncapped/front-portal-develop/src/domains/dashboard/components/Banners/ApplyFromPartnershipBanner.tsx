import { UseMutationResult } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import Button from "../../../../components/Basic/Button"
import Typography from "../../../../components/Basic/Typography"
import MainBanner from "../../../../components/UI/MainBanner"
import { format } from "../../../../utils/money"

const ApplyFromPartnershipBanner = ({
  amount,
  currency,
  mutation,
}: {
  amount: number
  currency: string
  mutation: UseMutationResult<unknown, Error, void>
}) => {
  const { t } = useTranslation("dashboard", {
    keyPrefix: "banners.applyFromPartnership",
  })
  const navigate = useNavigate()

  return (
    <MainBanner
      title={
        <>
          <Typography color="white" type="smallCopy">
            {t("title")}
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
          {t("content")}
        </Typography>
        <Button
          className="!w-full md:!w-auto md:min-w-60"
          type="button"
          onClick={async () => {
            await mutation.mutateAsync()
            await navigate("/onboarding")
          }}
          loading={mutation.isPending}
          variant="tertiary"
        >
          {t("button")}
        </Button>
      </div>
    </MainBanner>
  )
}

export default ApplyFromPartnershipBanner
