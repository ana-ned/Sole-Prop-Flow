import { useState, useMemo } from "react"
import { ChevronRight } from "@material-ui/icons"
import queryString from "query-string"
import { useTranslation } from "react-i18next"
import { Navigate, useLocation, useNavigate } from "react-router"
import Typography from "../../../components/Basic/Typography"
import Chip from "../../../components/UI/Chip"
import Dropdown from "../../../components/UI/Dropdown"
import { Option } from "../../../components/UI/Dropdown/Dropdown"
import DropdownMenu from "../../../components/UI/DropdownMenu/DropdownMenu"
import Layout from "../../../components/UI/Layout"
import Loader from "../../../components/UI/Loader"
import PortalMenu from "../../../components/UI/PortalMenu"
import useAgreements from "../../../hooks/useAgreements"
import useAllTransactions from "../../../hooks/useAllTransactions"
import useLateFeesSummary from "../../../hooks/useLateFeesSummary"
import {
  GetAllTransactionsExecutionTypesEnum,
  DetailedAgreementDTOStatusEnum,
  TransactionTypeEnum,
  DetailedAgreementDTOReasonForClosingEnum,
  DetailedAgreementDTO,
} from "../../../services/api/agreements"
import { ReactComponent as ClockIcon } from "../../../svgs/clock.svg"
import { ReactComponent as DownloadIcon } from "../../../svgs/download.svg"
import { ReactComponent as MoreIcon } from "../../../svgs/more-horiz.svg"
import { DateFormat, formatDate } from "../../../utils/date"
import { formatByStatus } from "../../../utils/money"
import { titleCase } from "../../../utils/string"
import BalanceBox from "../components/BalanceBox"
import DetailsModal from "../components/DetailsModal"
import LegacyDetailsModal from "../components/LegacyDetailsModal"
import OverdueBox from "../components/OverdueBox"
import RepaymentsBox from "../components/RepaymentsBox"
import useEarlyRepayments from "../hooks/useEarlyRepayments"
import useExportTransactions from "../hooks/useExportTransactions"
import {
  formatLoanInfo,
  getTransactionStatusColor,
  TransactionTypeFilter,
} from "../utils/transacations"

interface TransactionsQueryParams {
  page?: string
  agreementId?: string
  transactionTypeFilter?: string
}

const getTransactionTypesForFilter = (filter: string | undefined) => {
  const TRANSACTION_TYPES = [
    TransactionTypeEnum.Cash,
    TransactionTypeEnum.Card,
    TransactionTypeEnum.Invoice,
    TransactionTypeEnum.Refund,
    TransactionTypeEnum.Repayment,
  ]

  if (filter === TransactionTypeFilter.Payments) {
    return [TransactionTypeEnum.Repayment]
  }
  if (filter === TransactionTypeFilter.Advances) {
    return TRANSACTION_TYPES.filter(
      (type) => type !== TransactionTypeEnum.Repayment
    )
  }

  return [...TRANSACTION_TYPES]
}

