import { http, HttpResponse } from "msw"
import { AgreementsList } from "../stubs/agreements"
import { feesStub } from "../stubs/fees"
import { OrganisationApproved } from "../stubs/organisations"
import { UserStub } from "../stubs/profile"
import env from "../utils/runtime-env"

const apiPrefix = env("REACT_APP_API_URL")

export const handlers = [
  http.get(`${apiPrefix}/organisation-users/organisations/:org`, () =>
    HttpResponse.json(OrganisationApproved)
  ),

  http.get(`${apiPrefix}/organisation-users/organisation-users/:id`, () =>
    HttpResponse.json(UserStub)
  ),

  http.get(`${apiPrefix}/loan-operations/billVendors/fees`, () =>
    HttpResponse.json(feesStub)
  ),

  http.get(`${apiPrefix}/agreements/agreements`, () =>
    HttpResponse.json(AgreementsList)
  ),

  http.get("*", () => HttpResponse.json([])),
]
