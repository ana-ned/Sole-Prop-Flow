import { useQueries } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import {
  CheckEarlyRepaymentTermsEarlyRepaymentReasonEnum,
  EarlyRepaymentsControllerApi,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"

export interface RefinanceAgreementFee {
  agreementId: string
  discount: number
  amountToRepay: number
}

export const useRefinanceAgreementsFees = (
  agreementIds: string[],
  enabled = true
) => {
  const auth = useAuth()

  const queries = useQueries({
    queries: agreementIds.map((agreementId) => ({
      queryKey: ["EARLY_REPAYMENT_FEES", agreementId],
      queryFn: async () => {
        const api = new EarlyRepaymentsControllerApi(
          apiConfig({
            token: await auth.getToken(),
            service: ApiServicesEnum.Agreements,
          })
        )
        const result = await api.checkEarlyRepaymentTerms({
          agreementId,
          xXORGID: auth.organisation?.organisationId!,
          earlyRepaymentReason:
            CheckEarlyRepaymentTermsEarlyRepaymentReasonEnum.Refinance,
        })
        return {
          agreementId,
          discount: result.discount || 0,
          amountToRepay: result.amountToRepay || 0,
        }
      },
      enabled: enabled && !!auth.organisation?.organisationId && !!agreementId,
    })),
  })

  const feesMap = Object.fromEntries(
    queries
      .filter((q) => q.data)
      .map((q) => [q.data!.agreementId, q.data!.discount])
  )

  return {
    isLoading: queries.some((q) => q.isLoading),
    isError: queries.some((q) => q.isError),
    feesMap,
    totalFeesWaived: queries.reduce(
      (sum, query) => sum + (query.data?.discount || 0),
      0
    ),
    agreements: queries
      .map((q) => q.data)
      .filter((data): data is RefinanceAgreementFee => data !== undefined),
  }
}
