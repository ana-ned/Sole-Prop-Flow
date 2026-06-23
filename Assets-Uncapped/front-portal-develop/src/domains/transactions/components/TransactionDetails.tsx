import React from "react"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router"
import Typography from "../../../components/Basic/Typography"
import ApiErrorAlert from "../../../components/Functional/ApiErrorAlert"
import ContentDivider from "../../../components/UI/ContentDivider"
import Loader from "../../../components/UI/Loader"
import SimpleTable from "../../../components/UI/SimpleTable"
import useAgreements from "../../../hooks/useAgreements"
import useAuth from "../../../hooks/useAuth"
import useDevice from "../../../hooks/useDevice"
import {
  TransactionDetailsStatusEnum,
  TransactionsApi,
  TransactionTypeEnum,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { formatDate, DateFormat } from "../../../utils/date"
import { formatByStatus, format, isReversed } from "../../../utils/money"
import { titleCase } from "../../../utils/string"
import { transactionQueryKeys } from "../queries"
import sortFees from "../utils/sortFees"
import { formatLoanInfo } from "../utils/transacations"

const InfoHeader = ({ children }: { children: React.ReactNode }) => (
  <Typography type="body" color="neutral-600">
    {children}
  </Typography>
)

const InfoValue = ({ children }: { children: React.ReactNode }) => (
  <Typography type="body" className="not-last:mb-4">
    {children}
  </Typography>
)

const TransactionDetails = ({
  ids,
}: {
  ids?: {
    transactionId: string
    accountId: string
  }
}) => {
  const { t } = useTranslation("transactions", {
    keyPrefix: "transactionDetails",
  })
  const { isDesktop } = useDevice()
  const { isAuthenticated, getToken, organisation } = useAuth()
  const params = useParams<{ accountId: string; transactionId: string }>()

  const computedIds = ids || params

  const { isLoading, isError, data, error } = useQuery({
    queryKey: transactionQueryKeys.detail(
      computedIds.accountId!,
      computedIds.transactionId!
    ),
    queryFn: async () =>
      new TransactionsApi(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getTransactionById({
        accountId: computedIds.accountId!,
        transactionId: computedIds.transactionId!,
        xXORGID: organisation?.organisationId!,
      }),
    enabled: isAuthenticated && !!organisation?.organisationId,
    retry: 1,
  })

  const description = data?.description || ""
  const prefix = "Existing balance payoff for"
  const agreementId = description.toLowerCase().includes(prefix.toLowerCase())
    ? description.split(" ").pop()
    : undefined

  const { data: agreements } = useAgreements()
  const agreementData = agreements?.find(
    (agreement) => agreement.id === agreementId
  )

  if (isError) {
    return (
      <ApiErrorAlert error={error as unknown as Response} className="mt-3" />
    )
  }

  if (isLoading || !data) {
    return <Loader />
  }

  const isFX = !!data.originalAmount && !!data.transactionAmount

  return (
    <>
      <Typography
        type="h4"
        className={isDesktop ? "mt-4" : "mt-8"}
        strikethrough={isReversed(data.status)}
      >
        {formatByStatus(
          data.status,
          data.transactionAmount.amount || 0,
          data.transactionAmount.currency!,
          data.type === TransactionTypeEnum.Cash
        )}
      </Typography>
      <Typography type="bodyTitle">{data.name}</Typography>
      {data.status !== TransactionDetailsStatusEnum.Pending && (
        <Typography type="smallCopy" color="neutral-600">
          {formatDate(new Date(data.createdAt), {
            format: DateFormat.DATETIME,
          })}
        </Typography>
      )}

      <SimpleTable
        className="mt-6"
        wrapped
        data={[
          {
            th: t("status"),
            td: t(`statuses.${data.status}`, {
              defaultValue: titleCase(data.status),
            }),
          },
        ]}
      />

      {data.status === TransactionDetailsStatusEnum.Pending &&
        !!data.operationScheduledDate && (
          <SimpleTable
            wrapped
            data={[
              {
                th: t("sendDate"),
                td: formatDate(data.operationScheduledDate, {
                  format: DateFormat.LONG,
                }),
              },
            ]}
          />
        )}

      {!!data.declineReason && (
        <ContentDivider>
          <InfoHeader>{t("reason")}</InfoHeader>
          <InfoValue>{data.declineReason}</InfoValue>
        </ContentDivider>
      )}

      {!!data.description && (
        <ContentDivider>
          <InfoHeader>{t("reference")}</InfoHeader>
          <InfoValue>
            {agreementData
              ? `Existing balance payoff for ${formatLoanInfo(agreementData)}`
              : data.description}
          </InfoValue>
        </ContentDivider>
      )}

      {data.counterparty && (
        <ContentDivider>
          {!!data.counterparty.accountNumber && (
            <>
              <InfoHeader>{t("accountNumber")}</InfoHeader>
              <InfoValue>{data.counterparty.accountNumber}</InfoValue>
            </>
          )}
          {!!data.counterparty.accountIban && (
            <>
              <InfoHeader>{t("accountIban")}</InfoHeader>
              <InfoValue>{data.counterparty.accountIban}</InfoValue>
            </>
          )}
          {!!data.counterparty.accountSwiftBic && (
            <>
              <InfoHeader>{t("accountSwiftBic")}</InfoHeader>
              <InfoValue>{data.counterparty.accountSwiftBic}</InfoValue>
            </>
          )}
          {!!data.counterparty.routingNumber && (
            <>
              <InfoHeader>{t("routingNumber")}</InfoHeader>
              <InfoValue>{data.counterparty.routingNumber}</InfoValue>
            </>
          )}
          {!!data.counterparty.sortCode && (
            <>
              <InfoHeader>{t("sortCode")}</InfoHeader>
              <InfoValue>{data.counterparty.sortCode}</InfoValue>
            </>
          )}
        </ContentDivider>
      )}

      <SimpleTable
        wrapped
        data={[
          ...(isFX
            ? [
                {
                  th: t("amount"),
                  td: format(
                    data.originalAmount?.amount!,
                    data.originalAmount?.currency!
                  ),
                },
              ]
            : []),
          {
            th: isFX ? t("convertedAmount") : t("amount"),
            td: format(
              data.transactionAmount.amount!,
              data.transactionAmount.currency!
            ),
          },
          ...sortFees(data.fees).map((fee) => ({
            th: t(`fees.${fee.type}`, {
              defaultValue: titleCase(fee.type),
            }),
            td: format(fee.value.amount || 0, fee.value.currency!),
          })),
          {
            th: t("total"),
            td: format(
              data.totalAmount.amount || 0,
              data.totalAmount.currency!
            ),
            fontWeight: "bold",
          },
        ]}
      />
    </>
  )
}

export default TransactionDetails
