import { useTranslation } from "react-i18next"
import formatBankAccountNumber from "../../../domains/connections/utils/bankAccountNumber"
import useBankAccounts from "../../../hooks/useBankAccounts"
import { Account } from "../../../services/api/loan-operations"
import { ReactComponent as BankIcon } from "../../../svgs/bank.svg"
import Card from "../../UI/Card"
import Chip from "../../UI/Chip"
import ListItemInput from "../../UI/ListItemInput"

const BankAccountSelection = ({
  onChange,
  isChecked,
  disabled,
}: {
  onChange: (account: Account) => void
  isChecked: (id: string) => boolean
  disabled: boolean
}) => {
  const { t } = useTranslation("common", { keyPrefix: "BankAccountSelection" })

  const bankAccountsQuery = useBankAccounts()

  if (bankAccountsQuery.isLoading) {
    return null
  }

  return (
    <Card className="pt-0! pb-0!">
      {bankAccountsQuery.data
        ?.filter((item) => !item.personal)
        .map((item) => (
          <ListItemInput
            key={item.id}
            className="border-0! p-0!"
            type="radio"
            icon={<BankIcon />}
            disabled={disabled}
            title={`${
              item.bankName ? `${item.bankName} - ` : ""
            } ${formatBankAccountNumber(item)}`.trim()}
            subtitle={
              item.verified ? (
                <Chip color="success" label={t("verified")} />
              ) : (
                <Chip color="warning" label={t("unverified")} />
              )
            }
            checked={isChecked(item.id!)}
            onChange={() => {
              onChange(item)
            }}
          />
        ))}
    </Card>
  )
}

export default BankAccountSelection
