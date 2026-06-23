import countries from "../models/countries"
import { ICountry } from "../types/Country.types"
import { sortByPredefinedValues } from "../utils/lists"
import { initials } from "../utils/string"

export const PREFERRED_COUNTRY_ORDER = [
  "USA",
  "GBR",
  "CAN",
  "NLD",
  "ESP",
  "POL",
]

const CountryService = {
  getByAlpha3: (code?: string) => {
    return countries.find((country) => country["alpha-3"] === code)
  },
  getByAlpha2: (code?: string) => {
    return countries.find((country) => country["alpha-2"] === code)
  },
  getSelectOptions: () =>
    sortByPredefinedValues(countries, PREFERRED_COUNTRY_ORDER, "alpha-3").map(
      (item) => ({
        value: item["alpha-3"],
        label: item.name,
        entity: item,
      })
    ),
  getCompactSelectOptions: (selected?: string[]) =>
    sortByPredefinedValues(
      selected
        ? countries.filter((item) => selected.includes(item["alpha-3"]))
        : countries,
      PREFERRED_COUNTRY_ORDER,
      "alpha-3"
    ).map((item) => ({
      value: item["alpha-3"],
      label: `${item.flag} ${item["alpha-2"] === "GB" ? "UK" : item["alpha-2"]}`,
      entity: item,
    })),
  getSelectFilter: (
    country: { data: { value: string; label: string; entity: ICountry } },
    input: string
  ) => {
    if (input) {
      return CountryService.getSearchMatcher(country.data.entity, input)
    }
    return true
  },
  getSearchMatcher: (country: ICountry, query: string) => {
    return (
      country.name.toLowerCase().startsWith(query.toLowerCase()) ||
      country["alpha-3"].toLowerCase().startsWith(query.toLowerCase()) ||
      initials(country.name)?.toLowerCase().startsWith(query.toLowerCase())
    )
  },
  hasRegions: (countryAlpha3: string) =>
    !!countries.find((item) => item["alpha-3"] === countryAlpha3)?.regions
      ?.length,
  getCurrency: (countryAlpha3: string) => {
    const countryCurrencyMap: Record<
      ICountry["alpha-3"],
      ICountry["currency"]
    > = {
      AUS: "GBP",
      GBR: "GBP",
      USA: "USD",
      CAN: "CAD",
    }
    return (
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: countryCurrencyMap[countryAlpha3] ?? "EUR",
      })
        .formatToParts(0)
        .find((part) => part.type === "currency")?.value ?? ""
    )
  },
}

export default CountryService
