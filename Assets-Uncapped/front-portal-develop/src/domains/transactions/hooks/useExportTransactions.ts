import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import useAuth from "../../../hooks/useAuth"
import i18n from "../../../inits/i18next"
import { StatementControllerApi } from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { downloadFile } from "../../../utils/blob"

const useExportTransactions = () => {
  const auth = useAuth()

  return useMutation({
    mutationFn: async () =>
      new StatementControllerApi(
        apiConfig({
          service: ApiServicesEnum.Agreements,
          token: await auth.getToken(),
        })
      ).getXlsStatementForOrganisation({
        xXORGID: auth.organisation?.organisationId!,
      }),
    onSuccess: (res) => {
      downloadFile(
        res,
        `statement_${new Date().toISOString().slice(0, 10)}.xls`
      )
    },
    onError: () => {
      toast.error(i18n.t("common:download.error"))
    },
  })
}

export default useExportTransactions
