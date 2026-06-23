import env from "../../utils/runtime-env"
import {
  Configuration as ConfigurationAgreements,
  ConfigurationParameters,
} from "./agreements"
import { Configuration as ConfigurationAmazonGateway } from "./amazon-gateway"
import { Configuration as ConfigurationCollections } from "./collections"
import { Configuration as ConfigurationConnections } from "./connections"
import { Configuration as ConfigurationHubSpot } from "./hubspot"
import { Configuration as ConfigurationKyc } from "./kyc"
import { Configuration as ConfigurationLoanOperations } from "./loan-operations"
import { Configuration as ConfigurationOrganisationUsers } from "./organisation-users"
import { Configuration as ConfigurationPartners } from "./partners"
import { Configuration as ConfigurationUnderwriting } from "./underwriting"
import { Configuration as ConfigurationReengagement } from "./reengagement"

export enum ApiServicesEnum {
  Kyc = "kyc",
  OrganisationUsers = "organisation-users",
  Connections = "connections",
  LoanOperations = "loan-operations",
  Agreements = "agreements",
  Collections = "collections",
  Partners = "partners",
  HubSpot = "hubspot",
  Underwriting = "underwriting",
  AmazonGateway = "amazon-gateway",
  Reengagement = "reengagement",
}

const apiConfig = ({
  token,
  service,
}: {
  token?: string
  service: ApiServicesEnum
}): any => {
  const params = {
    basePath: `${env("REACT_APP_API_URL")}/${service}`,
    accessToken: token,
  } satisfies ConfigurationParameters

  switch (service) {
    case ApiServicesEnum.Kyc: {
      return new ConfigurationKyc(params)
    }

    case ApiServicesEnum.OrganisationUsers: {
      return new ConfigurationOrganisationUsers(params)
    }

    case ApiServicesEnum.Connections: {
      return new ConfigurationConnections(params)
    }

    case ApiServicesEnum.LoanOperations: {
      return new ConfigurationLoanOperations(params)
    }

    case ApiServicesEnum.Agreements: {
      return new ConfigurationAgreements(params)
    }

    case ApiServicesEnum.Collections: {
      return new ConfigurationCollections(params)
    }

    case ApiServicesEnum.Partners: {
      return new ConfigurationPartners(params)
    }

    case ApiServicesEnum.HubSpot: {
      return new ConfigurationHubSpot(params)
    }

    case ApiServicesEnum.Underwriting: {
      return new ConfigurationUnderwriting(params)
    }

    case ApiServicesEnum.AmazonGateway: {
      return new ConfigurationAmazonGateway(params)
    }

    case ApiServicesEnum.Reengagement: {
      return new ConfigurationReengagement(params)
    }

    default: {
      throw new Error("API configuration is missing")
    }
  }
}

export default apiConfig
