import { Trans, useTranslation } from "react-i18next"
import formatBankAccountNumber from "../../../domains/connections/utils/bankAccountNumber"
import useBankAccounts from "../../../hooks/useBankAccounts"
import useHubSpotChat from "../../../hooks/useHubSpotChat"
import { ReactComponent as BankIcon } from "../../../svgs/bank.svg"
import { format } from "../../../utils/money"
import Button from "../../Basic/Button"
import ButtonGroup from "../../Basic/ButtonGroup"
import SanitizedHtml from "../../Basic/SanitizedHtml"
import Typography from "../../Basic/Typography"
import ListItemContainer from "../../Collections/ListItemContainer"
import PageLoader from "../../Collections/PageLoader"
import ApiErrorAlert from "../../Functional/ApiErrorAlert"
import Alert from "../../UI/Alert"
import Card from "../../UI/Card"
import Chip from "../../UI/Chip"
import FormLayout from "../../UI/FormLayout/FormLayout"
import ListItemLarge from "../../UI/ListItemLarge"
import PageBar from "../../UI/PageBar"

const DrawDepositMethodFormAmazon = ({
  onSubmit,
  onBack,
  amount,
  currency,
  error = null,
  isLoading,
}: {
  onSubmit: (formData: { accountId: string }) => void
  onBack: () => void
  amount: number
  currency: string
  error?: Response | null
  isLoading?: boolean
}) => {
  const { t } = useTranslation("common", {
    keyPrefix: "DrawDepositMethodFormAmazonVerified",
  })

  const bankAccountsQuery = useBankAccounts()
  const { openChat } = useHubSpotChat()

  if (bankAccountsQuery.isLoading) {
    return <PageLoader />
  }

  const bankAccount = bankAccountsQuery.data?.find((el) => el.partnerVerified)

  return (
    <FormLayout>
      <FormLayout.Content>
        <PageBar
          title={t("title")}
          onClickBack={onBack}
          desktopHeaderType="h4"
        />

        {amount > 0 && (
          <Card className="mb-4">
            <Typography color="neutral-600" className="mb-2">
              {t("advanceAmount")}
            </Typography>
            <Typography type="h4">
              {format(amount, currency, {
                minimumFractionDigits: 0,
              })}
            </Typography>
          </Card>
        )}

        <Typography type="bodyTitle" color="neutral-800" className="mt-4">
          {t("whereWeSend")}
        </Typography>
        <Typography color="neutral-800" className="mb-2">
          <SanitizedHtml as="span" content={t("fundsCanBeSent")} />
        </Typography>
        <ListItemContainer size="sm">
          <ListItemLarge
            icon={<BankIcon />}
            title={
              bankAccount?.bankName
                ? `${bankAccount.bankName} - ${formatBankAccountNumber(bankAccount, { skipMask: true })}`
                : formatBankAccountNumber(bankAccount, { skipMask: true })
            }
            subtitle={<Chip color="success" label={t("verified")} />}
          />
        </ListItemContainer>
        <Alert type="info" className="mt-2">
          <Trans
            i18nKey="DrawDepositMethodFormAmazonVerified.alert"
            ns="common"
            components={{
              cta: (
                // @ts-expect-error children expected
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    openChat()
                  }}
                />
              ),
            }}
          />
        </Alert>

        <ApiErrorAlert className="mt-4" error={error} />
      </FormLayout.Content>
      <FormLayout.Footer>
        <ButtonGroup>
          <Button
            type="button"
            loading={isLoading}
            onClick={() => {
              onSubmit({ accountId: bankAccount?.id! })
            }}
          >
            {t("cta")}
          </Button>
        </ButtonGroup>
      </FormLayout.Footer>
    </FormLayout>
  )
}

export default DrawDepositMethodFormAmazon
