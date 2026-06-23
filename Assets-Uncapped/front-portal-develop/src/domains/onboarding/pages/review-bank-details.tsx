import { HugeiconsIcon } from "@hugeicons/react"
import {
  BankIcon,
  InformationCircleIcon,
} from "@hugeicons-pro/core-solid-rounded"
import { Trans, useTranslation } from "react-i18next"
import { Navigate, useNavigate } from "react-router"
import Button from "../../../components/Basic/Button"
import SanitizedHtml from "../../../components/Basic/SanitizedHtml"
import Typography from "../../../components/Basic/Typography"
import PageLoader from "../../../components/Collections/PageLoader"
import Card from "../../../components/UI/Card/Card"
import CardV2 from "../../../components/UI/CardV2/CardV2"
import Chip from "../../../components/UI/Chip/Chip"
import ListItemLarge from "../../../components/UI/ListItemLarge"
import Notice from "../../../components/UI/Notice/Notice"
import useBankAccounts from "../../../hooks/useBankAccounts"
import useDeal from "../../../hooks/useDeal"
import useHubSpotChat from "../../../hooks/useHubSpotChat"
import { format } from "../../../utils/money"
import useBankLogo from "../../connections/hooks/useBankLogo"
import OnboardingLayout from "../components/OnboardingLayout"
import TopUpMenu from "../components/TopUpMenu"
import useOffers from "../hooks/useOffers"
import useOnboarding from "../hooks/useOnboarding"
import useSetCashTransferAccount from "../hooks/useSetCashTransferAccount"
import { getOfferAdvanceAmount } from "../utils/offers"

const ReviewBankDetails = () => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "signing.reviewBankDetails",
  })
  const navigate = useNavigate()
  const { isAmazonPartnership } = useDeal()
  const { selectedOffer, isLoading: isOffersLoading } = useOffers()
  const { fullyCompleted } = useOnboarding()
  const { openChat } = useHubSpotChat()
  const bankAccountsQuery = useBankAccounts()
  const setCashTransferAccount = useSetCashTransferAccount()

  const disbursementAccount = bankAccountsQuery.data?.find(
    (account) => account.mandateVerified
  )
  const { data: bankLogoUrl } = useBankLogo({
    bankName: disbursementAccount?.bankName,
  })

  if (!fullyCompleted) {
    return <Navigate to="/" replace />
  }

  if (isOffersLoading || bankAccountsQuery.isLoading) {
    return <PageLoader />
  }

  const bankName = disbursementAccount?.bankName
  const accountTail = disbursementAccount?.mask
  const isVerifiedWithAmazon =
    isAmazonPartnership && !!disbursementAccount?.partnerVerified

  const advanceAmount = selectedOffer
    ? getOfferAdvanceAmount(selectedOffer)
    : undefined
  const currency =
    selectedOffer?.offerDetails?.commonOfferDetails?.advanceCurrency ?? "USD"

  return (
    <OnboardingLayout menu={<TopUpMenu />}>
      <OnboardingLayout.Parent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Typography type="h4">{t("title")}</Typography>
            <Typography color="neutral-700">
              <SanitizedHtml
                as="span"
                content={t(
                  isAmazonPartnership ? "subtitleAmazon" : "subtitleAch"
                )}
              />
            </Typography>
          </div>

          <CardV2
            title={t("cardTitle")}
            icon={<HugeiconsIcon icon={BankIcon} />}
            severity="accent-brand"
          >
            <div className="flex flex-col gap-3">
              {advanceAmount !== undefined && advanceAmount > 0 && (
                <div className="shadow-light-sm border-card rounded-card-md bg-white">
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <Typography color="neutral-800">
                      {t("advanceAmount")}
                    </Typography>
                    <Typography type="bodyTitle" color="neutral-900">
                      {format(advanceAmount, currency, {
                        minimumFractionDigits: 0,
                      })}
                    </Typography>
                  </div>
                </div>
              )}

              {bankName && accountTail ? (
                <Card spacing="small">
                  <ListItemLarge
                    variant="transparent"
                    iconBackgroundColor="neutral-100"
                    iconClassName="border border-neutral-300 !shadow-none"
                    icon={
                      bankLogoUrl ? (
                        <img
                          src={bankLogoUrl}
                          alt={bankName}
                          className="size-full object-contain"
                        />
                      ) : (
                        <HugeiconsIcon
                          icon={BankIcon}
                          className="size-5 text-neutral-600"
                        />
                      )
                    }
                    title={
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{bankName}</span>
                        <span className="text-neutral-700">
                          - ****{accountTail}
                        </span>
                        {isVerifiedWithAmazon && (
                          <Chip
                            color="success"
                            label={t("verifiedWithAmazon")}
                          />
                        )}
                      </span>
                    }
                  />
                </Card>
              ) : (
                <Notice
                  variant="warning"
                  icon={<HugeiconsIcon icon={InformationCircleIcon} />}
                >
                  {t("missingBankAccount")}
                </Notice>
              )}
            </div>
          </CardV2>

          <Notice
            variant="info"
            icon={<HugeiconsIcon icon={InformationCircleIcon} />}
          >
            <Trans
              i18nKey="signing.reviewBankDetails.supportNotice"
              ns="onboarding"
              components={[
                // @ts-expect-error children injected by Trans
                <Button
                  key="contact-support"
                  type="button"
                  variant="link"
                  onClick={openChat}
                />,
              ]}
            />
          </Notice>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="primary"
              loading={setCashTransferAccount.isPending}
              disabled={!selectedOffer?.id || !disbursementAccount?.id}
              onClick={async () => {
                if (!selectedOffer?.id || !disbursementAccount?.id) return
                await setCashTransferAccount.mutateAsync({
                  offerId: selectedOffer.id,
                  cashTransferAccountId: disbursementAccount.id,
                })
                navigate("/")
              }}
            >
              {t("submit")}
            </Button>
          </div>
        </div>
      </OnboardingLayout.Parent>
    </OnboardingLayout>
  )
}

export default ReviewBankDetails
