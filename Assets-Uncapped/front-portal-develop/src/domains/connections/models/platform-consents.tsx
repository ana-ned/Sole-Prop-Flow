import { ReactNode } from "react"
import { addDays } from "date-fns"
import { ParseKeys, TFunction } from "i18next"
import { Trans } from "react-i18next"
import Typography from "../../../components/Basic/Typography"
import CheckList from "../../../components/UI/CheckList"
import { DateFormat, formatDate } from "../../../utils/date"

interface PlatformConsent {
  systemId: string
  headerTranslationKey: ParseKeys<"connections">
  getContent: (
    t: TFunction<"connections">,
    metadata?: Record<string, string | undefined>
  ) => ReactNode
}

const platformConsents: Record<string, PlatformConsent> = {
  saltedge: {
    systemId: "SALTEDGE",
    headerTranslationKey: "consents.saltedge.header",
    getContent: (t) => (
      <>
        <Typography>{t("consents.saltedge.p1")}</Typography>
        <Typography>
          <Trans i18nKey="consents.saltedge.p2" ns="connections">
            By using the service, you indicate that you have read and agree with
            the Salt Edge{" "}
            <a
              href="https://www.saltedge.com/pages/dashboard_terms_of_service"
              target="_blank"
              rel="noreferrer"
            >
              Terms of service
            </a>{" "}
            and{" "}
            <a
              href="https://www.saltedge.com/pages/dashboard_privacy_policy"
              target="_blank"
              rel="noreferrer"
            >
              Privacy Policy
            </a>
            .
          </Trans>
        </Typography>
      </>
    ),
  },
  yapily: {
    systemId: "YAPILY",
    headerTranslationKey: "consents.yapily.header",
    getContent: (t, metadata) => (
      <>
        <Typography>
          {t("consents.yapily.p1", { bank: metadata?.bank })}
        </Typography>
        <Typography type="bodyTitle">
          {t("consents.yapily.p2", { bank: metadata?.bank })}
        </Typography>
        <CheckList items={t("consents.yapily.list", { returnObjects: true })} />
        <Typography>
          <Trans
            ns="connections"
            i18nKey="consents.yapily.p3"
            values={{
              date: formatDate(addDays(new Date(), 90), {
                format: DateFormat.MID,
              }),
            }}
          >
            {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
            <a
              href="https://www.yapily.com/legal/end-user-terms"
              target="_blank"
              rel="noreferrer"
            />
            {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
            <a
              href="https://www.yapily.com/legal/privacy-policy/"
              target="_blank"
              rel="noreferrer"
            />
          </Trans>
        </Typography>
      </>
    ),
  },
}

export default platformConsents
