import {
  Calendar03SolidStandard,
  CreditCardSolidStandard,
  MoneyReceive02SolidStandard,
  Wallet03SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import {
  DetailedAgreementDTO,
  DetailedAgreementDTODetailedProductTypeEnum,
} from "../../services/api/agreements"

const DetailedProductType = DetailedAgreementDTODetailedProductTypeEnum

const PRODUCT_CONFIG = {
  [DetailedProductType.Rbf]: {
    titleKey: "cashAdvance",
    severity: "accent-9",
    icon: MoneyReceive02SolidStandard,
  },
  [DetailedProductType.InterestRate]: {
    titleKey: "revenueLoan",
    severity: "accent-4",
    icon: Calendar03SolidStandard,
  },
  [DetailedProductType.Fixed]: {
    titleKey: "termLoan",
    severity: "accent-4",
    icon: Calendar03SolidStandard,
  },
  [DetailedProductType.LineOfCreditInterestRate]: {
    titleKey: "lineOfCredit",
    severity: "accent-3",
    icon: Wallet03SolidStandard,
  },
  [DetailedProductType.LineOfCreditFixedFrame]: {
    titleKey: "lineOfCredit",
    severity: "accent-3",
    icon: CreditCardSolidStandard,
  },
  [DetailedProductType.LineOfCreditFixedDraw]: {
    titleKey: "lineOfCreditDraw",
    severity: "accent-3",
    icon: Wallet03SolidStandard,
  },
  [DetailedProductType.DailyPayout]: {
    titleKey: "dailyPayout",
    severity: "accent-4",
    icon: MoneyReceive02SolidStandard,
  },
} as const

const FALLBACK_CONFIG = {
  titleKey: "agreement",
  severity: "accent-4",
  icon: CreditCardSolidStandard,
} as const

export const getProductConfig = (agreement: DetailedAgreementDTO) => {
  const type = agreement.detailedProductType ?? agreement.productType
  if (type && type in PRODUCT_CONFIG) {
    return PRODUCT_CONFIG[type as keyof typeof PRODUCT_CONFIG]
  }
  return FALLBACK_CONFIG
}
