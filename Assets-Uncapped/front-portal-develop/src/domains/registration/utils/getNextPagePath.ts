import {
  AttributionResponsePartnerEnum,
  RegisterOrganisationResponse,
} from "../../../services/api/organisation-users"
import { ONBOARDING_BASE_PATH } from "../../onboarding/constants"
import EligibilityCheckStatusPaths from "../EligibilityCheckStatusPaths"

const BASE_STATUS_PATH = "/funding/status/"

const getNextPagePath = (
  res: RegisterOrganisationResponse,
  opts: {
    source?: AttributionResponsePartnerEnum
  }
): {
  url: string
} => {
  if (res.eligibleForFunding) {
    if (opts.source === AttributionResponsePartnerEnum.Amazon) {
      return {
        url: ONBOARDING_BASE_PATH,
      }
    }
    return {
      url: `${BASE_STATUS_PATH}${EligibilityCheckStatusPaths.EligibleBallparkOffer}`,
    }
  }

  return {
    url: `${BASE_STATUS_PATH}${EligibilityCheckStatusPaths.NotEligible}`,
  }
}

export default getNextPagePath
