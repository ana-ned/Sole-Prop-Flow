import { useState } from "react"
import { useQueries } from "@tanstack/react-query"
import clsx from "clsx"
import { useTranslation } from "react-i18next"
import Button from "../../../components/Basic/Button"
import PageLoader from "../../../components/Collections/PageLoader"
import MultistepForm from "../../../components/Headless/MultistepForm"
import Confirmation from "../../../components/UI/Confirmation"
import Layout from "../../../components/UI/Layout"
import Modal from "../../../components/UI/Modal"
import useAgreements from "../../../hooks/useAgreements"
import useAuth from "../../../hooks/useAuth"
import useDevice from "../../../hooks/useDevice"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { BillInvoicesControllerApi } from "../../../services/api/loan-operations"
import AddressStep from "../components/NewVendorSteps/AddressStep"
import PaymentDetailsStep from "../components/NewVendorSteps/PaymentDetailsStep"
import ReviewStep from "../components/NewVendorSteps/ReviewStep"
import VendorDetailsStep from "../components/NewVendorSteps/VendorDetailsStep"
import payQueryKeys from "../queries"
import { NewVendorFormSchema } from "./new.schema"

type DeleteState = "NONE" | "CONFIRM" | "CONFIRMED"

const NewVendor = () => {
  const auth = useAuth()
  const [deleteState, setDeleteState] = useState<DeleteState>("NONE")
  const { t } = useTranslation("pay", { keyPrefix: "newVendor" })
  const { isMobile } = useDevice()
  const agreements = useAgreements()

  const results = useQueries({
    queries: [
      {
        queryKey: payQueryKeys.fees(),
        queryFn: async () =>
          new BillInvoicesControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.LoanOperations,
            })
          ).getBillPaymentFees({
            xXORGID: String(auth.organisation?.organisationId),
          }),
        enabled: auth.isAuthenticated && !!auth.organisation,
      },
    ],
  })

  const isLoading = results.some((item) => item.isLoading)

  const initialData: Partial<NewVendorFormSchema> = {
    availableFees: results[0].data,
    hasSimplifiedPricing: agreements.hasSimplifiedPricing(),
  }

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <Layout menu={false}>
      <Layout.Parent>
        <MultistepForm initialData={initialData}>
          <VendorDetailsStep
            onDelete={() => {
              setDeleteState("CONFIRM")
            }}
          />
          <AddressStep
            onDelete={() => {
              setDeleteState("CONFIRM")
            }}
          />
          <PaymentDetailsStep
            onDelete={() => {
              setDeleteState("CONFIRM")
            }}
          />
          <ReviewStep
            onDelete={() => {
              setDeleteState("CONFIRM")
            }}
          />
        </MultistepForm>

        <Modal
          isOpen={deleteState === "CONFIRM"}
          className={clsx({ "pb-12": isMobile })}
          onClose={() => {
            setDeleteState("NONE")
          }}
        >
          <Confirmation type="warning" title={t("deleteConfirmation.title")}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setDeleteState("NONE")
              }}
            >
              {t("deleteConfirmation.cancel")}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                setDeleteState("CONFIRMED")
              }}
            >
              {t("deleteConfirmation.confirm")}
            </Button>
          </Confirmation>
        </Modal>

        <Modal
          isOpen={deleteState === "CONFIRMED"}
          className={clsx({ "pb-12": isMobile })}
          onClose={() => {
            setDeleteState("NONE")
          }}
        >
          <Confirmation type="danger" title={t("deleteConfirmed.title")}>
            <Button variant="primary" href="/pay">
              {t("deleteConfirmed.proceed")}
            </Button>
          </Confirmation>
        </Modal>
      </Layout.Parent>
    </Layout>
  )
}

export default NewVendor
