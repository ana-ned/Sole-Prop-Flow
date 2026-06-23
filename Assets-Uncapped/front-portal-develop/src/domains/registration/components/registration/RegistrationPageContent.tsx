import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router"
import { twMerge } from "tailwind-merge"
import Button from "../../../../components/Basic/Button"
import Separator from "../../../../components/Basic/Separator"
import Typography from "../../../../components/Basic/Typography"
import TrustpilotWidget from "../../../../components/UI/TrustpilotWidget"
import useAuth from "../../../../hooks/useAuth"
import useTrackedQueryParams from "../../../../hooks/useTrackedQueryParams"
import { ReactComponent as AmazonLogo } from "../../../../svgs/logo-amazon.svg"
import { ReactComponent as GoogleLogo } from "../../../../svgs/logo-google.svg"
import RegistrationForm from "./RegistrationForm"

export const Referral = {
  WALMART: "walmart",
  AMAZON: "amazon",
} as const

export type Referral = (typeof Referral)[keyof typeof Referral]

const REFERRALS_WITHOUT_AMAZON_LOGIN = new Set<Referral>([Referral.WALMART])

const iconClasses = "h-6 !w-6.5 !mr-3 lg:-ml-9"

const ExternalLink = ({
  className,
  children,
  ...props
}: React.AllHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={twMerge(
        "text-brand font-bold no-underline hover:underline",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}

const PROSPECT_ID_KEY = "registration_prospectId"

let cachedProspectId: string | null = null

export const getStoredProspectId = (): string | null =>
  (cachedProspectId ??= sessionStorage.getItem(PROSPECT_ID_KEY))

const RegistrationPageContent = ({ prospectId }: { prospectId?: string }) => {
  const { t } = useTranslation("registration", { keyPrefix: "index" })
  const auth = useAuth()
  const { trackedQueryParams } = useTrackedQueryParams()

  const loginWithOAuth = async (connection: string) => {
    if (prospectId) sessionStorage.setItem(PROSPECT_ID_KEY, prospectId)
    await auth.loginWithRedirect({
      authorizationParams: {
        connection,
        redirect_uri: globalThis.location.origin,
      },
    })
  }

  return (
    <div className="lg:mx-auto lg:w-full lg:max-w-101">
      <div>
        <Button
          type="button"
          fullWidth
          variant="secondary"
          onClick={() => loginWithOAuth("google-oauth2")}
        >
          <GoogleLogo className={iconClasses} />
          {t("continueGoogle")}
        </Button>
        {!REFERRALS_WITHOUT_AMAZON_LOGIN.has(
          trackedQueryParams?.referral as Referral
        ) && (
          <Button
            type="button"
            fullWidth
            variant="secondary"
            onClick={() => loginWithOAuth("amazon")}
            className="mt-2"
          >
            <AmazonLogo className={iconClasses} />
            {t("continueAmazon")}
          </Button>
        )}
        <Separator
          className="mt-8 mb-8"
          textClassName="bg-surface-canvas"
          text={t("signupEmail")}
        />
        <RegistrationForm prospectId={prospectId} />
        <Typography
          type="body"
          color="neutral-700"
          className="mt-4 text-center"
        >
          {t("haveAccount")} <Link to="/">{t("logIn")}</Link>
        </Typography>
        <TrustpilotWidget className="mt-4 flex justify-center" />
      </div>
      <Typography
        type="smallCopy"
        color="neutral-700"
        className="mt-4 text-center"
      >
        <Trans i18nKey="index.alertExperiment" ns="registration">
          By continuing you agree to our
          <ExternalLink href="https://www.weareuncapped.com/legal">
            Terms & Conditions
          </ExternalLink>
        </Trans>
        . This site is protected by reCAPTCHA and the Google{" "}
        <ExternalLink href="https://policies.google.com/privacy">
          Privacy Policy
        </ExternalLink>{" "}
        and{" "}
        <ExternalLink href="https://policies.google.com/terms">
          Terms of Service
        </ExternalLink>{" "}
        apply.
      </Typography>
    </div>
  )
}

export default RegistrationPageContent
