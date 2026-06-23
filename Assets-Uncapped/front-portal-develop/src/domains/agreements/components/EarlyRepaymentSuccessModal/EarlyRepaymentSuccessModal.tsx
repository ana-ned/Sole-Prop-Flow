import { useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import Button from "../../../../components/Basic/Button"
import Confirmation from "../../../../components/UI/Confirmation"
import Modal from "../../../../components/UI/Modal"
import { BALANCES_QUERY_KEY } from "../../../../hooks/useBalances"
import { EARLY_REPAYMENTS_QUERY_KEY } from "../../../transactions/hooks/useEarlyRepayments"
import { ReactComponent as ModalImage } from "../../assets/early-repayment-success.svg"

const EarlyRepaymentSuccessModal = ({ isOpen }: { isOpen: boolean }) => {
  const { t } = useTranslation("agreements", {
    keyPrefix: "EarlyRepaymentSuccessModal",
  })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const onClose = async () => {
    await queryClient.invalidateQueries({
      queryKey: EARLY_REPAYMENTS_QUERY_KEY,
      type: "all",
    })
    await queryClient.invalidateQueries({
      queryKey: BALANCES_QUERY_KEY,
      type: "all",
    })
    await navigate("/transactions")
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} shouldCloseOnOverlayClick={false}>
      <Confirmation
        iconComponent={<ModalImage />}
        fluidIcon
        type="custom"
        title={t("title")}
        subtitle={t("copy")}
      >
        <Button type="button" onClick={onClose}>
          {t("cta")}
        </Button>
      </Confirmation>
    </Modal>
  )
}

export default EarlyRepaymentSuccessModal
