import { useCallback, useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { Comment01Icon } from "@hugeicons-pro/core-solid-rounded"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import Button from "../../../../components/Basic/Button"
import Typography from "../../../../components/Basic/Typography"
import PageLoader from "../../../../components/Collections/PageLoader"
import EligibilityTwoVariantSidebar from "../../../../components/Collections/RegistrationSidebars/variants/EligibilityTwoVariantSidebar"
import Checkbox from "../../../../components/Forms/Checkbox"
import CustomCombobox from "../../../../components/Forms/CustomCombobox"
import { SelectedOption } from "../../../../components/Forms/CustomCombobox/CustomCombobox"
import FormControl from "../../../../components/Forms/FormControl"
import Input from "../../../../components/Forms/Input"
import MultipleRadio from "../../../../components/Forms/MultipleRadio"
import Select from "../../../../components/Forms/Select"
import ApiErrorAlert from "../../../../components/Functional/ApiErrorAlert"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import TrustpilotWidget from "../../../../components/UI/TrustpilotWidget"
import Gradient from "../../../../components/UI/Gradient"
import Nudge from "../../../../components/UI/Nudge/Nudge"
import useAttribution from "../../../../hooks/useAttribution"
import useAuth, { getUserOverviewQueryKey } from "../../../../hooks/useAuth"
import { getDealQueryKey } from "../../../../hooks/useDeal"
import useTrackExperiment from "../../../../hooks/useTrackExperiment"
import { useTracking } from "../../../../hooks/useTracking"
import countries from "../../../../models/countries"
import apiConfig, { ApiServicesEnum } from "../../../../services/api/api-config"
import {
  AttributionResponsePartnerEnum,
  ExternalCompanyResponse,
  OnboardingRegistrationControllerApi,
  OrganisationCompanyDataApi,
  ReapplicationControllerApi,
  RegisterOrganisationRequestCurrencyEnum,
} from "../../../../services/api/organisation-users"
import CountryService from "../../../../services/country"
import { format } from "../../../../utils/money"
import { ucwords } from "../../../../utils/string"
import getNextPagePath from "../../utils/getNextPagePath"
import RegistrationLayout from "../RegistrationLayout/RegistrationLayout"
import { EligibilityCheckFormType } from "./EligibilityCheck"
import {
  canBeSoleTrader,
  mapMainRevenueToServerValues,
} from "./EligibilityCheck.utils"
import {
  FindBusinessFormSchema,
  FindBusinessFormType,
  isRegionUnsupported,
  isBespokeFunding,
} from "./findBusiness.schema"

type CombinedFormData = FindBusinessFormType &
  Omit<EligibilityCheckFormType, "businessWebsite"> &
  Partial<Pick<EligibilityCheckFormType, "businessWebsite">> &
  Omit<FindBusinessFormType, "contactEmail"> &
  Partial<Pick<FindBusinessFormType, "contactEmail">>

const FindBusiness = ({ data, setStep }: StepProps<CombinedFormData>) => {
  const auth = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation(["registration", "common"])
  const [companySearchData, setCompanySearchData] = useState<
    ExternalCompanyResponse | undefined
  >(data?.companySearchData)
  const { trackEvent } = useTracking()
  const attribution = useAttribution()
  const queryClient = useQueryClient()
  const { trackExperimentConverted } = useTrackExperiment()
  const isReapplication = !!auth.organisation?.organisationId
  const isPreQualified = !!auth.applicantData?.eligibilityCompleted
  const isAmazonPartnership =
    attribution.data?.partner === AttributionResponsePartnerEnum.Amazon

  const { control, handleSubmit, formState, watch, resetField, setValue } =
    useForm({
      resolver: yupResolver(FindBusinessFormSchema),
      context: {
        isAmazonPartnership,
      },
      defaultValues: {
        businessName:
          auth.organisationData?.companyName ||
          auth.applicantData?.legalName ||
          "",
        country:
          auth.organisationData?.countryCode ||
          attribution.data?.country ||
          auth.applicantData?.address?.country ||
          (navigator.language &&
            countries.find((item) =>
              [
                navigator.language.toUpperCase(),
                navigator.language.slice(3).toUpperCase(),
              ].includes(item["alpha-2"].toUpperCase())
            )?.["alpha-3"]) ||
          "",
        regions: auth.organisationData?.registeredAddress?.region
          ? [auth.organisationData.registeredAddress.region]
          : data?.regions ||
            (auth.applicantData?.address?.state
              ? [auth.applicantData.address.state]
              : []),
        phoneNumber:
          auth.userData?.phone ||
          auth.applicantData?.applicantUser?.personalPhoneNumber ||
          "",
        contactEmail: isAmazonPartnership ? auth.user?.email : undefined,
        isSoleTrader: auth.applicantData?.legalStructure
          ? canBeSoleTrader(auth.applicantData.legalStructure)
            ? "yes"
            : "no"
          : undefined,
        smsConsentGranted: data?.smsConsentGranted || false,
      },
      mode: "onBlur",
    })

  const refetch = useCallback(async () => {
    await auth.getToken({ cacheMode: "off" })
  }, [auth])

  const onSubmitMutation = useMutation({
    mutationFn: async (formData: CombinedFormData) =>
      isReapplication
        ? new ReapplicationControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.OrganisationUsers,
            })
          ).reapply({
            xXORGID: auth.organisation?.organisationId!,
            reapplyRequest: {
              regions: formData.regions,
              averageMonthlyRevenue: Number(formData.averageRevenue.amount),
              requiredFundingAmount: Number(formData.fundingAmount),
              typesOfBusiness: mapMainRevenueToServerValues(
                formData.mainRevenueSource
              ).typesOfBusiness,
              website: formData.businessWebsite?.trim() ?? "",
              mainEcommercePlatform: mapMainRevenueToServerValues(
                formData.mainRevenueSource
              ).mainEcommercePlatform,
              phoneNumber: formData.phoneNumber,
              isSoleTrader: requireSoleTraderField
                ? formData.isSoleTrader === "yes"
                : false,
              requiredFundingTimeHorizon: formData.requiredFundingTimeHorizon,
              smsConsentGranted: !!formData.smsConsentGranted,
              currency: formData.averageRevenue
                .currency as RegisterOrganisationRequestCurrencyEnum,
              contactEmail: formData.contactEmail,
              mostImportantForYou: formData.mostImportantForYou,
            },
          })
        : new OnboardingRegistrationControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.OrganisationUsers,
            })
          ).registerOrganisation({
            xXORGID: "",
            registerOrganisationRequest: {
              country: formData.country,
              regions: formData.regions,
              requiredFundingAmount: Number(formData.fundingAmount),
              companyName: formData.businessName,
              averageMonthlyRevenue: Number(formData.averageRevenue.amount),
              typesOfBusiness: mapMainRevenueToServerValues(
                formData.mainRevenueSource
              ).typesOfBusiness,
              website: formData.businessWebsite?.trim() ?? "",
              mainEcommercePlatform: mapMainRevenueToServerValues(
                formData.mainRevenueSource
              ).mainEcommercePlatform,
              phoneNumber: formData.phoneNumber,
              isSoleTrader: requireSoleTraderField
                ? formData.isSoleTrader === "yes"
                : false,
              registrationNumber: companySearchData?.companyNumber,
              dateOfCreation: companySearchData?.dateOfCreation,
              registeredAddress: companySearchData?.fullAddress,
              requiredFundingTimeHorizon: formData.requiredFundingTimeHorizon,
              smsConsentGranted: !!formData.smsConsentGranted,
              currency: formData.averageRevenue.currency,
              contactEmail: formData.contactEmail,
              mostImportantForYou: formData.mostImportantForYou,
            },
          }),
    onSuccess: async (res, formData) => {
      if (res.eligibleForFunding) {
        // Event required for conversion tracking in Google Ads
        trackEvent({
          category: "registration",
          name: "eligibility-check",
          action: "eligible",
          customFields: {
            revenue: formData.averageRevenue.amount,
            country: formData.country,
            email: auth.user?.email || "",
          },
        })
      }

      trackEvent({
        category: "funding-onboarding",
        name: "eligibility-check",
        action: "submitted",
        customFields: {
          eligible: !!res.eligibleForFunding,
          notEligibleReason: res.notEligibleReason ?? "",
          revenue: formData.averageRevenue.amount,
          country: formData.country,
          email: auth.user?.email ?? "",
        },
      })

      trackExperimentConverted("ROME-1458-Login-Shuffle-Experiment", "v1")

      const nextPagePath = getNextPagePath(res, {
        source: attribution.data?.partner,
      })

      await refetch()

      await queryClient.resetQueries({
        queryKey: getUserOverviewQueryKey(auth.organisation?.organisationId!),
        type: "all",
      })
      await queryClient.resetQueries({
        queryKey: getDealQueryKey(),
        type: "all",
      })

      await navigate(nextPagePath.url, {
        state: {
          reason: res.notEligibleReason,
          minimumRequiredRevenue: res.minimumRequiredRevenue,
          minimumRequiredRevenueCurrency: res.minimumRequiredRevenueCurrency,
          mainEcommercePlatform: mapMainRevenueToServerValues(
            formData.mainRevenueSource
          ).mainEcommercePlatform,
        },
      })
    },
    onError: () => {
      trackEvent({
        category: "funding-onboarding",
        name: "eligibility-check",
        action: "failed",
      })
    },
  })

  const formValues = watch()
  const selectedCountry = CountryService.getByAlpha3(formValues.country)

  const isCanada = formValues.country === "CAN"
  const requireSoleTraderField =
    formValues.businessName &&
    (!companySearchData || canBeSoleTrader(formValues.businessName))
  const requireRegionsField =
    !!selectedCountry?.regions &&
    formValues.businessName &&
    (!companySearchData?.region ||
      isRegionUnsupported([companySearchData.region], selectedCountry) ||
      isBespokeFunding([companySearchData.region], selectedCountry))

  if (auth.isLoading) {
    return <PageLoader />
  }

  const getStateHelpText = () => {
    if (isRegionUnsupported(formValues.regions, selectedCountry)) {
      return t("eligibility.FindBusiness.stateUnsupported", {
        state: formValues.regions![0],
        region: t(
          formValues.country === "CAN"
            ? "eligibility.FindBusiness.provinces"
            : "eligibility.FindBusiness.states"
        ),
      })
    }

    if (isBespokeFunding(formValues.regions, selectedCountry)) {
      return t("eligibility.FindBusiness.bespokeMortagageFunding")
    }

    return undefined
  }

  const sidebarAmount =
    auth.userData?.attribution?.offerMaxAmount ||
    Number(data?.averageRevenue.amount) ||
    0

  return (
    <RegistrationLayout
      title={t(
        isPreQualified
          ? "eligibility.FindBusiness.variant.titlePreQualified"
          : "eligibility.FindBusiness.variant.title"
      )}
      onClickBack={() => {
        setStep!(1)
      }}
      sidebar={
        <EligibilityTwoVariantSidebar
          amount={sidebarAmount}
          currency={data?.averageRevenue.currency || "USD"}
          belowExpectations={sidebarAmount < Number(data?.fundingAmount)}
          isPreQualified={isPreQualified}
        />
      }
    >
      <FormLayout>
        <form
          onSubmit={handleSubmit(async (formData) => {
            await onSubmitMutation.mutateAsync({
              ...formData,
              ...data!,
              companySearchData,
            })
          })}
        >
          <Gradient className="mb-4 rounded-2xl p-6 text-white lg:hidden">
            <Typography type="bodyMedium" className="text-center text-white">
              {t(
                isPreQualified
                  ? "common:sidebars.EligibilityTwoVariant.titlePreQualified"
                  : "common:sidebars.EligibilityTwoVariant.title"
              )}
            </Typography>
            <Typography className="font-heading text-center text-[40px] font-extrabold! text-white">
              {format(sidebarAmount, data?.averageRevenue.currency || "USD", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </Typography>
            <Typography type="smallCopy" className="mt-2 text-white">
              {t("common:sidebars.EligibilityTwoVariant.subtitle")}
            </Typography>
          </Gradient>
          <FormLayout.Content>
            <TrustpilotWidget className="mb-6 ml-[-13px]" />
            <FormControl>
              <Select
                control={control}
                name="country"
                label={t("eligibility.FindBusiness.country")}
                searchable
                onChange={() => {
                  resetField("regions")
                }}
                options={CountryService.getSelectOptions()}
                filterOption={CountryService.getSelectFilter}
                disabled={isReapplication}
              />
            </FormControl>
            <FormControl>
              <CustomCombobox
                disabled={isReapplication}
                control={control}
                name="businessName"
                label={
                  isReapplication
                    ? t("eligibility.FindBusiness.businessNameReadonly")
                    : t("eligibility.FindBusiness.businessName")
                }
                helpText={t("eligibility.FindBusiness.searchHelp")}
                createOption={{
                  title: t("eligibility.FindBusiness.createOption.title"),
                  description: t(
                    "eligibility.FindBusiness.createOption.description"
                  ),
                }}
                loadFn={async (searchQuery: string) => {
                  const response = await new OrganisationCompanyDataApi(
                    apiConfig({
                      token: await auth.getToken(),
                      service: ApiServicesEnum.OrganisationUsers,
                    })
                  ).searchCompanyByName({
                    xXORGID: auth.organisation?.organisationId || "",
                    name: searchQuery,
                    country: formValues.country,
                    maxResults: 10,
                  })

                  return (
                    response.content
                      ?.map((item) => ({
                        ...item,
                        title: ucwords(item.title || ""),
                      }))
                      .map((item) => ({
                        label: item.title,
                        subtitle: {
                          left: item.addressSnippet,
                          right: item.companyNumber
                            ? `#${item.companyNumber}`
                            : undefined,
                        },
                        value: item.title,
                        data: item,
                      })) || []
                  )
                }}
                displayValue={(value?: SelectedOption) =>
                  value?.data
                    ? [value.data.title, value.data.addressSnippet].join(", ")
                    : value?.label || ""
                }
                onChange={(value?: { data?: ExternalCompanyResponse }) => {
                  setCompanySearchData(value?.data)

                  trackEvent({
                    category: "registration",
                    name: "company-search",
                    action: value?.data?.id ? "selected" : "created",
                  })

                  if (value?.data?.region) {
                    setValue("regions", [value.data.region], {
                      shouldValidate: true,
                    })
                  }
                }}
              />
            </FormControl>
            {requireRegionsField && (
              <FormControl>
                <Select
                  label={t("eligibility.FindBusiness.addAllStates", {
                    region: t(
                      formValues.country === "CAN"
                        ? "eligibility.FindBusiness.provinces"
                        : "eligibility.FindBusiness.states"
                    ),
                  })}
                  control={control}
                  isMulti
                  name="regions"
                  options={
                    selectedCountry.regions?.map((item) => ({
                      value: item.name,
                      label: item.name,
                      entity: {
                        valid: !isRegionUnsupported(
                          [item.name],
                          selectedCountry
                        ),
                      },
                    })) || []
                  }
                  searchable
                  helpText={getStateHelpText()}
                />
              </FormControl>
            )}

            {requireSoleTraderField && (
              <FormControl>
                <MultipleRadio
                  label={t("eligibility.EligibilityCheck.soleTrader")}
                  name="isSoleTrader"
                  control={control}
                  options={[
                    {
                      value: "no",
                      label: isCanada
                        ? t(
                            "eligibility.EligibilityCheck.soleTraderOptions.noCanada"
                          )
                        : t(
                            "eligibility.EligibilityCheck.soleTraderOptions.no"
                          ),
                    },
                    {
                      value: "yes",
                      ...(isCanada
                        ? {
                            label: t(
                              "eligibility.EligibilityCheck.soleTraderOptions.yesCanada"
                            ),
                            sub: t(
                              "eligibility.EligibilityCheck.soleTraderOptions.yesHelpTextCanada"
                            ),
                          }
                        : {
                            label: t(
                              "eligibility.EligibilityCheck.soleTraderOptions.yes"
                            ),
                            sub: t(
                              "eligibility.EligibilityCheck.soleTraderOptions.yesHelpText"
                            ),
                          }),
                    },
                  ]}
                />
              </FormControl>
            )}

            {isAmazonPartnership && (
              <FormControl>
                <Input
                  type="email"
                  control={control}
                  name="contactEmail"
                  label={t("eligibility.FindBusiness.variant.contactEmail")}
                />
              </FormControl>
            )}

            <FormControl>
              <Input
                renderType="phone"
                country={
                  CountryService.getByAlpha3(formValues.country)?.["alpha-2"]
                }
                control={control}
                name="phoneNumber"
                label={t("eligibility.EligibilityCheck.phoneNumber")}
              />
            </FormControl>

            {onSubmitMutation.isError && (
              <ApiErrorAlert
                error={onSubmitMutation.error as unknown as Response}
                className="mt-2"
              />
            )}
          </FormLayout.Content>
          <FormLayout.Footer>
            <Nudge
              icon={Comment01Icon}
              content={t("eligibility.FindBusiness.variant.smsNudge")}
              layout="horizontal"
              accent={1}
              size={6}
            />
            <Checkbox
              name="smsConsentGranted"
              label={
                <Trans
                  i18nKey="eligibility.EligibilityCheck.consent.sms"
                  ns="registration"
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
              }
              control={control}
            />
            <Button
              type="submit"
              disabled={!formState.isValid}
              loading={onSubmitMutation.isPending}
              fullWidth
            >
              {isAmazonPartnership
                ? t("eligibility.FindBusiness.variant.submitAlt")
                : t(
                    isPreQualified
                      ? "eligibility.FindBusiness.variant.submitPreQualified"
                      : "eligibility.FindBusiness.variant.submit"
                  )}
            </Button>
          </FormLayout.Footer>
        </form>
      </FormLayout>
    </RegistrationLayout>
  )
}

export default FindBusiness
