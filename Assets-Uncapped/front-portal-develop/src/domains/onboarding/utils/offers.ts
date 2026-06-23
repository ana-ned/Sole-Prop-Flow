import { TOfferCustomizations } from "../../../hooks/useStore"
import {
  CommonOfferDetailsRepaymentFrequencyEnum,
  OfferResponse,
  OfferResponseOfferStatusEnum,
  OfferResponseOfferTypeEnum,
} from "../../../services/api/agreements"
import { differenceInDays } from "../../../utils/date"

export const OFFER_SELECTED_STATUSES: OfferResponseOfferStatusEnum[] = [
  OfferResponseOfferStatusEnum.Selected,
  OfferResponseOfferStatusEnum.PreSigned,
  OfferResponseOfferStatusEnum.Signed,
]

export interface BusinessLoanOfferParams {
  advance: number
  minAdvance: number
  maxAdvance: number
  currency?: string
  repaymentLength: number
  minRepaymentLength: number
  maxRepaymentLength: number
  baseFee: number
  repaymentFrequency?: CommonOfferDetailsRepaymentFrequencyEnum
  deferredRepaymentPeriod: number
  deferredRepaymentAdditionalFee: number
  maxNumberOfDeferredMonths: number
  dealId?: string
}

export const getBusinessLoanOfferParams = (
  offer: OfferResponse,
  params?: TOfferCustomizations
): BusinessLoanOfferParams => {
  const customizations = params?.[offer.id!]?.customizableOfferParameters

  return {
    advance:
      customizations?.advanceAmount ??
      offer.offerDetails?.fixedOfferDetails?.advanceAmount ??
      offer.offerDetails?.rbfOfferDetails?.advanceAmount ??
      0,
    minAdvance:
      offer.offerDetails?.fixedCustomizableOfferDetails?.minAdvanceAmount ||
      // Backward compatibility for potentially existing offers that hasn't been yet selected.
      offer.offerDetails?.fixedCustomizableOfferDetails?.maxAdvanceAmount! *
        0.1 ||
      1,
    maxAdvance:
      offer.offerDetails?.fixedCustomizableOfferDetails?.maxAdvanceAmount ?? 0,
    currency: offer.offerDetails?.commonOfferDetails?.advanceCurrency,
    repaymentLength:
      customizations?.fixedRepaymentLength ??
      offer.offerDetails?.fixedOfferDetails?.repaymentLength ??
      0,
    minRepaymentLength:
      offer.offerDetails?.fixedCustomizableOfferDetails?.minRepaymentLength ??
      1,
    maxRepaymentLength:
      offer.offerDetails?.fixedCustomizableOfferDetails?.maxRepaymentLength ??
      0,
    baseFee:
      customizations?.fixedRepaymentBaseFee ??
      offer.offerDetails?.fixedOfferDetails?.repaymentBaseFee ??
      0,
    repaymentFrequency:
      offer.offerDetails?.commonOfferDetails?.repaymentFrequency,
    deferredRepaymentPeriod:
      offer.offerDetails?.commonOfferDetails?.deferredRepaymentsParameters
        ?.deferredRepaymentPeriod ?? 0,
    deferredRepaymentAdditionalFee:
      offer.offerDetails?.commonOfferDetails?.deferredRepaymentsParameters
        ?.deferredRepaymentAdditionalFee ?? 0,
    maxNumberOfDeferredMonths:
      offer.offerDetails?.commonOfferDetails?.deferredRepaymentsParameters
        ?.maxNumberOfDeferredMonths ?? 0,
    dealId: offer.offerDetails?.commonOfferDetails?.externalId,
  }
}

interface LineOfCreditOfferParams {
  advance: number
  minAdvance: number
  maxAdvance: number
  currency?: string
  repaymentLength: number
  repaymentLengthMinimum: number
  baseFee: number
  minDraw: number
  repaymentFrequency?: CommonOfferDetailsRepaymentFrequencyEnum
  setupFee: number
  facilityFee: number
  drawdownPeriod: number
  firstDrawAmount?: number
  firstDrawFee?: number
  firstDrawRepaymentDuration?: number
}

