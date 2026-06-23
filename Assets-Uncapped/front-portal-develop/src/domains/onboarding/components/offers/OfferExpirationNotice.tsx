import { HugeiconsIcon } from "@hugeicons/react"
import { DateTimeSolidStandard } from "@hugeicons-pro/core-solid-standard"
import { differenceInDays, isPast } from "date-fns"
import { useTranslation } from "react-i18next"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Notice from "../../../../components/UI/Notice"
import { OfferResponse } from "../../../../services/api/agreements"
import { DateFormat, formatDate } from "../../../../utils/date"

interface OfferExpirationNoticeProps {
  offer: OfferResponse
}

const OfferExpirationNotice = ({ offer }: OfferExpirationNoticeProps) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers",
  })

  if (!offer.expirationDate) {
    return null
  }

  const isExpired = isPast(offer.expirationDate)
  const daysLeft = differenceInDays(offer.expirationDate, new Date())
  const formattedExpirationDate = formatDate(offer.expirationDate, {
    format: DateFormat.MID,
  })

  if (isExpired) {
    return (
      <Notice
        variant="danger"
        icon={<HugeiconsIcon icon={DateTimeSolidStandard} />}
      >
        <SanitizedHtml
          as="p"
          content={t("offerExpiredOn", {
            date: formattedExpirationDate,
          })}
        />
      </Notice>
    )
  }

  return (
    <Notice
      variant="warning"
      icon={<HugeiconsIcon icon={DateTimeSolidStandard} />}
    >
      <SanitizedHtml
        as="p"
        content={t("offerExpiresIn", {
          days: daysLeft,
          date: formattedExpirationDate,
        })}
      />
    </Notice>
  )
}

export default OfferExpirationNotice
