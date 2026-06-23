import { ReactNode, useEffect } from "react"
import { Trans, useTranslation } from "react-i18next"
import Button from "../../../components/Basic/Button"
import Typography from "../../../components/Basic/Typography"
import ListItemContainer from "../../../components/Collections/ListItemContainer"
import Alert from "../../../components/UI/Alert"
import ListItemLarge from "../../../components/UI/ListItemLarge"
import Modal from "../../../components/UI/Modal/Modal"
import SimpleTable from "../../../components/UI/SimpleTable"
import useAgreements from "../../../hooks/useAgreements"
import useHubSpotChat from "../../../hooks/useHubSpotChat"
import {
  RepaymentLinkedTransaction,
  RepaymentLinkedTransactionStatusEnum,
  DetailedAgreementDTOProductTypeEnum,
  DetailedAgreementDTODetailedProductTypeEnum,
  TransactionDetailsStatusEnum,
  RepaymentsFrequencyEnum,
} from "../../../services/api/agreements/models"
import { ReactComponent as ChevronRightIcon } from "../../../svgs/chevron-right.svg"
import { ReactComponent as ClockIcon } from "../../../svgs/clock.svg"
import { ReactComponent as CloseIcon } from "../../../svgs/close.svg"
import { ReactComponent as ErrorIcon } from "../../../svgs/error.svg"
import { ReactComponent as SentIcon } from "../../../svgs/sent.svg"
import { formatDate, DateFormat } from "../../../utils/date"
import { displayErrorToast } from "../../../utils/error-handling"
import { format, formatAsPercentage } from "../../../utils/money"
import { titleCase } from "../../../utils/string"
import { useTransactionDetails } from "../hooks/useTransactionDetails"

const TRANSACTION_ICONS: Record<
  RepaymentLinkedTransactionStatusEnum,
  ReactNode
> = {
  REQUESTED: <ClockIcon />,
  PENDING: <ClockIcon />,
  PAID: <SentIcon />,
  FAILED: <SentIcon />,
  CANCELLED: <CloseIcon />,
  UNKNOWN: <ErrorIcon />,
}

const getIconColor = (status: RepaymentLinkedTransactionStatusEnum) => {
  if (status === RepaymentLinkedTransactionStatusEnum.Paid) {
    return "neutral-800"
  }
  if (status === RepaymentLinkedTransactionStatusEnum.Failed) {
    return "error-700"
  }

  return "secondary"
}

const getIconBackgroundColor = (
  status: RepaymentLinkedTransactionStatusEnum
) => {
  if (status === RepaymentLinkedTransactionStatusEnum.Paid) {
    return "brand-300"
  }
  if (status === RepaymentLinkedTransactionStatusEnum.Failed) {
    return "error-100"
  }

  return "surface-canvas"
}

