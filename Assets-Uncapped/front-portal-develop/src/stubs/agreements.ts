import {
  DetailedAgreementDTO,
  DetailedAgreementDTOStatusEnum,
} from "../services/api/agreements"

const AgreementActive: DetailedAgreementDTO = {
  id: "testId",
  organisationId: "testOrg",
  currency: "USD",
  signedOffline: false,
  status: DetailedAgreementDTOStatusEnum.Active,
}

const AgreementClosed: DetailedAgreementDTO = {
  ...AgreementActive,
  status: DetailedAgreementDTOStatusEnum.Closed,
}

export const AgreementsList: DetailedAgreementDTO[] = [
  AgreementActive,
  AgreementClosed,
]
