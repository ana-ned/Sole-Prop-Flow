import { useState } from "react"
import clsx from "clsx"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import Button from "../../../../components/Basic/Button"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import DrawDepositMethodForm from "../../../../components/Shared/DrawDepositMethodForm"
import Confirmation from "../../../../components/UI/Confirmation"
import Layout from "../../../../components/UI/Layout"
import LogoOnlyMenu from "../../../../components/UI/LogoOnlyMenu"
import Modal from "../../../../components/UI/Modal"
import useDeal from "../../../../hooks/useDeal"
import useDevice from "../../../../hooks/useDevice"
import { ReactComponent as DrawRequestedImg } from "../../assets/draw-requested.svg"
import useRequestDraw from "../../hooks/useRequestDraw"

const DrawDepositMethod = ({
  data,
  setCustomSubmit,
  onSubmit,
  onBack,
}: StepProps) => {
  const { t } = useTranslation("line-of-credit", {
    keyPrefix: "DrawDepositMethod",
  })
  const [modalVisible, setModalVisible] = useState(false)
  const { isMobile } = useDevice()
  const deal = useDeal()
  const navigate = useNavigate()
  const currency = data.lineOfCredit?.limit?.currency!

  const requestDraw = useRequestDraw({
    lineOfCredit: data.lineOfCredit,
    setModalVisible,
  })

  return (
    <Layout menu={<LogoOnlyMenu />}>
      <Layout.Parent>
        <DrawDepositMethodForm
          onSubmit={async (formData) => {
            if (deal.hasAmazonPartnerOffer || formData.account?.verified) {
              await requestDraw.mutateAsync({
                amount: Number(data.amount),
                repaymentTermsMonths: data.repaymentTermsMonths,
                cashTransferAccountId: formData.accountId,
                deferredRepaymentPeriod:
                  data.offerSelectedDeferredRepayment?.deferredRepaymentPeriod,
              })
            }

            if (!deal.hasAmazonPartnerOffer && !formData.account?.verified) {
              onSubmit?.(formData)
            }
          }}
          onBack={onBack!}
          onDelete={async () => {
            await navigate(data.backUrl)
          }}
          currency={currency}
          amount={data.amount}
          onAddBankAccount={(formValues) => {
            setCustomSubmit?.(formValues, 4)
          }}
          error={requestDraw.error as unknown as Response}
        />
      </Layout.Parent>
      <Modal
        isOpen={modalVisible}
        onClose={async () => {
          await navigate("/")
        }}
        className={clsx({ "pb-12": isMobile, "max-w-sm": !isMobile })}
      >
        <Confirmation
          title={t("drawRequestSubmitted")}
          fluidIcon
          subtitle={t("pleaseAllowUpTo2BusinessDays")}
          type="custom"
          iconComponent={<DrawRequestedImg />}
        >
          <Button href="/">{t("gotIt")}</Button>
        </Confirmation>
      </Modal>
    </Layout>
  )
}

export default DrawDepositMethod
