import {
  CommonOfferDetailsLoanProductTypeEnum,
  CommonOfferDetailsRepaymentFrequencyEnum,
  CommonOfferDetailsRepaymentTypeEnum,
  CommonOfferDetailsSecurityTypeEnum,
  OfferResponse,
  OfferResponseOfferStatusEnum,
  OfferResponseOfferTypeEnum,
} from "../../../../../services/api/agreements"

const EditableOffer: OfferResponse = {
  id: "1949cc4e-3657-4a6a-9a09-1b8530502e69",
  organisationId: "Testeliza37dev",
  offerType: OfferResponseOfferTypeEnum.FixedCustomizable,
  offerStatus: OfferResponseOfferStatusEnum.New,
  basicRepaymentDetails: {
    firstRepaymentAmount: 2000,
  },
  offerDetails: {
    commonOfferDetails: {
      billOtherFee: 0.005,
      billMarketingFee: 0.005,
      billInventoryFee: 0.005,
      loanProductType: CommonOfferDetailsLoanProductTypeEnum.Core,
      cashTransferAllowed: false,
      securityType: CommonOfferDetailsSecurityTypeEnum.None,
      repaymentType: CommonOfferDetailsRepaymentTypeEnum.Automatic,
      repaymentFrequency: CommonOfferDetailsRepaymentFrequencyEnum.Monthly,
      advanceCurrency: "GBP",
      signedOffline: false,
    },
    fixedCustomizableOfferDetails: {
      maxAdvanceAmount: 36307,
      maxRepaymentLength: 6,
      maxBaseFee: 0.06,
    },
    fixedOfferDetails: {
      advanceAmount: 36307,
      repaymentBaseFee: 0.06,
    },
  },
  creationDate: new Date("2023-02-14T13:58:05.461455Z"),
  expirationDate: new Date("2023-02-28T00:00:00Z"),
}

export default EditableOffer
