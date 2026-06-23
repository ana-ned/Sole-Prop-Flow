import { twMerge } from "tailwind-merge"
import { Transaction } from "../../../services/api/agreements"
import { DateFormat } from "../../../utils/date"
import ListHeader from "../../UI/ListHeader"
import ListItemContainer from "../ListItemContainer"
import TransactionListItem from "../TransactionListItem"

interface TransactionListProps {
  name?: string
  seeAll?: {
    title?: string
    href: string
    state?: { origin: string }
    onClick?: () => void
  }
  data: Transaction[]
  format?: DateFormat
  className?: string
  urlPath: string
  isScheduled?: boolean
}

const TransactionList = ({
  name,
  seeAll,
  data,
  format,
  className,
  urlPath,
  isScheduled,
}: TransactionListProps) => {
  return (
    <div className={twMerge("not-last:mb-6", className, "!mt-5")}>
      {name && (
        <ListHeader
          title={name}
          type="bodyTitle"
          more={
            seeAll
              ? {
                  to: seeAll.href,
                  label: seeAll.title,
                  state: seeAll.state,
                  onClick: seeAll.onClick,
                }
              : undefined
          }
        />
      )}
      <ListItemContainer>
        {data.map((item) => (
          <TransactionListItem
            key={item.id}
            urlPath={urlPath}
            data={item}
            format={format}
            isScheduled={isScheduled}
            eventTracker={{
              category: "transactions",
              name: "transactions-details",
              action: "click",
            }}
          />
        ))}
      </ListItemContainer>
    </div>
  )
}

export default TransactionList
