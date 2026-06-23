import React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserEdit01Icon } from "@hugeicons-pro/core-solid-rounded"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { getDrawQueryKey } from "../../../domains/line-of-credit/hooks/useDraw"
import OnboardingLayout from "../../../domains/onboarding/components/OnboardingLayout"
import SkipStepButton from "../../../domains/onboarding/components/SkipStepButton"
import { OnboardingMenuPaths } from "../../../domains/onboarding/constants"
import useApplicationSteps from "../../../domains/onboarding/hooks/useApplicationSteps"
import { AGREEMENTS_OFFERS_QUERY_KEY } from "../../../domains/onboarding/hooks/useOffers"
import useAuth from "../../../hooks/useAuth"
import useDeal from "../../../hooks/useDeal"
import {
  DrawResponse,
  DrawSigningDetailsSigningTypeEnum,
  LineOfCreditApi,
  OfferControllerV3Api,
  OfferResponse,
  OfferResponseOfferStatusEnum,
  SigningDetailsSigningTypeEnum,
  SigningParametersSigningTypeEnum,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { ReactComponent as AddIcon } from "../../../svgs/add.svg"
import Button from "../../Basic/Button"
import ButtonGroup from "../../Basic/ButtonGroup"
import Typography from "../../Basic/Typography"
import ListItemContainer from "../../Collections/ListItemContainer/ListItemContainer"
import MultipleRadio from "../../Forms/MultipleRadio"
import ApiErrorAlert from "../../Functional/ApiErrorAlert"
import { StepProps } from "../../Headless/MultistepForm"
import Alert from "../../UI/Alert"
import CardV2 from "../../UI/CardV2/CardV2"
import FormLayout from "../../UI/FormLayout/FormLayout"
import ListItemLarge from "../../UI/ListItemLarge/ListItemLarge"
import PageBar from "../../UI/PageBar"
import {
  SigningFormFields,
  authorityStepSchema,
} from "./SigningFormSteps.types"

const AuthorityStep = ({
  data,
  onSubmit,
  resource,
  title,
  content,
  disclaimer,
  setCustomSubmit,
}: StepProps<SigningFormFields> & {
  resource?: OfferResponse | DrawResponse
  title?: string
  content?: React.ReactNode
  disclaimer?: string
}) => {
  const auth = useAuth()
  const { t } = useTranslation("common", {
    keyPrefix: "SigningFormSteps",
  })
  const navigate = useNavigate()
  const { skipStep } = useApplicationSteps()
  const queryClient = useQueryClient()
  const deal = useDeal()

  const { handleSubmit, formState, watch, control } = useForm({
    resolver: yupResolver(authorityStepSchema),
    defaultValues: data,
    mode: "onBlur",
  })
  const formValues = watch()

  const preSign = useMutation({
    mutationFn: async () => {
      if (
        resource &&
        "lineOfCreditId" in resource &&
        resource.drawSigningDetails?.signingType ===
          DrawSigningDetailsSigningTypeEnum.Embedded
      ) {
        return true
      }

      if (
        resource &&
        "offerType" in resource &&
        resource.offerDetails?.signingDetails?.signingType ===
          SigningDetailsSigningTypeEnum.Embedded &&
        resource.offerStatus === OfferResponseOfferStatusEnum.PreSigned
      ) {
        return true
      }

      if (resource && "lineOfCreditId" in resource) {
        return new LineOfCreditApi(
          apiConfig({
            token: await auth.getToken(),
            service: ApiServicesEnum.Agreements,
          })
        ).preSign1({
          xXORGID: auth.organisation?.organisationId!,
          id: resource.lineOfCreditId!,
          drawId: resource.id!,
          drawSigningDetails: {
            signingType: DrawSigningDetailsSigningTypeEnum.Embedded,
          },
        })
      }

      return new OfferControllerV3Api(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).preSign({
        xXORGID: auth.organisation?.organisationId!,
        preSignOfferRequest: {
          signingParameters: {
            signingType: SigningParametersSigningTypeEnum.Embedded,
          },
        },
        offerId: resource?.id!,
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          resource && "lineOfCreditId" in resource
            ? getDrawQueryKey(resource.id)
            : [AGREEMENTS_OFFERS_QUERY_KEY],
        type: "all",
      })
      setCustomSubmit?.(formValues, 4)
    },
  })

  return (
    <OnboardingLayout.Parent
      pageBar={
        <PageBar
          title={title || t("authorityStep.title")}
          withChat
          desktopHeaderType="h4"
        />
      }
    >
      <FormLayout>
        {preSign.isError && (
          <ApiErrorAlert className="mb-2" error={preSign.error} />
        )}
        {content}
        <form onSubmit={handleSubmit(onSubmit!)}>
          <FormLayout.Content>
            <CardV2
              title={t("authorityStep.header")}
              icon={<HugeiconsIcon icon={UserEdit01Icon} />}
              severity="accent-2"
            >
              <div className="flex flex-col gap-4">
                <Typography color="neutral-700">
                  {t("authorityStep.copy")}
                </Typography>
                <MultipleRadio
                  name="authority"
                  control={control}
                  label={t("authorityStep.header")}
                />
              </div>
            </CardV2>

            {formValues.authority === "no" && (
              <ListItemContainer className="mt-2">
                <ListItemLarge
                  icon={<AddIcon />}
                  more={{
                    onClick: () => onSubmit?.(formValues),
                    type: "button",
                  }}
                  title={t("authorityStep.add")}
                />
              </ListItemContainer>
            )}
          </FormLayout.Content>
          <FormLayout.Footer>
            {disclaimer && <Alert>{disclaimer}</Alert>}
            <ButtonGroup>
              {!auth.organisation?.activated && !deal.isAmazonPartnership && (
                <SkipStepButton
                  onClick={async () => {
                    await skipStep("SIGNING")
                    await navigate(OnboardingMenuPaths.Owners)
                  }}
                />
              )}
              {formValues.authority === "no" ? (
                <Button type="button" variant="primary" disabled>
                  {t("authorityStep.sendAgreement")}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  onClick={async () => {
                    await preSign.mutateAsync()
                  }}
                  disabled={!formState.isValid}
                >
                  {t("authorityStep.continue")}
                </Button>
              )}
            </ButtonGroup>
          </FormLayout.Footer>
        </form>
      </FormLayout>
    </OnboardingLayout.Parent>
  )
}

export default AuthorityStep
