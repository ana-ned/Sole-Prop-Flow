import { RegisterOrganisationRequestCurrencyEnum } from "../services/api/organisation-users"

/**
 * Maps locale regions to supported currencies
 */
const LOCALE_TO_CURRENCY_MAP: Record<
  string,
  RegisterOrganisationRequestCurrencyEnum
> = {
  // Eurozone countries
  AT: RegisterOrganisationRequestCurrencyEnum.Eur, // Austria
  BE: RegisterOrganisationRequestCurrencyEnum.Eur, // Belgium
  CY: RegisterOrganisationRequestCurrencyEnum.Eur, // Cyprus
  HR: RegisterOrganisationRequestCurrencyEnum.Eur, // Croatia
  EE: RegisterOrganisationRequestCurrencyEnum.Eur, // Estonia
  FI: RegisterOrganisationRequestCurrencyEnum.Eur, // Finland
  FR: RegisterOrganisationRequestCurrencyEnum.Eur, // France
  DE: RegisterOrganisationRequestCurrencyEnum.Eur, // Germany
  GR: RegisterOrganisationRequestCurrencyEnum.Eur, // Greece
  IE: RegisterOrganisationRequestCurrencyEnum.Eur, // Ireland
  IT: RegisterOrganisationRequestCurrencyEnum.Eur, // Italy
  LV: RegisterOrganisationRequestCurrencyEnum.Eur, // Latvia
  LT: RegisterOrganisationRequestCurrencyEnum.Eur, // Lithuania
  LU: RegisterOrganisationRequestCurrencyEnum.Eur, // Luxembourg
  MT: RegisterOrganisationRequestCurrencyEnum.Eur, // Malta
  NL: RegisterOrganisationRequestCurrencyEnum.Eur, // Netherlands
  PT: RegisterOrganisationRequestCurrencyEnum.Eur, // Portugal
  SK: RegisterOrganisationRequestCurrencyEnum.Eur, // Slovakia
  SI: RegisterOrganisationRequestCurrencyEnum.Eur, // Slovenia
  ES: RegisterOrganisationRequestCurrencyEnum.Eur, // Spain

  // GBP
  GB: RegisterOrganisationRequestCurrencyEnum.Gbp, // United Kingdom

  // USD
  US: RegisterOrganisationRequestCurrencyEnum.Usd, // United States

  // CAD
  CA: RegisterOrganisationRequestCurrencyEnum.Cad, // Canada
}

/**
 * Detects currency from a locale string based on supported currencies.
 *
 * @param locale - The locale string (e.g., "en-US", "fr-FR")
 * @param supportedCurrencies - Array of supported currency values
 * @param defaultCurrency - The fallback currency if detection fails or currency is not supported
 * @returns A currency from the supported currencies or the default
 */
export const detectCurrencyFromLocale = <T extends string>(
  locale: string | undefined | null,
  supportedCurrencies: readonly T[],
  defaultCurrency: T
): T => {
  if (!locale) {
    return defaultCurrency
  }

  // Extract the country code from locale (e.g., "en-US" -> "US", "zh-Hans-CN" -> "CN")
  const segments = locale.split("-")
  const countryCode =
    segments.length > 1 ? segments.at(-1)?.toUpperCase() : undefined

  if (!countryCode) {
    return defaultCurrency
  }

  // Look up the currency for this country
  const detectedCurrency = LOCALE_TO_CURRENCY_MAP[countryCode] as unknown as T

  // Return the detected currency if it's in supported currencies, otherwise fall back to default
  return detectedCurrency && supportedCurrencies.includes(detectedCurrency)
    ? detectedCurrency
    : defaultCurrency
}

/**
 * Detects the user's currency based on their browser locale.
 * Falls back to USD if detection fails or the detected currency is not supported.
 *
 * @returns A currency from RegisterOrganisationRequestCurrencyEnum
 */
export const detectCurrencyFromBrowser =
  (): RegisterOrganisationRequestCurrencyEnum => {
    try {
      return detectCurrencyFromLocale(
        navigator.language,
        Object.values(RegisterOrganisationRequestCurrencyEnum),
        RegisterOrganisationRequestCurrencyEnum.Usd
      )
    } catch {
      // If anything goes wrong, fall back to USD
      return RegisterOrganisationRequestCurrencyEnum.Usd
    }
  }
