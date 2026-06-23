import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import * as yup from "yup"
import Button from "../../../../../../components/Basic/Button"
import ButtonGroup from "../../../../../../components/Basic/ButtonGroup"
import FormControl from "../../../../../../components/Forms/FormControl"
import Input from "../../../../../../components/Forms/Input"
import ApiErrorAlert from "../../../../../../components/Functional/ApiErrorAlert"
import { StepProps } from "../../../../../../components/Headless/MultistepForm"
import FormLayout from "../../../../../../components/UI/FormLayout/FormLayout"
import PageBar from "../../../../../../components/UI/PageBar"
import useAuth from "../../../../../../hooks/useAuth"
import apiConfig, {
  ApiServicesEnum,
} from "../../../../../../services/api/api-config"
import { CustomerPersonControllerApi } from "../../../../../../services/api/kyc"
import { OnboardingMenuPaths } from "../../../../constants"
import useBeneficialOwners, {
  BENEFICIAL_OWNERS_QUERY_KEY,
} from "../../../../hooks/useBeneficialOwners"
import OnboardingLayout from "../../../OnboardingLayout"
import { BeneficialOwnerForm } from "../../beneficial-owners-flow.types"

const OwnerDetails = ({ data }: StepProps<BeneficialOwnerForm>) => {
  const auth = useAuth()
  const { t } = useTranslation("onboarding", {
    keyPrefix: "verifyOwners.detailsForm",
  })
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { control, handleSubmit, formState } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        email: yup.string().required().email(),
      })
    ),
    defaultValues: data,
    mode: "onBlur",
  })
  const { data: owners } = useBeneficialOwners()

  const mutation = useMutation({
    mutationFn: async ({ formValues }: { formValues: BeneficialOwnerForm }) => {
      if (owners?.length === 0) {
        return new CustomerPersonControllerApi(
          apiConfig({
            token: await auth.getToken(),
            service: ApiServicesEnum.Kyc,
          })
        ).create({
          xXORGID: auth.organisation?.organisationId!,
          createCustomerPersonDto: [
            {
              firstName: formValues.firstName || "",
              lastName: formValues.lastName || "",
              email: formValues.email || "",
            },
          ],
        })
      }

      if (formValues.fullOwner) {
        return new CustomerPersonControllerApi(
          apiConfig({
            token: await auth.getToken(),
            service: ApiServicesEnum.Kyc,
          })
        ).update1({
          externalId: formValues.fullOwner.externalId,
          xXORGID: auth.organisation?.organisationId!,
          updateCustomerPersonDto: {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            email: formValues.email,
            externalId: formValues.fullOwner.externalId,
          },
        })
      }

      return new CustomerPersonControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Kyc,
        })
      ).add({
        xXORGID: auth.organisation?.organisationId!,
        createCustomerPersonDto: {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
        },
      })
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [BENEFICIAL_OWNERS_QUERY_KEY],
      })
      await navigate(OnboardingMenuPaths.Owners)
    },
  })

  return (
    <OnboardingLayout.Parent
      pageBar={
        <PageBar title={t("titleOwner")} withChat desktopHeaderType="h4" />
      }
    >
      <FormLayout>
        <form
          onSubmit={handleSubmit((formValues) => {
            mutation.mutate({ formValues })
          })}
        >
          <FormLayout.Content>
            <FormControl>
              <Input
                control={control}
                name="firstName"
                label={t("firstName")}
              />
            </FormControl>
            <FormControl>
              <Input control={control} name="lastName" label={t("lastName")} />
            </FormControl>
            <FormControl>
              <Input
                type="email"
                control={control}
                name="email"
                label={t("email")}
              />
            </FormControl>

            <ApiErrorAlert
              error={mutation.error as unknown as Response}
              className="mt-4"
            />
          </FormLayout.Content>
          <FormLayout.Footer>
            <ButtonGroup backUrl={OnboardingMenuPaths.Owners}>
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
    </OnboardingLayout.Parent>
  )
}

export default OwnerDetails
