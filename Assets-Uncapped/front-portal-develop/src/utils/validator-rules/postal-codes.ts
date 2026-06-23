import postalCodes from "postal-codes-js"
import { TestContext } from "yup"

export default function PostalCode(this: TestContext, value?: string): boolean {
  if (!value || !this.parent.country) {
    return true
  }

  return postalCodes.validate(this.parent.country, value) === true
}
