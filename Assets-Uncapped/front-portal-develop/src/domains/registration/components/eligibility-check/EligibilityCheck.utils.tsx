import {
  RegisterOrganisationRequestTypesOfBusinessEnum,
  RegisterOrganisationRequestMainEcommercePlatformEnum,
} from "../../../../services/api/organisation-users"
import { MainRevenueSourceEnum } from "./EligibilityCheckForm.types"

export const getMarketplaceUrlNoticeTranslationKey = (website: string) => {
  const AMAZON_REGEX = /amazon\.[\w.]+\/shops\/\w+/
  const EBAY_REGEX = /ebay\.[\w.]+\/str\/\w+/
  const SHOPIFY_REGEX = /\w+\.myshopify\.com/

  if (website.includes("amazon") && !AMAZON_REGEX.test(website)) {
    return "eligibility.EligibilityCheck.businessWebsiteHints.amazon"
  }

  if (
    (website.includes("shopify") || website.includes("myshopify")) &&
    !SHOPIFY_REGEX.test(website)
  ) {
    return "eligibility.EligibilityCheck.businessWebsiteHints.shopify"
  }

  if (website.includes("ebay") && !EBAY_REGEX.test(website)) {
    return "eligibility.EligibilityCheck.businessWebsiteHints.ebay"
  }

  return undefined
}

export const canBeSoleTrader = (companyName?: string) => {
  const exclusionKeywords = [
    "LLC",
    "LLP",
    "INC",
    "INCORPORATED",
    "CORP",
    "CORPORATION",
    "LTD",
    "Limited",
  ]

  return !exclusionKeywords.some((keyword) =>
    companyName
      ?.trim()
      .replaceAll(/\W/g, "")
      .toLowerCase()
      .includes(keyword.toLowerCase())
  )
}

export const mapMainRevenueToServerValues = (
  mainRevenueSource: MainRevenueSourceEnum
): {
  typesOfBusiness: Set<RegisterOrganisationRequestTypesOfBusinessEnum>
  mainEcommercePlatform?: RegisterOrganisationRequestMainEcommercePlatformEnum
} => {
  switch (mainRevenueSource) {
    case MainRevenueSourceEnum.Amazon: {
      return {
        typesOfBusiness: new Set([
          RegisterOrganisationRequestTypesOfBusinessEnum.EcommerceAmazonMarketplace,
        ]),
        mainEcommercePlatform:
          RegisterOrganisationRequestMainEcommercePlatformEnum.Amazon,
      }
    }
    case MainRevenueSourceEnum.Walmart: {
      return {
        typesOfBusiness: new Set([
          RegisterOrganisationRequestTypesOfBusinessEnum.EcommerceAmazonMarketplace,
        ]),
        mainEcommercePlatform:
          RegisterOrganisationRequestMainEcommercePlatformEnum.Walmart,
      }
    }
    case MainRevenueSourceEnum.Shopify: {
      return {
        typesOfBusiness: new Set([
          RegisterOrganisationRequestTypesOfBusinessEnum.EcommerceAmazonMarketplace,
        ]),
        mainEcommercePlatform:
          RegisterOrganisationRequestMainEcommercePlatformEnum.Shopify,
      }
    }
    case MainRevenueSourceEnum.OtherEcommercePlatform: {
      return {
        typesOfBusiness: new Set([
          RegisterOrganisationRequestTypesOfBusinessEnum.EcommerceAmazonMarketplace,
        ]),
        mainEcommercePlatform:
          RegisterOrganisationRequestMainEcommercePlatformEnum.Other,
      }
    }
    case MainRevenueSourceEnum.RetailStoresWholesale: {
      return {
        typesOfBusiness: new Set([
          RegisterOrganisationRequestTypesOfBusinessEnum.RetailWholesale,
        ]),
        mainEcommercePlatform: undefined,
      }
    }
    case MainRevenueSourceEnum.SubscriptionSaaS: {
      return {
        typesOfBusiness: new Set([
          RegisterOrganisationRequestTypesOfBusinessEnum.SubscriptionSaas,
        ]),
        mainEcommercePlatform: undefined,
      }
    }
    case MainRevenueSourceEnum.Other: {
      return {
        typesOfBusiness: new Set([
          RegisterOrganisationRequestTypesOfBusinessEnum.Other,
        ]),
        mainEcommercePlatform: undefined,
      }
    }
    default: {
      return {
        typesOfBusiness: new Set(),
        mainEcommercePlatform: undefined,
      }
    }
  }
}
