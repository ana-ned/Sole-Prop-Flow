import { useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as yup from "yup"
import Button from "../../../components/Basic/Button"
import ButtonGroup from "../../../components/Basic/ButtonGroup"
import PageLoader from "../../../components/Collections/PageLoader/PageLoader"
import FormControl from "../../../components/Forms/FormControl"
import Input from "../../../components/Forms/Input"
import ApiErrorAlert from "../../../components/Functional/ApiErrorAlert"
import { StepProps } from "../../../components/Headless/MultistepForm"
import FormLayout from "../../../components/UI/FormLayout/FormLayout"
import Layout from "../../../components/UI/Layout"
import LogoOnlyMenu from "../../../components/UI/LogoOnlyMenu"
import PageBar from "../../../components/UI/PageBar"
import useAuth from "../../../hooks/useAuth"
import useDevice from "../../../hooks/useDevice"
import usePartnerInfo from "../../../hooks/usePartnerInfo"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { ApplicationControllerApi } from "../../../services/api/partners"
import CountryService from "../../../services/country"
import PhoneFormat from "../../../utils/validator-rules/phone"
import partnerApplicationQueryKeys from "../partner-application.queries"
import { PartnerApplicationFormSchema } from "../partner-application.types"

const StepIntroduceClient = ({
  data,
  onSubmit,
}: StepProps<PartnerApplicationFormSchema>) => {
  const auth = useAuth()
  const { t } = useTranslation("partner-application", {
    keyPrefix: "stepIntroduceClient",
  })
  const [benefitsVisible, setBenefitsVisible] = useState(false)
  const queryClient = useQueryClient()
  const partnerInfo = usePartnerInfo()
  const { isDesktop, isMobile } = useDevice()

  const { control, handleSubmit, formState } =
    useForm<PartnerApplicationFormSchema>({
      // @ts-expect-error: fix yup schema to infer ts types: https://github.com/react-hook-form/resolvers/releases/tag/v3.1.1
      resolver: yupResolver(
        yup.object().shape({
          firstName: yup.string().required(),
          lastName: yup.string().required(),
          phoneNumber: yup.string().test(PhoneFormat()),
          email: yup.string().email().required(),
        })
      ),
      defaultValues: data,
      mode: "onBlur",
    })

  const mutation = useMutation({
    mutationFn: async (formData: PartnerApplicationFormSchema) => {
      return formData.applicationId
        ? new ApplicationControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.Partners,
            })
          ).updateClient({
            xXPARTNERID: auth.partnerId!,
            applicationId: formData.applicationId,
            applicationCreationRequest: {
              clientInviteRequest: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
              },
            },
          })
        : new ApplicationControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.Partners,
            })
          ).introduceClient({
            xXPARTNERID: auth.partnerId!,
            applicationCreationRequest: {
              clientInviteRequest: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
              },
            },
          })
    },
    onSuccess: async (response, formData) => {
      await queryClient.invalidateQueries({
        queryKey: partnerApplicationQueryKeys.all(),
      })
      await queryClient.invalidateQueries({
        queryKey: partnerApplicationQueryKeys.detail(formData.applicationId),
      })

      onSubmit?.({
        ...formData,
        applicationId: response.id,
      })
    },
  })

  if (partnerInfo.isLoading) return <PageLoader />

  return (
    <Layout
      menu={<LogoOnlyMenu />}
      sidebar={
        (isDesktop || benefitsVisible) && (
          <Layout.Child
            desktopTitle={t("sidebar.title")}
            onClickBack={() => {
              setBenefitsVisible(false)
            }}
            autoHeight
          >
            <ol className="ol-primary text-neutral-800">
              {t("sidebar.content", {
                returnObjects: true,
              }).map((item) => (
                <li className="mt-4" key={item}>
                  {item}
                </li>
              ))}
            </ol>
          </Layout.Child>
        )
      }
    >
      <Layout.Parent>
        <FormLayout>
          <PageBar
            title={t("title")}
            backUrl="/"
            desktopHeaderType="h4"
            withChat
          />
          <form
            onSubmit={handleSubmit((formData) => {
              mutation.mutate(formData)
            })}
          >
            <FormLayout.Content>
              <FormControl>
                <Input
                  label={t("firstName")}
                  name="firstName"
                  control={control}
                />
              </FormControl>
              <FormControl>
                <Input
                  label={t("lastName")}
                  name="lastName"
                  control={control}
                />
              </FormControl>
              <FormControl>
                <Input
                  renderType="phone"
                  country={
                    CountryService.getByAlpha3(
                      partnerInfo.data?.partner?.country
                    )?.["alpha-2"]
                  }
                  control={control}
                  name="phoneNumber"
                  label={t("phoneNumber")}
                />
              </FormControl>
              <FormControl>
                <Input label={t("email")} name="email" control={control} />
              </FormControl>
              {mutation.isError && (
                <ApiErrorAlert error={mutation.error as unknown as Response} />
              )}
              {isMobile && (
                <div className="flex justify-end">
                  <Button
                    variant="link"
                    type="button"
                    onClick={() => {
                      setBenefitsVisible(true)
                    }}
                  >
                    {t("sidebar.title")}
                  </Button>
                </div>
              )}
            </FormLayout.Content>
            <FormLayout.Footer>
              <ButtonGroup>
                <Button
                  type="submit"
                  disabled={!formState.isValid}
                  loading={mutation.isPending}
                >
                  {t("submit")}
                </Button>
              </ButtonGroup>
            </FormLayout.Footer>
          </form>
        </FormLayout>
      </Layout.Parent>
    </Layout>
  )
}

export default StepIntroduceClient
