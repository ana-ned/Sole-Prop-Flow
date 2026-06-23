import { ChipColor } from "../../../components/UI/Chip/Chip"

export const TransactionTypeFilter = {
  All: "all",
  Payments: "payments",
  Advances: "advances",
} as const

export type TransactionTypeFilter =
  (typeof TransactionTypeFilter)[keyof typeof TransactionTypeFilter]
import i18n from "../../../inits/i18next"
import {
  DetailedAgreementDTO,
  DetailedAgreementDTODebtProviderEnum,
  DetailedAgreementDTODetailedProductTypeEnum,
  TransactionStatusEnum,
} from "../../../services/api/agreements"
import { formatDate } from "../../../utils/date"
import { format } from "../../../utils/money"

type LoanProductConfig = {
  defaultKey: string
  providerOverrides?: Partial<
    Record<DetailedAgreementDTODebtProviderEnum, string>
  >
}

const LOAN_PRODUCT_CONFIG: Partial<
  Record<DetailedAgreementDTODetailedProductTypeEnum, LoanProductConfig>
> = {
  [DetailedAgreementDTODetailedProductTypeEnum.LineOfCreditFixedFrame]: {
    defaultKey: "LOC",
  },
  [DetailedAgreementDTODetailedProductTypeEnum.LineOfCreditFixedDraw]: {
    defaultKey: "LOC",
  },
  [DetailedAgreementDTODetailedProductTypeEnum.LineOfCreditInterestRate]: {
    defaultKey: "LOC",
  },
  [DetailedAgreementDTODetailedProductTypeEnum.DailyPayout]: {
    defaultKey: "DAILY_PAYOUT",
  },
  [DetailedAgreementDTODetailedProductTypeEnum.Rbf]: {
    defaultKey: "RBF",
    providerOverrides: {
      [DetailedAgreementDTODebtProviderEnum.Fasanara]: "SELLERSFI.RBF",
    },
  },
  [DetailedAgreementDTODetailedProductTypeEnum.InterestRate]: {
    defaultKey: "INTEREST_RATE",
    providerOverrides: {
      [DetailedAgreementDTODebtProviderEnum.Fasanara]: "SELLERSFI.TERM_LOAN",
      [DetailedAgreementDTODebtProviderEnum.Marcus]: "MARCUS.TERM_LOAN",
    },
  },
  [DetailedAgreementDTODetailedProductTypeEnum.Fixed]: {
    defaultKey: "FIXED",
    providerOverrides: {
      [DetailedAgreementDTODebtProviderEnum.Fasanara]: "SELLERSFI.CAPITAL_LOAN",
    },
  },
}

export const getLoanProductTypeName = (
  agreement: DetailedAgreementDTO,
  fullName?: boolean
): string => {
  const { debtProvider, detailedProductType } = agreement
  const keyType = "transactions:loanProductTypes"

  const config = detailedProductType
    ? LOAN_PRODUCT_CONFIG[detailedProductType]
    : undefined

  if (!config) {
    return i18n.t(`${keyType}.UNKNOWN`)
  }

  const providerOverride = debtProvider
    ? config.providerOverrides?.[debtProvider]
    : undefined

  if (providerOverride) {
    return i18n.t(`${keyType}.${providerOverride}`) as string
  }

  return i18n.t(
    `${keyType}.${config.defaultKey}.${fullName ? "full" : "short"}`
  ) as string
}

export const getTransactionStatusColor = (
  status: TransactionStatusEnum
): ChipColor => {
  if (
    (
      [
        TransactionStatusEnum.Completed,
        TransactionStatusEnum.Sent,
        TransactionStatusEnum.Received,
      ] as TransactionStatusEnum[]
    ).includes(status)
  ) {
    return "success"
  }
  if (
    (
      [
        TransactionStatusEnum.Failed,
        TransactionStatusEnum.Canceled,
      ] as TransactionStatusEnum[]
    ).includes(status)
  ) {
    return "danger"
  }
  if (
    ([TransactionStatusEnum.Retrying] as TransactionStatusEnum[]).includes(
      status
    )
  ) {
    return "warning"
  }
  return "default"
}

export const formatLoanInfo = (
  agreement: DetailedAgreementDTO,
  fullName?: boolean
): string => {
  const amountSection =
    !agreement.advanceAmount ||
    agreement.advanceAmount === 0 ||
    !agreement.currency
      ? ""
      : ` - ${format(agreement.advanceAmount, agreement.currency, { minimumFractionDigits: 0, notation: "compact" })}`

  return `${getLoanProductTypeName(agreement, fullName)}${amountSection} -${fullName ? " Activated" : ""} ${formatDate(
    new Date(agreement.activationDate!),
    {
      customFormat: "MMM yyyy",
    }
  )}`
}
