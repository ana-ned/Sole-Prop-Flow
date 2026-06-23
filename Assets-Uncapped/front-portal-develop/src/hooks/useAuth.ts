import { useEffect } from "react"
import {
  Auth0ContextInterface,
  GetTokenSilentlyOptions,
  useAuth0,
} from "@auth0/auth0-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { useLocalStorage } from "react-use"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import {
  UserOrganisationControllerApi,
  UserOrganisationRelationshipDTO,
} from "../services/api/organisation-users"
import { PartnerDetailsResponse } from "../services/api/partners"
import { logError } from "../utils/error-handling"
import { url } from "../utils/url"
import { UserRoles } from "./useAuth.types"
import useBrowserStorage from "./useBrowserStorage"

const OAUTH_SOCIAL_PROVIDERS = ["google", "amazon"]

const AUTH0_ORGANISATION_FIELD = "https://weareuncapped.com/organisation_id"
export const AUTH0_ROLES_FIELD = "https://weareuncapped.com/roles"
const AUTH0_PARTNER_FIELD = "https://weareuncapped.com/partner_id"

export const getUserOverviewQueryKey = (orgId: string) => [
  "USER_OVERVIEW",
  orgId,
]

const IS_E2E_MOCKED =
  !!globalThis.Cypress && !!globalThis.localStorage.getItem("auth0Cypress")

const useAuth = () => {
  const auth0 = useAuth0()
  const queryClient = useQueryClient()
  const [organisation, setOrganisation] =
    useBrowserStorage<UserOrganisationRelationshipDTO>(
      auth0.user?.sub,
      "organisation"
    )
  const deleteSmsConsent = useBrowserStorage<string>(
    auth0.user?.sub,
    "sms_consent_at"
  )[2]
  const [impersonateAs, setImpersonateAs] =
    useLocalStorage<UserOrganisationRelationshipDTO>(
      "uncapped_organisation" // Used for God Mode between front-portal-v2 and front-backoffice.
    )
  const [
    impersonateAsPartner,
    setImpersonateAsPartner,
    deleteImpersonateAsPartner,
  ] = useLocalStorage<PartnerDetailsResponse>("uncapped_partner")
  const navigate = useNavigate()

  const auth: Auth0ContextInterface = IS_E2E_MOCKED
    ? JSON.parse(globalThis.localStorage.getItem("auth0Cypress") || "{}")
    : auth0

  const isGod = auth.user?.[AUTH0_ORGANISATION_FIELD] === "SELF"

  const getToken = (options?: GetTokenSilentlyOptions) => {
    return IS_E2E_MOCKED
      ? // @ts-expect-error Support mocks
        Promise.resolve(auth.token)
      : auth0.getAccessTokenSilently(options)
  }

  const getOrganisationId = () => {
    if (impersonateAs?.organisationId && isGod) {
      return impersonateAs.organisationId
    }

    return auth.user?.[AUTH0_ORGANISATION_FIELD] || ""
  }

  const canImpersonateAsPartner =
    isGod && auth.user?.[AUTH0_ROLES_FIELD].includes(UserRoles.PARTNER)
  const isCurrentlyImpersonatedAsPartner =
    impersonateAsPartner?.id && canImpersonateAsPartner

  const getPartnerId = () => {
    if (canImpersonateAsPartner) {
      return impersonateAsPartner?.id
    }

    return auth.user?.[AUTH0_PARTNER_FIELD]
      ? String(auth.user[AUTH0_PARTNER_FIELD])
      : undefined
  }

  const query = useQuery({
    queryKey: getUserOverviewQueryKey(getOrganisationId()),
    queryFn: async () =>
      new UserOrganisationControllerApi(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.OrganisationUsers,
        })
      ).getUserOverview({
        xXORGID: getOrganisationId(),
      }),
    enabled:
      auth.isAuthenticated &&
      !getPartnerId() &&
      auth.user?.[AUTH0_ROLES_FIELD].includes(UserRoles.REGISTERED),
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: false,
  })

  useEffect(() => {
    if (query.data?.organisation) {
      setOrganisation({
        organisationId: query.data.organisation.id,
        organisationName: query.data.organisation.companyName,
        currencyCode: query.data.organisation.currencyCode,
        countryCode: query.data.organisation.countryCode,
        activated: query.data.organisation.activated,
        createdAt: query.data.organisation.dateOfCreation,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data])

  const isSocialAccount = OAUTH_SOCIAL_PROVIDERS.some((platform) =>
    auth0.user?.sub?.includes(platform)
  )

  useEffect(() => {
    if (auth0.error && !auth0.isLoading) {
      logError(auth0.error)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      navigate("/error/auth")
    }
  }, [auth0, auth0.error, navigate])

  return {
    ...auth,
    loginWithRedirect: auth0.loginWithRedirect,
    logout: async () => {
      deleteSmsConsent()
      return auth0.logout({
        logoutParams: {
          returnTo: url("/", true),
        },
      })
    },
    organisation:
      isCurrentlyImpersonatedAsPartner ||
      getOrganisationId() !== organisation?.organisationId
        ? undefined
        : organisation,
    setImpersonateAs: (value?: UserOrganisationRelationshipDTO) => {
      setImpersonateAs(value)
      deleteImpersonateAsPartner()
      // FIXME: We could avoid hard reload by clearing all queries.
      globalThis.location.href = "/"
    },
    isCurrentlyImpersonatedAsPartner,
    impersonateAsPartner: isCurrentlyImpersonatedAsPartner
      ? impersonateAsPartner
      : undefined,
    setImpersonateAsPartner: (value?: PartnerDetailsResponse) => {
      setImpersonateAsPartner(value)
      queryClient.removeQueries()
      // FIXME: We could avoid hard reload by clearing all queries.
      globalThis.location.href = "/"
    },
    canImpersonateAsPartner,
    isSocialAccount,
    getToken,
    isLoading:
      auth0.isLoading ||
      (!!auth.user?.[AUTH0_ORGANISATION_FIELD] && !organisation) ||
      query.isLoading,
    hasOrganisationInToken: !!auth.user?.[AUTH0_ORGANISATION_FIELD],
    hasRole: (role: UserRoles): boolean => {
      const isMultiUser =
        auth.user?.[AUTH0_ROLES_FIELD].includes(UserRoles.PARTNER) &&
        auth.user[AUTH0_ROLES_FIELD].includes(UserRoles.CUSTOMER)

      // For users that are both customers and partners, check impersonating status to determine which portal should be shown.
      if (isMultiUser) {
        if (!isCurrentlyImpersonatedAsPartner && role === UserRoles.PARTNER) {
          return false
        }

        if (isCurrentlyImpersonatedAsPartner && role === UserRoles.CUSTOMER) {
          return false
        }
      }

      return auth.user?.[AUTH0_ROLES_FIELD].includes(role)
    },
    partnerId: getPartnerId(),
    isGod,
    organisationData: query.data?.organisation,
    userData: query.data?.user,
    applicantData: query.data?.applicantOverview,
  }
}

export default useAuth
