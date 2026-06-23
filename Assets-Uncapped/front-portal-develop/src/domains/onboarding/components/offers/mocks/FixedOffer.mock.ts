import {
  CommonOfferDetailsLoanProductTypeEnum,
  CommonOfferDetailsRepaymentFrequencyEnum,
  CommonOfferDetailsRepaymentTypeEnum,
  CommonOfferDetailsSecurityTypeEnum,
  OfferResponse,
  OfferResponseOfferStatusEnum,
  OfferResponseOfferTypeEnum,
} from "../../../../../services/api/agreements"

const FixedOffer: OfferResponse = {
  id: "e4fc4108-d95f-4a7e-aef3-830a77135fdd",
  organisationId: "Testeliza37dev",
  offerType: OfferResponseOfferTypeEnum.Fixed,
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
      repaymentFrequency: CommonOfferDetailsRepaymentFrequencyEnum.Weekly,
      advanceCurrency: "GBP",
      signedOffline: false,
    },
    fixedOfferDetails: {
      advanceAmount: 400000,
      repaymentLength: 6,
      repaymentBaseFee: 0.05,
    },
  },
  creationDate: new Date("2023-02-21T17:24:47.346918Z"),
  expirationDate: new Date("2023-03-07T17:24:47.326343Z"),
}

export default FixedOffer
