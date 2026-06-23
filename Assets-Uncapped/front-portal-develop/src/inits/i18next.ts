import i18n from "i18next"
import HttpApi from "i18next-http-backend"
import { initReactI18next } from "react-i18next"
import { isProduction } from "../utils/env"
import env from "../utils/runtime-env"

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `/static/locales/{{lng}}/{{ns}}.json?v=${env("REACT_APP_VERSION")}`,
    },
    lng: "en-GB",
    ns: ["common"],
    defaultNS: "common",
    fallbackNS: "common",
    interpolation: { escapeValue: false }, // React already does escaping
    load: "currentOnly",
    fallbackLng: "en-GB",
    preload: ["en-GB"],
    react: { useSuspense: true },
    debug: !isProduction(),
  })

export { default } from "i18next"
