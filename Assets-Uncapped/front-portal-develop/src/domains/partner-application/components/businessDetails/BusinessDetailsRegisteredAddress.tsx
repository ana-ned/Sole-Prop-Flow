import { useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router"
import * as yup from "yup"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import AddressFields from "../../../../components/Forms/AddressAutocompleteFields"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import PageBar from "../../../../components/UI/PageBar"
import useAuth from "../../../../hooks/useAuth"
import CountryService from "../../../../services/country"
import PostalCode from "../../../../utils/validator-rules/postal-codes"
import { BusinessDetailsForm } from "../../../onboarding/components/business-details/BusinessDetailsForm.types"
import useCompany from "../../hooks/useCompany"

const AddressSchema = yup.object({
  location: yup.string(),
  country: yup.string(),
  addressLine1: yup.string().max(49),
  addressLine2: yup.string().max(40),
  locality: yup.string().max(49),
  region: yup.string().when("country", {
    is: (country: string) => CountryService.hasRegions(country),
    then: (schema) => schema.required().max(49),
  }),
  postalCode: yup.string().test(PostalCode),
})

const BusinessDetailsRegisteredAddress = ({
  data,
  setCustomSubmit,
  onBack,
  setStep,
}: StepProps<BusinessDetailsForm>) => {
  const auth = useAuth()
  const { t } = useTranslation(["onboarding", "partner-application"])
  const { id } = useParams()
  const { editCompanyWithFormData } = useCompany(id)

  const { control, handleSubmit, setValue, watch, trigger } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        registeredAddress: AddressSchema,
      })
    ),
    defaultValues: data,
    mode: "onBlur",
  })

  useEffect(() => {
    if (data?.registeredAddress.addressLine1) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      trigger()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <PageBar
        title={
          auth.organisation?.countryCode === "USA"
            ? t(
                "partner-application:businessDetails.businessDetailsRegisteredAddress.headerUsa"
              )
            : t(
                "partner-application:businessDetails.businessDetailsRegisteredAddress.header"
              )
        }
        onClickBack={onBack}
        withChat
        desktopHeaderType="h4"
      />
      <FormLayout>
        <form
          // @ts-expect-error: fix yup schema to infer ts types: https://github.com/react-hook-form/resolvers/releases/tag/v3.1.1
          onSubmit={handleSubmit((formData: BusinessDetailsForm) => {
            editCompanyWithFormData.mutate(formData)
            setCustomSubmit?.(formData, 3)
          })}
        >
          <FormLayout.Content>
            <AddressFields
              control={control}
              watch={watch}
              setValue={setValue}
              prefix="registeredAddress"
            />
          </FormLayout.Content>
          <FormLayout.Footer>
            <ButtonGroup>
              <Button
                type="submit"
                variant="secondary"
                onClick={() => {
                  setStep!(4)
                }}
              >
                {t("partner-application:businessDetails.skip")}
              </Button>
              <Button type="submit">
                {auth.organisation?.countryCode === "USA"
                  ? t("businessDetails.registeredAddress.submitUsa")
                  : t("businessDetails.registeredAddress.submit")}
              </Button>
            </ButtonGroup>
          </FormLayout.Footer>
        </form>
      </FormLayout>
    </>
  )
}

export default BusinessDetailsRegisteredAddress
