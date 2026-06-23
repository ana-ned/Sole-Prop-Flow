import { faker } from "@faker-js/faker"
import { UserDTO } from "../services/api/organisation-users"

export const UserStub: UserDTO = {
  id: faker.string.uuid(),
  externalId: faker.string.uuid(),
  name: faker.person.firstName(),
  surname: faker.person.lastName(),
  email: faker.internet.email(),
  position: "CEO",
  phone: faker.phone.number(),
  roles: [
    "admin",
    "admin",
    "billPaymentApprover",
    "minimumFundingRequirementsSuperUser",
  ],
}
