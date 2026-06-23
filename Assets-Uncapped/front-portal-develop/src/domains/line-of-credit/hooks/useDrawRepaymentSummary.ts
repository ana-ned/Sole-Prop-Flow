import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import {
  DrawRepaymentPreviewCustomisationTypeEnum,
  LineOfCreditApi,
  LineOfCreditResponse,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"

interface DrawRepaymentSummaryParams {
  lineOfCredit?: LineOfCreditResponse
  drawAmount: number
  repaymentTermsMonths: number
  customisationType?: DrawRepaymentPreviewCustomisationTypeEnum
  customisationPeriod?: number
}

const getDrawRepaymentSummaryQueryKey = (
  params: DrawRepaymentSummaryParams
) => [
  "AGREEMENTS-LOC-DRAW-REPAYMENT-SUMMARY",
  params.lineOfCredit?.id,
  params.drawAmount,
  params.repaymentTermsMonths,
  params.customisationType,
  params.customisationPeriod,
]

const useDrawRepaymentSummary = (
  {
    lineOfCredit,
    drawAmount,
    repaymentTermsMonths,
    customisationType,
    customisationPeriod,
  }: DrawRepaymentSummaryParams,
  enabled = true
) => {
  const auth = useAuth()

  return useQuery({
    queryKey: getDrawRepaymentSummaryQueryKey({
      lineOfCredit,
      drawAmount,
      repaymentTermsMonths,
      customisationType,
      customisationPeriod,
    }),
    queryFn: async () => {
      return new LineOfCreditApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).drawRepaymentPreview({
        xXORGID: auth.organisation?.organisationId!,
        id: lineOfCredit?.id!,
        drawAmount,
        repaymentTermsMonths,
        customisationType,
        customisationPeriod,
      })
    },
    enabled:
      auth.isAuthenticated &&
      !!auth.organisation?.organisationId &&
      !!lineOfCredit?.id &&
      !!drawAmount &&
      !!repaymentTermsMonths &&
      enabled,
  })
}

export default useDrawRepaymentSummary
