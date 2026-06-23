import { CustomerPersonDTO } from "../../../../services/api/kyc"

export interface BeneficialOwnerForm {
  firstName: string
  lastName: string
  email: string
  fullOwner?: CustomerPersonDTO
}
