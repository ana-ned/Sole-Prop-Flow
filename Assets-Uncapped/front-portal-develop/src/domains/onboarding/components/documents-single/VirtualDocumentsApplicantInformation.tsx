import { useEffect, useMemo } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { HugeiconsIcon } from "@hugeicons/react"
import { SecurityValidationSolidRounded } from "@hugeicons-pro/core-solid-rounded"
import { StarAward02SolidSharp } from "@hugeicons-pro/core-solid-sharp"
import { Rocket01SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import * as yup from "yup"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import Typography from "../../../../components/Basic/Typography"
import PageLoader from "../../../../components/Collections/PageLoader"
import AddressFields, {
  AddressValidationSchemaEquifax,
} from "../../../../components/Forms/AddressAutocompleteFields"
import DateInput from "../../../../components/Forms/DateInput"
import FormControl from "../../../../components/Forms/FormControl"
import Input from "../../../../components/Forms/Input"
import Select from "../../../../components/Forms/Select"
import Alert from "../../../../components/UI/Alert"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import Nudge from "../../../../components/UI/Nudge/Nudge"
import useAuth, { getUserOverviewQueryKey } from "../../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../../services/api/api-config"
import {
  ConsentControllerApi,
  GrantConsentConsentTypeEnum,
  UserUpdateRequest,
} from "../../../../services/api/organisation-users"
import CountryService from "../../../../services/country"
import AtLeast18Yo from "../../../../utils/validator-rules/at-least-18-yo"
import DateFormat from "../../../../utils/validator-rules/date-format"
import { OnboardingMenuPaths } from "../../constants"
import useApplicationSteps from "../../hooks/useApplicationSteps"
import useOnboardingNavigation from "../../hooks/useOnboardingNavigation"
import OnboardingMenu from "../OnboardingMenu"
import DocumentsUploadLayout from "./DocumentsUploadLayout"

const SIDEBAR_ITEM_ICONS = [
  {
    accent: "accent-2",
    icon: Rocket01SolidStandard,
  },
  {
    accent: "accent-6",
    icon: StarAward02SolidSharp,
  },
] as const

const VirtualDocumentsApplicantInformation = ({
  backUrl,
}: {
  backUrl: string
}) => {
  const auth = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation("onboarding", {
    keyPrefix: "documents.virtualDocuments.applicantInformation",
  })
  const queryClient = useQueryClient()
  const { handleCompleteStep } = useApplicationSteps()
  const navigation = useOnboardingNavigation()

  const displayedAsOnboardingStep = backUrl === OnboardingMenuPaths.Review

  const applicantUser = auth.applicantData?.applicantUser
  const userData = auth.userData

  const { control, handleSubmit, formState, watch, setValue } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        dob: yup.string().required().test(DateFormat()).test(AtLeast18Yo()),
        nationality: yup.string().required(),
        homeAddress: AddressValidationSchemaEquifax,
      })
    ),
    values: useMemo(
      () => ({
        firstName: applicantUser?.firstName ?? userData?.firstName ?? "",
        lastName: applicantUser?.lastName ?? userData?.lastName ?? "",
        dob: applicantUser?.dateOfBirth?.toISOString().substring(0, 10) || "",
        nationality: applicantUser?.nationality ?? "",
        homeAddress: {
          street: applicantUser?.address?.street ?? "",
          buildingNumber: applicantUser?.address?.buildingNumber ?? "",
          ...(applicantUser?.address?.apartmentNumber && {
            apartmentNumber: applicantUser.address.apartmentNumber,
          }),
          locality: applicantUser?.address?.city ?? "",
          ...(applicantUser?.address?.stateRegion && {
            region: applicantUser.address.stateRegion,
          }),
          postalCode: applicantUser?.address?.zip ?? "",
          country: applicantUser?.address?.country ?? "",
        },
      }),
      [applicantUser, userData]
    ),
    mode: "onBlur",
  })

  const proceed = async () => {
    if (displayedAsOnboardingStep) {
      await handleCompleteStep("APPLICANT_INFORMATION")
      navigation.next()
    } else {
      await navigate(backUrl)
    }
  }

  const upload = useMutation({
    mutationFn: async (userUpdateRequest: UserUpdateRequest) =>
      new ConsentControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.OrganisationUsers,
        })
      ).grantConsent({
        xXORGID: auth.organisation?.organisationId!,
        consentType: GrantConsentConsentTypeEnum.SoftCreditCheck,
        userExternalId: auth.user?.sub!,
        userUpdateRequest,
      }),
    onSuccess: async () => {
      await proceed()
      await queryClient.invalidateQueries({
        queryKey: getUserOverviewQueryKey(auth.organisation?.organisationId!),
      })
    },
  })

  const homeAddressCountry = watch("homeAddress.country")

  useEffect(() => {
    if (auth.organisationData?.countryCode && !homeAddressCountry) {
      setValue("homeAddress.country", auth.organisationData.countryCode)
    }
  }, [auth.organisationData?.countryCode, homeAddressCountry, setValue])

  if (auth.isLoading) {
    return <PageLoader />
  }

  const submitted = auth.organisationData?.consents?.some(
    (consent) =>
      consent.type === GrantConsentConsentTypeEnum.SoftCreditCheck &&
      consent.status === "GIVEN"
  )

  return (
    <DocumentsUploadLayout
      title={t("title")}
      menu={displayedAsOnboardingStep ? <OnboardingMenu /> : undefined}
      sidebar={
        <>
          <Typography type="bodyTitle" className="mb-4">
            {t("sidebar.title")}
          </Typography>
          <ul className="space-y-4">
            {t("sidebar.items", { returnObjects: true }).map((item, index) => (
              <li key={index} className="flex items-start gap-x-4">
                <BoxIcon
                  icon={<HugeiconsIcon icon={SIDEBAR_ITEM_ICONS[index].icon} />}
                  severity={SIDEBAR_ITEM_ICONS[index].accent}
                />
                <Typography>{item}</Typography>
              </li>
            ))}
          </ul>
        </>
      }
    >
      <Nudge
        title={t("nudge.title")}
        content={t("nudge.content")}
        icon={SecurityValidationSolidRounded}
        layout="horizontal"
        accent={1}
        className="mb-4 lg:mb-8"
      />
      <FormLayout>
        <form
          onSubmit={handleSubmit(async (formData) => {
            await upload.mutateAsync({
              userBasicInfo: {
                name: formData.firstName,
                surname: formData.lastName,
              },
              userDetails: {
                dateOfBirth: new Date(formData.dob),
                nationality: formData.nationality,
                address: {
                  addressLine1: [
                    formData.homeAddress.buildingNumber,
                    formData.homeAddress.street,
                  ]
                    .filter(Boolean)
                    .join(" "),
                  addressLine2: formData.homeAddress.apartmentNumber,
                  street: formData.homeAddress.street,
                  buildingNumber: formData.homeAddress.buildingNumber,
                  apartmentNumber: formData.homeAddress.apartmentNumber,
                  city: formData.homeAddress.locality,
                  country: formData.homeAddress.country,
                  state: formData.homeAddress.region,
                  postalCode: formData.homeAddress.postalCode,
                },
              },
            })
          })}
        >
          <FormLayout.Content>
            {submitted ? (
              <Alert type="success" title={t("submitted.title")}>
                {t("submitted.content")}
              </Alert>
            ) : (
              <>
                <FormControl>
                  <Input
                    control={control}
                    name="firstName"
                    label={t("form.firstName")}
                  />
                </FormControl>

                <FormControl>
                  <Input
                    control={control}
                    name="lastName"
                    label={t("form.lastName")}
                  />
                </FormControl>

                <FormControl>
                  <DateInput
                    control={control}
                    name="dob"
                    label={t("form.dob")}
                    inputFormat={
                      auth.organisationData?.countryCode === "USA" ? "US" : "EU"
                    }
                  />
                </FormControl>

                <FormControl>
                  <Select
                    control={control}
                    name="nationality"
                    label={t("form.nationality")}
                    searchable
                    options={CountryService.getSelectOptions()}
                    filterOption={CountryService.getSelectFilter}
                    defaultValue={auth.organisationData?.countryCode}
                  />
                </FormControl>

                <AddressFields
                  control={control}
                  setValue={setValue}
                  watch={watch}
                  prefix="homeAddress"
                  label={t("form.homeAddress")}
                  variant="equifax"
                />

                <Alert type="success" className="mt-4">
                  <Trans
                    i18nKey="documents.virtualDocuments.applicantInformation.alert"
                    ns="onboarding"
                    components={{
                      href: (
                        // eslint-disable-next-line jsx-a11y/anchor-has-content
                        <a
                          href="https://www.weareuncapped.com/privacy-policy"
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            textDecoration: "none",
                            fontWeight: "bold",
                            color: "var(--color-brand-600)",
                          }}
                        />
                      ),
                    }}
                  />
                </Alert>
              </>
            )}
          </FormLayout.Content>
          <FormLayout.Footer>
            <ButtonGroup>
              {submitted ? (
                <Button
                  type="button"
                  onClick={async () => {
                    await proceed()
                  }}
                >
                  {t("submit")}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!formState.isValid}
                  loading={upload.isPending}
                >
                  {t("submit")}
                </Button>
              )}
            </ButtonGroup>
          </FormLayout.Footer>
        </form>
      </FormLayout>
    </DocumentsUploadLayout>
  )
}

export default VirtualDocumentsApplicantInformation
