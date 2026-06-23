import { useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import freeEmailDomains from "free-email-domains"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as yup from "yup"
import Button from "../../../../components/Basic/Button"
import PageLoader from "../../../../components/Collections/PageLoader"
import EligibilityOneVariantSidebar from "../../../../components/Collections/RegistrationSidebars/variants/EligibilityOneVariantSidebar"
import FormControl from "../../../../components/Forms/FormControl"
import Input from "../../../../components/Forms/Input"
import MoneyFields from "../../../../components/Forms/MoneyFields"
import Select from "../../../../components/Forms/Select"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import TrustpilotWidget from "../../../../components/UI/TrustpilotWidget"
import useAttribution from "../../../../hooks/useAttribution"
import useAuth from "../../../../hooks/useAuth"
import useTrackedQueryParams from "../../../../hooks/useTrackedQueryParams"
import { useTracking } from "../../../../hooks/useTracking"
import {
  AttributionResponsePartnerEnum,
  RegisterOrganisationRequestCurrencyEnum,
} from "../../../../services/api/organisation-users"
import { detectCurrencyFromBrowser } from "../../../../utils/detectCurrency"
import { currencyToSymbol } from "../../../../utils/money"
import Url from "../../../../utils/validator-rules/url"
import { Referral } from "../registration/RegistrationPageContent"
import RegistrationLayout from "../RegistrationLayout/RegistrationLayout"
import { MainRevenueSourceEnum } from "./EligibilityCheckForm.types"

const schema = yup.object().shape({
  averageRevenue: yup.object().shape({
    currency: yup
      .string()
      .oneOf(Object.values(RegisterOrganisationRequestCurrencyEnum))
      .required(),
    amount: yup.string().required(),
  }),
  fundingAmount: yup.string().required(),
  requiredFundingTimeHorizon: yup.string().required(),
  mainRevenueSource: yup
    .string()
    .oneOf(Object.values(MainRevenueSourceEnum))
    .required(),
  businessWebsite: yup.string().required().test(Url()),
  mostImportantForYou: yup.string().when("$isAmazonPartnership", {
    is: true,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.optional(),
  }),
})

export type EligibilityCheckFormType = yup.InferType<typeof schema>

const EligibilityCheck = ({
  data,
  onSubmit,
}: StepProps<EligibilityCheckFormType>) => {
  const { t } = useTranslation("registration")
  const auth = useAuth()
  const { trackEvent } = useTracking()
  const attribution = useAttribution()
  const { trackedQueryParams } = useTrackedQueryParams()

  const isAmazonPartnership =
    attribution.data?.partner === AttributionResponsePartnerEnum.Amazon
  const isWalmartPartnership = trackedQueryParams?.referral === Referral.WALMART

  const websiteFromEmail =
    auth.user?.email?.split("@")[1] &&
    !freeEmailDomains.includes(auth.user.email.split("@")[1])
      ? auth.user.email.split("@")[1]
      : undefined

  const { control, handleSubmit, formState, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    context: { isAmazonPartnership },
    defaultValues: {
      averageRevenue: data?.averageRevenue || {
        currency: (auth.organisationData?.averageMonthlyRevenue?.currency ||
          attribution.data?.currency ||
          detectCurrencyFromBrowser()) as RegisterOrganisationRequestCurrencyEnum,
        amount:
          attribution.data?.offerRevenue?.toString() ||
          auth.organisationData?.averageMonthlyRevenue?.amount?.toString() ||
          "",
      },
      fundingAmount: data?.fundingAmount || "",
      requiredFundingTimeHorizon: data?.requiredFundingTimeHorizon || "",
      mainRevenueSource:
        data?.mainRevenueSource ||
        (isAmazonPartnership
          ? MainRevenueSourceEnum.Amazon
          : isWalmartPartnership
            ? MainRevenueSourceEnum.Walmart
            : (auth.applicantData
                ?.mainRevenueSource as MainRevenueSourceEnum) || undefined),
      businessWebsite:
        data?.businessWebsite ||
        (isAmazonPartnership
          ? "https://amazon.com"
          : auth.organisationData?.website ||
            auth.applicantData?.mainStoreUrl ||
            ""),
      mostImportantForYou: data?.mostImportantForYou,
    },
    mode: "onBlur",
  })

  const formValues = watch() as Partial<EligibilityCheckFormType>

  const isAmazonRevenueSource =
    formValues.mainRevenueSource === MainRevenueSourceEnum.Amazon

  const isWalmartRevenueSource =
    formValues.mainRevenueSource === MainRevenueSourceEnum.Walmart

  // Synchronize businessWebsite when mainRevenueSource changes
  useEffect(() => {
    if (isAmazonRevenueSource) {
      setValue("businessWebsite", "https://amazon.com", {
        shouldValidate: true,
      })
      return
    }

    if (formValues.businessWebsite === "https://amazon.com") {
      setValue("businessWebsite", "", {
        shouldValidate: true,
        shouldTouch: false,
      })
      return
    }

    if (formState.touchedFields.businessWebsite) return

    if (
      isWalmartRevenueSource &&
      !formState.dirtyFields.businessWebsite &&
      formValues.businessWebsite === websiteFromEmail
    ) {
      setValue("businessWebsite", "", {
        shouldValidate: true,
        shouldTouch: false,
      })
      return
    }

    if (
      !isWalmartRevenueSource &&
      websiteFromEmail &&
      !formValues.businessWebsite &&
      formValues.mainRevenueSource
    ) {
      setValue("businessWebsite", websiteFromEmail, { shouldValidate: true })
    }
  }, [
    formValues.businessWebsite,
    formValues.mainRevenueSource,
    formState.touchedFields.businessWebsite,
    formState.dirtyFields.businessWebsite,
    isAmazonRevenueSource,
    isWalmartRevenueSource,
    setValue,
    websiteFromEmail,
  ])

  if (auth.isLoading) {
    return <PageLoader />
  }

  return (
    <RegistrationLayout
      sidebar={<EligibilityOneVariantSidebar />}
      title={t("eligibility.EligibilityCheck.variant.title")}
    >
      <FormLayout>
        <form
          onSubmit={handleSubmit((formData) => {
            trackEvent({
              category: "registration",
              name: "eligibility-check",
              action: "find-business",
            })
            onSubmit?.(formData)
          })}
        >
          <FormLayout.Content>
            <TrustpilotWidget className="mb-6 -ml-[13px]" />
            {!isAmazonPartnership && (
              <FormControl>
                <MoneyFields
                  control={control}
                  prefix="averageRevenue"
                  label={
                    t("eligibility.EligibilityCheck.averageRevenue") ||
                    "Average monthly revenue"
                  }
                  watch={watch}
                  order={0}
                  currencies={Object.values(
                    RegisterOrganisationRequestCurrencyEnum
                  )}
                />
              </FormControl>
            )}

            <FormControl>
              <Input
                control={control}
                name="fundingAmount"
                label={t("eligibility.EligibilityCheck.variant.fundingAmount")}
                renderType="currency"
                currency={currencyToSymbol(
                  formValues.averageRevenue?.currency || ""
                )}
                padFractionalZeros={false}
                helpText={t(
                  "eligibility.EligibilityCheck.variant.fundingAmountHelpText"
                )}
              />
            </FormControl>

            <FormControl>
              <Select
                label={t(
                  "eligibility.EligibilityCheck.requiredFundingTimeHorizon"
                )}
                control={control}
                name="requiredFundingTimeHorizon"
                options={t(
                  "eligibility.EligibilityCheck.requiredFundingTimeHorizonOptions",
                  { returnObjects: true }
                ).map((item: string) => ({
                  value: item,
                  label: item,
                }))}
              />
            </FormControl>

            {!isAmazonPartnership && (
              <FormControl>
                <Select
                  label={t(
                    "eligibility.EligibilityCheck.variant.mainRevenueSource"
                  )}
                  control={control}
                  name="mainRevenueSource"
                  searchable
                  options={Object.values(MainRevenueSourceEnum).map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  helpText={t(
                    "eligibility.EligibilityCheck.variant.mainRevenueSourceHelpText"
                  )}
                />
              </FormControl>
            )}

            {!!formValues.mainRevenueSource &&
              !isAmazonPartnership &&
              !isAmazonRevenueSource && (
                <FormControl>
                  <Input
                    control={control}
                    name="businessWebsite"
                    label={t(
                      "eligibility.EligibilityCheck.variant.businessWebsite.other"
                    )}
                    helpText={
                      formValues.businessWebsite === websiteFromEmail
                        ? t(
                            "eligibility.EligibilityCheck.variant.businessWebsiteHelpText.other"
                          )
                        : undefined
                    }
                  />
                </FormControl>
              )}

            {isAmazonPartnership && (
              <FormControl>
                <Select
                  label={t(
                    "eligibility.EligibilityCheck.variant.mostImportantForYou"
                  )}
                  control={control}
                  name="mostImportantForYou"
                  searchable
                  options={t(
                    "eligibility.EligibilityCheck.variant.mostImportantForYouOptions",
                    { returnObjects: true }
                  ).map((item: string) => ({
                    value: item,
                    label: item,
                  }))}
                />
              </FormControl>
            )}
          </FormLayout.Content>
          <FormLayout.Footer>
            <Button type="submit" disabled={!formState.isValid} fullWidth>
              {isAmazonPartnership
                ? t("eligibility.EligibilityCheck.submitAlt")
                : t("eligibility.EligibilityCheck.submit")}
            </Button>
          </FormLayout.Footer>
        </form>
      </FormLayout>
    </RegistrationLayout>
  )
}

export default EligibilityCheck
