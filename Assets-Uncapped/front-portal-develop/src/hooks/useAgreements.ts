import { useQuery } from "@tanstack/react-query"
import {
  AgreementControllerApi,
  AgreementsProductGroupEnum,
  DetailedAgreementDTO,
  DetailedAgreementDTOStatusEnum,
} from "../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import useAuth from "./useAuth"

const getAgreementsQueryKey = ({
  productGroup,
}: {
  productGroup?: AgreementsProductGroupEnum
}) => ["AGREEMENTS_INDEX", productGroup]

const sortByLatest = (a: DetailedAgreementDTO, b: DetailedAgreementDTO) => {
  if (!a.startDate || !b.startDate) {
    return 0
  }

  return b.startDate.getTime() - a.startDate.getTime()
}

const isUsingSimplifiedPricing = (agreement: DetailedAgreementDTO) => {
  return (
    agreement.fees?.billPaymentMarketing ===
      agreement.fees?.billPaymentInventory &&
    agreement.fees?.billPaymentInventory === agreement.fees?.billPaymentOther
  )
}

const useAgreements = ({
  productGroup,
}: {
  productGroup?: AgreementsProductGroupEnum
} = {}) => {
  const auth = useAuth()

  const query = useQuery({
    queryKey: getAgreementsQueryKey({ productGroup }),
    queryFn: async () =>
      new AgreementControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).agreements({
        xXORGID: auth.organisation?.organisationId!,
        productGroup,
      }),
    enabled: auth.isAuthenticated && !!auth.organisation?.organisationId,
  })

  return {
    ...query,
    sortByLatest,
    hasSimplifiedPricing: (agreement?: DetailedAgreementDTO) => {
      if (agreement) {
        return isUsingSimplifiedPricing(agreement)
      }
      return query.data?.some((detailedAgreement) =>
        isUsingSimplifiedPricing(detailedAgreement)
      )
    },
    hasActiveAgreements: query.data?.some(
      (item) => item.status === DetailedAgreementDTOStatusEnum.Active
    ),
  }
}

export default useAgreements
