import { yupResolver } from "@hookform/resolvers/yup"
import { pickBy } from "lodash-es"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as yup from "yup"
import Button from "../../../components/Basic/Button"
import ButtonGroup from "../../../components/Basic/ButtonGroup"
import FormControl from "../../../components/Forms/FormControl"
import Input from "../../../components/Forms/Input"
import Select from "../../../components/Forms/Select"
import ApiErrorAlert from "../../../components/Functional/ApiErrorAlert"
import { StepProps } from "../../../components/Headless/MultistepForm"
import Alert from "../../../components/UI/Alert"
import FormLayout from "../../../components/UI/FormLayout/FormLayout"
import { PartnerRegistrationRequestTypeEnum } from "../../../services/api/partners"
import CountryService from "../../../services/country"
import PhoneFormat from "../../../utils/validator-rules/phone"
import RegistrationLayout from "../../registration/components/RegistrationLayout"
import useRegisterPartner, {
  PartnerRegistrationForm,
} from "../hooks/useRegisterPartner"
import PartnerRegistrationSidebar from "./PartnerRegistrationSidebar"

interface DetailsForm {
  businessCountry: string
  phoneNumber: string
  businessName?: string
  website?: string
  partnerType: string
}

const PartnerRegistrationBusinessDetails = ({
  onBack,
  data,
}: StepProps<DetailsForm>) => {
  const { t } = useTranslation("partner-registration", {
    keyPrefix: "partnerRegistrationBusinessDetails",
  })
  const { registerPartner, recaptchaError } = useRegisterPartner()
  const { control, handleSubmit, formState, watch } = useForm<DetailsForm>({
    resolver: yupResolver(
      yup.object().shape({
        businessCountry: yup.string().required(),
        phoneNumber: yup.string().required().test(PhoneFormat()),
        businessName: yup.string(),
        partnerType: yup.string().required(),
        website: yup.string(),
      })
    ),
    mode: "onBlur",
    defaultValues: data,
  })

  const currentCountry = watch("businessCountry")

  return (
    <RegistrationLayout
      sidebar={<PartnerRegistrationSidebar />}
      title={t("title")}
      onClickBack={onBack}
    >
      <FormLayout>
        <form
          onSubmit={handleSubmit((formData) => {
            registerPartner.mutate(
              pickBy(
                { ...data, ...formData },
                (field) => field.length > 0
              ) as unknown as PartnerRegistrationForm
            )
          })}
        >
          <FormLayout.Content>
            <FormControl>
              <Select
                label={t("form.country")}
                name="businessCountry"
                searchable
                control={control}
                options={CountryService.getSelectOptions()}
                filterOption={CountryService.getSelectFilter}
              />
            </FormControl>
            <FormControl>
              <Input
                renderType="phone"
                country={
                  CountryService.getByAlpha3(currentCountry)?.["alpha-2"]
                }
                control={control}
                name="phoneNumber"
                label={t("form.contactNumber")}
              />
            </FormControl>
            <FormControl>
              <Select
                label={t("form.partnerType")}
                name="partnerType"
                searchable
                control={control}
                options={[
                  {
                    value: PartnerRegistrationRequestTypeEnum.Affiliate,
                    label: t("form.partnerTypeOptions.affilate"),
                  },
                  {
                    value: PartnerRegistrationRequestTypeEnum.Broker,
                    label: t("form.partnerTypeOptions.broker"),
                  },
                  {
                    value: PartnerRegistrationRequestTypeEnum.Other,
                    label: t("form.partnerTypeOptions.other"),
                  },
                ]}
              />
            </FormControl>
            <FormControl>
              <Input
                control={control}
                name="businessName"
                label={t("form.businessName")}
              />
            </FormControl>
            <FormControl>
              <Input
                control={control}
                name="website"
                label={t("form.businessWebsite")}
              />
            </FormControl>
          </FormLayout.Content>
          <FormLayout.Footer>
            {recaptchaError && (
              <Alert type="danger">
                <p>{recaptchaError}</p>
              </Alert>
            )}
            {registerPartner.isError && !recaptchaError && (
              <ApiErrorAlert
                error={registerPartner.error as unknown as Response}
              />
            )}
            <ButtonGroup>
              <Button
                type="submit"
                disabled={!formState.isValid}
                loading={registerPartner.isPending}
              >
                {t("continue")}
              </Button>
            </ButtonGroup>
          </FormLayout.Footer>
        </form>
      </FormLayout>
    </RegistrationLayout>
  )
}

export default PartnerRegistrationBusinessDetails
