import { useQuery } from "@tanstack/react-query"
import { useLocation, useParams } from "react-router"
import useAgreements from "../../../hooks/useAgreements"
import useAuth from "../../../hooks/useAuth"
import useBalances from "../../../hooks/useBalances"
import useLateFeesSummary from "../../../hooks/useLateFeesSummary"
import {
  DetailedAgreementDTO,
  DetailedAgreementDTOStatusEnum,
  BalanceWithAgreementStatusDTO,
  RepaymentScheduleResponse,
  TransactionControllerApi,
  CustomerTransactionFeeBalance,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
const FEES_BALANCE_QUERY_KEY = "FEES_BALANCE"
import useProductType from "../hooks/useProductType"
import useRepaymentSchedule from "../hooks/useRepaymentSchedule"

interface AgreementData {
  agreement: DetailedAgreementDTO | undefined
  balance: BalanceWithAgreementStatusDTO | undefined
  repaymentSchedule: RepaymentScheduleResponse[] | undefined
  feesBalance: CustomerTransactionFeeBalance | undefined
  lateFees: number
  lateFeesApplicable: boolean
  backUrl: string
  isLoading: boolean
  isInterestRate: boolean
  isLineOfCreditInterestRate: boolean
  isLineOfCreditFixed: boolean
  isRbf: boolean
  isDailyPayout: boolean
}

const useAgreementData = (): AgreementData => {
  const auth = useAuth()
  const params = useParams()
  const locationState = useLocation().state as { backUrl?: string } | undefined
  const agreements = useAgreements()
  const balances = useBalances()
  const { lateFeesSummaryQuery, lateFeesApplicable } = useLateFeesSummary({
    agreementId: params.agreementId,
  })

  const agreement = agreements.data?.find(
    (item) => item.id === params.agreementId
  )

  const {
    isLineOfCreditInterestRate,
    isLineOfCreditFixed,
    isRbf,
    isDailyPayout,
    isInterestRate,
  } = useProductType(agreement)

  const scheduledTransactions = useRepaymentSchedule({
    agreementId: params.agreementId,
  })

  const feesBalance = useQuery({
    queryKey: [FEES_BALANCE_QUERY_KEY],
    queryFn: async () =>
      new TransactionControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).feesBalanceForAgreement({
        agreementId: agreement?.id!,
        xXORGID: auth.organisation?.organisationId!,
      }),
    enabled:
      auth.isAuthenticated &&
      !!auth.organisation?.organisationId &&
      !!agreement?.id &&
      agreements.hasSimplifiedPricing(agreement),
  })

  const balance =
    balances.data?.balances?.find(
      (item) => item.agreementId === params.agreementId
    ) ??
    (agreement
      ? {
          agreementId: agreement.id,
          currency: agreement.currency,
          values: {},
        }
      : undefined)

  const isLoading =
    scheduledTransactions.isLoading ||
    agreements.isLoading ||
    balances.isLoading ||
    feesBalance.isLoading ||
    lateFeesSummaryQuery.isLoading

  const getBackUrl = () => {
    if (locationState?.backUrl) {
      return locationState.backUrl
    }

    if (agreement?.status === DetailedAgreementDTOStatusEnum.Active) {
      return "/loans"
    }

    return "/loans/past"
  }

  const lateFees = lateFeesApplicable
    ? lateFeesSummaryQuery.data?.totalChargedAmount || 0
    : 0

  return {
    agreement,
    balance,
    repaymentSchedule: scheduledTransactions.data,
    feesBalance: feesBalance.data,
    lateFees,
    lateFeesApplicable,
    backUrl: getBackUrl(),
    isLoading,
    isInterestRate,
    isLineOfCreditInterestRate,
    isLineOfCreditFixed,
    isRbf,
    isDailyPayout,
  }
}

export default useAgreementData
