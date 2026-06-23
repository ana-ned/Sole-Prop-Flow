import auth0 from "auth0-js"
import { toast } from "react-toastify"
import { logError } from "../utils/error-handling"
import env from "../utils/runtime-env"
import { url } from "../utils/url"

const useLogin = () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const login = (username: string, password: string, redirectUri: string) => {
    const auth0Client = new auth0.WebAuth({
      domain: env("REACT_APP_AUTH0_DOMAIN"),
      clientID: env("REACT_APP_AUTH0_CLIENT_ID"),
      audience: env("REACT_APP_AUTH0_AUDIENCE"),
      redirectUri: url(redirectUri, true),
      responseType: "token",
    })

    auth0Client.login(
      {
        realm: "Username-Password-Authentication",
        username,
        password,
      },
      (err) => {
        if (err) {
          logError(err)
          toast.error(err.description)
        }
      }
    )
  }

  return {
    login,
  }
}

export default useLogin
