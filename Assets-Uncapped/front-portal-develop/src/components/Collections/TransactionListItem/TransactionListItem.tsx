import { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router"
import { TEventTracker } from "../../../hooks/useTracking"
import {
  Transaction,
  TransactionStatusEnum,
  TransactionTypeEnum,
} from "../../../services/api/agreements"
import { ReactComponent as NearMeIcon } from "../../../svgs/near-me.svg"
import { ReactComponent as PaymentIcon } from "../../../svgs/payment.svg"
import { ReactComponent as PaymentsIcon } from "../../../svgs/payments.svg"
import { formatDate, DateFormat } from "../../../utils/date"
import { formatByStatus, isReversed } from "../../../utils/money"
import ListItemLarge from "../../UI/ListItemLarge"

const DEFAULT_FORMAT = DateFormat.DATETIME
const TRANSACTION_ICONS: Record<TransactionTypeEnum, ReactNode> = {
  CARD: <PaymentIcon />,
  INVOICE: <NearMeIcon />,
  CASH: <PaymentsIcon />,
  REFUND: <PaymentsIcon />,
  REPAYMENT: <PaymentsIcon />,
  COLLECTION: <PaymentsIcon />,
}

const getPath = (url: string, data: Transaction) =>
  `${url}${data.account.id.toLowerCase()}/${data.id}`

const getBackgroundColor = (type: TransactionTypeEnum) => {
  if (type === TransactionTypeEnum.Card) {
    return "info-300"
  }

  return "brand-300"
}

const TransactionListItem = ({
  urlPath,
  data,
  format = DEFAULT_FORMAT,
  isScheduled,
  className,
  eventTracker,
}: {
  urlPath: string
  data: Transaction
  format?: DateFormat
  isScheduled?: boolean
  className?: string
  eventTracker?: TEventTracker
}) => {
  const { t } = useTranslation("transactions", {
    keyPrefix: "transactionDetails",
  })
  const location = useLocation()
  const isAlreadyActive = getPath(urlPath, data) === location.pathname
  const isPending = data.status === TransactionStatusEnum.Pending

  const getSubtitle = () => {
    if (isPending) {
      return t("statuses.PENDING")
    }
    if (isScheduled && data.operationScheduledDate) {
      formatDate(new Date(data.operationScheduledDate), {
        format: DateFormat.SHORT,
      })
    }
    return formatDate(new Date(data.createdAt), { format })
  }

  return (
    <ListItemLarge
      title={data.name}
      subtitle={getSubtitle()}
      icon={TRANSACTION_ICONS[data.type]}
      href={isAlreadyActive ? urlPath : getPath(urlPath, data)}
      more={{
        type: "value",
        value: formatByStatus(
          data.status,
          data.transactionAmount.amount!,
          data.transactionAmount.currency!,
          data.type === TransactionTypeEnum.Cash
        ),
        strikethrough: isReversed(data.status),
      }}
      iconColor="primary"
      iconOutlined={isPending}
      iconBackgroundColor={getBackgroundColor(data.type)}
      className={className}
      eventTracker={eventTracker}
    />
  )
}

export default TransactionListItem
