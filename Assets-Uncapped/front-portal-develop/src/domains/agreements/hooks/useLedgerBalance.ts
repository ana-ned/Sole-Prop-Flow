import { useQuery } from "@tanstack/react-query"
import Decimal from "decimal.js"
import useAuth from "../../../hooks/useAuth"
import {
  CurrentBalanceState,
  LedgerControllerApi,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"

export const getLedgerBalanceQueryKey = (agreementId: string) => [
  "LEDGER-BALANCE",
  agreementId,
]

const compute = (d: CurrentBalanceState) => ({
  ...d,
  currentAmount: new Decimal(d.currentPrincipal ?? 0)
    .plus(d.currentInterest ?? 0)
    .plus(d.currentFees ?? 0)
    .toNumber(),
  totalAmount: new Decimal(d.totalPrincipal ?? 0)
    .plus(d.totalInterest ?? 0)
    .plus(d.totalFees ?? 0)
    .toNumber(),
})

const useLedgerBalance = ({
  agreementId,
  enabled = true,
}: {
  agreementId: string
  enabled?: boolean
}) => {
  const auth = useAuth()

  return useQuery({
    queryKey: getLedgerBalanceQueryKey(agreementId),
    queryFn: async () =>
      new LedgerControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getLatestAgreementBalance({
        agreementId,
        xXORGID: auth.organisation?.organisationId!,
      }),
    select: compute,
    enabled:
      auth.isAuthenticated && !!auth.organisation?.organisationId && enabled,
  })
}

export default useLedgerBalance
