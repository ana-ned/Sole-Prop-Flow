import React from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import OnboardingLayout from "../../../domains/onboarding/components/OnboardingLayout"
import Summary from "../../../domains/onboarding/components/signing/Summary"
import { AGREEMENTS_OFFERS_QUERY_KEY } from "../../../domains/onboarding/hooks/useOffers"
import useAuth from "../../../hooks/useAuth"
import { AGREEMENTS_LOC_QUERY_KEY } from "../../../hooks/useLineOfCreditAgreements"
import {
  DrawResponse,
  DrawSigningDetailsSigningTypeEnum,
  LineOfCreditApi,
  OfferControllerV3Api,
  OfferResponse,
  OfferResponseOfferTypeEnum,
  SigningParametersSigningTypeEnum,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import Button from "../../Basic/Button"
import ButtonGroup from "../../Basic/ButtonGroup"
import { StepProps } from "../../Headless/MultistepForm"
import Alert from "../../UI/Alert"
import FormLayout from "../../UI/FormLayout/FormLayout"
import PageBar from "../../UI/PageBar"
import { SigningFormFields } from "./SigningFormSteps.types"

const ReviewOfferNoAuthority = ({
  data,
  onBack,
  resource,
  title,
  content,
  disclaimer,
  onEmailSentCallback,
}: StepProps<SigningFormFields> & {
  resource: OfferResponse | DrawResponse
  title?: string
  content?: React.ReactNode
  disclaimer?: string
  onEmailSentCallback: () => void
}) => {
  const queryClient = useQueryClient()
  const auth = useAuth()
  const { t } = useTranslation("common", {
    keyPrefix: "SigningFormSteps",
  })
  const isLocWithDraw =
    "offerType" in resource &&
    resource.offerDetails &&
    resource.offerType === OfferResponseOfferTypeEnum.LineOfCredit &&
    !!resource.offerDetails.lineOfCreditDetails?.firstDrawAmount

  const sendEmail = useMutation({
    mutationFn: async () => {
      if ("lineOfCreditId" in resource) {
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
            signingType: DrawSigningDetailsSigningTypeEnum.Email,
            signerFirstName: data?.firstName,
            signerLastName: data?.lastName,
            signerEmail: data?.email,
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
            signingType: SigningParametersSigningTypeEnum.Email,
            signerFirstName: data?.firstName,
            signerLastName: data?.lastName,
            signerEmail: data?.email,
          },
        },
        offerId: resource.id!,
      })
    },
  })

  return (
    <OnboardingLayout.Parent
      pageBar={
        <PageBar
          onClickBack={onBack}
          title={
            title || isLocWithDraw
              ? "Your agreements are ready!"
              : "Your agreement is ready!"
          }
          withChat
          desktopHeaderType="h4"
        />
      }
    >
      <FormLayout>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            await sendEmail.mutateAsync(undefined, {
              onSuccess: async () => {
                await queryClient.invalidateQueries({
                  queryKey: [AGREEMENTS_OFFERS_QUERY_KEY],
                })
                await queryClient.invalidateQueries({
                  queryKey: [AGREEMENTS_LOC_QUERY_KEY],
                })
                onEmailSentCallback()
              },
            })
          }}
        >
          <FormLayout.Content>
            {content}
            {"offerType" in resource && <Summary offer={resource} />}
          </FormLayout.Content>
          <FormLayout.Footer>
            {disclaimer && <Alert>{disclaimer}</Alert>}
            <ButtonGroup>
              <Button type="submit" loading={sendEmail.isPending}>
                {t(
                  isLocWithDraw
                    ? "reviewStep.submitWithDraw"
                    : "reviewStep.submit"
                )}
              </Button>
            </ButtonGroup>
          </FormLayout.Footer>
        </form>
      </FormLayout>
    </OnboardingLayout.Parent>
  )
}

export default ReviewOfferNoAuthority
