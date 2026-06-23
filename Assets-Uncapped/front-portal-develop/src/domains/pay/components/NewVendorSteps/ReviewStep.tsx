import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import Typography from "../../../../components/Basic/Typography"
import FieldsSummary from "../../../../components/Collections/FieldsSummary"
import ApiErrorAlert from "../../../../components/Functional/ApiErrorAlert"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import ContentDivider from "../../../../components/UI/ContentDivider"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import PageBar from "../../../../components/UI/PageBar"
import useAuth from "../../../../hooks/useAuth"
import { useTracking } from "../../../../hooks/useTracking"
import apiConfig, { ApiServicesEnum } from "../../../../services/api/api-config"
import { BillVendorControllerApi } from "../../../../services/api/loan-operations"
import CountryService from "../../../../services/country"
import { ReactComponent as DeleteOutlineIcon } from "../../../../svgs/delete-outline.svg"
import { getCurrencyList } from "../../../../utils/currency"
import { formatAsPercentage } from "../../../../utils/money"
import { titleCase } from "../../../../utils/string"
import { NewVendorFormSchema } from "../../pages/new.schema"
import payQueryKeys from "../../queries"

const ReviewStep = ({
  data,
  onBack,
  onDelete,
}: StepProps<NewVendorFormSchema> & {
  onDelete: () => void
}) => {
  const { t } = useTranslation("pay", { keyPrefix: "newVendor" })
  const auth = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { trackEvent } = useTracking()

  const { mutate, error, isPending } = useMutation({
    mutationFn: async () =>
      new BillVendorControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.LoanOperations,
        })
      ).create({
        xXORGID: String(auth.organisation?.organisationId),
        createBillVendorRequest: {
          name: data?.name,
          email: data?.email,
          category: data?.hasSimplifiedPricing
            ? "other"
            : data?.selectedConvenienceFee,
          addressLine1: data?.address?.addressLine1,
          addressLine2: data?.address?.addressLine2,
          city: data?.address?.locality,
          region: data?.address?.region,
          postcode: data?.address?.postalCode,
          country: data?.address?.country,
          accountCountry: data?.countryOfAccount,
          currency: data?.currency,
          accountNumber: data?.accountNumber,
          accountIban: data?.iban,
          accountSwiftBic: data?.swiftBic,
          accountSortCode: data?.sortCode || data?.routingNumber,
          branchCode: data?.branchCode,
          bankCode: data?.bankCode,
          ifscCode: data?.ifscCode,
          bsbCode: data?.bsbCode,
        },
      }),
    onSuccess: async (response) => {
      trackEvent({
        category: "pay",
        name: "new-payee",
        action: "created",
      })
      await queryClient.refetchQueries({ queryKey: payQueryKeys.vendors() })
      await navigate(`/pay/${response.id}`)
    },
  })

  const currency = getCurrencyList().find(
    (item) => item.value === data?.currency
  )

  return (
    <FormLayout>
      <PageBar
        title={t("reviewStep.title")}
        onClickBack={onBack}
        actionButton={{
          onClick: onDelete,
          children: <DeleteOutlineIcon />,
        }}
      />

      <FormLayout.Content>
        <Typography type="bodyTitle" color="neutral-600" className="mb-2">
          {t("vendorDetailsStep.title")}
        </Typography>
        <ContentDivider className="mb-4">
          <FieldsSummary
            className=""
            data={[
              { th: t("vendorDetailsStep.name"), td: data?.name },
              { th: t("vendorDetailsStep.email"), td: data?.email },
              ...(data?.hasSimplifiedPricing
                ? []
                : [
                    {
                      th: t("vendorDetailsStep.typeOfPurchase"),
                      td: `${titleCase(
                        data?.selectedConvenienceFee || ""
                      )} (${t("vendorDetailsStep.feeRate", {
                        rate: formatAsPercentage(
                          data?.availableFees[data.selectedConvenienceFee] || 0
                        ),
                      })})   
                  `,
                    },
                  ]),
            ]}
          />
        </ContentDivider>

        <Typography type="bodyTitle" color="neutral-600" className="mb-2">
          {t("vendorDetailsStep.title")}
        </Typography>
        <ContentDivider className="mb-4">
          <FieldsSummary
            className=""
            data={[
              {
                th: t("addressStep.title"),
                td: [
                  data?.address?.addressLine1,
                  data?.address?.addressLine2,
                  data?.address?.locality,
                  data?.address?.region,
                  data?.address?.postalCode,
                  data?.address?.country,
                ]
                  .filter(Boolean)
                  .join(", "),
              },
            ]}
          />
        </ContentDivider>

        <Typography type="bodyTitle" color="neutral-600" className="mb-2">
          {t("paymentDetailsStep.title")}
        </Typography>
        <ContentDivider>
          <FieldsSummary
            className=""
            data={[
              {
                th: t("paymentDetailsStep.countryOfAccount"),
                td: CountryService.getByAlpha3(data?.countryOfAccount)?.name,
              },
              {
                th: t("paymentDetailsStep.currency"),
                td: `${currency?.symbol} ${currency?.name}`,
              },
              {
                th: t("paymentDetailsStep.accountNumber"),
                td: data?.accountNumber,
              },
              {
                th: t("paymentDetailsStep.iban"),
                td: data?.iban,
              },
              {
                th: t("paymentDetailsStep.swiftBic"),
                td: data?.swiftBic,
              },
              {
                th: t("paymentDetailsStep.sortCode"),
                td: data?.sortCode,
              },
              {
                th: t("paymentDetailsStep.branchCode"),
                td: data?.branchCode,
              },
              {
                th: t("paymentDetailsStep.bankCode"),
                td: data?.bankCode,
              },
              {
                th: t("paymentDetailsStep.ifscCode"),
                td: data?.ifscCode,
              },
              {
                th: t("paymentDetailsStep.bsbCode"),
                td: data?.bsbCode,
              },
            ]}
          />
        </ContentDivider>

        <ApiErrorAlert error={error as unknown as Response} className="mt-2" />
      </FormLayout.Content>
      <FormLayout.Footer>
        <ButtonGroup>
          <Button type="submit" onClick={mutate} loading={isPending}>
            {t("reviewStep.submit")}
          </Button>
        </ButtonGroup>
      </FormLayout.Footer>
    </FormLayout>
  )
}

export default ReviewStep
