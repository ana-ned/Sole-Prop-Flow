import { RegisterOrganisationRequestMainEcommercePlatformEnum } from "../../../../services/api/organisation-users"
import { OrganisationCreationRequestBusinessEntityEnum } from "../../../../services/api/partners"

export const ELIGIBLE_FOR_LOW_REVENUE_INVENTORY_COUNTRIES = new Set([
  "GBR",
  "USA",
  "POL",
  "NLD",
  "ESP",
])

export const ECOMMERCE_PLATFORMS: {
  value: RegisterOrganisationRequestMainEcommercePlatformEnum
  label: string
}[] = [
  {
    value: RegisterOrganisationRequestMainEcommercePlatformEnum.Amazon,
    label: RegisterOrganisationRequestMainEcommercePlatformEnum.Amazon,
  },
  {
    value: RegisterOrganisationRequestMainEcommercePlatformEnum.Walmart,
    label: RegisterOrganisationRequestMainEcommercePlatformEnum.Walmart,
  },
  {
    value: RegisterOrganisationRequestMainEcommercePlatformEnum.Shopify,
    label: RegisterOrganisationRequestMainEcommercePlatformEnum.Shopify,
  },
  {
    value: RegisterOrganisationRequestMainEcommercePlatformEnum.Other,
    label: RegisterOrganisationRequestMainEcommercePlatformEnum.Other,
  },
  {
    value: RegisterOrganisationRequestMainEcommercePlatformEnum.None,
    label: "I don’t use any online sales platform",
  },
]

export const BUSINESS_ENTITY_TYPES = {
  USA: [
    OrganisationCreationRequestBusinessEntityEnum.UsaCCorporation,
    OrganisationCreationRequestBusinessEntityEnum.UsaSCorporation,
    OrganisationCreationRequestBusinessEntityEnum.UsaLimitedLiabilityCompany,
    OrganisationCreationRequestBusinessEntityEnum.UsaLimitedLiabilityPartership,
    OrganisationCreationRequestBusinessEntityEnum.UsaPartnership,
    OrganisationCreationRequestBusinessEntityEnum.UsaSoleProprietorship,
    OrganisationCreationRequestBusinessEntityEnum.UsaOther,
  ],
  POL: [
    OrganisationCreationRequestBusinessEntityEnum.PolandRegisteredPartnership,
    OrganisationCreationRequestBusinessEntityEnum.PolandProfessionalPartnership,
    OrganisationCreationRequestBusinessEntityEnum.PolandLimitedPartnership,
    OrganisationCreationRequestBusinessEntityEnum.PolandLimitedJointStockPartnership,
    OrganisationCreationRequestBusinessEntityEnum.PolandLimitedLiabilityCompany,
    OrganisationCreationRequestBusinessEntityEnum.PolandJointStockCompany,
    OrganisationCreationRequestBusinessEntityEnum.PolandSoleProprietorship,
    OrganisationCreationRequestBusinessEntityEnum.PolandOther,
  ],
  GBR: [
    OrganisationCreationRequestBusinessEntityEnum.GbrPrivateLimitedCompany,
    OrganisationCreationRequestBusinessEntityEnum.GbrPublicLimitedCompany,
    OrganisationCreationRequestBusinessEntityEnum.GbrCompanyLimitedByGuarantee,
    OrganisationCreationRequestBusinessEntityEnum.GbrUnlimitedCompany,
    OrganisationCreationRequestBusinessEntityEnum.GbrLimitedLiabilityPartnership,
    OrganisationCreationRequestBusinessEntityEnum.GbrCommunityInterestCompany,
    OrganisationCreationRequestBusinessEntityEnum.GbrIndustrialAndProvidentSociety,
    OrganisationCreationRequestBusinessEntityEnum.GbrSoleTrader,
    OrganisationCreationRequestBusinessEntityEnum.GbrOther,
  ],
}

export enum MainRevenueSourceEnum {
  Amazon = "Amazon",
  Walmart = "Walmart",
  Shopify = "Shopify",
  OtherEcommercePlatform = "Other ecommerce platform",
  RetailStoresWholesale = "Retail stores / Wholesale",
  SubscriptionSaaS = "Subscription / SaaS",
  Other = "Other revenue source",
}
