import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { CreditCardSolidStandard } from "@hugeicons-pro/core-solid-standard"
import { Trans, useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import Button from "../../../../../components/Basic/Button"
import SanitizedHtml from "../../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../../components/Basic/Typography"
import CardV2 from "../../../../../components/UI/CardV2"
import { ErrorListItem } from "../../../../../components/UI/ErrorListItem"
import useAuth from "../../../../../hooks/useAuth"
import usePlaid, { PlaidAction } from "../../../../../hooks/usePlaid"
import { useTracking } from "../../../../../hooks/useTracking"
import { DataVerificationResultTypeEnum } from "../../../../../services/api/underwriting"
import { url } from "../../../../../utils/url"
import useConnections from "../../../../connections/hooks/useConnections"
import { OnboardingMenuPaths } from "../../../constants"
import useBankAccountsLabels from "../../../hooks/useBankAccountsLabels"
import useBankVerification from "../../../hooks/useBankVerification"
import BankAccountsLabelingModal from "./BankAccountsLabelingModal"
import { ReactComponent as MissingBankAmazonPayoutIcon } from "./NoOffers/assets/missing-bank-amazon-payout.svg"

const BankVerificationErrors = () => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers.PreOffer",
  })
  const { trackEvent } = useTracking()
  const auth = useAuth()
  const [isBankAccountsLabelingModalOpen, setIsBankAccountsLabelingModalOpen] =
    useState(false)
  const navigate = useNavigate()
  const bankVerification = useBankVerification()
  const { refetchConnections } = useConnections()
  const plaid = usePlaid({
    redirectUrl: url(`${OnboardingMenuPaths.Banking}/plaid-auth`, true),
    method: PlaidAction.CONNECT_WITH_INSTITUTION,
    onSuccessCallback: () => refetchConnections(),
  })
  const bankAccountsLabels = useBankAccountsLabels({
    enabled:
      bankVerification.error?.type ===
      DataVerificationResultTypeEnum.MissingBankAccounts,
  })

  const bankVerificationErrors = bankVerification.error
    ? [
        bankVerification.error.type ===
        DataVerificationResultTypeEnum.MissingBankAccounts
          ? {
              ...bankVerification.error,
              details: {
                ...bankVerification.error.details,
                missingAccounts:
                  bankVerification.error.details?.missingAccounts?.filter(
                    (account) =>
                      account !==
                      bankAccountsLabels.data?.find(
                        (item) => item.mask === account
                      )?.mask
                  ),
              },
            }
          : bankVerification.error,
      ]
    : []

  const onBankVerificationResolve = async () => {
    if (auth.organisation?.countryCode === "USA") {
      plaid.openWithInstitution()
    } else {
      await navigate(
        auth.organisation?.activated &&
          auth.organisationData?.onboardingFinished
          ? "/connections"
          : OnboardingMenuPaths.Banking,
        {
          state: {
            nextPath: location.pathname,
          },
        }
      )
    }
  }

  if (bankAccountsLabels.isLoading) {
    return null
  }

  return (
    <>
      {bankVerificationErrors.length > 0 ? (
        <CardV2
          severity="accent-5"
          icon={<HugeiconsIcon icon={CreditCardSolidStandard} />}
          title={t("missingBank.title")}
        >
          <div className="flex flex-col gap-y-4">
            <Typography>
              <SanitizedHtml as="span" content={t("missingBank.content")} />
            </Typography>

            {bankVerificationErrors.find(
              (error) =>
                error.type ===
                DataVerificationResultTypeEnum.SalesPayoutBankAccount
            ) && (
              <ErrorListItem
                icon={<MissingBankAmazonPayoutIcon />}
                iconWrapped={false}
                button={
                  <Button
                    type="button"
                    onClick={async () => {
                      trackEvent({
                        category: "onboarding",
                        name: "pre-offer-resolve-bank-verification",
                        action: "click",
                        customFields: {
                          type: DataVerificationResultTypeEnum.SalesPayoutBankAccount,
                        },
                      })

                      await onBankVerificationResolve()
                    }}
                  >
                    {t("missingBank.button")}
                  </Button>
                }
                title={t("missingBank.types.SALES_PAYOUT_BANK_ACCOUNT")}
              />
            )}

            {bankVerificationErrors.find(
              (error) =>
                error.type ===
                DataVerificationResultTypeEnum.MissingBankAccounts
            ) && (
              <ErrorListItem
                button={
                  <Button
                    type="button"
                    onClick={async () => {
                      trackEvent({
                        category: "onboarding",
                        name: "pre-offer-resolve-bank-verification",
                        action: "click",
                        customFields: {
                          type: DataVerificationResultTypeEnum.MissingBankAccounts,
                        },
                      })
                      await onBankVerificationResolve()
                    }}
                  >
                    {t("missingBank.button")}
                  </Button>
                }
                icon={<HugeiconsIcon icon={CreditCardSolidStandard} />}
                title={t("missingBank.types.MISSING_BANK_ACCOUNTS")}
                subtitle={bankVerificationErrors
                  .find(
                    (error) =>
                      error.type ===
                      DataVerificationResultTypeEnum.MissingBankAccounts
                  )
                  ?.details?.missingAccounts?.map(
                    (account) => `**** ${account.slice(-4)}`
                  )
                  .join(", ")}
              />
            )}

            {bankVerificationErrors.find(
              (error) =>
                error.type ===
                DataVerificationResultTypeEnum.MissingBankAccounts
            ) && (
              <Typography type="smallCopy" className="text-neutral-800">
                <Trans
                  i18nKey="offers.PreOffer.missingBank.notes.MISSING_BANK_ACCOUNTS"
                  ns="onboarding"
                  components={[
                    <button
                      key="link"
                      type="button"
                      className="text-brand-600 font-bold hover:underline"
                      onClick={() => {
                        trackEvent({
                          category: "onboarding",
                          name: "missing-bank-accounts-modal",
                          action: "open",
                        })
                        setIsBankAccountsLabelingModalOpen(true)
                      }}
                    >
                      foo
                    </button>,
                  ]}
                />
              </Typography>
            )}
          </div>
        </CardV2>
      ) : null}
      <BankAccountsLabelingModal
        isOpen={isBankAccountsLabelingModalOpen}
        onClose={() => {
          setIsBankAccountsLabelingModalOpen(false)
        }}
      />
    </>
  )
}

export default BankVerificationErrors
