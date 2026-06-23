import { useTranslation } from "react-i18next"
import useAuth from "../../../hooks/useAuth"
import useDeal from "../../../hooks/useDeal"
import {
  CustomerFacingDealDetailsResponseStageEnum,
  DealAttributeObjectAttributeEnum,
} from "../../../services/api/hubspot"
import {
  GrantConsentConsentTypeEnum,
  MissingDocumentResponse,
} from "../../../services/api/organisation-users"

export enum VirtualDocumentTypesEnum {
  APPLICANT_INFORMATION = "APPLICANT_INFORMATION",
}

const useVirtualDocuments = (): {
  missing: MissingDocumentResponse[]
  locked: MissingDocumentResponse[]
  isLoading: boolean
} => {
  const auth = useAuth()
  const { t } = useTranslation("onboarding", {
    keyPrefix: "documents.virtualDocuments",
  })
  const deal = useDeal()
  const missing: MissingDocumentResponse[] = []
  const locked: MissingDocumentResponse[] = []

  if (
    [
      CustomerFacingDealDetailsResponseStageEnum.DataCompleteness,
      CustomerFacingDealDetailsResponseStageEnum.DataValidation,
      CustomerFacingDealDetailsResponseStageEnum.Underwriting,
    ].includes(deal.data?.stage as any) &&
    !auth.partnerId &&
    deal.data?.attributes?.find(
      (item) =>
        item.attribute === DealAttributeObjectAttributeEnum.SoftCreditCheck
    )?.value === true
  ) {
    if (
      auth.organisationData?.consents?.some(
        (consent) =>
          consent.type === GrantConsentConsentTypeEnum.SoftCreditCheck &&
          consent.status === "GIVEN"
      )
    ) {
      locked.push({
        documentType: VirtualDocumentTypesEnum.APPLICANT_INFORMATION,
        title: t("applicantInformation.title"),
        subtitle: t("applicantInformation.subtitle"),
      })
    } else {
      missing.push({
        documentType: VirtualDocumentTypesEnum.APPLICANT_INFORMATION,
        title: t("applicantInformation.title"),
        subtitle: t("applicantInformation.subtitle"),
      })
    }
  }

  return {
    missing,
    locked,
    isLoading: auth.isLoading,
  }
}

export default useVirtualDocuments
