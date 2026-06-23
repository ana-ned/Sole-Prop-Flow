import { useEffect, useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import * as yup from "yup"
import useAuth from "../../../hooks/useAuth"
import useBankAccounts from "../../../hooks/useBankAccounts"
import useHubSpotChat from "../../../hooks/useHubSpotChat"
import {
  AccountLockApi,
  AccountVerificationApi,
} from "../../../services/api/amazon-gateway"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { format } from "../../../utils/money"
import BetweenLength from "../../../utils/validator-rules/between-length"
import OnlyDigits from "../../../utils/validator-rules/only-digits"
import Button from "../../Basic/Button"
import ButtonGroup from "../../Basic/ButtonGroup"
import SanitizedHtml from "../../Basic/SanitizedHtml"
import Typography from "../../Basic/Typography"
import PageLoader from "../../Collections/PageLoader"
import FormControl from "../../Forms/FormControl"
import Input from "../../Forms/Input"
import ApiErrorAlert from "../../Functional/ApiErrorAlert"
import Alert from "../../UI/Alert"
import Card from "../../UI/Card"
import FormLayout from "../../UI/FormLayout/FormLayout"
import PageBar from "../../UI/PageBar"
import SimpleTable from "../../UI/SimpleTable"

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
    keyPrefix: "DrawDepositMethodFormAmazon",
  })
  const auth = useAuth()
  const [shouldRefetch, setShouldRefetch] = useState<boolean>()
  const { openChat } = useHubSpotChat()

  const bankAccountsQuery = useBankAccounts({
    refetchInterval: shouldRefetch ? 500 : false,
  })

  const { control, handleSubmit, formState, setError } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        accountNumber: yup
          .string()
          .trim()
          .test(OnlyDigits())
          .test(BetweenLength(6, 17))
          .required(),
      })
    ),
    mode: "onBlur",
  })

  const lockQuery = useQuery({
    queryKey: ["ACCOUNT_LOCK", auth.organisation?.organisationId],
    queryFn: async () =>
      new AccountLockApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.AmazonGateway,
        })
      ).getAccountLockForOrganisation({
        xXORGID: auth.organisation?.organisationId!,
      }),
    enabled: auth.isAuthenticated && !!auth.organisation?.organisationId,
  })

  const checkAccountMutation = useMutation({
    mutationFn: async (params: { accountNumber: string; sortCode: string }) =>
      new AccountVerificationApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.AmazonGateway,
        })
      ).verifyAccount({
        xXORGID: auth.organisation?.organisationId!,
        accountVerificationRequest: {
          accountNumber: params.accountNumber,
          sortCode: params.sortCode,
        },
      }),
    onSuccess: (data) => {
      // if bank account number is the same as the one locked
      // be is adding that bank account to our bank list and we need to refetch it
      if (data.result) {
        setShouldRefetch(true)
      } else {
        setError(
          "accountNumber",
          {
            type: "custom",
            message: t("verificationError"),
          },
          { shouldFocus: true }
        )
      }
    },
  })

  useEffect(() => {
    // if we find the verified bank account after adding
    // we submit it for cash request
    const verifiedAccountId = bankAccountsQuery.data?.find(
      (account) => account.partnerVerified
    )?.id
    if (verifiedAccountId) {
      onSubmit({
        accountId: verifiedAccountId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bankAccountsQuery.data])

  if (bankAccountsQuery.isLoading || shouldRefetch || lockQuery.isLoading) {
    return <PageLoader />
  }

  return (
    <FormLayout>
      <form
        onSubmit={handleSubmit(async (formData) => {
          await checkAccountMutation.mutateAsync({
            accountNumber: formData.accountNumber,
            sortCode: lockQuery.data?.bankIdCode!,
          })
        })}
      >
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

          <Typography type="bodyTitle" className="mt-4" color="neutral-800">
            {t("confirmBankDetails")}
          </Typography>
          <Typography color="neutral-800" className="mb-2">
            <SanitizedHtml
              as="span"
              content={t("fundsCanBeSent", {
                accountNumber: lockQuery.data?.accountTail,
              })}
            />
          </Typography>
          <FormControl>
            <Input
              placeholder={t("accountNumber", {
                accountNumber: lockQuery.data?.accountTail,
              })}
              name="accountNumber"
              control={control}
            />
          </FormControl>
          <Card>
            <SimpleTable
              data={[
                ...(lockQuery.data?.bankName
                  ? [
                      {
                        th: t("bank"),
                        td: <Typography>{lockQuery.data.bankName}</Typography>,
                      },
                    ]
                  : []),
                {
                  th: t("routingNumber"),
                  td: <Typography>{lockQuery.data?.bankIdCode}</Typography>,
                },
              ]}
            />
          </Card>

          <Alert type="info" className="mt-2">
            <Trans
              i18nKey="DrawDepositMethodFormAmazon.alert"
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
              type="submit"
              loading={isLoading || checkAccountMutation.isPending}
              disabled={!formState.isValid}
            >
              {t("cta")}
            </Button>
          </ButtonGroup>
        </FormLayout.Footer>
      </form>
    </FormLayout>
  )
}

export default DrawDepositMethodFormAmazon
