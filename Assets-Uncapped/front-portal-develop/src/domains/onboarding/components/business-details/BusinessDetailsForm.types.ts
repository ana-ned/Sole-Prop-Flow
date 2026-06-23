import { IAddressAutocomplete } from "../../../../components/Forms/AddressAutocompleteFields"

export interface BusinessDetailsForm {
  companySearch?: string
  companyName?: string
  businessCountry: string
  companyNumber?: string
  dateOfCreation?: string
  registeredAddress: IAddressAutocomplete
}
