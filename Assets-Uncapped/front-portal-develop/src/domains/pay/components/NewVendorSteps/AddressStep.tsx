import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as yup from "yup"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import AddressFields, {
  AddressValidationSchema,
} from "../../../../components/Forms/AddressAutocompleteFields"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import PageBar from "../../../../components/UI/PageBar"
import { useTracking } from "../../../../hooks/useTracking"
import { ReactComponent as DeleteOutlineIcon } from "../../../../svgs/delete-outline.svg"
import { NewVendorFormSchema } from "../../pages/new.schema"

const schema = yup.object().shape({
  address: AddressValidationSchema,
})

const AddressStep = ({
  data,
  onBack,
  onDelete,
  onSubmit,
}: StepProps<NewVendorFormSchema> & {
  onDelete: () => void
}) => {
  const { t } = useTranslation("pay", {
    keyPrefix: "newVendor.addressStep",
  })
  const { trackEvent } = useTracking()

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
        onClickBack={onBack}
        title={t("title")}
        actionButton={{
          onClick: onDelete,
          children: <DeleteOutlineIcon />,
        }}
      />

      <form
        onSubmit={handleSubmit((formData) => {
          trackEvent({
            category: "pay",
            name: "new-payee-address",
            action: "submit",
          })
          onSubmit?.(formData)
        })}
      >
        <FormLayout.Content>
          <AddressFields
            control={control}
            watch={watch}
            setValue={setValue}
            prefix="address"
          />
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

export default AddressStep
