import "i18next"
import agreements from "../../public/static/locales/en-GB/agreements.json"
import cards from "../../public/static/locales/en-GB/cards.json"
import common from "../../public/static/locales/en-GB/common.json"
import connections from "../../public/static/locales/en-GB/connections.json"
import dashboard from "../../public/static/locales/en-GB/dashboard.json"
import error from "../../public/static/locales/en-GB/error.json"
import invitations from "../../public/static/locales/en-GB/invitations.json"
import kyc from "../../public/static/locales/en-GB/kyc.json"
import lineOfCredit from "../../public/static/locales/en-GB/line-of-credit.json"
import onboarding from "../../public/static/locales/en-GB/onboarding.json"
import partnerApplication from "../../public/static/locales/en-GB/partner-application.json"
import partnerDashboard from "../../public/static/locales/en-GB/partner-dashboard.json"
import partnerRegistration from "../../public/static/locales/en-GB/partner-registration.json"
import pay from "../../public/static/locales/en-GB/pay.json"
import profile from "../../public/static/locales/en-GB/profile.json"
import registration from "../../public/static/locales/en-GB/registration.json"
import staticJson from "../../public/static/locales/en-GB/static.json"
import transactions from "../../public/static/locales/en-GB/transactions.json"
import withdraw from "../../public/static/locales/en-GB/withdraw.json"

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      common: typeof common
      cards: typeof cards
      connections: typeof connections
      dashboard: typeof dashboard
      error: typeof error
      agreements: typeof agreements
      onboarding: typeof onboarding
      pay: typeof pay
      profile: typeof profile
      registration: typeof registration
      transactions: typeof transactions
      "partner-registration": typeof partnerRegistration
      "partner-application": typeof partnerApplication
      "partner-dashboard": typeof partnerDashboard
      kyc: typeof kyc
      "line-of-credit": typeof lineOfCredit
      invitations: typeof invitations
      withdraw: typeof withdraw
      static: typeof staticJson
    }
  }
}
