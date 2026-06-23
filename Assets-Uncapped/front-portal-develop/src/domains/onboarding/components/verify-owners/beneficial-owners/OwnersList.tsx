import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import Button from "../../../../../components/Basic/Button"
import ButtonGroup from "../../../../../components/Basic/ButtonGroup"
import SanitizedHtml from "../../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../../components/Basic/Typography"
import ListItemContainer from "../../../../../components/Collections/ListItemContainer"
import PageLoader from "../../../../../components/Collections/PageLoader"
import Alert from "../../../../../components/UI/Alert"
import FormLayout from "../../../../../components/UI/FormLayout/FormLayout"
import ListItemLarge from "../../../../../components/UI/ListItemLarge"
import { ListItemMoreProps } from "../../../../../components/UI/ListItemLarge/ListItemLarge"
import PageBar from "../../../../../components/UI/PageBar"
import useAuth from "../../../../../hooks/useAuth"
import useBankAccounts from "../../../../../hooks/useBankAccounts"
import useDeal from "../../../../../hooks/useDeal"
import {
  CustomerPersonDTO,
  CustomerPersonDTOLivenessCheckStatusEnum,
} from "../../../../../services/api/kyc"
import { ReactComponent as AddIcon } from "../../../../../svgs/add.svg"
import { titleCase } from "../../../../../utils/string"
import { OnboardingMenuPaths } from "../../../constants"
import useApplicationSteps from "../../../hooks/useApplicationSteps"
import useBeneficialOwners from "../../../hooks/useBeneficialOwners"
import useKycStatus from "../../../hooks/useKycStatus"
import useOnboardingNavigation from "../../../hooks/useOnboardingNavigation"
import OnboardingLayout from "../../OnboardingLayout"
import SectionHeader from "../SectionHeader"
import ModalLinksSent from "./ModalLinksSent"

