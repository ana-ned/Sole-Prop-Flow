import { HugeiconsIcon } from "@hugeicons/react"
import { CancelSquareSolidRounded } from "@hugeicons-pro/core-solid-rounded"
import { differenceInDays } from "date-fns"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import MainBanner from "../../../../components/UI/MainBanner"
import ProgressBar from "../../../../components/UI/ProgressBar"
import { lowerCaseFirstLetter } from "../../../../utils/string"

const RejectedBanner = ({
  reason,
  reapplyDate,
}: {
  reason: string
  reapplyDate?: Date
}) => {
  const { t } = useTranslation("dashboard", { keyPrefix: "banners.rejected" })

  return (
    <MainBanner
      title={
        <>
          <Typography color="white" type="h4" className="mb-2">
            {t("title")}
          </Typography>
          <Typography color="white" type="body">
            {t("subtitle", {
              reason: lowerCaseFirstLetter(reason),
            })}
          </Typography>
        </>
      }
    >
      <div className="mb-2">
        <div className="xs:items-center xs:flex-row xs:gap-y-0 flex flex-col gap-x-3 gap-y-2">
          <div className="flex grow gap-x-3">
            <BoxIcon
              icon={<HugeiconsIcon icon={CancelSquareSolidRounded} />}
              severity="accent-5"
            />
            <Typography type="bodyTitle">{t("progressFail")}</Typography>
          </div>
          <Typography className="self-end">{t("status")}</Typography>
        </div>
      </div>
      <ProgressBar stop current={0} total={3} />

      {!!reapplyDate && (
        <Typography type="body" className="mt-4">
          <SanitizedHtml
            as="span"
            content={t("content", {
              days: t("day", {
                count: differenceInDays(reapplyDate, new Date()),
              }),
            })}
          />
        </Typography>
      )}
    </MainBanner>
  )
}

export default RejectedBanner
