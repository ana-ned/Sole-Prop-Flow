import { useQuery } from "@tanstack/react-query"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import { OwnerControllerApi } from "../services/api/hubspot"
import { TIER_BIG_BREAKPOINT } from "../utils/globals"
import useAuth from "./useAuth"
import useDeal from "./useDeal"

const CALENDARS: {
  matcher: (countryCode: string, revenue: number) => boolean
  link: string
}[] = [
  // USA
  {
    matcher: (countryCode, revenue): boolean =>
      countryCode === "USA" &&
      revenue >= TIER_BIG_BREAKPOINT &&
      revenue < 250000,
    link: "https://meetings.hubspot.com/julia-souto-ribeiro/explore-call-us-150k-250k",
  },
  {
    matcher: (countryCode, revenue): boolean =>
      countryCode === "USA" && revenue >= 250000 && revenue < 500000,
    link: "https://meetings.hubspot.com/julia-souto-ribeiro/explore-call-us-250k-500k",
  },
  {
    matcher: (countryCode, revenue): boolean =>
      countryCode === "USA" && revenue >= 500000 && revenue < 1000000,
    link: "https://meetings.hubspot.com/julia-souto-ribeiro/explore-call-us-500k-1m",
  },
  {
    matcher: (countryCode, revenue): boolean =>
      countryCode === "USA" && revenue >= 1000000,
    link: "https://meetings.hubspot.com/julia-souto-ribeiro/explore-call-us-500k-1m",
  },
  // REST
  {
    matcher: (countryCode, revenue): boolean =>
      countryCode !== "USA" &&
      revenue >= TIER_BIG_BREAKPOINT &&
      revenue < 250000,
    link: "https://meetings.hubspot.com/julia-souto-ribeiro/explore-call-uk-150k-250k",
  },
  {
    matcher: (countryCode, revenue): boolean =>
      countryCode !== "USA" && revenue >= 250000 && revenue < 500000,
    link: "https://meetings.hubspot.com/julia-souto-ribeiro/explore-call-uk-250k-500k",
  },
  {
    matcher: (countryCode, revenue): boolean =>
      countryCode !== "USA" && revenue >= 500000 && revenue < 1000000,
    link: "https://meetings.hubspot.com/julia-souto-ribeiro/explore-call-uk-500k-1m",
  },
  {
    matcher: (countryCode, revenue): boolean =>
      countryCode !== "USA" && revenue >= 1000000,
    link: "https://meetings.hubspot.com/julia-souto-ribeiro/explore-call-uk-500k-1m",
  },
]

export const useHubspotCalendarLink = ({
  dedicated = true,
}: {
  dedicated?: boolean
} = {}) => {
  const auth = useAuth()
  const deal = useDeal()

  const query = useQuery({
    queryKey: ["hubspot:OwnerControllerApi@getOwnerForLatestDeal"],
    queryFn: async () => {
      return new OwnerControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.HubSpot,
        })
      ).getOwnerByDealId({
        xXORGID: auth.organisation?.organisationId!,
        dealId: deal.data?.id!,
      })
    },
    enabled:
      auth.isAuthenticated &&
      !!auth.organisation?.organisationId &&
      !!deal.data?.id &&
      dedicated,
    retry: false,
  })

  return {
    link:
      query.data?.contact?.bookACallLink ||
      CALENDARS.find((calendar) =>
        calendar.matcher(
          auth.organisation?.countryCode!,
          deal.data?.amount?.amount ||
            auth.organisationData?.averageMonthlyRevenue?.amount!
        )
      )?.link,
    isLoading: query.isLoading,
  }
}
