import { useTranslation } from "react-i18next"
import Chip from "../../../../../components/UI/Chip"
import ListItemLarge from "../../../../../components/UI/ListItemLarge"
import useAuth from "../../../../../hooks/useAuth"
import {
  OutstandingDebtDocumentResponse,
  OutstandingDebtDocumentResponseStatusEnum,
} from "../../../../../services/api/organisation-users"
import { ReactComponent as EditIcon } from "../../../../../svgs/edit.svg"
import { ReactComponent as PlusIcon } from "../../../../../svgs/plus.svg"
import { formatDate } from "../../../../../utils/date"
import { format } from "../../../../../utils/money"

const DocumentsDebtListItem = ({
  editable = true,
  debt,
  onClick,
}: {
  editable?: boolean
  debt: OutstandingDebtDocumentResponse
  onClick: (debt: OutstandingDebtDocumentResponse) => void
}) => {
  const auth = useAuth()
  const { t } = useTranslation("onboarding", {
    keyPrefix: "documents.outstandingDebt",
  })

  return (
    <ListItemLarge
      key={debt.id}
      title={debt.loanProvider}
      subtitle={
        <Chip
          label={
            debt.status === OutstandingDebtDocumentResponseStatusEnum.Requested
              ? t("DocumentsDebtList.debtItemRequested")
              : debt.lastModificationDate
                ? t("DocumentsDebtList.debtItemUpdated", {
                    amount: format(debt.remainingBalance!, debt.currency!),
                    date: formatDate(debt.lastModificationDate, {
                      customFormat:
                        auth.organisation?.countryCode === "USA"
                          ? "MM/dd/yyyy"
                          : "dd/MM/yyyy",
                    }),
                  })
                : format(debt.remainingBalance!, debt.currency!)
          }
          color={
            debt.status === OutstandingDebtDocumentResponseStatusEnum.Requested
              ? "warning"
              : "success"
          }
        />
      }
      more={
        editable
          ? {
              type: "element",
              element:
                debt.status ===
                OutstandingDebtDocumentResponseStatusEnum.Requested ? (
                  <PlusIcon />
                ) : (
                  <EditIcon />
                ),
              onClick: () => {
                onClick(debt)
              },
            }
          : undefined
      }
    />
  )
}

export default DocumentsDebtListItem
