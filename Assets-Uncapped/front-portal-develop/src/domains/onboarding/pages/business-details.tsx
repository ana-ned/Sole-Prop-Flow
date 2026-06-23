import { useEffect, useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as yup from "yup"
import Button from "../../../components/Basic/Button"
import ButtonGroup from "../../../components/Basic/ButtonGroup"
import SanitizedHtml from "../../../components/Basic/SanitizedHtml"
import Typography from "../../../components/Basic/Typography"
import AddressSummary from "../../../components/Collections/AddressSummary"
import PageLoader from "../../../components/Collections/PageLoader"
import AddressFields, {
  AddressValidationSchema,
} from "../../../components/Forms/AddressAutocompleteFields"
import Input from "../../../components/Forms/Input"
import Card from "../../../components/UI/Card"
import FormLayout from "../../../components/UI/FormLayout/FormLayout"
import PageBar from "../../../components/UI/PageBar"
import useAuth from "../../../hooks/useAuth"
import { useTracking } from "../../../hooks/useTracking"
import OnboardingGuard from "../components/OnboardingGuard"
import OnboardingLayout from "../components/OnboardingLayout"
import useApplicationSteps from "../hooks/useApplicationSteps"
import useCompany from "../hooks/useCompany"
import useOnboardingNavigation from "../hooks/useOnboardingNavigation"

const schema = yup.object().shape({
  companyName: yup.string().required(),
  companyNumber: yup.string().required(),
  registeredAddress: AddressValidationSchema,
})

const BusinessDetails = () => {
  const auth = useAuth()
  const { handleCompleteStep, hasAutocompletedStep } = useApplicationSteps()
  const { companyDetails, updateBusinessDetails } = useCompany()
  const { t } = useTranslation("onboarding")
  const [editAddress, setEditAddress] = useState(false)
  const navigation = useOnboardingNavigation()
  const form = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  })
  const { trackEvent } = useTracking()

  useEffect(() => {
    if (companyDetails.data) {
      const applicant = auth.applicantData
      const companyAddress = companyDetails.data.registeredAddress
      const applicantAddress = applicant?.address

      const mergedAddress = {
        addressLine1:
          companyAddress?.addressLine1 || applicantAddress?.addressLine1 || "",
        addressLine2:
          companyAddress?.addressLine2 || applicantAddress?.addressLine2 || "",
        locality: companyAddress?.locality || applicantAddress?.city || "",
        region: companyAddress?.region || applicantAddress?.state || "",
        postalCode: companyAddress?.postalCode || applicantAddress?.zip || "",
        country:
          companyAddress?.country ||
          auth.organisation?.countryCode ||
          applicantAddress?.country ||
          "",
      }

      form.reset({
        companyName:
          companyDetails.data.companyName || applicant?.legalName || "",
        companyNumber:
          companyDetails.data.companyNumber ||
          applicant?.companyRegistrationId ||
          "",
        registeredAddress: mergedAddress.addressLine1
          ? mergedAddress
          : { country: mergedAddress.country },
      })

      setEditAddress(
        !mergedAddress.addressLine1 ||
          !mergedAddress.locality ||
          !mergedAddress.region ||
          !mergedAddress.country
      )

      if (mergedAddress.addressLine1) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        form.trigger("registeredAddress")
      }
    }
  }, [
    companyDetails.data,
    form,
    auth.organisation?.countryCode,
    auth.applicantData,
  ])

  const registeredAddressError = form.formState.errors.registeredAddress

  useEffect(() => {
    if (registeredAddressError) {
      setEditAddress(true)
    }
  }, [registeredAddressError])

  useEffect(() => {
    if (form.formState.isDirty) {
      trackEvent({
        category: "onboarding",
        name: "business-details",
        action: "updated",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState.isDirty])

  if (companyDetails.isLoading) {
    return <PageLoader />
  }

  return (
    <OnboardingGuard step="BUSINESS_DETAILS">
      <OnboardingLayout>
        <OnboardingLayout.Parent
          pageBar={
            <PageBar
              title={t("businessDetails.title")}
              withChat
              desktopHeaderType="h4"
            />
          }
        >
          <Typography className="mb-6">
            {t("businessDetails.content")}
          </Typography>
          <FormLayout>
            <form
              onSubmit={form.handleSubmit(async (data) => {
                await updateBusinessDetails.mutateAsync(data)

                if (!hasAutocompletedStep("BUSINESS_DETAILS")) {
                  await handleCompleteStep("BUSINESS_DETAILS")
                }
                navigation.next()
              })}
            >
              <div className="flex flex-col gap-y-5">
                <Input
                  control={form.control}
                  name="companyName"
                  label={
                    auth.organisation?.countryCode === "USA"
                      ? t("businessDetails.businessInfo.legalCorporateName")
                      : t("businessDetails.businessInfo.registeredBusinessName")
                  }
                />

                <Input
                  control={form.control}
                  name="companyNumber"
                  label={
                    auth.organisation?.countryCode === "GBR"
                      ? t("businessDetails.businessInfo.companiesHouseNumber")
                      : auth.organisation?.countryCode === "USA"
                        ? t("businessDetails.businessInfo.companyEinNo")
                        : t(
                            "businessDetails.businessInfo.companyRegistrationNo"
                          )
                  }
                />

                <div>
                  {editAddress ? (
                    <>
                      <Typography
                        type="bodyTitle"
                        className="mb-1"
                        color="neutral-700"
                      >
                        {t("businessDetails.address.title")}
                      </Typography>
                      <Typography
                        type="smallCopy"
                        className="mb-3"
                        color="neutral-600"
                      >
                        <SanitizedHtml
                          as="span"
                          content={t("businessDetails.address.description")}
                        />
                      </Typography>
                      <AddressFields
                        control={form.control}
                        watch={form.watch}
                        setValue={form.setValue}
                        prefix="registeredAddress"
                      />
                    </>
                  ) : (
                    <>
                      <Card>
                        <Typography
                          type="tableValue"
                          color="neutral-600"
                          className="mb-1"
                        >
                          {auth.organisation?.countryCode === "USA"
                            ? t(
                                "businessDetails.reviewBusiness.legalBusinessAddress"
                              )
                            : t(
                                "businessDetails.reviewBusiness.registeredAddress"
                              )}
                        </Typography>
                        <AddressSummary
                          address={form.watch("registeredAddress")}
                        />
                      </Card>
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="link"
                          type="button"
                          onClick={() => {
                            trackEvent({
                              category: "onboarding",
                              name: "business-details",
                              action: "edit-address",
                            })
                            setEditAddress(true)
                          }}
                        >
                          {t("businessDetails.editAddress")}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <FormLayout.Footer>
                <ButtonGroup onClickBack={() => navigation.prev()}>
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid}
                    loading={updateBusinessDetails.isPending}
                  >
                    {t("businessDetails.submit")}
                  </Button>
                </ButtonGroup>
              </FormLayout.Footer>
            </form>
          </FormLayout>
        </OnboardingLayout.Parent>
      </OnboardingLayout>
    </OnboardingGuard>
  )
}

export default BusinessDetails
