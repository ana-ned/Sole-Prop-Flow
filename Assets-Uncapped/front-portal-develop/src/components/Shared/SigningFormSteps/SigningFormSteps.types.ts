import * as yup from "yup"

export const authorityStepSchema = yup.object().shape({
  authority: yup.string().oneOf(["yes", "no"]).required(),
})

export const detailsStepSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
})

export type SigningFormFields = yup.InferType<typeof authorityStepSchema> &
  yup.InferType<typeof detailsStepSchema>