const OwnersList = () => {
  const auth = useAuth()
  const { t } = useTranslation("onboarding", {
    keyPrefix: "verifyOwners.ownersList",
  })
  const [modal, setModal] = useState<"MODAL_CONFIRM" | undefined>()
  const { handleCompleteStep, hasCompletedStep } = useApplicationSteps()
  const navigate = useNavigate()
  const { data, isLoading } = useBeneficialOwners()
  const deal = useDeal()
  const navigation = useOnboardingNavigation()
  const bankAccountsQuery = useBankAccounts({
    refetchInterval:
      deal.hasAmazonPartnerOffer && !!data && data.length > 0 ? 2500 : false,
  })

  // Customers coming from amazon portal can only proceed if all persons are verified positively
  const kycStatusQuery = useKycStatus({
    enabled:
      auth.isAuthenticated &&
      !!auth.organisation?.organisationId &&
      deal.hasAmazonPartnerOffer &&
      !!data &&
      data.length > 0,
    refetchInterval:
      deal.hasAmazonPartnerOffer && !!data && data.length > 0 ? 2500 : false,
  })

  const getStatus = (
    owner: CustomerPersonDTO
  ): ListItemMoreProps | undefined => {
    if (
      auth.user?.sub === owner.externalId &&
      owner.status?.toUpperCase() === "PENDING" &&
      owner.verificationLink
    ) {
      return {
        type: "label",
        value: t("complete"),
      }
    }

    return {
      type: "value",
      value:
        owner.status ===
        CustomerPersonDTOLivenessCheckStatusEnum.PositivelyVerified
          ? t("verified")
          : titleCase(owner.status || ""),
    }
  }

  const proceed = () => {
    navigation.next()
  }

  if (isLoading) {
    return (
      <OnboardingLayout.Parent>
        <PageLoader />
      </OnboardingLayout.Parent>
    )
  }

  if (hasCompletedStep("OWNERS")) {
    const isNotVerified =
      deal.hasAmazonPartnerOffer &&
      (!kycStatusQuery.data?.wasAllPersonsVerifiedPositively ||
        bankAccountsQuery.data?.some(
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, sonarjs/different-types-comparison
          (account) => account.partnerVerified === null
        ))

    return (
      <OnboardingLayout.Parent
        pageBar={
          <PageBar
            title={t("titleCompleted")}
            withChat
            desktopHeaderType="h4"
          />
        }
      >
        <FormLayout>
          <FormLayout.Content>
            <Typography type="body" className="mb-6" color="neutral-600">
              {t("contentCompleted")}
            </Typography>

            {data && data.length > 0 ? (
              <>
                <SectionHeader
                  title={t("beneficialOwners")}
                  onEdit={async () => {
                    await navigate(`${OnboardingMenuPaths.Owners}/add`)
                  }}
                  editTitle={t("add")}
                />
                <ListItemContainer>
                  {data.map((item) => (
                    <ListItemLarge
                      more={getStatus(item)}
                      title={`${item.firstName} ${item.lastName}`}
                      subtitle={item.email}
                      key={item.externalId}
                    />
                  ))}
                </ListItemContainer>
              </>
            ) : (
              <div className="mt-6 flex justify-end">
                <Button
                  variant="link"
                  href={`${OnboardingMenuPaths.Owners}/add`}
                >
                  {t("add")}
                </Button>
              </div>
            )}
          </FormLayout.Content>
          <FormLayout.Footer>
            {isNotVerified && (
              <Alert type="info">{t("identityVerification")}</Alert>
            )}
            <ButtonGroup>
              <Button
                type="button"
                disabled={!!data && data.length > 0 && isNotVerified}
                onClick={() => {
                  proceed()
                }}
              >
                {t("submitCompleted")}
              </Button>
            </ButtonGroup>
          </FormLayout.Footer>
          <ModalLinksSent
            isOpen={modal === "MODAL_CONFIRM"}
            onClose={() => {
              setModal(undefined)
            }}
          />
        </FormLayout>
      </OnboardingLayout.Parent>
    )
  }

  return (
    <OnboardingLayout.Parent
      pageBar={<PageBar title={t("title")} withChat desktopHeaderType="h4" />}
    >
      <FormLayout>
        <FormLayout.Content>
          <Typography type="body" className="mb-6">
            <SanitizedHtml content={t("content")} as="span" />
          </Typography>

          <Typography type="body" className="mb-6">
            <SanitizedHtml content={t("provideDetails")} as="span" />
          </Typography>

          <ListItemContainer>
            {data && data.length > 0 ? (
              data.map((item) => (
                <ListItemLarge
                  href={`${OnboardingMenuPaths.Owners}/edit/${item.externalId}`}
                  more={{
                    type: "link",
                  }}
                  title={`${item.firstName} ${item.lastName}`}
                  subtitle={item.email}
                  key={item.externalId}
                />
              ))
            ) : (
              <ListItemLarge
                icon={<AddIcon />}
                iconBackgroundColor="surface-canvas"
                href={`${OnboardingMenuPaths.Owners}/add`}
                title={t("add")}
                more={{ type: "link" }}
              />
            )}
          </ListItemContainer>

          {data && data.length > 0 && (
            <div className="mt-6 flex justify-end">
              <Button variant="link" href={`${OnboardingMenuPaths.Owners}/add`}>
                {t("add")}
              </Button>
            </div>
          )}
        </FormLayout.Content>
        <FormLayout.Footer>
          <Alert type="warning">{t("stepRequiredToDeposit")}</Alert>
          <ButtonGroup>
            <Button
              type="button"
              disabled={!!data && data.length === 0}
              onClick={async () => {
                await handleCompleteStep("OWNERS")

                if (data && data.length > 0) {
                  setModal("MODAL_CONFIRM")
                } else {
                  proceed()
                }
              }}
            >
              {data?.length === 0 ? t("continue") : t("submit")}
            </Button>
          </ButtonGroup>
        </FormLayout.Footer>
        <ModalLinksSent
          isOpen={modal === "MODAL_CONFIRM"}
          onClose={() => {
            setModal(undefined)
          }}
        />
      </FormLayout>
    </OnboardingLayout.Parent>
  )
}

export default OwnersList
