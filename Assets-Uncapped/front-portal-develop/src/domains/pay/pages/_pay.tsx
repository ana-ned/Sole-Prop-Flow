import { useEffect, useState } from "react"
import { useQueries } from "@tanstack/react-query"
import clsx from "clsx"
import { useTranslation } from "react-i18next"
import { Navigate, useParams } from "react-router"
import Button from "../../../components/Basic/Button"
import PageLoader from "../../../components/Collections/PageLoader"
import MultistepForm from "../../../components/Headless/MultistepForm"
import Confirmation from "../../../components/UI/Confirmation"
import Layout from "../../../components/UI/Layout"
import Modal from "../../../components/UI/Modal"
import useAgreements from "../../../hooks/useAgreements"
import useAuth from "../../../hooks/useAuth"
import useBalances from "../../../hooks/useBalances"
import useDevice from "../../../hooks/useDevice"
import ErrorIndex from "../../../pages/error/_error"
import API from "../../../services/api"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import {
  BillInvoicesControllerApi,
  BillVendorDTOStatusEnum,
} from "../../../services/api/loan-operations"
import ChoosePayeeStep from "../components/PaySteps/ChoosePayeeStep"
import DetailsStep from "../components/PaySteps/DetailsStep"
import ReviewStep from "../components/PaySteps/ReviewStep"
import useBillVendors from "../hooks/useBillVendors"
import payQueryKeys from "../queries"
import { PayFormSchema } from "./_pay.schema"

type DeleteState = "NONE" | "CONFIRM" | "CONFIRMED"

const PayIndex = () => {
  const auth = useAuth()
  const [deleteState, setDeleteState] = useState<DeleteState>("NONE")
  const { t } = useTranslation("pay", { keyPrefix: "index" })
  const { isMobile } = useDevice()
  const [baseCurrency, setBaseCurrency] = useState<string | undefined>()
  const { vendorId } = useParams()
  const balances = useBalances()
  const agreements = useAgreements()

  useEffect(() => {
    if (balances.data) {
      setBaseCurrency(balances.data.aggregatedBalance?.currency)
    }
  }, [balances.data])

  const vendorsQuery = useBillVendors()

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
      {
        queryKey: payQueryKeys.exchangeRates(baseCurrency!),
        queryFn: async () =>
          API.ExchangeRates.snapshot({
            token: await auth.getToken(),
            organisation: String(auth.organisation?.organisationId),
            body: {
              baseCurrency: baseCurrency!,
              amount: 1,
            },
          }),
        enabled: auth.isAuthenticated && !!auth.organisation && !!baseCurrency,
      },
    ],
  })

  const isLoading =
    results.some((item) => item.isLoading) || vendorsQuery.isLoading
  const availableVendors =
    vendorsQuery.data?.filter(
      (item) => item.status !== BillVendorDTOStatusEnum.Rejected
    ) || []
  const selectedVendor = vendorId
    ? vendorsQuery.data?.find((item) => item.id === vendorId)
    : undefined

  const initialData: Partial<PayFormSchema> = {
    availableVendors,
    availableFees: results[0].data,
    availableExchangeRates: results[1].data?.[0].rates,
    availableBalance: balances.data?.aggregatedBalance,
    selectedVendor,
    hasSimplifiedPricing: agreements.hasSimplifiedPricing(),
  }

  const initialStep = initialData.selectedVendor ? 2 : 1

  if (
    isLoading ||
    // For some reasons, these are undefined when isLoading is false for a bit.
    !initialData.availableBalance ||
    !initialData.availableExchangeRates
  ) {
    return <PageLoader />
  }

  if (!selectedVendor && vendorId) {
    return <ErrorIndex type="404" />
  }

  if (availableVendors.length === 0) {
    return <Navigate to="/pay/new" />
  }

  return (
    <Layout menu={false}>
      <Layout.Parent>
        <MultistepForm initialData={initialData} initialStep={initialStep}>
          <ChoosePayeeStep />
          <DetailsStep
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
            <Button variant="primary" href="/">
              {t("deleteConfirmed.proceed")}
            </Button>
          </Confirmation>
        </Modal>
      </Layout.Parent>
    </Layout>
  )
}

export default PayIndex
