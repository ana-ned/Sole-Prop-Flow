import React, { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import Typography from "../../../../components/Basic/Typography"
import ApiErrorAlert from "../../../../components/Functional/ApiErrorAlert"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import Alert from "../../../../components/UI/Alert"
import ContentDivider from "../../../../components/UI/ContentDivider"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import PageBar from "../../../../components/UI/PageBar"
import SimpleTable from "../../../../components/UI/SimpleTable"
import useAuth from "../../../../hooks/useAuth"
import { useTracking } from "../../../../hooks/useTracking"
import apiConfig, { ApiServicesEnum } from "../../../../services/api/api-config"
import {
  BillInvoiceDTO,
  BillInvoicesControllerApi,
  BillPaymentFee,
} from "../../../../services/api/loan-operations"
import { ReactComponent as DeleteOutlineIcon } from "../../../../svgs/delete-outline.svg"
import { ReactComponent as LocationPinIcon } from "../../../../svgs/location-pin.svg"
import { DateFormat, formatDate, getDateFormat } from "../../../../utils/date"
import { format, formatAsPercentage } from "../../../../utils/money"
import { transactionQueryKeys } from "../../../transactions/queries"
import { PayFormSchema } from "../../pages/_pay.schema"
import ConfirmationModal from "./ConfirmationModal"

const ReviewStep = ({
  data,
  onBack,
  onDelete,
}: StepProps<PayFormSchema> & { onDelete: () => void }) => {
  const { t } = useTranslation("pay", { keyPrefix: "index.reviewStep" })
  const queryClient = useQueryClient()
  const auth = useAuth()
  const [isSuccess, setIsSuccess] = useState(false)
  const { trackEvent } = useTracking()

  const { mutate, error, isPending } = useMutation<BillInvoiceDTO, Response>({
    mutationFn: async () =>
      new BillInvoicesControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.LoanOperations,
        })
      ).create2({
        xXORGID: String(auth.organisation?.organisationId),
        createBillInvoiceRequest: {
          vendorId: data?.selectedVendor.id,
          referenceText: data?.reference,
          amount: data?.amount,
          dateToSendPayment: data?.sendDate,
          swift: data?.swift,
        },
      }),
    onSuccess: async () => {
      trackEvent({
        category: "pay",
        name: "payment",
        action: "created",
      })
      await queryClient.invalidateQueries({
        queryKey: transactionQueryKeys.all(),
      })
      await queryClient.invalidateQueries({
        queryKey: transactionQueryKeys.scheduled(),
      })
      await queryClient.invalidateQueries({
        queryKey: transactionQueryKeys.scheduledAll(),
      })
      setIsSuccess(true)
    },
  })

  const isExchangedTransfer =
    data?.availableBalance.currency !== data?.selectedVendor.currency
  const exchangedAmount = isExchangedTransfer
    ? (data?.amount || 0) /
      (data?.availableExchangeRates[data.selectedVendor.currency!] || 1)
    : data?.amount || 0
  const convenienceFeeRate =
    data?.availableFees[
      data.selectedVendor.category! as keyof BillPaymentFee
    ] || 0
  const convenienceFeeAmount = (convenienceFeeRate / 100) * exchangedAmount
  const exchangeFeeRate = data?.availableFees.exchange || 0
  const exchangeFeeAmount = isExchangedTransfer
    ? (exchangeFeeRate / 100) * exchangedAmount
    : 0
  const total = [
    exchangedAmount,
    convenienceFeeAmount,
    exchangeFeeAmount,
  ].reduce((sum, item) => sum + +item.toFixed(2), 0)

  const costBreakdown = [
    {
      th: t("amount"),
      td: format(data?.amount!, data?.selectedVendor.currency!),
    },
    ...(isExchangedTransfer
      ? [
          {
            th: t("exchangeRate"),
            td: `${format(1, data?.selectedVendor.currency!)} = ${format(
              exchangedAmount / (data?.amount || 1),
              data?.availableBalance.currency!
            )}`,
          },
        ]
      : []),
    ...(isExchangedTransfer
      ? [
          {
            th: t("exchangedAmount"),
            td: format(exchangedAmount, data?.availableBalance.currency!),
          },
        ]
      : []),
    ...(isExchangedTransfer
      ? [
          {
            th: t("exchangeFee", { rate: formatAsPercentage(exchangeFeeRate) }),
            td: format(exchangeFeeAmount, data?.availableBalance.currency!),
          },
        ]
      : []),
    {
      th: t("convenienceFee", {
        rate: formatAsPercentage(convenienceFeeRate),
      }),
      td: format(convenienceFeeAmount, data?.availableBalance.currency!),
    },
    {
      th: isExchangedTransfer ? t("estimatedTotal") : t("total"),
      td: format(total, data?.availableBalance.currency!),
      fontWeight: "bold" as const,
    },
  ]
  const vendorDetails = [
    ...(data?.selectedVendor.accountSortCode
      ? [
          {
            label:
              data.selectedVendor.country === "USA"
                ? t("routingNumber")
                : t("sortCode"),
            value: data.selectedVendor.accountSortCode,
          },
        ]
      : []),
    ...(data?.selectedVendor.accountNumber
      ? [
          {
            label: t("accountNumber"),
            value: data.selectedVendor.accountNumber,
          },
        ]
      : []),
    ...(data?.selectedVendor.accountIban
      ? [
          {
            label: t("iban"),
            value: data.selectedVendor.accountIban,
          },
        ]
      : []),
    ...(data?.selectedVendor.accountSwiftBic
      ? [
          {
            label: t("swiftBic"),
            value: data.selectedVendor.accountSwiftBic,
          },
        ]
      : []),
  ]

  return (
    <FormLayout>
      <PageBar
        title={t("title")}
        onClickBack={onBack}
        actionButton={{
          onClick: onDelete,
          children: <DeleteOutlineIcon />,
        }}
      />
      <ConfirmationModal data={data} isOpen={isSuccess} />
      <FormLayout.Content>
        <ContentDivider>
          <Typography type="h4" className="mb-2">
            - {format(data?.amount!, data?.selectedVendor.currency!)}
          </Typography>
          <Typography type="smallCopy" color="neutral-600" className="mb-6">
            {t("sendDate")}:{" "}
            {formatDate(new Date(data?.sendDate!), {
              customFormat: getDateFormat(DateFormat.LONG),
            })}
          </Typography>
          <div className="flex">
            <div className="mr-2 flex flex-col items-center">
              <LocationPinIcon className="text-brand-600 size-6" />
              <div className="bg-brand-600 mx-0 my-1 block h-6.5 w-0.5 rounded-sm" />
              <LocationPinIcon className="size-6" />
            </div>
            <div>
              <Typography type="bodyTitle" className="mb-9">
                {t("sender")}
              </Typography>
              <Typography type="bodyTitle" className="mb-2">
                {data?.selectedVendor.name}
              </Typography>
              {vendorDetails.map((item) => (
                <React.Fragment key={item.label}>
                  <Typography type="body" color="neutral-600" className="mb-1">
                    {item.label}
                  </Typography>
                  <Typography type="body" className="mb-1">
                    {item.value}
                  </Typography>
                </React.Fragment>
              ))}
            </div>
          </div>
        </ContentDivider>
        <ContentDivider>
          <Typography type="body" color="neutral-600">
            {t("reference")}
          </Typography>
          <Typography type="body">{data?.reference}</Typography>
        </ContentDivider>
        <SimpleTable wrapped data={costBreakdown} />
        {isExchangedTransfer && (
          <Alert className="mt-2">{t("alertExchangeRate")}</Alert>
        )}
        {data?.swift && <Alert className="mt-2">{t("alertSwift")}</Alert>}
        <ApiErrorAlert error={error} className="mt-2" />
      </FormLayout.Content>
      <FormLayout.Footer>
        <ButtonGroup>
          <Button
            type="submit"
            onClick={() => {
              mutate()
            }}
            loading={isPending}
          >
            {t("submit")}
          </Button>
        </ButtonGroup>
      </FormLayout.Footer>
    </FormLayout>
  )
}

export default ReviewStep
