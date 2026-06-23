import { yupResolver } from "@hookform/resolvers/yup"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router"
import * as yup from "yup"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import Typography from "../../../../components/Basic/Typography"
import AddressSummary from "../../../../components/Collections/AddressSummary"
import FieldsSummary from "../../../../components/Collections/FieldsSummary"
import ApiErrorAlert from "../../../../components/Functional/ApiErrorAlert"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import ContentDivider from "../../../../components/UI/ContentDivider"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import PageBar from "../../../../components/UI/PageBar"
import useAuth from "../../../../hooks/useAuth"
import { BusinessDetailsForm } from "../../../onboarding/components/business-details/BusinessDetailsForm.types"
import useCompany from "../../hooks/useCompany"

const US_DATE_FORMAT_CLIENT = "MM/dd/yyyy"

const InputPlaceholder = () => {
  const { t } = useTranslation("partner-application")

  return (
    <Typography type="tableValue" color="warning-600" className="mb-1">
      {t("businessDetails.businessDetailsReview.forInput")}
    </Typography>
  )
}

const BusinessDetailsReview = ({
  data,
  setCustomSubmit,
  onBack,
}: StepProps<BusinessDetailsForm>) => {
  const auth = useAuth()
  const { id } = useParams()
  const { t } = useTranslation(["onboarding", "partner-application"])
  const navigate = useNavigate()
  const { editCompanyWithFormData } = useCompany(id)
  const error = null

  const schema = yup.object().shape({
    sameAddresses: yup.string(),
  })

  const { handleSubmit, formState, watch } = useForm({
    // @ts-expect-error: fix yup schema to infer ts types: https://github.com/react-hook-form/resolvers/releases/tag/v3.1.1
    resolver: yupResolver(schema),
    defaultValues: data,
    mode: "onBlur",
  })
  const formValues = watch()

  return (
    <>
      <PageBar
        onClickBack={onBack}
        title={t("businessDetails.reviewBusiness.title")}
        withChat
        desktopHeaderType="h4"
      />
      <FormLayout>
        <form
          onSubmit={handleSubmit(async () => {
            await editCompanyWithFormData.mutateAsync(formValues)
            await navigate(`/partner/application/documents/${id}`)
          })}
        >
          <FormLayout.Content>
            <ContentDivider>
              <FieldsSummary
                className=""
                data={[
                  {
                    th:
                      data?.registeredAddress.country === "USA"
                        ? t("businessDetails.reviewBusiness.legalCorporateName")
                        : t("businessDetails.reviewBusiness.legalBusinessName"),
                    td: data?.companyName || <InputPlaceholder />,
                  },
                  {
                    th:
                      data?.registeredAddress.country === "USA"
                        ? t("businessDetails.reviewBusiness.einNumber")
                        : t(
                            "businessDetails.reviewBusiness.companyRegistrationNo"
                          ),
                    td: data?.companyNumber || <InputPlaceholder />,
                  },
                  {
                    th: t("businessDetails.reviewBusiness.dateOfCreation"),
                    td:
                      data?.registeredAddress.country === "USA" &&
                      data.dateOfCreation
                        ? format(
                            new Date(data.dateOfCreation),
                            US_DATE_FORMAT_CLIENT
                          )
                        : data?.dateOfCreation || <InputPlaceholder />,
                  },
                ]}
              />
            </ContentDivider>

            <ContentDivider className="mb-4">
              <Typography
                type="tableValue"
                color="neutral-600"
                className="mb-1"
              >
                {auth.organisation?.countryCode === "USA"
                  ? t("businessDetails.reviewBusiness.legalBusinessAddress")
                  : t("businessDetails.reviewBusiness.registeredAddress")}
              </Typography>
              {(!data?.registeredAddress.addressLine1 ||
                !data.registeredAddress.country ||
                !data.registeredAddress.locality ||
                !data.registeredAddress.postalCode) && <InputPlaceholder />}
              <AddressSummary address={data?.registeredAddress} />
            </ContentDivider>

            <div className="flex justify-end">
              <Button
                variant="link"
                type="button"
                onClick={() => {
                  setCustomSubmit?.({ ...formValues }, 1)
                }}
              >
                {t("businessDetails.reviewBusiness.editBusinessInfo")}
              </Button>
            </div>

            <ApiErrorAlert className="mt-4" error={error} />
          </FormLayout.Content>
          <FormLayout.Footer>
            <ButtonGroup>
              <Button type="submit" disabled={!formState.isValid}>
                {t("businessDetails.reviewBusiness.submit")}
              </Button>
            </ButtonGroup>
          </FormLayout.Footer>
        </form>
      </FormLayout>
    </>
  )
}

export default BusinessDetailsReview
