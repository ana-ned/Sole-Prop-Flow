import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import {
  DataVerificationResultStatusEnum,
  DataVerificationResultTypeEnum,
  VerificationControllerApi,
} from "../../../services/api/underwriting"
import useConnections from "../../connections/hooks/useConnections"
import useBankAccountsLabels from "./useBankAccountsLabels"

export const getQueryKeyForBankVerification = (
  bankingConnectionIds?: string[]
) => [
  "underwriting:VerificationControllerApi@getAmazonBankVerification",
  bankingConnectionIds,
]

const SUPPORTED_VERIFICATION_TYPES = new Set([
  DataVerificationResultTypeEnum.MissingBankAccounts,
  DataVerificationResultTypeEnum.SalesPayoutBankAccount,
])

const useBankVerification = () => {
  const auth = useAuth()
  const connections = useConnections()

  const query = useQuery({
    queryKey: getQueryKeyForBankVerification(
      connections.bankingConnections.map((item) => item.id!)
    ),
    queryFn: async () =>
      new VerificationControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Underwriting,
        })
      ).getVerifications({
        xXORGID: auth.organisation?.organisationId!,
      }),
    enabled: !!auth.organisation?.organisationId,
    refetchInterval(query) {
      if (
        query.state.data?.some(
          (item) => item.status === DataVerificationResultStatusEnum.InProgress
        )
      ) {
        return 1000 * 5
      }

      return false
    },
  })

  const data =
    query.data?.filter((item) =>
      SUPPORTED_VERIFICATION_TYPES.has(item.type!)
    ) || []

  const bankAccountsLabels = useBankAccountsLabels({
    enabled: data.some(
      (item) => item.type === DataVerificationResultTypeEnum.MissingBankAccounts
    ),
  })

  const error = data
    .filter((item) => {
      if (item.type == DataVerificationResultTypeEnum.MissingBankAccounts) {
        return item.details?.missingAccounts?.some(
          (account) =>
            account !==
            bankAccountsLabels.data?.find((item) => item.mask === account)?.mask
        )
      }
      return item.status === DataVerificationResultStatusEnum.NotVerified
    })
    .toSorted((a, b) => {
      if (a.type === DataVerificationResultTypeEnum.SalesPayoutBankAccount)
        return -1
      if (b.type === DataVerificationResultTypeEnum.SalesPayoutBankAccount)
        return 1
      return 0
    })
    .at(0)

  const isFailed = !!error

  const inProgress = data.some(
    (item) => item.status === DataVerificationResultStatusEnum.InProgress
  )

  return {
    ...query,
    isFailed,
    inProgress,
    data,
    error,
  }
}

export default useBankVerification
