import * as yup from "yup"
import { RegisterOrganisationRequestCurrencyEnum } from "../../../../services/api/organisation-users"

export const reapplySchema = yup.object().shape({
  fundingAmount: yup.object().shape({
    currency: yup
      .string()
      .oneOf(Object.values(RegisterOrganisationRequestCurrencyEnum))
      .required(),
    amount: yup.string().required(),
  }),
  applicationType: yup.string().required(),
})

export type ReapplyFormData = yup.InferType<typeof reapplySchema>
