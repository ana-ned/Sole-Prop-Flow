import { HugeiconsIcon } from "@hugeicons/react"
import { Rocket01SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import Button from "../../../../components/Basic/Button"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import MainBanner from "../../../../components/UI/MainBanner"
import ProgressBar from "../../../../components/UI/ProgressBar"
import { CustomerFacingDealDetailsResponseTierEnum } from "../../../../services/api/hubspot"
import { format } from "../../../../utils/money"

const TopUpBanner = ({
  title,
  content,
  amount,
  currency,
  tier,
  onSubmit,
  isPending,
}: {
  title?: string
  content?: string
  amount: number
  currency: string
  tier: CustomerFacingDealDetailsResponseTierEnum
  onSubmit: () => void
  isPending: boolean
}) => {
  const { t } = useTranslation("dashboard", { keyPrefix: "banners.topUp" })

  return (
    <MainBanner
      title={
        <>
          <Typography color="white" type="smallCopy">
            {title ? <SanitizedHtml as="span" content={title} /> : t("title")}
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
      <div className="mb-2">
        <div className="xs:flex-row xs:items-center xs:gap-y-0 flex flex-col gap-x-3 gap-y-2">
          <div className="flex grow gap-x-3">
            <BoxIcon
              icon={<HugeiconsIcon icon={Rocket01SolidStandard} />}
              severity="accent-2"
            />
            <Typography type="bodyTitle">{t("progress")}</Typography>
          </div>
          <Typography className="self-end">
            ETA:{" "}
            <b>{`${tier === CustomerFacingDealDetailsResponseTierEnum.Small ? 24 : 36} hours`}</b>
          </Typography>
        </div>
      </div>
      <ProgressBar color="paused" current={3} total={3} />

      <div className="mt-6 flex flex-col items-center gap-4 md:flex-row">
        <div className="grow">
          {content ? (
            <SanitizedHtml
              className="prose prose-base"
              as="div"
              content={content}
            />
          ) : (
            <Typography type="body">{t("content")}</Typography>
          )}
        </div>
        <Button
          className="!w-full md:!w-auto md:min-w-60"
          type="button"
          onClick={() => {
            onSubmit()
          }}
          loading={isPending}
          variant="tertiary"
        >
          {t("button")}
        </Button>
      </div>
    </MainBanner>
  )
}

export default TopUpBanner
