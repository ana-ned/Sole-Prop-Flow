import freshBooksIcon from "../assets/accounting-platforms/icons/freshbooks.svg"
import kashFlowIcon from "../assets/accounting-platforms/icons/kashflow.svg"
import oracleNetsuiteIcon from "../assets/accounting-platforms/icons/oracle-netsuite.svg"
import quickbookIcon from "../assets/accounting-platforms/icons/quickbooks.svg"
import sageIcon from "../assets/accounting-platforms/icons/sage.svg"
import xeroIcon from "../assets/accounting-platforms/icons/xero.svg"
import zohoBooksIcon from "../assets/accounting-platforms/icons/zoho-books.svg"
import amazonAdsIcon from "../assets/sales-platforms/icons/amazon-ads.svg"
import amazonIcon from "../assets/sales-platforms/icons/amazon.svg"
import braintreeIcon from "../assets/sales-platforms/icons/braintree.svg"
import checkoutIcon from "../assets/sales-platforms/icons/checkout.svg"
import klarnaIcon from "../assets/sales-platforms/icons/klarna.svg"
import payPalIcon from "../assets/sales-platforms/icons/paypal.svg"
import shopifyIcon from "../assets/sales-platforms/icons/shopify.svg"
import stripeIcon from "../assets/sales-platforms/icons/stripe.svg"
import walmartIcon from "../assets/sales-platforms/icons/walmart.svg"

export const enum PlatformCategory {
  sales = "sales",
  accounting = "accounting",
  banking = "banking",
}

export interface Platform {
  category: PlatformCategory
  name: string
  subtitle?: string
  systemId: string
  connectionTemplateId: string
  iconUrl?: string
  automatic?: boolean
  reuse: boolean // can be added only once
  ecommerce?: boolean
  consentRequired?: boolean
}