const DetailsModal = ({
  transactionId,
  agreementId,
  onClose,
}: {
  transactionId: string
  agreementId: string
  onClose: () => void
}) => {
  const { t } = useTranslation("transactions", {
    keyPrefix: "transactionsV2.DetailsModal",
  })
  const agreements = useAgreements()
  const { openChat } = useHubSpotChat()
  const agreement = agreements.data?.find(
    (agreement) => agreement.id === agreementId
  )

  const { data, error } = useTransactionDetails({
    transactionId,
    agreementId,
  })

  useEffect(() => {
    if (error) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      displayErrorToast(error as unknown as Response)
    }
  }, [error])

  if (!data) {
    return null
  }

  const getRepaymentLabel = (
    frequency: RepaymentsFrequencyEnum | undefined,
    percent: string
  ) => {
    switch (frequency) {
      case RepaymentsFrequencyEnum.Every14Days: {
        return t("rbf.ofYourSalesEvery14Days", { percent })
      }
      case RepaymentsFrequencyEnum.Every15Days: {
        return t("rbf.ofYourSalesEvery15Days", { percent })
      }
      default: {
        return t("rbf.ofYourSalesDefault", {
          percent,
          frequency: titleCase(frequency ?? "").toLocaleLowerCase(),
        })
      }
    }
  }

  const repaymentPercent = formatAsPercentage(
    (data.repaymentDetails?.revenueShareDetails?.revenueSharePercentage ?? 0) *
      100,
    0
  )
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      className="bg-surface-elevated-2 w-[418px]"
    >
      <div className="flex flex-col gap-4">
        <Button
          type="button"
          onClick={onClose}
          variant="secondary"
          className="self-end"
        >
          <CloseIcon onClick={onClose} />
        </Button>
        {agreement?.productType === DetailedAgreementDTOProductTypeEnum.Rbf ? (
          <>
            <SimpleTable
              wrapped
              className="!m-0 !p-3"
              data={[
                {
                  th: t("rbf.period"),
                  td: `${formatDate(data.repaymentDetails?.revenueShareDetails?.repaymentPeriodStartDate!, { format: DateFormat.SMID })} - ${formatDate(data.repaymentDetails?.revenueShareDetails?.repaymentPeriodEndDate!, { format: DateFormat.SMID })}`,
                },
                {
                  th: t("rbf.sales"),
                  td: format(
                    data.repaymentDetails?.revenueShareDetails?.periodRevenue ??
                      0,
                    data.transactionAmount.currency!
                  ),
                },
                {
                  th: t("rbf.repayWith"),
                  td: getRepaymentLabel(
                    agreement.repayments?.frequency,
                    repaymentPercent
                  ),
                },
              ]}
            />
            <SimpleTable
              wrapped
              className="!m-0 !p-3"
              data={[
                {
                  th: t("repaymentDate"),
                  td: formatDate(new Date(data.createdAt), {
                    format: DateFormat.MLONG,
                  }),
                },
                {
                  th: t("amount"),
                  td: format(
                    data.repaymentDetails?.amountDue ?? 0,
                    data.transactionAmount.currency!
                  ),
                },
                {
                  th: t("status"),
                  td: titleCase(data.status),
                },
              ]}
            />
          </>
        ) : (
          <>
            <SimpleTable
              wrapped
              className="!m-0 !p-3"
              data={[
                {
                  th: t("date"),
                  td: formatDate(new Date(data.createdAt), {
                    format: DateFormat.MLONG,
                  }),
                },
                {
                  th: t("repaymentStatus"),
                  td: titleCase(data.status),
                },
              ]}
            />
            <SimpleTable
              wrapped
              className="!m-0 !p-3"
              data={[
                {
                  th: t("repaymentTotal"),
                  td: format(
                    data.transactionAmount.amount ?? 0,
                    data.transactionAmount.currency!
                  ),
                  propertyFontWeight: "bold" as const,
                },
                ...(agreement?.productType ===
                DetailedAgreementDTOProductTypeEnum.InterestRate
                  ? [
                      {
                        th: t("amountDue"),
                        td: format(
                          data.repaymentDetails?.amountDue ?? 0,
                          data.transactionAmount.currency!
                        ),
                        child: true,
                      },
                      {
                        th: t("pastDue"),
                        td: format(
                          data.repaymentDetails?.overdue ?? 0,
                          data.transactionAmount.currency!
                        ),
                        child: true,
                      },
                      {
                        th: t("fees"),
                        td: format(
                          data.repaymentDetails?.lateFeeDetails?.totalCharged ??
                            0,
                          data.transactionAmount.currency!
                        ),
                        child: true,
                      },
                    ]
                  : []),
                ...(agreement?.detailedProductType ===
                DetailedAgreementDTODetailedProductTypeEnum.DailyPayout
                  ? [
                      {
                        th: t("principal"),
                        td: format(
                          data.repaymentDetails?.principal ?? 0,
                          data.transactionAmount.currency!
                        ),
                        child: true,
                      },
                      {
                        th: t("fees"),
                        td: format(
                          data.repaymentDetails?.interest ?? 0,
                          data.transactionAmount.currency!
                        ),
                        child: true,
                      },
                    ]
                  : []),
              ]}
            />
          </>
        )}

        {data.status === TransactionDetailsStatusEnum.Completed &&
          agreement?.productType ===
            DetailedAgreementDTOProductTypeEnum.InterestRate && (
            <SimpleTable
              wrapped
              className="!m-0 !p-3"
              data={[
                {
                  th: t("repaymentBreakdown"),
                  td: format(
                    data.transactionAmount.amount ?? 0,
                    data.transactionAmount.currency!
                  ),
                  propertyFontWeight: "bold" as const,
                },
                {
                  th: t("paidToFees"),
                  td: format(
                    data.repaymentDetails?.fees ?? 0,
                    data.transactionAmount.currency!
                  ),
                  child: true,
                },
                {
                  th: t("paidToInterest"),
                  td: format(
                    data.repaymentDetails?.interest ?? 0,
                    data.transactionAmount.currency!
                  ),
                  child: true,
                },
                {
                  th: t("paidToPrincipal"),
                  td: format(
                    data.repaymentDetails?.principal ?? 0,
                    data.transactionAmount.currency!
                  ),
                  child: true,
                },
              ]}
            />
          )}

        {data.repaymentDetails?.transactionList &&
          data.repaymentDetails.transactionList.length > 0 && (
            <div className="flex flex-col gap-2">
              <Typography type="bodyTitle" className="font-bold">
                {t("linkedTransactions")}
              </Typography>
              <ListItemContainer size="sm">
                {data.repaymentDetails.transactionList.map(
                  (transaction: RepaymentLinkedTransaction) => (
                    <ListItemLarge
                      key={transaction.date?.toISOString()}
                      iconColor={getIconColor(transaction.status!)}
                      iconBackgroundColor={getIconBackgroundColor(
                        transaction.status!
                      )}
                      title={
                        transaction.date
                          ? formatDate(transaction.date, {
                              format: DateFormat.SHORT,
                            })
                          : ""
                      }
                      subtitle={
                        transaction.status ===
                        RepaymentLinkedTransactionStatusEnum.Paid
                          ? t("collected")
                          : titleCase(transaction.status)
                      }
                      icon={TRANSACTION_ICONS[transaction.status!]}
                      more={{
                        type: "value",
                        value: transaction.amount
                          ? format(
                              transaction.amount,
                              data.transactionAmount.currency!
                            )
                          : "",
                      }}
                    />
                  )
                )}
              </ListItemContainer>
            </div>
          )}
        {(data.repaymentDetails?.lateFeeDetails?.totalCharged || 0) > 0 &&
          data.repaymentDetails?.lateFeeDetails?.feeRate &&
          agreement?.productType !==
            DetailedAgreementDTOProductTypeEnum.InterestRate && (
            <div className="flex flex-col gap-2">
              <Typography type="bodyTitle" className="font-bold">
                {t("linkedLateFees")}
              </Typography>
              <Alert
                showIcon={false}
                type="danger"
                title={t("lateFeesAlert.header")}
              >
                <Trans
                  i18nKey="transactionsV2.DetailsModal.lateFeesAlert.copy"
                  ns="transactions"
                  components={{
                    button: (
                      // @ts-expect-error Property 'children' is missing in type
                      <Button type="button" variant="link" onClick={openChat} />
                    ),
                  }}
                />
              </Alert>
              <SimpleTable
                color="neutral-900"
                wrapped
                className="!m-0 !p-3"
                data={[
                  {
                    th: t("dailyLateFee"),
                    td: formatAsPercentage(
                      data.repaymentDetails.lateFeeDetails.feeRate,
                      3
                    ),
                  },
                  {
                    th: t("lateFeeCharges", {
                      count: data.repaymentDetails.lateFeeDetails.numberOfDays,
                    }),
                    td: format(
                      data.repaymentDetails.lateFeeDetails.totalCharged || 0,
                      data.transactionAmount.currency!
                    ),
                  },
                ]}
              />
            </div>
          )}

        <SimpleTable
          className="!m-0 !p-3"
          wrapped
          data={[
            {
              th: t("loanActivationDate"),
              td: formatDate(new Date(agreement?.activationDate!), {
                format: DateFormat.SMID,
              }),
            },
          ]}
        />

        <ListItemContainer size="sm">
          <ListItemLarge
            title={t("viewLoanOverview")}
            more={{
              type: "link",
              element: <ChevronRightIcon />,
            }}
            href={`/loans/${agreementId}`}
          />
        </ListItemContainer>
      </div>
    </Modal>
  )
}

export default DetailsModal
