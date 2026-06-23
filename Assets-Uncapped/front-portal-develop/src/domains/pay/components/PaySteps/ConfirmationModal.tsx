import { useQueryClient } from "@tanstack/react-query"
import clsx from "clsx"
import { isToday } from "date-fns"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import Button from "../../../../components/Basic/Button"
import Confirmation from "../../../../components/UI/Confirmation"
import Modal from "../../../../components/UI/Modal"
import { BALANCES_QUERY_KEY } from "../../../../hooks/useBalances"
import useDevice from "../../../../hooks/useDevice"
import { BillVendorDTOStatusEnum } from "../../../../services/api/loan-operations"
import { ReactComponent as WorkingOnItIllustration } from "../../../../svgs/illustrations/working-on-it.svg"
import { DateFormat, formatDate, getDateFormat } from "../../../../utils/date"
import { PayFormSchema } from "../../pages/_pay.schema"

const ConfirmationModal = ({
  data,
  isOpen,
}: {
  data: PayFormSchema | undefined
  isOpen: boolean
}) => {
  const { t } = useTranslation("pay", { keyPrefix: "index.confirmationStep" })
  const { isMobile } = useDevice()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const isScheduled = !isToday(new Date(data?.sendDate!))
  const isTrusted =
    data?.selectedVendor.status === BillVendorDTOStatusEnum.Approved

  const getTitle = () => {
    if (!isTrusted) {
      return t("titleRequested")
    }

    if (isScheduled) {
      return t("titleScheduled")
    }

    return t("titleSent")
  }

  const getContent = () => {
    if (!isTrusted) {
      return t("contentRequested")
    }

    if (isScheduled) {
      return t("contentScheduled", {
        date: formatDate(new Date(data.sendDate), {
          customFormat: getDateFormat(DateFormat.MLONG),
        }),
      })
    }

    return t("contentSent")
  }

  return (
    <Modal isOpen={isOpen} className={clsx({ "pb-12": isMobile })}>
      <Confirmation
        title={getTitle()}
        subtitle={getContent()}
        type={isTrusted ? "success" : "custom"}
        iconComponent={isTrusted ? undefined : <WorkingOnItIllustration />}
      >
        <Button
          type="button"
          variant="primary"
          onClick={async () => {
            await queryClient.invalidateQueries({
              queryKey: [BALANCES_QUERY_KEY],
            })
            await navigate("/transactions")
          }}
        >
          {t("submit")}
        </Button>
      </Confirmation>
    </Modal>
  )
}

export default ConfirmationModal
