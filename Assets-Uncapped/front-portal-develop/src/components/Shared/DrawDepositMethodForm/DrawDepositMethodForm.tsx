import useBankAccounts from "../../../hooks/useBankAccounts"
import useDeal from "../../../hooks/useDeal"
import { OfferResponse } from "../../../services/api/agreements"
import PageLoader from "../../Collections/PageLoader"
import DrawDepositMethodFormAmazon from "./DrawDepositMethodFormAmazon"
import DrawDepositMethodFormAmazonVerified from "./DrawDepositMethodFormAmazonVerified"
import DrawDepositMethodFormRegular, {
  DrawDepositMethodFormSchema,
} from "./DrawDepositMethodFormDefault"

const DrawDepositMethodForm = ({
  onSubmit,
  onBack,
  onDelete,
  onAddBankAccount,
  onSkip,
  amount,
  currency,
  error = null,
  isLoc = true,
  isLoading,
  offer,
}: {
  onSubmit: (formData: DrawDepositMethodFormSchema) => void
  onBack: () => void
  onAddBankAccount: (
    formValues: DrawDepositMethodFormSchema | { accountId: string }
  ) => void
  onDelete?: () => void
  amount: number
  currency: string
  error?: Response | null
  isLoc?: boolean
  onSkip?: () => void
  isLoading?: boolean
  offer?: OfferResponse
}) => {
  const bankAccountsQuery = useBankAccounts()
  const deal = useDeal()

  if (bankAccountsQuery.isLoading || deal.isLoading) {
    return <PageLoader />
  }

  const hasPartnerVerifiedAccount = bankAccountsQuery.data?.some(
    (el) => el.partnerVerified
  )

  // Customers coming from seller portal will have only amazon bank account connecected
  if (deal.hasAmazonPartnerOffer) {
    return hasPartnerVerifiedAccount ? (
      <DrawDepositMethodFormAmazonVerified
        onSubmit={onSubmit}
        onBack={onBack}
        amount={amount}
        currency={currency}
        error={error}
        isLoading={isLoading}
      />
    ) : (
      <DrawDepositMethodFormAmazon
        onSubmit={onSubmit}
        onBack={onBack}
        amount={amount}
        currency={currency}
        error={error}
        isLoading={isLoading}
      />
    )
  }

  return (
    <DrawDepositMethodFormRegular
      onSubmit={onSubmit}
      onBack={onBack}
      onAddBankAccount={onAddBankAccount}
      onDelete={onDelete}
      amount={amount}
      currency={currency}
      error={error}
      isLoc={isLoc}
      isLoading={isLoading}
      onSkip={onSkip}
      offer={offer}
    />
  )
}

export default DrawDepositMethodForm
