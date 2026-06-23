import * as yup from "yup"
import {
  OrganisationCreationRequestBusinessEntityEnum,
  OrganisationDetailsResponseBusinessTypesEnum,
  PartnersEligibilityCheckResponseNotEligibleReasonEnum,
} from "../../services/api/partners"
import CountryService from "../../services/country"
import Url from "../../utils/validator-rules/url"
import {
  BUSINESS_ENTITY_TYPES,
  ELIGIBLE_FOR_LOW_REVENUE_INVENTORY_COUNTRIES,
} from "../registration/components/eligibility-check/EligibilityCheckForm.types"
import isSmallTier from "../registration/utils/isSmallTier"

export const StepIntroduceOrganisationSchema = yup.object().shape({
  businessName: yup.string().required(),
  businessWebsite: yup.string().required().test(Url()),
  country: yup.string().required(),
  region: yup.string().when("country", {
    is: (country: string) => CountryService.hasRegions(country),
    then: (s) => s.required(),
  }),
  businessEntity: yup
    .string()
    .oneOf(Object.values(OrganisationCreationRequestBusinessEntityEnum))
    .when("country", {
      is: (country: string) =>
        !!BUSINESS_ENTITY_TYPES[country as keyof typeof BUSINESS_ENTITY_TYPES],
      then: (s) => s.required(),
    }),
  revenue: yup.string().required(),
  businessTypes: yup
    .array()
    .of(
      yup
        .string()
        .oneOf(Object.values(OrganisationDetailsResponseBusinessTypesEnum))
    )
    .min(1)
    .required(),
  mainEcommercePlatform: yup
    .string()
    .when(["country", "revenue", "businessType"], {
      is: (country: string, revenue: string, businessType: string) =>
        businessType === "e-commerce" &&
        ELIGIBLE_FOR_LOW_REVENUE_INVENTORY_COUNTRIES.has(country) &&
        isSmallTier(Number(revenue)),
      then: (s) => s.required(),
    }),
})

export type StepIntroduceOrganisationFormSchemaType = yup.InferType<
  typeof StepIntroduceOrganisationSchema
>

export type PartnerApplicationFormSchema =
  StepIntroduceOrganisationFormSchemaType & {
    // Input fields
    firstName: string
    lastName: string
    phoneNumber: string
    email: string
    // Dynamic fields
    applicationId: string
    hasOrganisation: boolean
    isEligible?: boolean
    eligibleAmount?: number
    eligibleCurrency?: string
    notEligibleReason: PartnersEligibilityCheckResponseNotEligibleReasonEnum
  }
