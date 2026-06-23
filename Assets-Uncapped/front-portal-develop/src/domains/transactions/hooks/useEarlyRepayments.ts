import { useQuery } from "@tanstack/react-query"
import useAgreements from "../../../hooks/useAgreements"
import useAuth from "../../../hooks/useAuth"
import {
  CustomerTransaction,
  EarlyRepaymentsControllerApi,
  RepaymentScheduleResponse,
  RepaymentScheduleResponseScheduleTypeEnum,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import useRepaymentSchedule from "../../agreements/hooks/useRepaymentSchedule"

export const EARLY_REPAYMENTS_QUERY_KEY = ["EARLY_REPAYMENTS"]

const useEarlyRepayments = () => {
  const auth = useAuth()
  const scheduledTransactionsQuery = useRepaymentSchedule()
  const agreementsQuery = useAgreements()

  const query = useQuery({
    queryKey: EARLY_REPAYMENTS_QUERY_KEY,
    queryFn: async () =>
      new EarlyRepaymentsControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getAgreementIdsApplicableByProcessType({
        xXORGID: auth.organisation?.organisationId!,
      }),
    enabled:
      auth.isAuthenticated &&
      !!auth.organisation?.organisationId &&
      agreementsQuery.data?.some((el) => el.repayments?.earlyRepaymentAllowed),
  })

  const isEarlyRepayment = (
    transaction?: CustomerTransaction | RepaymentScheduleResponse
  ) => {
    return (
      transaction &&
      "externalId" in transaction &&
      scheduledTransactionsQuery.data
        ?.filter(
          (schedule) =>
            schedule.scheduleType ===
            RepaymentScheduleResponseScheduleTypeEnum.EarlyRepayment
        )
        .some((schedule) =>
          schedule.externalIds?.includes(transaction.externalId!)
        )
    )
  }

  return {
    ...query,
    isEarlyRepayment,
  }
}

export default useEarlyRepayments
