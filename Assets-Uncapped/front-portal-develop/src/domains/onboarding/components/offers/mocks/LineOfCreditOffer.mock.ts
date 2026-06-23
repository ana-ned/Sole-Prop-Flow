import {
  CommonOfferDetailsLoanProductTypeEnum,
  CommonOfferDetailsRepaymentFrequencyEnum,
  CommonOfferDetailsRepaymentTypeEnum,
  CommonOfferDetailsSecurityTypeEnum,
  OfferResponse,
  OfferResponseOfferStatusEnum,
  OfferResponseOfferTypeEnum,
} from "../../../../../services/api/agreements"

const LineOfCreditOffer: OfferResponse = {
  id: "e1205259-5774-4e3f-ad66-931e55e60b59",
  organisationId: "Testeliza37dev",
  offerType: OfferResponseOfferTypeEnum.LineOfCredit,
  offerStatus: OfferResponseOfferStatusEnum.New,
  offerDetails: {
    commonOfferDetails: {
      billOtherFee: 0.005,
      billMarketingFee: 0.005,
      billInventoryFee: 0.005,
      loanProductType: CommonOfferDetailsLoanProductTypeEnum.LineOfCredit,
      cashTransferAllowed: false,
      securityType: CommonOfferDetailsSecurityTypeEnum.None,
      repaymentType: CommonOfferDetailsRepaymentTypeEnum.Automatic,
      repaymentFrequency: CommonOfferDetailsRepaymentFrequencyEnum.Monthly,
      advanceCurrency: "GBP",
      signedOffline: false,
    },
    lineOfCreditDetails: {
      facilityFee: 0.01,
      setupFee: 0.01,
      drawMinimumAmount: 5000,
      totalAdvanceAmount: 100000,
      drawRepaymentDuration: 6,
      minAdvanceAmount: 100000,
      maxAdvanceAmount: 100000,
      drawDownTerm: 6,
      drawFee: 0.01,
      minRepaymentLength: 6,
      maxRepaymentLength: 6,
    },
  },
  creationDate: new Date("2023-02-27T22:28:01.451814Z"),
  expirationDate: new Date("2023-03-13T00:00:00Z"),
}

export default LineOfCreditOffer
