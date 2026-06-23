import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import {
  LineOfCreditApi,
  LineOfCreditResponse,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"

export const getDrawQueryKey = (id?: string) => ["AGREEMENTS-LOC-DRAW", id]

const useDraw = ({
  lineOfCredit,
  drawId,
}: {
  lineOfCredit?: LineOfCreditResponse
  drawId?: string
}) => {
  const auth = useAuth()

  return useQuery({
    queryKey: getDrawQueryKey(drawId),
    queryFn: async () => {
      return new LineOfCreditApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).drawDetails({
        xXORGID: auth.organisation?.organisationId!,
        id: lineOfCredit?.id!,
        drawId: drawId!,
      })
    },
    enabled:
      auth.isAuthenticated &&
      !!auth.organisation?.organisationId &&
      !!lineOfCredit?.id &&
      !!drawId,
  })
}

export default useDraw
