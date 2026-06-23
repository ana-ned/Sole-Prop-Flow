import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { useShallow } from "zustand/shallow"
import useAuth from "../../../hooks/useAuth"
import useStore from "../../../hooks/useStore"
import {
  DrawRequest,
  LineOfCreditApi,
  LineOfCreditResponse,
  LineOfCreditResponseTypeEnum,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { displayErrorToast } from "../../../utils/error-handling"
import { documentQueryKeys } from "../../onboarding/queries"
import { LINE_OF_CREDIT_DOCUMENTS_PATH } from "../constants"

const useRequestDraw = ({
  lineOfCredit,
  setModalVisible,
}: {
  lineOfCredit: LineOfCreditResponse
  setModalVisible?: (visible: boolean) => void
}) => {
  const auth = useAuth()
  const navigate = useNavigate()
  const setDocumentsReferer = useStore(
    useShallow((state) => state.setDocumentsReferer)
  )
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (drawRequest: DrawRequest) =>
      new LineOfCreditApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).requestDraw({
        xXORGID: auth.organisation?.organisationId!,
        id: lineOfCredit.id!,
        drawRequest,
      }),
    onSuccess: async (res) => {
      await queryClient.resetQueries({
        queryKey: documentQueryKeys.v2(),
        type: "all",
      })
      if (lineOfCredit.type === LineOfCreditResponseTypeEnum.InterestRate) {
        setModalVisible?.(true)
      } else {
        setDocumentsReferer({ origin: "DRAW_REQUEST", id: res.id })
        await navigate(LINE_OF_CREDIT_DOCUMENTS_PATH)
      }
    },
    onError: async (err: Response) => {
      await displayErrorToast(err)
    },
  })
}

export default useRequestDraw
