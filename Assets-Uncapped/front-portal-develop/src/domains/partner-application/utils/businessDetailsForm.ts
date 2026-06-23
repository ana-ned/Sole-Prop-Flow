import { format } from "date-fns"
import { CompanyLegalDetailsResponse } from "../../../services/api/partners/models/CompanyLegalDetailsResponse"
import { BusinessDetailsForm } from "../../onboarding/components/business-details/BusinessDetailsForm.types"

export const createInitialFormData = (
  data: CompanyLegalDetailsResponse | undefined
): BusinessDetailsForm => {
  return {
    companySearch: data?.companyName || "",
    companyName: data?.companyName || "",
    companyNumber: data?.companyNumber || "",
    businessCountry: data?.registeredAddress?.country || "",
    dateOfCreation: data?.dateOfCreation
      ? format(data.dateOfCreation, "yyyy-MM-dd")
      : undefined,
    registeredAddress: {
      location: "",
      country: data?.registeredAddress?.country || "",
      addressLine1: data?.registeredAddress?.addressLine1 || "",
      addressLine2: data?.registeredAddress?.addressLine2,
      locality: data?.registeredAddress?.locality || "",
      region: data?.registeredAddress?.region || "",
      postalCode: data?.registeredAddress?.postalCode || "",
    },
  }
}
