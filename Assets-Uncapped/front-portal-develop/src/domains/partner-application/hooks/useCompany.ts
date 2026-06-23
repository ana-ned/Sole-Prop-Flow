import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import useAuth from "../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { OrganisationOnboardingControllerApi } from "../../../services/api/partners"
import { BusinessDetailsForm } from "../../onboarding/components/business-details/BusinessDetailsForm.types"
import partnerApplicationQueryKeys from "../partner-application.queries"

const useCompany = (id?: string) => {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const companyDetails = useQuery({
    queryKey: partnerApplicationQueryKeys.detail(id),
    queryFn: async () => {
      return new OrganisationOnboardingControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Partners,
        })
      ).getCompanyDetails({
        xXPARTNERID: auth.partnerId!,
        applicationId: id!,
      })
    },
    enabled: auth.isAuthenticated && !!auth.partnerId && !!id,
    refetchOnWindowFocus: false,
  })

  const editCompanyWithFormData = useMutation({
    mutationFn: async (form: BusinessDetailsForm) => {
      return new OrganisationOnboardingControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Partners,
        })
      ).editCompanyInformation2({
        xXPARTNERID: auth.partnerId!,
        applicationId: id!,
        companyLegalDetailsRequest: {
          companyName: form.companyName || "",
          companyNumber: form.companyNumber,
          dateOfCreation: form.dateOfCreation
            ? new Date(form.dateOfCreation)
            : undefined,
          registeredAddress: form.registeredAddress,
        },
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: partnerApplicationQueryKeys.detail(id),
        exact: true,
      })
    },
    onError: () => {
      toast.error(t("defaultErrorMessage"))
    },
  })

  return {
    companyDetails,
    editCompanyWithFormData,
  }
}

export default useCompany