const TransactionsV2 = () => {
  const { t } = useTranslation("transactions", { keyPrefix: "transactionsV2" })
  const location = useLocation()
  const navigate = useNavigate()
  const exportTransactionsMutation = useExportTransactions()
  const parsedQs = queryString.parse(location.search) as TransactionsQueryParams
  const agreements = useAgreements()
  const earlyRepaymentsQuery = useEarlyRepayments()
  const [selectedTransaction, setSelectedTransaction] = useState<{
    id: string
    agreementId: string
    type?: TransactionTypeEnum
  } | null>(null)

  const TRANSACTION_TYPE_FILTERS = [
    { label: t("transactionTypeFilter.all"), value: TransactionTypeFilter.All },
    {
      label: t("transactionTypeFilter.payments"),
      value: TransactionTypeFilter.Payments,
    },
    {
      label: t("transactionTypeFilter.advances"),
      value: TransactionTypeFilter.Advances,
    },
  ] as const

  const transactionTypeFilterOption =
    TRANSACTION_TYPE_FILTERS.find(
      (opt) => opt.value === parsedQs.transactionTypeFilter
    ) || TRANSACTION_TYPE_FILTERS[0]

  const handleTransactionTypeFilterChange = async (option: Option) => {
    const newQs: TransactionsQueryParams = {
      ...parsedQs,
      transactionTypeFilter:
        option.value === TransactionTypeFilter.All ? undefined : option.value,
      page: "0",
    }
    await navigate({ search: queryString.stringify(newQs) })
  }

  const canRepayEarly =
    !earlyRepaymentsQuery.isLoading &&
    earlyRepaymentsQuery.data &&
    earlyRepaymentsQuery.data.length > 0 &&
    agreements.data?.some((el) =>
      earlyRepaymentsQuery.data.some(
        (repayment) => repayment.agreementId === el.id!
      )
    )
  const transactionsQuery = useAllTransactions({
    params: {
      page: parsedQs.page ? Number(parsedQs.page) : 0,
      size: 10,
      accountId: parsedQs.agreementId,
      executionTypes: new Set([GetAllTransactionsExecutionTypesEnum.Executed]),
      transactionTypes: new Set(
        getTransactionTypesForFilter(parsedQs.transactionTypeFilter)
      ),
    },
  })

  const lateFeesSummary = useLateFeesSummary({
    agreementId: parsedQs.agreementId,
  })

  const visibleAgreements = useMemo(() => {
    const list =
      agreements.data?.filter(
        (a) =>
          a.status === DetailedAgreementDTOStatusEnum.Active ||
          a.reasonForClosing === DetailedAgreementDTOReasonForClosingEnum.Repaid
      ) || []

    return list.toSorted(
      (a, b) =>
        new Date(b.activationDate!).getTime() -
        new Date(a.activationDate!).getTime()
    )
  }, [agreements.data])

  if (agreements.data?.length === 1 && !parsedQs.agreementId) {
    const query = { ...parsedQs, agreementId: agreements.data[0].id, page: "0" }
    return (
      <Navigate
        to={`${location.pathname}?${queryString.stringify(query)}`}
        replace
      />
    )
  }

  const dropdownOptions: Option[] = [
    ...(visibleAgreements.length > 1
      ? [
          {
            label: t("viewAllLoans", { count: visibleAgreements.length }),
            value: "",
          },
        ]
      : []),
    ...visibleAgreements.map((agreement) => {
      const chipColor =
        agreement.status === DetailedAgreementDTOStatusEnum.Active
          ? "success"
          : "default"
      const chipLabel =
        agreement.status === DetailedAgreementDTOStatusEnum.Active
          ? titleCase(agreement.status)
          : t("completed")

      return {
        label: formatLoanInfo(agreement, true),
        icon: <Chip color={chipColor} label={chipLabel} />,
        value: agreement.id!,
      }
    }),
  ]

  const handleAgreementChange = async (option: Option) => {
    const newQs: TransactionsQueryParams = { ...parsedQs, page: "0" }
    if (option.value) {
      newQs.agreementId = option.value
    } else {
      delete newQs.agreementId
    }
    await navigate({ search: queryString.stringify(newQs) })
  }

  const handlePageChange = async (direction: "next" | "prev") => {
    const currentPage = Number(parsedQs.page || 0)

    await navigate({
      search: queryString.stringify({
        ...parsedQs,
        page:
          direction === "next"
            ? Math.min(
                currentPage + 1,
                (transactionsQuery.data?.totalPages || 1) - 1
              )
            : Math.max(currentPage - 1, 0),
      }),
    })
  }

  return (
    <Layout menu={<PortalMenu menuOnMobile />} mode="full">
      <Layout.FullWidth>
        <div className="w-full">
          <div className="mt-6 flex flex-col gap-6">
            <div className="flex items-end gap-4">
              <div>
                <Typography type="smallTitle" className="mb-1">
                  {t("viewLoans")}
                </Typography>
                <Dropdown
                  options={dropdownOptions}
                  value={
                    dropdownOptions.find(
                      (opt) => opt.value === parsedQs.agreementId
                    ) || dropdownOptions[0]
                  }
                  onChange={handleAgreementChange}
                />
              </div>
              <div>
                <Typography type="smallTitle" className="mb-1">
                  {t("viewTransactionType")}
                </Typography>
                <Dropdown
                  options={[...TRANSACTION_TYPE_FILTERS]}
                  value={transactionTypeFilterOption}
                  onChange={handleTransactionTypeFilterChange}
                />
              </div>
              <DropdownMenu
                className="ml-auto"
                icon={<MoreIcon />}
                anchor="bottom end"
                options={[
                  ...(canRepayEarly
                    ? [
                        {
                          label: t("repayLoanEarly"),
                          icon: <ClockIcon />,
                          onClick: async () => {
                            await navigate("/loans/early-repayments")
                          },
                        },
                      ]
                    : []),
                  {
                    label: t("downloadRepaymentBreakdown"),
                    icon: <DownloadIcon />,
                    onClick: () => {
                      exportTransactionsMutation.mutate()
                    },
                  },
                ]}
              />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <BalanceBox agreementId={parsedQs.agreementId} />
              {lateFeesSummary.lateFeesSummaryQuery.data
                ?.totalOverdueRepayments !== undefined &&
              lateFeesSummary.lateFeesSummaryQuery.data.totalOverdueRepayments >
                0 ? (
                <OverdueBox agreementId={parsedQs.agreementId} />
              ) : (
                <RepaymentsBox agreementId={parsedQs.agreementId} />
              )}
            </div>

            <div className="shadow-light-sm border-card overflow-hidden rounded-lg bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="min-w-[160px] px-6 py-3 text-left">
                        <Typography type="tableHeader">
                          {t("table.headers.date")}
                        </Typography>
                      </th>
                      <th className="w-36 px-6 py-3 text-left">
                        <Typography type="tableHeader">
                          {t("table.headers.type")}
                        </Typography>
                      </th>
                      <th className="w-28 px-6 py-3 text-left">
                        <Typography type="tableHeader">
                          {t("table.headers.status")}
                        </Typography>
                      </th>
                      <th className="min-w-[280px] px-6 py-3 text-left">
                        <Typography type="tableHeader">
                          {t("table.headers.loan")}
                        </Typography>
                      </th>
                      <th className="w-32 px-6 py-3 text-right">
                        <Typography type="tableHeader">
                          {t("table.headers.amount")}
                        </Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionsQuery.isLoading || agreements.isLoading ? (
                      <tr>
                        <td colSpan={5} className="py-10">
                          <Loader size="xs" />
                        </td>
                      </tr>
                    ) : (
                      transactionsQuery.data?.content!.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="cursor-pointer border-b border-neutral-200 transition-colors last:border-b-0 hover:bg-neutral-50"
                          onClick={() => {
                            setSelectedTransaction({
                              id: transaction.id,
                              agreementId: transaction.account.id,
                              type: transaction.type,
                            })
                          }}
                        >
                          <td className="px-6 py-4">
                            <Typography type="tableValue" color="neutral-900">
                              {formatDate(new Date(transaction.createdAt), {
                                format: DateFormat.SHORT,
                              })}
                            </Typography>
                          </td>
                          <td className="px-6 py-4">
                            <Typography type="tableValue" color="neutral-900">
                              {transaction.type ===
                                TransactionTypeEnum.Repayment &&
                              transaction.name.toLowerCase() === "rebate"
                                ? t("feesWaived")
                                : transaction.type ===
                                    TransactionTypeEnum.Repayment
                                  ? t("transactionTypePayment")
                                  : transaction.type ===
                                      TransactionTypeEnum.Cash
                                    ? t("transactionTypeAdvance")
                                    : titleCase(transaction.type)}
                            </Typography>
                          </td>
                          <td className="px-6 py-4">
                            <Chip
                              label={titleCase(transaction.status)}
                              color={getTransactionStatusColor(
                                transaction.status
                              )}
                            />
                          </td>
                          <td className="px-6 py-4">
                            {!!agreements.data?.find(
                              (a: DetailedAgreementDTO) =>
                                a.id === transaction.account.id
                            ) && (
                              <Typography type="tableValue" color="neutral-900">
                                {formatLoanInfo(
                                  agreements.data.find(
                                    (a: DetailedAgreementDTO) =>
                                      a.id === transaction.account.id
                                  )!
                                )}
                              </Typography>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <Typography type="tableHeader" color="neutral-900">
                              {formatByStatus(
                                transaction.status,
                                transaction.transactionAmount.amount!,
                                transaction.transactionAmount.currency!,
                                transaction.type === TransactionTypeEnum.Cash
                              )}
                            </Typography>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-neutral-200 px-6 py-4">
                <div className="flex items-center justify-end gap-4">
                  <Typography type="tableHeader" color="neutral-700">
                    {10 * (Number(parsedQs.page) || 0) + 1} -
                    {10 * (Number(parsedQs.page) || 0) +
                      (transactionsQuery.data?.content?.length || 0)}{" "}
                    <Typography type="tableValue" tag="span">
                      {t("pagination.of")}
                    </Typography>{" "}
                    {transactionsQuery.data?.totalElements}
                  </Typography>
                  <div className="flex gap-1">
                    <button
                      className="rounded p-1.5 transition-colors hover:bg-neutral-100 disabled:opacity-25 disabled:hover:bg-white"
                      onClick={() => handlePageChange("prev")}
                      disabled={(Number(parsedQs.page) || 0) === 0}
                    >
                      <ChevronRight className="h-5 w-5 rotate-180 text-neutral-800" />
                    </button>
                    <button
                      className="rounded p-1.5 transition-colors hover:bg-neutral-100 disabled:opacity-25 disabled:hover:bg-white"
                      onClick={() => handlePageChange("next")}
                      disabled={
                        (Number(parsedQs.page) || 0) >=
                        (transactionsQuery.data?.totalPages || 1) - 1
                      }
                    >
                      <ChevronRight className="h-5 w-5 text-neutral-800" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {selectedTransaction &&
          (selectedTransaction.type === TransactionTypeEnum.Repayment ? (
            <DetailsModal
              transactionId={selectedTransaction.id}
              agreementId={selectedTransaction.agreementId}
              onClose={() => {
                setSelectedTransaction(null)
              }}
            />
          ) : (
            <LegacyDetailsModal
              accountId={selectedTransaction.agreementId}
              transactionId={selectedTransaction.id}
              onClose={() => {
                setSelectedTransaction(null)
              }}
            />
          ))}
      </Layout.FullWidth>
    </Layout>
  )
}

export default TransactionsV2
