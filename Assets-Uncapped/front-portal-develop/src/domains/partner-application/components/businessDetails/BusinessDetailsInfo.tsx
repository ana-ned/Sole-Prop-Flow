import { useEffect, useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router"
import { toast } from "react-toastify"
import { useDebounceValue } from "usehooks-ts"
import * as yup from "yup"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import Typography from "../../../../components/Basic/Typography"
import DateInput from "../../../../components/Forms/DateInput"
import FormControl from "../../../../components/Forms/FormControl"
import Input from "../../../../components/Forms/Input"
import Select from "../../../../components/Forms/Select"
import ApiErrorAlert from "../../../../components/Functional/ApiErrorAlert"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import ContentDivider from "../../../../components/UI/ContentDivider"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import Loader from "../../../../components/UI/Loader"
import PageBar from "../../../../components/UI/PageBar"
import useAuth from "../../../../hooks/useAuth"
import i18n from "../../../../inits/i18next"
import apiConfig, { ApiServicesEnum } from "../../../../services/api/api-config"
import { OrganisationOnboardingControllerApi } from "../../../../services/api/partners"
import CountryService from "../../../../services/country"
import { ReactComponent as ChevronRightIcon } from "../../../../svgs/chevron-right.svg"
import { ReactComponent as SearchIcon } from "../../../../svgs/search.svg"
import QUERY_KEYS from "../../../../utils/query-keys"
import DateFormat from "../../../../utils/validator-rules/date-format"
import DatePast from "../../../../utils/validator-rules/date-past"
import { BusinessDetailsForm } from "../../../onboarding/components/business-details/BusinessDetailsForm.types"
import useApplicationDetails from "../../hooks/useApplicationDetails"
import useCompany from "../../hooks/useCompany"
import { createInitialFormData } from "../../utils/businessDetailsForm"

const BusinessDetailsInfo = ({
  data,
  onSubmit,
  setCustomSubmit,
}: StepProps<BusinessDetailsForm>) => {
  const { t } = useTranslation(["onboarding", "partner-application"])
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { id } = useParams()
  const { control, handleSubmit, watch, setValue, getValues, trigger } =
    useForm<BusinessDetailsForm>({
      // @ts-expect-error: fix yup schema to infer ts types: https://github.com/react-hook-form/resolvers/releases/tag/v3.1.1
      resolver: yupResolver(
        yup.object().shape({
          companySearch: yup.string(),
          businessCountry: yup.string().required(),
          companyName: yup.string(),
          companyNumber: yup.string(),
          dateOfCreation: yup.string().test(DateFormat()).test(DatePast()),
          entityType: yup.string(),
        })
      ),
      defaultValues: data,
      mode: "onBlur",
    })
  const [enterInfoManually, setEnterInfoManually] = useState<boolean>(false)
  const { data: applicationDetailsData } = useApplicationDetails(id)
  const { companyDetails, editCompanyWithFormData } = useCompany(id)

  const formValues = watch()
  const [searchQuery] = useDebounceValue(formValues.companyName, 500)

  const isSearchEnabled = !enterInfoManually

  const companySearchQuery = useQuery({
    queryKey: [QUERY_KEYS.organisationUsers.companySearch, searchQuery],
    queryFn: async () => {
      return new OrganisationOnboardingControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Partners,
        })
      ).findCompanyLegalDetailsByName({
        applicationId: id!,
        xXPARTNERID: auth.partnerId!,
        name: searchQuery!,
        country: formValues.businessCountry,
        maxResults: 10,
      })
    },
    enabled: isSearchEnabled && !!searchQuery && !!formValues.businessCountry,
    refetchOnWindowFocus: false,
  })

  const updateCompany = useMutation({
    mutationFn: async ({
      companyId,
      country,
    }: {
      companyId: string
      country: string
    }) =>
      new OrganisationOnboardingControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Partners,
        })
      ).editCompanyInformation({
        applicationId: id!,
        xXPARTNERID: auth.partnerId!,
        partnerCompanyUpdateFromRegistryRequest: { companyId, country },
      }),
    onSuccess: async () => {
      const businessDetailsResult = await companyDetails.refetch()
      if (formValues.businessCountry === "GBR") {
        setCustomSubmit?.(
          createInitialFormData({
            ...businessDetailsResult.data,
            sameAddresses: true,
          }),
          4
        )
      } else {
        setValue("companyName", businessDetailsResult.data?.companyName)
        setValue(
          "companyNumber",
          businessDetailsResult.data?.companyNumber || ""
        )
        setValue(
          "dateOfCreation",
          businessDetailsResult.data?.dateOfCreation
            ? format(businessDetailsResult.data.dateOfCreation, "yyyy-MM-dd")
            : ""
        )
        setValue("registeredAddress", {
          location: "",
          country: businessDetailsResult.data?.registeredAddress?.country || "",
          addressLine1:
            businessDetailsResult.data?.registeredAddress?.addressLine1 || "",
          addressLine2:
            businessDetailsResult.data?.registeredAddress?.addressLine2,
          locality:
            businessDetailsResult.data?.registeredAddress?.locality || "",
          region: businessDetailsResult.data?.registeredAddress?.region || "",
          postalCode:
            businessDetailsResult.data?.registeredAddress?.postalCode || "",
        })
        setEnterInfoManually(true)
      }
    },
    onError: () => {
      toast.error(i18n.t("common:defaultErrorMessage"))
    },
  })

  useEffect(() => {
    if (
      !!applicationDetailsData?.organisationDetailsResponse?.country &&
      !formValues.businessCountry
    ) {
      setValue(
        "businessCountry",
        applicationDetailsData.organisationDetailsResponse.country
      )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationDetailsData])

  return (
    <>
      <PageBar
        title={t(
          "partner-application:businessDetails.businessDetailsInfo.header"
        )}
        withChat
        desktopHeaderType="h4"
      />
      <Typography type="body" color="neutral-600" className="mb-6">
        {t("partner-application:businessDetails.businessDetailsInfo.copy")}
      </Typography>
      <FormLayout>
        <form
          onSubmit={handleSubmit((formData) => {
            const newData = {
              ...formData,
              registeredAddress: {
                ...formData.registeredAddress,
                country: formData.businessCountry,
              },
            }
            editCompanyWithFormData.mutate(newData)
            onSubmit?.(newData)
          })}
        >
          <FormLayout.Content>
            <FormControl>
              <Select
                label={t("businessDetails.businessInfo.businessCountry")}
                name="businessCountry"
                searchable
                control={control}
                options={CountryService.getSelectOptions()}
                filterOption={CountryService.getSelectFilter}
                onChange={async () => {
                  queryClient.removeQueries({
                    queryKey: [QUERY_KEYS.organisationUsers.companySearch],
                  })
                  await trigger(
                    Object.keys(getValues()).filter((fieldName) =>
                      getValues(fieldName as keyof BusinessDetailsForm)
                    ) as (keyof BusinessDetailsForm)[]
                  )
                }}
              />
            </FormControl>

            {isSearchEnabled && (
              <div className="relative">
                <Input
                  icon={<SearchIcon />}
                  control={control}
                  name="companyName"
                  label={t("businessDetails.businessInfo.search")}
                />
                <button
                  type="button"
                  aria-label="Search company"
                  className="absolute top-0 right-0 h-14 w-14 cursor-pointer border-0 bg-none"
                  onClick={async () => {
                    await companySearchQuery.refetch()
                  }}
                />
              </div>
            )}

            {companySearchQuery.isFetching && (
              <div className="mt-5 mb-5">
                <Loader />
              </div>
            )}

            {isSearchEnabled &&
              !companySearchQuery.isFetching &&
              companySearchQuery.data?.companyLegalBaseDetails && (
                <>
                  <Typography
                    type="bodyTitle"
                    color="neutral-600"
                    className="mt-5 mb-3"
                  >
                    {t("businessDetails.businessInfo.selectYourBusiness")}
                  </Typography>
                  {companySearchQuery.data.companyLegalBaseDetails.length >
                  0 ? (
                    <ContentDivider className="mb-4">
                      {companySearchQuery.data.companyLegalBaseDetails.map(
                        (item) => (
                          <button
                            type="button"
                            onClick={() => {
                              updateCompany.mutate({
                                companyId: item.id!,
                                country: formValues.businessCountry,
                              })
                            }}
                            className="mb-4 flex w-full items-center border-0 bg-none"
                            key={item.id}
                          >
                            <div className="flex-grow-1">
                              <Typography
                                type="tableValue"
                                color="neutral-600"
                                className="text-left"
                              >
                                {item.title}
                              </Typography>
                              <Typography
                                type="smallCopy"
                                className="text-left"
                              >
                                {[item.companyNumber, item.addressSnippet]
                                  .filter(Boolean)
                                  .join(" | ")}
                              </Typography>
                            </div>
                            <div className="text-brand-600">
                              <ChevronRightIcon />
                            </div>
                          </button>
                        )
                      )}
                    </ContentDivider>
                  ) : (
                    <ContentDivider className="mb-4">
                      <Typography
                        type="tableValue"
                        color="neutral-600"
                        className="mt-5 mb-3 text-center"
                      >
                        {t("businessDetails.businessInfo.noData")}
                      </Typography>
                    </ContentDivider>
                  )}
                </>
              )}
            {!isSearchEnabled && (
              <>
                <Input
                  control={control}
                  name="companyName"
                  label={
                    auth.organisation?.countryCode === "USA"
                      ? t("businessDetails.businessInfo.legalCorporateName")
                      : t("businessDetails.businessInfo.registeredBusinessName")
                  }
                />
                <Input
                  control={control}
                  name="companyNumber"
                  className="mt-5"
                  label={
                    formValues.businessCountry === "GBR"
                      ? t("businessDetails.businessInfo.companiesHouseNumber")
                      : formValues.businessCountry === "USA"
                        ? t("businessDetails.businessInfo.companyEinNo")
                        : t(
                            "businessDetails.businessInfo.companyRegistrationNo"
                          )
                  }
                />
              </>
            )}

            {!isSearchEnabled && (
              <>
                <Typography
                  type="smallTitle"
                  color="neutral-600"
                  className="mt-5 mb-5"
                >
                  {t("businessDetails.businessInfo.dateOfCreation")}
                </Typography>
                <FormControl>
                  <DateInput
                    control={control}
                    inputFormat={
                      getValues("businessCountry") === "USA" ? "US" : "EU"
                    }
                    name="dateOfCreation"
                  />
                </FormControl>
              </>
            )}
            {isSearchEnabled && (
              <div className="flex justify-end">
                <Button
                  variant="link"
                  type="button"
                  onClick={async () => {
                    await trigger()
                    setEnterInfoManually(true)
                  }}
                >
                  {companySearchQuery.data &&
                  companySearchQuery.data.companyLegalBaseDetails!.length > 0
                    ? t("businessDetails.businessInfo.cantFindBusiness")
                    : t("businessDetails.businessInfo.goToManual")}
                </Button>
              </div>
            )}
            {!!companySearchQuery.error && (
              <ApiErrorAlert
                className="mt-4"
                error={companySearchQuery.error as unknown as Response}
                isPlainTextExpected
                withSupportLink={false}
              />
            )}
          </FormLayout.Content>
          <FormLayout.Footer>
            <ButtonGroup>
              <Button
                variant="secondary"
                href={`/partner/application/documents/${id}`}
              >
                {t("partner-application:businessDetails.skip")}
              </Button>
              {!isSearchEnabled && (
                <Button type="submit">
                  {t("businessDetails.businessInfo.submit")}
                </Button>
              )}
            </ButtonGroup>
          </FormLayout.Footer>
        </form>
      </FormLayout>
    </>
  )
}

export default BusinessDetailsInfo
