import React, { useEffect, useMemo, useRef } from "react"
import { useUnleashClient } from "@unleash/proxy-client-react"
import { isEqual } from "lodash-es"
import PageLoader from "./components/Collections/PageLoader"
import useAttribution from "./hooks/useAttribution"
import useAuth, { AUTH0_ROLES_FIELD } from "./hooks/useAuth"
import useAuthorizedMicrosoftClarity from "./hooks/useAuthorizedMicrosoftClarity"
import useAuthorizedSentry from "./hooks/useAuthorizedSentry"
import useDeal from "./hooks/useDeal"
import useTrackedQueryParams from "./hooks/useTrackedQueryParams"
import { useTracking } from "./hooks/useTracking"

const AppBase = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth()
  const attribution = useAttribution()
  const { trackUserProps, isInitialized } = useTracking()
  const allFeatureFlags = useUnleashClient().getAllToggles()
  const lastTrackedValue = useRef<typeof userProps>(undefined)
  const deal = useDeal()

  useAuthorizedSentry()
  useAuthorizedMicrosoftClarity()
  useTrackedQueryParams()

  const userProps = useMemo(
    () => ({
      organisationId: auth.organisation?.organisationId,
      activated: !!auth.organisation?.activated,
      email: auth.user?.email,
      firstName: auth.user?.given_name,
      lastName: auth.user?.family_name,
      phone: auth.user?.phone_number,
      roles: [...new Set(auth.user?.[AUTH0_ROLES_FIELD] || [])],
      featureFlags: allFeatureFlags
        .filter((item) => item.enabled)
        .map((item) => item.name),
      isAmazonSeller: deal.isAmazonSeller,
      tier: deal.data?.tier,
    }),
    [
      auth.organisation?.organisationId,
      auth.organisation?.activated,
      auth.user,
      allFeatureFlags,
      deal.isAmazonSeller,
      deal.data?.tier,
    ]
  )

  useEffect(() => {
    if (
      isInitialized &&
      auth.user &&
      !deal.isLoading &&
      (!auth.hasOrganisationInToken || auth.organisation) &&
      !isEqual(lastTrackedValue.current, userProps)
    ) {
      trackUserProps(userProps)
      lastTrackedValue.current = userProps
    }
  }, [
    auth.user,
    userProps,
    trackUserProps,
    isInitialized,
    auth.hasOrganisationInToken,
    auth.organisation,
  ])

  if (auth.isLoading || attribution.isLoading) {
    return <PageLoader overlay />
  }

  return children
}

export default AppBase
