import { ApplicationDetailsResponse } from "../../services/api/partners"
import { formatDate } from "../../utils/date"

export const formatPartnerApplicationDate = (date: Date | undefined) => {
  if (!date) return "-"
  return formatDate(date, {
    customFormat: "dd MMM yyyy",
  })
}

export const getPartnerApplicationTitle = (
  application: ApplicationDetailsResponse
) => {
  return (
    application.organisationDetailsResponse?.businessName ||
    `${application.clientDetailsResponse?.firstName} ${application.clientDetailsResponse?.lastName}`
  )
}
