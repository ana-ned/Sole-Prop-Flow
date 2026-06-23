import { IconSvgElement } from "@hugeicons/react"
import { UserListSolidRounded } from "@hugeicons-pro/core-solid-rounded"
import {
  ChartUpSolidStandard,
  CreditCardSolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import useAuth from "../../../hooks/useAuth"
import useDeal from "../../../hooks/useDeal"
import { ConnectionResponseStatusEnum } from "../../../services/api/connections"
import { DealAttributeObjectAttributeEnum } from "../../../services/api/hubspot"
import { GrantConsentConsentTypeEnum } from "../../../services/api/organisation-users"
import useConnections from "../../connections/hooks/useConnections"
import { VirtualDocumentTypesEnum } from "../../onboarding/hooks/useVirtualDocuments"
import { ReactComponent as AmazonIcon } from "../assets/amazon.svg"

export interface MissingDataCheck {
  type:
    | "soft_credit"
    | "bank_error"
    | "bank_missing"
    | "amazon_error"
    | "amazon_missing"
    | "sales_error"
    | "sales_missing"
  url: string
  icon: IconSvgElement | React.ComponentType<any>
}

const useMissingDataChecks = () => {
  const auth = useAuth()
  const deal = useDeal()
  const connections = useConnections()
  const checks: MissingDataCheck[] = []

  if (
    !deal.isDealTypeExcluded &&
    deal.data?.attributes?.find(
      (item) =>
        item.attribute === DealAttributeObjectAttributeEnum.SoftCreditCheck
    )?.value === true &&
    !auth.organisationData?.consents?.some(
      (consent) =>
        consent.type === GrantConsentConsentTypeEnum.SoftCreditCheck &&
        consent.status === "GIVEN"
    )
  ) {
    checks.push({
      type: "soft_credit",
      url: `/onboarding/documents/type/${VirtualDocumentTypesEnum.APPLICANT_INFORMATION}`,
      icon: UserListSolidRounded,
    })
  }

  if (connections.bankingConnections.length === 0) {
    checks.push({
      type: "bank_missing",
      url: "/connections/add/bank-search",
      icon: CreditCardSolidStandard,
    })
  } else if (
    connections.bankingConnections.some(
      (connection) => connection.status === ConnectionResponseStatusEnum.Error
    )
  ) {
    checks.push({
      type: "bank_error",
      url: "/connections",
      icon: CreditCardSolidStandard,
    })
  }

  if (connections.salesConnections.length === 0) {
    if (deal.isAmazonSeller) {
      checks.push({
        type: "amazon_missing",
        url: "/connections/add/amazon",
        icon: AmazonIcon,
      })
    } else {
      checks.push({
        type: "sales_missing",
        url: "/connections/add/sales",
        icon: ChartUpSolidStandard,
      })
    }
  } else if (
    connections.salesConnections.some(
      (connection) => connection.status === ConnectionResponseStatusEnum.Error
    )
  ) {
    if (deal.isAmazonSeller) {
      checks.push({
        type: "amazon_error",
        url: "/connections",
        icon: AmazonIcon,
      })
    } else {
      checks.push({
        type: "sales_error",
        url: "/connections",
        icon: ChartUpSolidStandard,
      })
    }
  }

  return {
    checks,
    isLoading: deal.isLoading || connections.isLoading,
  }
}

export default useMissingDataChecks