const platforms = {
  AmazonV2: {
    category: PlatformCategory.sales,
    name: "Amazon",
    subtitle: "Connect another region",
    systemId: "AMAZON_V2",
    connectionTemplateId: "AMAZON_CONNECTION_TEMPLATE",
    iconUrl: amazonIcon,
    reuse: true,
    ecommerce: true,
  },
  AmazonAds: {
    category: PlatformCategory.sales,
    name: "Amazon Ads",
    systemId: "AMAZON_ADS",
    connectionTemplateId: "AMAZON_ADS_CONNECTION_TEMPLATE",
    iconUrl: amazonAdsIcon,
    automatic: true,
    reuse: true,
    ecommerce: true,
  },
  Stripe: {
    category: PlatformCategory.sales,
    name: "Stripe",
    systemId: "STRIPE",
    connectionTemplateId: "STRIPE_CONNECTION_TEMPLATE",
    iconUrl: stripeIcon,
    automatic: true,
    reuse: true,
  },
  ShopifyV2: {
    category: PlatformCategory.sales,
    name: "Shopify",
    systemId: "SHOPIFY_V2",
    connectionTemplateId: "SHOPIFY_CONNECTION_TEMPLATE",
    iconUrl: shopifyIcon,
    reuse: true,
    ecommerce: true,
  },
  PayPal: {
    category: PlatformCategory.sales,
    name: "PayPal",
    systemId: "PAYPAL",
    connectionTemplateId: "PAYPAL_CONNECTION_TEMPLATE",
    iconUrl: payPalIcon,
    reuse: true,
    automatic: true,
  },
  Braintree: {
    category: PlatformCategory.sales,
    name: "PayPal Braintree",
    systemId: "BRAINTREE",
    connectionTemplateId: "BRAINTREE_CONNECTION_TEMPLATE",
    iconUrl: braintreeIcon,
    reuse: false,
  },
  Checkout: {
    category: PlatformCategory.sales,
    name: "Checkout.com",
    systemId: "CHECKOUT",
    connectionTemplateId: "CHECKOUT_CONNECTION_TEMPLATE",
    iconUrl: checkoutIcon,
    reuse: false,
  },
  Klarna: {
    category: PlatformCategory.sales,
    name: "Klarna",
    systemId: "KLARNA",
    connectionTemplateId: "KLARNA_CONNECTION_TEMPLATE",
    iconUrl: klarnaIcon,
    reuse: false,
  },
  WalmartV2: {
    category: PlatformCategory.sales,
    name: "Walmart",
    systemId: "WALMART",
    connectionTemplateId: "WALMART_CONNECTION_TEMPLATE",
    iconUrl: walmartIcon,
    reuse: true,
  },
  Invoicing: {
    category: PlatformCategory.sales,
    name: "Invoicing",
    systemId: "INVOICING",
    connectionTemplateId: "INVOICING_CONNECTION_TEMPLATE",
    reuse: false,
  },
  DirectDebit: {
    category: PlatformCategory.sales,
    name: "Direct debit",
    systemId: "DIRECT_DEBIT",
    connectionTemplateId: "DIRECT_DEBIT_CONNECTION_TEMPLATE",
    reuse: false,
  },
  Quickbooks: {
    category: PlatformCategory.accounting,
    name: "Quickbooks",
    systemId: "QUICKBOOKS",
    connectionTemplateId: "QUICKBOOKS_CONNECTION_TEMPLATE",
    iconUrl: quickbookIcon,
    automatic: true,
    reuse: false,
  },
  Xero: {
    category: PlatformCategory.accounting,
    name: "Xero",
    systemId: "XERO_CODAT",
    connectionTemplateId: "XERO_CODAT_CONNECTION_TEMPLATE",
    iconUrl: xeroIcon,
    automatic: true,
    reuse: false,
  },
  Sage: {
    category: PlatformCategory.accounting,
    name: "Sage Business Cloud",
    systemId: "SAGE_BUSINESS_CLOUD",
    connectionTemplateId: "SAGE_BUSINESS_CLOUD_CONNECTION_TEMPLATE",
    iconUrl: sageIcon,
    automatic: true,
    reuse: false,
  },
  ZohoBooks: {
    category: PlatformCategory.accounting,
    name: "Zoho Books",
    systemId: "ZOHOBOOKS",
    connectionTemplateId: "ZOHOBOOKS_CONNECTION_TEMPLATE",
    iconUrl: zohoBooksIcon,
    automatic: true,
    reuse: false,
  },
  Oraclenetsuite: {
    category: PlatformCategory.accounting,
    name: "Oracle Netsuite",
    systemId: "ORACLE_NETSUITE",
    connectionTemplateId: "ORACLE_NETSUITE_CONNECTION_TEMPLATE",
    iconUrl: oracleNetsuiteIcon,
    reuse: false,
    automatic: true,
  },
  Freshbooks: {
    category: PlatformCategory.accounting,
    name: "Freshbooks",
    systemId: "FRESHBOOKS",
    connectionTemplateId: "FRESHBOOKS_CONNECTION_TEMPLATE",
    iconUrl: freshBooksIcon,
    automatic: true,
    reuse: false,
  },
  Kashflow: {
    category: PlatformCategory.accounting,
    name: "Iris Kashflow",
    systemId: "KASHFLOW",
    connectionTemplateId: "KASHFLOW_CONNECTION_TEMPLATE",
    iconUrl: kashFlowIcon,
    automatic: true,
    reuse: false,
  },
  Plaid: {
    category: PlatformCategory.banking,
    name: "Plaid",
    systemId: "PLAID",
    connectionTemplateId: "PLAID_CONNECTION_TEMPLATE",
    reuse: true,
    automatic: true,
  },
  Saltedge: {
    category: PlatformCategory.banking,
    name: "Saltedge",
    systemId: "SALTEDGE",
    connectionTemplateId: "SALTEDGE_CONNECTION_TEMPLATE",
    reuse: true,
    automatic: true,
    consentRequired: true,
  },
  Yapily: {
    category: PlatformCategory.banking,
    name: "Yapily",
    systemId: "YAPILY",
    connectionTemplateId: "YAPILY_CONNECTION_TEMPLATE",
    reuse: true,
    automatic: true,
    consentRequired: true,
  },
} satisfies Record<string, Platform>

export const salesPlatforms = () =>
  Object.values(platforms).filter(({ category, systemId }) => {
    return (
      category === PlatformCategory.sales &&
      systemId !== platforms.Invoicing.systemId &&
      systemId !== platforms.DirectDebit.systemId
    )
  })

export const featuredSalesPlatforms = [
  platforms.AmazonV2,
  platforms.AmazonAds,
  platforms.ShopifyV2,
  platforms.WalmartV2,
  platforms.Stripe,
]

export const accountingPlatforms = Object.values(platforms).filter(
  ({ category }) => category === PlatformCategory.accounting
)

export const bankingPlatforms = Object.values(platforms).filter(
  ({ category }) => category === PlatformCategory.banking
)

export const featuredAccountingPlatforms = [
  platforms.Quickbooks,
  platforms.Xero,
]

export default platforms
