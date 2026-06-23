import { useTranslation } from "react-i18next"
import ListItemLarge from "../../../components/UI/ListItemLarge"
import {
  DrawResponse,
  DrawResponseStatusEnum,
} from "../../../services/api/agreements"
import { DateFormat, formatDate } from "../../../utils/date"
import { format } from "../../../utils/money"
import { LINE_OF_CREDIT_DOCUMENTS_PATH } from "../constants"
import { getTitle } from "../utils"

const LocListItem = ({ draw }: { draw: DrawResponse }) => {
  const { t } = useTranslation("line-of-credit", { keyPrefix: "LocListItem" })

  const getSubtitle = () => {
    if (
      draw.status === DrawResponseStatusEnum.Closed ||
      draw.status === DrawResponseStatusEnum.Active
    ) {
      return t("activated", {
        date: formatDate(new Date(draw.activationDate!), {
          format: DateFormat.MID,
        }),
      })
    }

    if (draw.status === DrawResponseStatusEnum.Pending) {
      return t("statuses.pending")
    }

    if (draw.status === DrawResponseStatusEnum.Draft) {
      return t("statuses.draft")
    }

    if (draw.status === DrawResponseStatusEnum.WaitingForSignature) {
      return t("statuses.waitingForSignature")
    }

    return ""
  }

  const getUrl = () => {
    if (draw.status === DrawResponseStatusEnum.Pending) {
      return undefined
    }

    if (draw.status === DrawResponseStatusEnum.Draft) {
      return LINE_OF_CREDIT_DOCUMENTS_PATH
    }

    if (draw.status === DrawResponseStatusEnum.WaitingForSignature) {
      return `/line-of-credit/${draw.lineOfCreditId}/draw/${draw.id}/sign`
    }

    return `/loans/${draw.agreementId}`
  }

  return (
    <ListItemLarge
      key={draw.id}
      title={getTitle(draw)}
      subtitle={getSubtitle()}
      href={getUrl()}
      hrefState={{
        backUrl: `/line-of-credit/${draw.lineOfCreditId}`,
        origin:
          draw.status === DrawResponseStatusEnum.Draft
            ? "DRAW_REQUEST"
            : undefined,
        id: draw.id,
      }}
      more={{
        type: "value",
        value:
          draw.size?.amount && draw.size.currency
            ? format(draw.size.amount, draw.size.currency)
            : "",
      }}
    />
  )
}

export default LocListItem
