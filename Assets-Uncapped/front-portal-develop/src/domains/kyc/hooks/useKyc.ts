import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { ApplicantDataControllerApi } from "../../../services/api/kyc"

const KYC_QUERY_KEY = "KYC_USER_DATA"

const useKyc = () => {
  const { uuid } = useParams<{ uuid: string }>()

  const userData = useQuery({
    queryKey: [KYC_QUERY_KEY],
    queryFn: async () =>
      new ApplicantDataControllerApi(
        apiConfig({
          service: ApiServicesEnum.Kyc,
        })
      ).getApplicantData({
        xXORGID: "",
        uuid: uuid!,
      }),
    enabled: !!uuid,
    retry: 0,
    throwOnError: () => {
      return false
    },
  })

  return {
    userData,
    uuid,
  }
}

export default useKyc
