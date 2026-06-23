import { HugeiconsIcon } from "@hugeicons/react"
import {
  Logout05Icon,
  Rocket01SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { Trans, useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router"
import BoxIcon from "../../../components/Basic/BoxIcon"
import PageLoader from "../../../components/Collections/PageLoader"
import LogoOnlyMenu from "../../../components/UI/LogoOnlyMenu"
import Nudge from "../../../components/UI/Nudge/Nudge"
import StepperMenu from "../../../components/UI/StepperMenu"
import useAuth from "../../../hooks/useAuth"
import useStore from "../../../hooks/useStore"
import { useTracking } from "../../../hooks/useTracking"
import { OfferResponseOfferStatusEnum } from "../../../services/api/agreements"
import { format } from "../../../utils/money"
import { getOfferAmount } from "../../agreements/utils"
import { ONBOARDING_BASE_PATH, OnboardingMenuPaths } from "../constants"
import useApplicationSteps from "../hooks/useApplicationSteps"
import useOffers from "../hooks/useOffers"
import useOnboarding from "../hooks/useOnboarding"

const OnboardingMenu = ({ hideNudge }: { hideNudge?: boolean }) => {
  const location = useLocation()
  const { pathname } = location
  const { flowQuery } = useApplicationSteps()
  const { steps } = useOnboarding()
  const auth = useAuth()
  const customNextOnboardingPath = useStore(
    (state) => state.customNextOnboardingPath
  )
  const { signeableOffers, selectedOffer } = useOffers()
  const { t } = useTranslation("onboarding")
  const { trackEvent } = useTracking()

  const isStepperMenuHidden =
    customNextOnboardingPath?.includes(`${ONBOARDING_BASE_PATH}/documents`) &&
    (pathname.includes(OnboardingMenuPaths.Sales) ||
      pathname.includes(OnboardingMenuPaths.Accounting) ||
      pathname.includes(OnboardingMenuPaths.Banking) ||
      pathname.includes(`${ONBOARDING_BASE_PATH}/consent`))

  if (flowQuery.isLoading) return <PageLoader />

  const highestOfferToSelect =
    !selectedOffer &&
    signeableOffers
      .toSorted((a, b) => (getOfferAmount(b) || 0) - (getOfferAmount(a) || 0))
      .find((item) => item.offerStatus === OfferResponseOfferStatusEnum.New)

  return (
    <div className="flex h-full flex-col">
      <div className="grow">
        <LogoOnlyMenu withSeparator={false} />

        {isStepperMenuHidden ? null : (
          <StepperMenu steps={steps.filter((item) => !item.hidden)} />
        )}

        {highestOfferToSelect && !hideNudge && (
          <div className="mx-auto mt-4 max-w-200 px-4 lg:mt-6 lg:px-0">
            <Nudge
              layout="vertical"
              accent={2}
              title={t("OfferNudge.title", {
                amount: format(
                  getOfferAmount(highestOfferToSelect) || 0,
                  highestOfferToSelect.offerDetails?.commonOfferDetails
                    ?.advanceCurrency!,
                  {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }
                ),
              })}
              content={
                <Trans
                  i18nKey="onboarding:OfferNudge.content"
                  components={[
                    <Link
                      key="link"
                      to={OnboardingMenuPaths.Offers}
                      onClick={() => {
                        trackEvent({
                          category: "onboarding",
                          name: "menu",
                          action: "offer-nudge-clicked",
                          customFields: {
                            automatic:
                              !!highestOfferToSelect.offerDetails
                                ?.commonOfferDetails?.automatic,
                          },
                        })
                      }}
                    ></Link>,
                  ]}
                />
              }
              icon={Rocket01SolidStandard}
            />
          </div>
        )}
      </div>

      <ul className="mt-auto hidden pt-10 lg:block">
        <li>
          <button
            type="button"
            className="hover:bg-surface-elevated-2 hover:border-nav-item-active border-nav-item flex w-[240px] flex-row items-center gap-x-[10px] gap-y-1 rounded-lg px-3 py-2 whitespace-nowrap transition-all"
            onClick={() => auth.logout()}
          >
            <BoxIcon
              severity="accent-2"
              icon={<HugeiconsIcon icon={Logout05Icon} />}
            />
            {t("logout")}
          </button>
        </li>
      </ul>
    </div>
  )
}

export default OnboardingMenu
