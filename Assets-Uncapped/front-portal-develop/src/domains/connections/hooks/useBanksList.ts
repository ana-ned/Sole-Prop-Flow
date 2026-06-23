import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { BanksApi, PageModelBank } from "../../../services/api/connections"

const useBanksList = <TData = PageModelBank>({
  country,
  name,
  id,
  select,
  staleTime,
}: {
  country?: string
  name?: string
  id?: string[]
  select?: (data: PageModelBank) => TData
  staleTime?: number
}) => {
  const auth = useAuth()

  const getSize = () => {
    if (name) {
      return 100
    }

    if (id) {
      return id.length
    }

    return 10
  }

  const size = getSize()

  return useQuery({
    queryKey: ["CONNECTIONS_BANKS_LIST", country, name, id, size],
    queryFn: async () =>
      new BanksApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Connections,
        })
      ).searchBanks({
        xXORGID: auth.organisation?.organisationId!,
        country: country?.toUpperCase()!,
        name,
        id,
        size,
      }),
    enabled:
      auth.isAuthenticated && !!auth.organisation?.organisationId && !!country,
    select,
    staleTime,
  })
}

export default useBanksList
