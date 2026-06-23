import { useEffect, useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Button from "../../../components/Basic/Button"
import ButtonGroup from "../../../components/Basic/ButtonGroup"
import CheckboxGroup from "../../../components/Forms/CheckboxGroup/CheckboxGroup"
import FormControl from "../../../components/Forms/FormControl"
import Input from "../../../components/Forms/Input"
import Select from "../../../components/Forms/Select"
import ApiErrorAlert from "../../../components/Functional/ApiErrorAlert"
import { StepProps } from "../../../components/Headless/MultistepForm"
import CheckList from "../../../components/UI/CheckList"
import FormLayout from "../../../components/UI/FormLayout/FormLayout"
import Layout from "../../../components/UI/Layout"
import LogoOnlyMenu from "../../../components/UI/LogoOnlyMenu"
import PageBar from "../../../components/UI/PageBar"
import useAuth from "../../../hooks/useAuth"
import useDevice from "../../../hooks/useDevice"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import {
  ApplicationControllerApi,
  OrganisationCreationRequestMainEcommercePlatformEnum,
  OrganisationDetailsResponseBusinessTypesEnum,
} from "../../../services/api/partners"
import CountryService from "../../../services/country"
import {
  BUSINESS_ENTITY_TYPES,
  ECOMMERCE_PLATFORMS,
} from "../../registration/components/eligibility-check/EligibilityCheckForm.types"
import isSmallTier from "../../registration/utils/isSmallTier"
import partnerApplicationQueryKeys from "../partner-application.queries"
import {
  PartnerApplicationFormSchema,
  StepIntroduceOrganisationFormSchemaType,
  StepIntroduceOrganisationSchema,
} from "../partner-application.types"
import StepIntroduceOrganisationSkipModal from "./StepIntroduceOrganisationSkipModal"

const StepIntroduceOrganisation = ({
  data,
  onSubmit,
  onBack,
}: StepProps<PartnerApplicationFormSchema>) => {
  const auth = useAuth()
  const { t } = useTranslation(["partner-application", "registration"])
  const [skipModalOpen, setSkipModalOpen] = useState(false)
  const [infoVisible, setInfoVisible] = useState(false)
  const { isDesktop, isMobile } = useDevice()
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    formState,
    watch,
    setValue,
    trigger,
    register,
  } = useForm({
    resolver: yupResolver(StepIntroduceOrganisationSchema),
    defaultValues: data,
    mode: "onBlur",
  })

  const formValues = watch()
  const ecommercePlatformVisible = isSmallTier(Number(formValues.revenue))
  const selectedCountry = CountryService.getByAlpha3(formValues.country)

  useEffect(() => {
    if (!ecommercePlatformVisible) {
      setValue("mainEcommercePlatform", undefined)
    }
  }, [ecommercePlatformVisible, setValue])

  useEffect(() => {
    if (data?.country) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      trigger()
    }
  }, [data?.country, trigger])

  const organisationMutation = useMutation({
    mutationFn: async (formData: StepIntroduceOrganisationFormSchemaType) => {
      return data?.hasOrganisation
        ? new ApplicationControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.Partners,
            })
          ).updateOrganisation({
            xXPARTNERID: auth.partnerId!,
            applicationId: data.applicationId,
            organisationCreationRequest: {
              businessName: formData.businessName,
              businessWebsite: formData.businessWebsite.trim(),
              // @ts-expect-error set issue - fixed in latest swagger
              businessTypes: formData.businessTypes,
              businessEntity: formData.businessEntity!,
              country: formData.country,
              regions: formData.region ? [formData.region] : [],
              revenue: Number(formData.revenue),
              mainEcommercePlatform:
                formData.mainEcommercePlatform as OrganisationCreationRequestMainEcommercePlatformEnum,
            },
          })
        : new ApplicationControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.Partners,
            })
          ).introduceOrganisation({
            xXPARTNERID: auth.partnerId!,
            applicationId: data?.applicationId!,
            organisationCreationRequest: {
              businessName: formData.businessName,
              businessWebsite: formData.businessWebsite.trim(),
              // @ts-expect-error set issue - fixed in latest swagger
              businessTypes: formData.businessTypes,
              businessEntity: formData.businessEntity,
              country: formData.country,
              regions: formData.region ? [formData.region] : [],
              revenue: Number(formData.revenue),
              mainEcommercePlatform:
                formData.mainEcommercePlatform as OrganisationCreationRequestMainEcommercePlatformEnum,
            },
          })
    },
  })

  const verifyMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mutationFn: async (_: StepIntroduceOrganisationFormSchemaType) => {
      return new ApplicationControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Partners,
        })
      ).verify({
        xXPARTNERID: auth.partnerId!,
        applicationId: data?.applicationId!,
      })
    },
    onSuccess: async (response, formData) => {
      await queryClient.invalidateQueries({
        queryKey: partnerApplicationQueryKeys.all(),
      })
      await queryClient.invalidateQueries({
        queryKey: partnerApplicationQueryKeys.detail(data?.applicationId),
      })

      onSubmit?.({
        ...formData,
        isEligible: response.isEligible,
        eligibleAmount: response.eligibleAmount,
        eligibleCurrency: response.eligibleCurrency,
        notEligibleReason: response.notEligibleReason,
      })
    },
  })

  return (
    <Layout
      menu={<LogoOnlyMenu />}
      sidebar={
        (isDesktop || infoVisible) && (
          <Layout.Child
            desktopTitle={t(
              "partner-application:stepIntroduceOrganisation.sidebar.title"
            )}
            onClickBack={() => {
              setInfoVisible(false)
            }}
          >
            <CheckList
              items={t(
                "partner-application:stepIntroduceOrganisation.sidebar.content",
                {
                  returnObjects: true,
                }
              )}
            />
          </Layout.Child>
        )
      }
    >
      <Layout.Parent>
        <FormLayout>
          <PageBar
            title={t("partner-application:stepIntroduceOrganisation.title")}
            onClickBack={onBack}
            desktopHeaderType="h4"
            withChat
          />

          <form
            onSubmit={handleSubmit(async (formData) => {
              await organisationMutation.mutateAsync(formData)
              await verifyMutation.mutateAsync(formData)
            })}
          >
            <FormLayout.Content>
              <FormControl>
                <Input
                  control={control}
                  name="businessName"
                  label={t(
                    "partner-application:stepIntroduceOrganisation.businessName"
                  )}
                />
              </FormControl>
              <FormControl>
                <Input
                  control={control}
                  name="businessWebsite"
                  label={t(
                    "partner-application:stepIntroduceOrganisation.businessWebsite"
                  )}
                />
              </FormControl>
              <FormControl>
                <Select
                  control={control}
                  name="country"
                  label={t(
                    "partner-application:stepIntroduceOrganisation.country"
                  )}
                  searchable
                  onChange={() => {
                    setValue("businessEntity", undefined)
                    setValue("region", undefined)
                  }}
                  options={CountryService.getSelectOptions()}
                  filterOption={CountryService.getSelectFilter}
                />
              </FormControl>
              {!!selectedCountry?.regions && (
                <FormControl>
                  <Select
                    label={t(
                      "partner-application:stepIntroduceOrganisation.region",
                      {
                        region:
                          formValues.country === "CAN"
                            ? t(
                                "partner-application:stepIntroduceOrganisation.province"
                              )
                            : t(
                                "partner-application:stepIntroduceOrganisation.state"
                              ),
                      }
                    )}
                    control={control}
                    name="region"
                    options={selectedCountry.regions.map((item) => ({
                      value: item.name,
                      label: item.name,
                    }))}
                    searchable
                  />
                </FormControl>
              )}
              <FormControl>
                <Input
                  control={control}
                  name="revenue"
                  label={t(
                    "partner-application:stepIntroduceOrganisation.revenue"
                  )}
                  renderType="currency"
                  currency={
                    watch("country")
                      ? CountryService.getCurrency(watch("country"))
                      : ""
                  }
                />
              </FormControl>
              {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
              {!!BUSINESS_ENTITY_TYPES[
                watch("country") as keyof typeof BUSINESS_ENTITY_TYPES
              ] && (
                <FormControl>
                  <Select
                    label={t(
                      "partner-application:stepIntroduceOrganisation.businessEntity"
                    )}
                    control={control}
                    name="businessEntity"
                    options={BUSINESS_ENTITY_TYPES[
                      watch("country") as keyof typeof BUSINESS_ENTITY_TYPES
                    ].map((item) => ({
                      value: item,
                      label: t(
                        `registration:eligibility.checkForm.businessEntityTypes.${item}`
                      ),
                    }))}
                  />
                </FormControl>
              )}
              <FormControl>
                <CheckboxGroup
                  reverse
                  name="businessTypes"
                  label={t(
                    "partner-application:stepIntroduceOrganisation.businessModel"
                  )}
                  helpText={t(
                    "partner-application:stepIntroduceOrganisation.businessModelHelpText"
                  )}
                  register={register}
                  options={[
                    {
                      value:
                        OrganisationDetailsResponseBusinessTypesEnum.EcommerceAmazonMarketplace,
                      label: t(
                        "partner-application:stepIntroduceOrganisation.businessModelOptions.ECOMMERCE_AMAZON_MARKETPLACE"
                      ),
                    },
                    {
                      value:
                        OrganisationDetailsResponseBusinessTypesEnum.RetailWholesale,
                      label: t(
                        "partner-application:stepIntroduceOrganisation.businessModelOptions.RETAIL_WHOLESALE"
                      ),
                    },
                    {
                      value:
                        OrganisationDetailsResponseBusinessTypesEnum.SubscriptionSaas,
                      label: t(
                        "partner-application:stepIntroduceOrganisation.businessModelOptions.SUBSCRIPTION_SAAS"
                      ),
                    },
                    {
                      value: OrganisationDetailsResponseBusinessTypesEnum.Other,
                      label: t(
                        "partner-application:stepIntroduceOrganisation.businessModelOptions.OTHER"
                      ),
                    },
                  ]}
                />
              </FormControl>
              {ecommercePlatformVisible && (
                <FormControl>
                  <Select
                    label={t(
                      "partner-application:stepIntroduceOrganisation.mainEcommercePlatform"
                    )}
                    control={control}
                    name="mainEcommercePlatform"
                    options={ECOMMERCE_PLATFORMS.map((item) => ({
                      value: item.value,
                      label: item.label,
                    }))}
                  />
                </FormControl>
              )}
              {organisationMutation.isError && (
                <ApiErrorAlert
                  error={organisationMutation.error as unknown as Response}
                />
              )}
              {verifyMutation.isError && (
                <ApiErrorAlert
                  error={verifyMutation.error as unknown as Response}
                />
              )}
              {isMobile && (
                <div className="flex justify-end">
                  <Button
                    variant="link"
                    type="button"
                    onClick={() => {
                      setInfoVisible(true)
                    }}
                  >
                    {t(
                      "partner-application:stepIntroduceOrganisation.sidebar.title"
                    )}
                  </Button>
                </div>
              )}
            </FormLayout.Content>
            <FormLayout.Footer>
              <ButtonGroup>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setSkipModalOpen(true)
                  }}
                  disabled={
                    organisationMutation.isPending || verifyMutation.isPending
                  }
                >
                  {t("partner-application:stepIntroduceOrganisation.skip")}
                </Button>
                <Button
                  type="submit"
                  disabled={!formState.isValid}
                  loading={
                    organisationMutation.isPending || verifyMutation.isPending
                  }
                >
                  {t("partner-application:stepIntroduceOrganisation.submit")}
                </Button>
              </ButtonGroup>
            </FormLayout.Footer>
          </form>
          <StepIntroduceOrganisationSkipModal
            isOpen={skipModalOpen}
            onClose={() => {
              setSkipModalOpen(false)
            }}
            applicationId={data!.applicationId}
          />
        </FormLayout>
      </Layout.Parent>
    </Layout>
  )
}

export default StepIntroduceOrganisation
