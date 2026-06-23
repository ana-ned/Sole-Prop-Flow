import { http, HttpResponse } from "msw"
import env from "../utils/runtime-env"

const apiPrefix = env("REACT_APP_API_URL")

export const handlers = [
  http.get(`${apiPrefix}/example-mock`, () =>
    HttpResponse.json({
      success: true,
    })
  ),
]
