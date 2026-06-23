import { useQuery } from "@tanstack/react-query"
import {
  LateFeeSummaryChargingStatusEnum,
  LateFeeSummaryOverdueStatusEnum,
  LateFeesControllerApi,
} from "../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import useAuth from "./useAuth"

const useLateFeesSummary = ({ agreementId }: { agreementId?: string } = {}) => {
  const auth = useAuth()

  const lateFeesSummaryQuery = useQuery({
    queryKey: ["LATE_FEES_SUMMARY_QUERY", agreementId],
    queryFn: async () =>
      new LateFeesControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getSummary1({
        xXORGID: auth.organisation?.organisationId!,
        agreementId: agreementId!,
      }),
    enabled: auth.isAuthenticated && !!auth.organisation?.organisationId,
  })

  return {
    lateFeesSummaryQuery,
    lateFeesApplicable:
      (
        [
          LateFeeSummaryChargingStatusEnum.Eligible,
          LateFeeSummaryChargingStatusEnum.Paused,
        ] as LateFeeSummaryChargingStatusEnum[]
      ).includes(lateFeesSummaryQuery.data?.chargingStatus!) &&
      lateFeesSummaryQuery.data?.overdueStatus ===
        LateFeeSummaryOverdueStatusEnum.Overdue,
  }
}

export default useLateFeesSummary
