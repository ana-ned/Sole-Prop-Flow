import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import * as yup from "yup"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import Typography from "../../../../components/Basic/Typography"
import ListItemContainer from "../../../../components/Collections/ListItemContainer"
import FormControl from "../../../../components/Forms/FormControl"
import Input from "../../../../components/Forms/Input"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import ListItemInput from "../../../../components/UI/ListItemInput"
import PageBar from "../../../../components/UI/PageBar"
import { useTracking } from "../../../../hooks/useTracking"
import { BillPaymentFee } from "../../../../services/api/loan-operations"
import { ReactComponent as DeleteOutlineIcon } from "../../../../svgs/delete-outline.svg"
import { formatAsPercentage } from "../../../../utils/money"
import { titleCase } from "../../../../utils/string"
import useBillVendors from "../../hooks/useBillVendors"
import { NewVendorFormSchema } from "../../pages/new.schema"

const schema = yup.object().shape({
  hasSimplifiedPricing: yup.boolean().required(),
  name: yup.string().required().trim().min(1).max(100),
  email: yup.string().required().email(),
  selectedConvenienceFee: yup
    .string()
    .when("hasSimplifiedPricing", ([hasSimplifiedPricing], s) => {
      return hasSimplifiedPricing ? s.notRequired() : s.required()
    }),
})

const DISPLAYED_FEES: (keyof BillPaymentFee)[] = [
  "marketing",
  "inventory",
  "other",
]

const VendorDetailsStep = ({
  data,
  onSubmit,
  onDelete,
}: StepProps<NewVendorFormSchema> & {
  onDelete: () => void
}) => {
  const { t } = useTranslation("pay", {
    keyPrefix: "newVendor.vendorDetailsStep",
  })
  const navigate = useNavigate()
  const { trackEvent } = useTracking()
  const vendorsQuery = useBillVendors()

  const { control, handleSubmit, formState, setValue, watch } =
    useForm<NewVendorFormSchema>({
      // @ts-expect-error: fix yup schema to infer ts types: https://github.com/react-hook-form/resolvers/releases/tag/v3.1.1
      resolver: yupResolver(schema),
      defaultValues: data,
      mode: "onBlur",
    })

  return (
    <FormLayout>
      <PageBar
        title={t("title")}
        onClickBack={async () => {
          await (vendorsQuery.data && vendorsQuery.data.length > 0
            ? navigate("/pay")
            : navigate("/"))
        }}
        actionButton={{
          onClick: onDelete,
          children: <DeleteOutlineIcon />,
        }}
      />

      <form
        onSubmit={handleSubmit((formData) => {
          trackEvent({
            category: "pay",
            name: "new-payee-vendor-details",
            action: "submit",
          })

          onSubmit?.(formData)
        })}
      >
        <FormLayout.Content>
          <FormControl>
            <Input
              label={t("name")}
              name="name"
              type="text"
              control={control}
            />
          </FormControl>
          <FormControl>
            <Input
              label={t("email")}
              name="email"
              type="email"
              control={control}
            />
          </FormControl>

          {!data?.hasSimplifiedPricing && (
            <>
              <Typography type="bodyTitle" color="neutral-600" className="mb-2">
                {t("typeOfPurchase")}
              </Typography>

              <ListItemContainer>
                {DISPLAYED_FEES.map((fee) => (
                  <ListItemInput
                    key={fee}
                    onChange={() => {
                      setValue("selectedConvenienceFee", fee, {
                        shouldValidate: true,
                      })
                    }}
                    title={titleCase(fee)}
                    subtitle={t("feeRate", {
                      rate: formatAsPercentage(data?.availableFees[fee] || 0),
                    })}
                    type="radio"
                    checked={watch("selectedConvenienceFee") === fee}
                    value={fee}
                  />
                ))}
              </ListItemContainer>
            </>
          )}
        </FormLayout.Content>
        <FormLayout.Footer>
          <ButtonGroup>
            <Button type="submit" disabled={!formState.isValid}>
              {t("submit")}
            </Button>
          </ButtonGroup>
        </FormLayout.Footer>
      </form>
    </FormLayout>
  )
}

export default VendorDetailsStep
