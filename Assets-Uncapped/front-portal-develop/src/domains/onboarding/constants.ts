import { ApplicationFlowStepResponseStepEnum } from "../../services/api/hubspot"
import { VirtualDocumentTypesEnum } from "./hooks/useVirtualDocuments"

export const ONBOARDING_BASE_PATH = "/onboarding"

export const OnboardingSidePaths = {
  Documents: "/documents",
}

export const OnboardingFullSidePaths = {
  Documents: `${ONBOARDING_BASE_PATH}${OnboardingSidePaths.Documents}`,
}

export enum OnboardingPaths {
  Sales = "/sales",
  SalesAmazon = "/sales/amazon",
  Accounting = "/accounting",
  Banking = "/banking",
  Business = "/business-details",
  Review = "/review",
  Offers = "/offers",
  Signing = "/signing",
  Owners = "/owners",
  DirectDebit = "/direct-debit",
  Submit = "/submitted",
  BookCall = "/book-call",
  InformationRequired = "/information-required",
  Rejected = "/rejected",
  AmazonConsent = "/amazon-consent",
  ReviewBankDetails = "/review-bank-details",
}

export const OnboardingMenuPaths = {
  Sales: `${ONBOARDING_BASE_PATH}${OnboardingPaths.Sales}`,
  SalesAmazon: `${ONBOARDING_BASE_PATH}${OnboardingPaths.SalesAmazon}`,
  Accounting: `${ONBOARDING_BASE_PATH}${OnboardingPaths.Accounting}`,
  Banking: `${ONBOARDING_BASE_PATH}${OnboardingPaths.Banking}`,
  Business: `${ONBOARDING_BASE_PATH}${OnboardingPaths.Business}`,
  SoftCreditCheck: `${ONBOARDING_BASE_PATH}${OnboardingSidePaths.Documents}/type/${VirtualDocumentTypesEnum.APPLICANT_INFORMATION}`,
  Review: `${ONBOARDING_BASE_PATH}${OnboardingPaths.Review}`,
  Offers: `${ONBOARDING_BASE_PATH}${OnboardingPaths.Offers}`,
  Signing: `${ONBOARDING_BASE_PATH}${OnboardingPaths.Signing}`,
  Owners: `${ONBOARDING_BASE_PATH}${OnboardingPaths.Owners}`,
  DirectDebit: `${ONBOARDING_BASE_PATH}${OnboardingPaths.DirectDebit}`,
  InformationRequired: `${ONBOARDING_BASE_PATH}${OnboardingPaths.InformationRequired}`,
  Submit: `${ONBOARDING_BASE_PATH}${OnboardingPaths.Submit}`,
  AmazonConsent: `${ONBOARDING_BASE_PATH}${OnboardingPaths.AmazonConsent}`,
  ReviewBankDetails: `${ONBOARDING_BASE_PATH}${OnboardingPaths.ReviewBankDetails}`,
}

export const ApplicationStepMap: Record<
  string,
  ApplicationFlowStepResponseStepEnum
> = {
  [OnboardingMenuPaths.Sales]: ApplicationFlowStepResponseStepEnum.Sales,
  [OnboardingMenuPaths.Accounting]:
    ApplicationFlowStepResponseStepEnum.Accounting,
  [OnboardingMenuPaths.Banking]: ApplicationFlowStepResponseStepEnum.Banking,
}

export enum UploadDocumentType {
  OutstandingDebt = "OUTSTANDING_DEBT",
  GrossMargin = "GROSS_MARGIN",
  TotalCashBalance = "TOTAL_CASH_BALANCE",
  BankStatement = "BANK_STATEMENT",
  ProfitLossReport = "PROFIT_LOSS_REPORT",
  BalanceSheet = "BALANCE_SHEET",
}

export const ACCOUNTING_LOWER_OFFER_BREAKPOINT = 500000