export const getLineOfCreditOfferParams = (
  offer: OfferResponse,
  params?: TOfferCustomizations
): LineOfCreditOfferParams => {
  const customizations = params?.[offer.id!]?.lineOfCreditParameters

  return {
    advance:
      customizations?.totalAdvanceAmount ??
      offer.offerDetails?.lineOfCreditDetails?.totalAdvanceAmount ??
      offer.offerDetails?.lineOfCreditDetails?.maxAdvanceAmount ??
      0,
    minAdvance: offer.offerDetails?.lineOfCreditDetails?.minAdvanceAmount ?? 0,
    maxAdvance: offer.offerDetails?.lineOfCreditDetails?.maxAdvanceAmount ?? 0,
    currency: offer.offerDetails?.commonOfferDetails?.advanceCurrency,
    repaymentLength:
      customizations?.drawRepaymentDurationInMonths ??
      offer.offerDetails?.lineOfCreditDetails?.drawRepaymentDuration ??
      0,
    repaymentLengthMinimum:
      offer.offerDetails?.lineOfCreditDetails?.drawRepaymentDurationMinimum ??
      0,
    baseFee: offer.offerDetails?.lineOfCreditDetails?.drawFee ?? 0,
    minDraw: offer.offerDetails?.lineOfCreditDetails?.drawMinimumAmount ?? 0,
    repaymentFrequency:
      offer.offerDetails?.commonOfferDetails?.repaymentFrequency,
    setupFee: offer.offerDetails?.lineOfCreditDetails?.setupFee ?? 0,
    facilityFee: offer.offerDetails?.lineOfCreditDetails?.facilityFee ?? 0,
    drawdownPeriod: offer.offerDetails?.lineOfCreditDetails?.drawDownTerm ?? 0,
    firstDrawAmount: offer.offerDetails?.lineOfCreditDetails?.firstDrawAmount,
    firstDrawFee: offer.offerDetails?.lineOfCreditDetails?.firstDrawFee,
    firstDrawRepaymentDuration:
      offer.offerDetails?.lineOfCreditDetails?.firstDrawRepaymentDuration,
  }
}

export const getRepaymentsSummaryRequestParams = (
  offer: OfferResponse,
  params: TOfferCustomizations
) => {
  if (offer.offerType === OfferResponseOfferTypeEnum.LineOfCredit) {
    const { minDraw, baseFee, repaymentLength } = getLineOfCreditOfferParams(
      offer,
      params
    )
    return {
      advance: minDraw,
      baseFee,
      repaymentLength,
    }
  }

  const { advance, baseFee, repaymentLength } = getBusinessLoanOfferParams(
    offer,
    params
  )
  return {
    advance,
    baseFee,
    repaymentLength:
      offer.offerType === OfferResponseOfferTypeEnum.Flat ? 6 : repaymentLength,
  }
}

const checkLoc = (offerType: OfferResponseOfferTypeEnum) => {
  return [
    OfferResponseOfferTypeEnum.LineOfCredit,
    OfferResponseOfferTypeEnum.InterestRateLineOfCredit,
  ].includes(offerType as any)
}

export const getOfferReadableId = (
  offer: OfferResponse,
  offers?: OfferResponse[]
) => {
  const offerIsLoc = checkLoc(offer.offerType!)

  const similarOffers =
    offers?.filter((item) =>
      offerIsLoc
        ? checkLoc(item.offerType!)
        : item.offerType === offer.offerType
    ) || []

  if (similarOffers.length === 1) {
    return ""
  }

  const index = similarOffers.findIndex((item) => item.id === offer.id)

  return String.fromCodePoint(65 + index)
}

export const getFirstRepaymentDay = (firstRepaymentDate: Date): number => {
  return differenceInDays(firstRepaymentDate, new Date()) + 1
}

export const deferredRepaymentsVisible = (offer: OfferResponse) => {
  const offerParams = getBusinessLoanOfferParams(offer)
  return (
    offerParams.maxNumberOfDeferredMonths > 0 &&
    !OFFER_SELECTED_STATUSES.includes(offer.offerStatus!)
  )
}

export const getOfferAdvanceAmount = (
  offer: OfferResponse
): number | undefined => {
  const details = offer.offerDetails
  if (!details) return undefined

  if (offer.offerType === OfferResponseOfferTypeEnum.InterestRateLineOfCredit) {
    return (
      details.interestRateLocDetails?.firstDrawAmount ??
      details.interestRateLocDetails?.creditLimit
    )
  }

  if (offer.offerType === OfferResponseOfferTypeEnum.LineOfCredit) {
    return (
      details.lineOfCreditDetails?.firstDrawAmount ??
      details.lineOfCreditDetails?.totalAdvanceAmount
    )
  }

  if (offer.offerType === OfferResponseOfferTypeEnum.DailyPayout) {
    return details.dailyPayoutOfferDetails?.advanceLimit
  }

  return (
    details.fixedOfferDetails?.advanceAmount ??
    details.rbfOfferDetails?.advanceAmount
  )
}

export const getRepaymentFrequencyDays = (
  frequency: CommonOfferDetailsRepaymentFrequencyEnum
): number => {
  switch (frequency) {
    case "DAILY": {
      return 1
    }
    case "WEEKLY": {
      return 7
    }
    case "EVERY_14_DAYS": {
      return 14
    }
    case "EVERY_15_DAYS": {
      return 15
    }
    case "MONTHLY": {
      return 30
    }
    default: {
      return 14
    }
  }
}
