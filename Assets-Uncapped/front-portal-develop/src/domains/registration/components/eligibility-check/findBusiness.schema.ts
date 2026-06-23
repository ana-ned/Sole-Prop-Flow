import * as yup from "yup"
import i18n from "../../../../inits/i18next"
import { ExternalCompanyResponse } from "../../../../services/api/organisation-users"
import CountryService from "../../../../services/country"
import { ICountry } from "../../../../types/Country.types"
import PhoneFormat from "../../../../utils/validator-rules/phone"
import { canBeSoleTrader } from "./EligibilityCheck.utils"

export const FindBusinessFormSchema = yup.object().shape({
  country: yup.string().required(),
  businessName: yup.string().required(),
  regions: yup.array().when("country", {
    is: (country: string) => CountryService.hasRegions(country),
    then: (s) =>
      s
        .of(yup.string())
        .required()
        .min(1, i18n.t("registration:eligibility.FindBusiness.stateRequired")),
  }),
  isSoleTrader: yup.string().when(["businessName"], {
    is: (businessName: string) => canBeSoleTrader(businessName),
    then: (s) => s.required(),
  }),
  contactEmail: yup
    .string()
    .email()
    .when("$isAmazonPartnership", {
      is: true,
      then: (s) => s.required(),
    }),
  phoneNumber: yup.string().required().test(PhoneFormat()),
  smsConsentGranted: yup.boolean(),
})

export type FindBusinessFormType = yup.InferType<
  typeof FindBusinessFormSchema
> & {
  companySearchData: ExternalCompanyResponse | undefined
}

const getUnsupportedRegionNames = (country?: ICountry) =>
  country?.regions?.filter((item) => !item.eligible).map((item) => item.name) ||
  []

export const isRegionUnsupported = (regions?: string[], country?: ICountry) => {
  const unsupportedRegions = getUnsupportedRegionNames(country)

  return (
    (regions || []).length > 0 &&
    regions?.every((el) => unsupportedRegions.includes(el))
  )
}

export const isBespokeFunding = (regions?: string[], country?: ICountry) => {
  const unsupportedRegions = getUnsupportedRegionNames(country)

  const bespokeRegions =
    country?.regions
      ?.filter((item) => item.eligible && item.fundedBy === "BESPOKE")
      .map((item) => item.name) || []

  return (
    (regions || []).length > 0 &&
    regions?.every(
      (el) => bespokeRegions.includes(el) || unsupportedRegions.includes(el)
    )
  )
}
