import { PlatformCategory } from "../../connections/models/platforms"
import { OnboardingMenuPaths } from "../constants"

export const onboardingConnectionOnSuccessRedirect = {
  [PlatformCategory.sales]: OnboardingMenuPaths.Sales,
  [PlatformCategory.accounting]: OnboardingMenuPaths.Accounting,
  [PlatformCategory.banking]: OnboardingMenuPaths.Banking,
}
