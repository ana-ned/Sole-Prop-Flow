import { useScript } from "usehooks-ts"
import { isProduction } from "../utils/env"

const getSiteKey = () => {
  if (isProduction()) {
    return "6LcNvmUkAAAAAC_6hMPgQYDYc2VWoJ0NQepBgD_t"
  }

  return "6Ld6-mIkAAAAAGW65T9z7RKZgK1Ul0fTT36lxChL"
}

const getUrl = (key: string, enabled: boolean) => {
  if (!key || !enabled) {
    return null
  }

  return `https://www.google.com/recaptcha/enterprise.js?render=${key}&waf=session`
}

/*
 * Quick wrapper for reCAPTCHA Enterprise by Google
 * @src https://cloud.google.com/recaptcha-enterprise/docs/instrument-web-pages#user-action
 */
const useRecaptcha = () => {
  const enabled = true // FIXME: In future, we will want to disable on some environments (local, e2e, preview?)
  const key = getSiteKey()

  const status = useScript(getUrl(key, enabled))

  return {
    isReady: status === "ready" && !!globalThis.grecaptcha,
    getToken: (): Promise<string | null> => {
      return new Promise((resolve) => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!globalThis.grecaptcha) {
          resolve(null)
          return
        }
        globalThis.grecaptcha.enterprise.ready(async () => {
          const token = await globalThis.grecaptcha.enterprise.execute(key, {
            action: "LOGIN",
          })
          resolve(token)
        })
      })
    },
  }
}

export default useRecaptcha
