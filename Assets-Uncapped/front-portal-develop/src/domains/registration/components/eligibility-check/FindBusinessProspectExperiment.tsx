import { useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { Comment01Icon } from "@hugeicons-pro/core-solid-rounded"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import Typography from "../../../../components/Basic/Typography"
import EligibilityTwoVariantSidebar from "../../../../components/Collections/RegistrationSidebars/variants/EligibilityTwoVariantSidebar"
import NotEligible from "../../../../components/Content/Registration/NotEligible"
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
import { useTracking } from "../../../../hooks/useTracking"
import countries from "../../../../models/countries"
import apiConfig, { ApiServicesEnum } from "../../../../services/api/api-config"
import {
  ExternalCompanyResponse,
  OrganisationCompanyDataApi,
  ProspectControllerApi,
  ProspectWithEligibilityCheckResponse,
  RegisterOrganisationRequestCurrencyEnum,
  RegisterOrganisationResponseNotEligibleReasonEnum,
} from "../../../../services/api/organisation-users"
import CountryService from "../../../../services/country"
import { format } from "../../../../utils/money"
import { ucwords } from "../../../../utils/string"
import RegistrationLayout from "../RegistrationLayout/RegistrationLayout"
import { EligibilityCheckFormType } from "./EligibilityCheck"
import {
  canBeSoleTrader,
  mapMainRevenueToServerValues,
} from "./EligibilityCheck.utils"
import { MainRevenueSourceEnum } from "./EligibilityCheckForm.types"
import {
  FindBusinessFormSchema,
  FindBusinessFormType,
  isRegionUnsupported,
  isBespokeFunding,
} from "./findBusiness.schema"

type CombinedFormData = FindBusinessFormType &
  Omit<EligibilityCheckFormType, "businessWebsite"> &
  Partial<Pick<EligibilityCheckFormType, "businessWebsite">> & {
    prospectId?: string
    preliminaryOffer?: number
    preliminaryOfferCurrency?: string
  }

const FindBusinessProspectExperiment = ({
  data,
  onSubmit,
  setStep,
}: StepProps<CombinedFormData>) => {
  const { t } = useTranslation(["registration", "common"])
  const [companySearchData, setCompanySearchData] = useState<
    ExternalCompanyResponse | undefined
  >(data?.companySearchData)
  const [notEligibleDetails, setNotEligibleDetails] = useState<
    ProspectWithEligibilityCheckResponse | undefined
  >()
  const { trackEvent } = useTracking()

  const { control, handleSubmit, formState, watch, resetField, setValue } =
    useForm({
      resolver: yupResolver(FindBusinessFormSchema),
      defaultValues: {
        businessName: data?.businessName || "",
        country:
          (navigator.language &&
            countries.find((item) =>
              [
                navigator.language.toUpperCase(),
                navigator.language.slice(3).toUpperCase(),
              ].includes(item["alpha-2"].toUpperCase())
            )?.["alpha-3"]) ||
          "",
        regions: data?.regions || [],
        phoneNumber: data?.phoneNumber || "",
        smsConsentGranted: data?.smsConsentGranted || false,
      },
      mode: "onBlur",
    })

  const onSubmitMutation = useMutation({
    mutationFn: async (formData: CombinedFormData) => {
      const { typesOfBusiness, mainEcommercePlatform } =
        mapMainRevenueToServerValues(
          formData.mainRevenueSource as MainRevenueSourceEnum
        )

      const result = await new ProspectControllerApi(
        apiConfig({ service: ApiServicesEnum.OrganisationUsers })
      ).verify({
        xXORGID: "",
        registerOrganisationRequest: {
          country: formData.country,
          companyName: formData.businessName,
          regions: formData.regions,
          averageMonthlyRevenue: Number(formData.averageRevenue.amount),
          requiredFundingAmount: Number(formData.fundingAmount),
          requiredFundingTimeHorizon: formData.requiredFundingTimeHorizon,
          typesOfBusiness,
          mainEcommercePlatform,
          website: formData.businessWebsite?.trim() ?? "",
          phoneNumber: formData.phoneNumber,
          isSoleTrader: formData.isSoleTrader === "yes",
          smsConsentGranted: !!formData.smsConsentGranted,
          currency: formData.averageRevenue
            .currency as RegisterOrganisationRequestCurrencyEnum,
          registrationNumber: companySearchData?.companyNumber,
          dateOfCreation: companySearchData?.dateOfCreation,
          registeredAddress: companySearchData?.fullAddress,
          mostImportantForYou: formData.mostImportantForYou,
        },
      })

      return { formData, result }
    },
    onSuccess: ({ formData, result }) => {
      if (!result.eligibleForFunding) {
        setNotEligibleDetails(result)
        trackEvent({
          category: "registration",
          name: "prospect",
          action: "not-eligible",
        })
        return
      }

      trackEvent({
        category: "registration",
        name: "prospect",
        action: "eligible",
      })

      onSubmit?.({
        ...formData,
        prospectId: result.prospectId,
        preliminaryOffer: result.preliminaryOffer,
        preliminaryOfferCurrency: result.preliminaryOfferCurrency,
        companySearchData,
      })
    },
    onError: () => {
      trackEvent({
        category: "registration",
        name: "prospect",
        action: "failed",
      })
    },
  })

  const formValues = watch()
  const selectedCountry = CountryService.getByAlpha3(formValues.country)

  const isCanada = formValues.country === "CAN"
  const regionLabel = t(
    isCanada
      ? "eligibility.FindBusiness.provinces"
      : "eligibility.FindBusiness.states"
  )
  const requireSoleTraderField =
    formValues.businessName &&
    (!companySearchData || canBeSoleTrader(formValues.businessName))
  const requireRegionsField =
    !!selectedCountry?.regions &&
    formValues.businessName &&
    (!companySearchData?.region ||
      isRegionUnsupported([companySearchData.region], selectedCountry) ||
      isBespokeFunding([companySearchData.region], selectedCountry))

  const getStateHelpText = () => {
    if (isRegionUnsupported(formValues.regions, selectedCountry)) {
      return t("eligibility.FindBusiness.stateUnsupported", {
        state: formValues.regions![0],
        region: regionLabel,
      })
    }

    if (isBespokeFunding(formValues.regions, selectedCountry)) {
      return t("eligibility.FindBusiness.bespokeMortagageFunding")
    }

    return undefined
  }

  const sidebarAmount = Number(data?.averageRevenue.amount) || 0

  if (notEligibleDetails?.notEligibleReason) {
    return (
      <NotEligible
        reason={
          notEligibleDetails.notEligibleReason satisfies RegisterOrganisationResponseNotEligibleReasonEnum
        }
        requiredRevenue={notEligibleDetails.minimumRequiredRevenue}
        requiredCurrency={notEligibleDetails.minimumRequiredRevenueCurrency}
        onReapply={() => {
          setNotEligibleDetails(undefined)
          setStep!(1)
        }}
        isReapplyPending={false}
      />
    )
  }

  return (
    <RegistrationLayout
      title={t("eligibility.FindBusiness.variant.title")}
      onClickBack={() => {
        setStep!(1)
      }}
      sidebar={
        <EligibilityTwoVariantSidebar
          amount={sidebarAmount}
          currency={data?.averageRevenue.currency || "USD"}
          belowExpectations={sidebarAmount < Number(data?.fundingAmount)}
        />
      }
    >
      <FormLayout>
        <form
          onSubmit={handleSubmit(async (formData) => {
            await onSubmitMutation.mutateAsync({
              ...data!,
              ...formData,
              companySearchData,
            })
          })}
        >
          <Gradient className="mb-4 rounded-2xl p-6 text-white lg:hidden">
            <Typography type="bodyMedium" className="text-center text-white">
              {t("common:sidebars.EligibilityTwoVariant.title")}
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
            <TrustpilotWidget className="mb-6 -ml-[13px]" />
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
              />
            </FormControl>
            <FormControl>
              <CustomCombobox
                control={control}
                name="businessName"
                label={t("eligibility.FindBusiness.businessName")}
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
                      service: ApiServicesEnum.OrganisationUsers,
                    })
                  ).searchCompanyByName({
                    xXORGID: "",
                    name: searchQuery,
                    country: formValues.country,
                    maxResults: 10,
                  })

                  return (
                    response.content?.map((item) => {
                      const title = ucwords(item.title || "")
                      return {
                        label: title,
                        subtitle: {
                          left: item.addressSnippet,
                          right: item.companyNumber
                            ? `#${item.companyNumber}`
                            : undefined,
                        },
                        value: title,
                        data: { ...item, title },
                      }
                    }) || []
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
                    region: regionLabel,
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
                      label: t(
                        `eligibility.EligibilityCheck.soleTraderOptions.${isCanada ? "noCanada" : "no"}`
                      ),
                    },
                    {
                      value: "yes",
                      label: t(
                        `eligibility.EligibilityCheck.soleTraderOptions.${isCanada ? "yesCanada" : "yes"}`
                      ),
                      sub: t(
                        `eligibility.EligibilityCheck.soleTraderOptions.${isCanada ? "yesHelpTextCanada" : "yesHelpText"}`
                      ),
                    },
                  ]}
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
              {t("eligibility.FindBusiness.variant.submit")}
            </Button>
          </FormLayout.Footer>
        </form>
      </FormLayout>
    </RegistrationLayout>
  )
}

export default FindBusinessProspectExperiment
