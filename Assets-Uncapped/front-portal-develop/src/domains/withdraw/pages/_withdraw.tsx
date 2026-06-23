import { useMutation } from "@tanstack/react-query"
import PageLoader from "../../../components/Collections/PageLoader"
import MultistepForm from "../../../components/Headless/MultistepForm"
import useAuth from "../../../hooks/useAuth"
import useBalances from "../../../hooks/useBalances"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import {
  CashTransferRequestDTOTypeEnum,
  DisbursementsControllerApi,
} from "../../../services/api/loan-operations"
import { displayErrorToast } from "../../../utils/error-handling"
import AmountToWithdraw from "../components/AmountToWithdraw"
import UploadStatement from "../components/UploadStatement"
import VerifyingDocumentsModal from "../components/VerifyingDocumentsModal"

const Withdrawindex = () => {
  const auth = useAuth()
  const balancesQuery = useBalances()

  const disbursementMutation = useMutation({
    mutationFn: async (cashRequest: { amount: number; toAccountId: string }) =>
      new DisbursementsControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.LoanOperations,
        })
      ).createDisbursement({
        xXORGID: auth.organisation?.organisationId!,
        cashTransferRequestDTO: {
          organisationId: auth.organisation?.organisationId!,
          type: CashTransferRequestDTOTypeEnum.Automatic,
          currencyCode: balancesQuery.data?.aggregatedBalance!.currency!,
          ...cashRequest,
        },
      }),
    onError: async (error: Response) => {
      await displayErrorToast(error)
    },
  })

  if (balancesQuery.isPending || disbursementMutation.isPending) {
    return <PageLoader />
  }

  return (
    <>
      <MultistepForm
        onFinish={async (data) => {
          await disbursementMutation.mutateAsync({
            amount: Number(data.amount),
            toAccountId: data.bankAccountId,
          })
        }}
      >
        <AmountToWithdraw />
        <UploadStatement />
      </MultistepForm>
      <VerifyingDocumentsModal isOpen={disbursementMutation.isSuccess} />
    </>
  )
}

export default Withdrawindex
