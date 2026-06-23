import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import useLogin from "../../../hooks/useLogin"
import useRecaptcha from "../../../hooks/useRecaptcha"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import {
  PartnerRegistrationControllerApi,
  PartnerRegistrationRequestTypeEnum,
} from "../../../services/api/partners"

export interface PartnerRegistrationForm {
  firstName: string
  lastName: string
  email: string
  password: string
  businessCountry: string
  phoneNumber: string
  businessName?: string
  partnerType?: string
  website?: string
}

const RECAPTCHA_ERROR_MESSAGE = "reCAPTCHA not ready. Please try again."

const useRegisterPartner = () => {
  const recaptcha = useRecaptcha()
  const { login } = useLogin()
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null)

  const registerPartner = useMutation({
    mutationFn: async (formData: PartnerRegistrationForm) => {
      setRecaptchaError(null)
      const token = await recaptcha.getToken()
      if (!token) {
        setRecaptchaError(RECAPTCHA_ERROR_MESSAGE)
        throw new Error(RECAPTCHA_ERROR_MESSAGE)
      }
      return new PartnerRegistrationControllerApi(
        apiConfig({ service: ApiServicesEnum.Partners })
      ).registerPartnerAndUser({
        xXCAPTCHA: token,
        partnerAndUserRegistrationRequest: {
          partnerRegistrationRequest: {
            name: formData.businessName,
            type: formData.partnerType as PartnerRegistrationRequestTypeEnum,
            website: formData.website,
            country: formData.businessCountry,
          },
          userRegistrationRequest: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phoneNumber,
            password: formData.password,
          },
        },
      })
    },
    onSuccess: (requestData, formData) => {
      login(formData.email, formData.password, "/partner/registration/success")
    },
  })

  return {
    registerPartner,
    recaptchaError,
    isRecaptchaReady: recaptcha.isReady,
  }
}

export default useRegisterPartner
