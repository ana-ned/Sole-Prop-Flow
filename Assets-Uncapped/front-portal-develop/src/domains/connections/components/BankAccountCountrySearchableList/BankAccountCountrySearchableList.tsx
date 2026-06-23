import { useEffect } from "react"
import { Search } from "@material-ui/icons"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router"
import { useDebounceValue } from "usehooks-ts"
import Button from "../../../../components/Basic/Button"
import Input from "../../../../components/Forms/Input"
import Select from "../../../../components/Forms/Select"
import Alert from "../../../../components/UI/Alert"
import CardV2 from "../../../../components/UI/CardV2"
import ListItemLarge from "../../../../components/UI/ListItemLarge"
import Loader from "../../../../components/UI/Loader"
import useAuth from "../../../../hooks/useAuth"
import useDevice from "../../../../hooks/useDevice"
import usePlaid, { PlaidAction } from "../../../../hooks/usePlaid"
import { useTracking } from "../../../../hooks/useTracking"
import countries from "../../../../models/countries"
import { Bank } from "../../../../services/api/connections"
import CountryService from "../../../../services/country"
import { isProduction } from "../../../../utils/env"
import { initials } from "../../../../utils/string"
import { ONBOARDING_BASE_PATH } from "../../../onboarding/constants"
import { onboardingConnectionOnSuccessRedirect } from "../../../onboarding/utils/redirects"
import useBanksList from "../../hooks/useBanksList"
import useConnections from "../../hooks/useConnections"
import platforms, {
  bankingPlatforms,
  PlatformCategory,
} from "../../models/platforms"
import { pickBankLogo } from "../../utils/bankLogo"
import SaltedgeLogo from "./assets/saltedge.png"

const SUPPORTED_COUNTRIES = ["USA", "GBR", "CAN", "ESP", "POL", "NLD"] as const

const BANKS = {
  // USA
  AMERICAN_EXPRESS: "ins_10",
  CAPITAL_ONE: "ins_128026",
  CHASE: "ins_56",
  BANK_OF_AMERICA: "ins_127989",
  MERCURY: "ins_116794",
  WELLS_FARGO: "ins_127991",
  BREX: "ins_127888",
  SVB_ONLINE_BANKING: "ins_53",
  WISE: "ins_132616",
  US_BANK: "ins_127990",
  TD_BANK: "ins_14",
  TRUIST: "ins_130888",
  CITIBANK_ONLINE: "ins_5",
  PNC: "ins_13",
  // GBR
  STARLING_OB: "starling_ob",
  REVOLUT: "revolut",
  WISE_LIVE: "wise-live",
  SANTANDER_UK: "santander_uk",
  HSB_CB_BUSINESS_UK: "hsbcbusiness_uk",
  HSBC_CORPORATE: "hsbccorporate",
  BARCLAYS_BUSINESS: "barclays_business",
  LLOYDSBUSINESS: "lloydsbusiness",
  // ESP
  BANCO_SABADELL: "banco_sabadell",
  CAIXABANK: "caixabank",
  BBVA_ES: "bbva_es",
  BANCO_SANTANDER: "banco_santander",
  BANKINTER: "bankinter",
  // FIN
  AMEX_OB_EU: "amex-ob_eu",
}

const FREQUENT_BANKS: Record<string, string[]> = {
  GBR: [
    BANKS.STARLING_OB,
    BANKS.REVOLUT,
    BANKS.WISE_LIVE,
    BANKS.SANTANDER_UK,
    BANKS.HSB_CB_BUSINESS_UK,
    BANKS.HSBC_CORPORATE,
    BANKS.BARCLAYS_BUSINESS,
    BANKS.LLOYDSBUSINESS,
  ],
  ESP: [
    BANKS.BANCO_SABADELL,
    BANKS.CAIXABANK,
    BANKS.BBVA_ES,
    BANKS.BANCO_SANTANDER,
    BANKS.BANKINTER,
  ],
  USA: [
    BANKS.AMERICAN_EXPRESS,
    BANKS.CAPITAL_ONE,
    BANKS.CHASE,
    BANKS.BANK_OF_AMERICA,
    BANKS.MERCURY,
    BANKS.WELLS_FARGO,
    BANKS.BREX,
    BANKS.SVB_ONLINE_BANKING,
    BANKS.WISE,
    BANKS.US_BANK,
    BANKS.TD_BANK,
    BANKS.TRUIST,
  ],
  FIN: [BANKS.AMEX_OB_EU],
}

const PAYONEER_FALLBACK_BANK: Bank = {
  id: isProduction() ? "payoneer_uk" : "modelo-sandbox",
  name: "Payoneer",
  country: "GBR",
  systemId: platforms.Yapily.systemId,
  logo: {
    url: "https://images.yapily.com/image/563673e1-543f-40c8-baf3-ed20f6a03e3b",
  },
  icon: {
    url: "https://images.yapily.com/image/75394850-315d-4dd9-b97c-e3fea2608b68",
  },
}

const BankAccountCountrySearchableList = ({
  plaidFallback,
  onSkip,
}: {
  plaidFallback: string
  onSkip?: () => void
}) => {
  const { t } = useTranslation(["connections", "common"])
  const navigate = useNavigate()
  const { trackEvent } = useTracking()
  const location = useLocation()
  const { isMobile } = useDevice()
  const { refetchConnections, handleOpenAuthorizationProvider } =
    useConnections()
  const isOnboarding = location.pathname.includes(ONBOARDING_BASE_PATH)
  const plaid = usePlaid({
    redirectUrl: plaidFallback,
    method: PlaidAction.CONNECT_WITH_INSTITUTION,
    onSuccessCallback: async () => {
      await refetchConnections()
      await navigate(
        isOnboarding
          ? onboardingConnectionOnSuccessRedirect[PlatformCategory.banking]
          : "/connections"
      )
    },
  })

  const auth = useAuth()
  const { control, watch } = useForm({
    defaultValues: {
      search: "",
      country: auth.organisation?.countryCode
        ? SUPPORTED_COUNTRIES.includes(
            auth.organisation
              .countryCode as (typeof SUPPORTED_COUNTRIES)[number]
          )
          ? auth.organisation.countryCode
          : "USA"
        : "USA",
    },
  })
  const searchField = watch("search")
  const countryField = watch("country")
  const [debouncedSearchField, setDebouncedSearchField] = useDebounceValue(
    searchField,
    500
  )

  useEffect(() => {
    setDebouncedSearchField(searchField)
  }, [searchField, setDebouncedSearchField])

  const banks = useBanksList({
    country: countryField,
    name: debouncedSearchField,
    id: debouncedSearchField
      ? []
      : !isProduction() && !["CAN", "USA"].includes(countryField)
        ? ["modelo-sandbox"]
        : FREQUENT_BANKS[countryField],
  })

  const normalizedSearch = debouncedSearchField.trim().toLowerCase()
  const showPayoneerFallback =
    countryField === "USA" &&
    normalizedSearch.length >= 2 &&
    !!PAYONEER_FALLBACK_BANK.name?.toLowerCase().startsWith(normalizedSearch)

  const displayedBanks = showPayoneerFallback
    ? [
        ...(banks.data?.content?.filter(
          (bank) => bank.id !== PAYONEER_FALLBACK_BANK.id
        ) ?? []),
        PAYONEER_FALLBACK_BANK,
      ]
    : (banks.data?.content ?? [])

  return (
    <>
      {plaid.plaidLinkError && (
        <Alert type="danger" className="mb-2">
          {t("bankErrors.plaidLinkError")}
        </Alert>
      )}
      {plaid.isTokenError && (
        <Alert type="danger" className="mb-2">
          {t("bankErrors.tokenError")}
        </Alert>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <div className="w-auto">
            <Select
              name="country"
              control={control}
              options={CountryService.getCompactSelectOptions(
                SUPPORTED_COUNTRIES as unknown as string[]
              )}
              defaultValue={auth.organisation?.countryCode}
            />
          </div>
          <div className="flex-1">
            <Input
              name="search"
              placeholder={t(
                isMobile
                  ? "BankAccountCountrySearchableList.searchMobile"
                  : "BankAccountCountrySearchableList.search"
              )}
              className="mt-0"
              inputClassName="pt-4 pr-4 pb-4 pl-4"
              icon={<Search />}
              control={control}
            />
          </div>
        </div>

        {banks.isLoading && (
          <div className="my-4">
            <Loader />
          </div>
        )}

        {banks.isSuccess && displayedBanks.length !== 0 && (
          <CardV2
            title={
              debouncedSearchField
                ? t("BankAccountCountrySearchableList.searchResults")
                : t("common:SearchableList.frequentlySelected")
            }
          >
            {displayedBanks.map((item) => {
              const logoUrl = pickBankLogo(item)
              return (
                <ListItemLarge
                  variant="transparent"
                  key={item.id}
                  more={{
                    type: "button",
                    onClick: async () => {
                      const platform = bankingPlatforms.find(
                        (x) => x.systemId === item.systemId
                      )

                      trackEvent({
                        category: "connections",
                        name: "bank-list",
                        action: "clicked",
                        customFields: {
                          name: platform?.name || "",
                          category: platform?.category || "",
                          country: countryField || "",
                          bank: item.name!,
                          institutionId: item.id!,
                        },
                      })

                      if (platform?.systemId === platforms.Plaid.systemId) {
                        plaid.openWithInstitution(item.id)
                        return
                      }

                      const consentCountry = item.country ?? countryField
                      const qs = `country=${consentCountry}&institutionId=${item.id}`

                      await navigate(
                        location.pathname.includes("onboarding")
                          ? `${ONBOARDING_BASE_PATH}/consent/${platforms.Yapily.systemId.toLowerCase()}?${qs}`
                          : `/connections/add/consent/${platforms.Yapily.systemId.toLowerCase()}?${qs}`
                      )
                    },
                  }}
                  icon={
                    logoUrl ? <img src={logoUrl} alt={item.name} /> : undefined
                  }
                  title={item.name}
                  initialIcon={logoUrl ? undefined : initials(item.name || "")}
                />
              )
            })}
          </CardV2>
        )}

        {banks.isSuccess && displayedBanks.length === 0 && (
          <>
            {searchField.length > 0 && (
              <Alert type="warning">
                <Trans
                  ns="connections"
                  i18nKey={
                    countries.some(
                      (item) =>
                        item["alpha-3"] === countryField &&
                        item.systemId === "SALTEDGE"
                    )
                      ? "BankAccountCountrySearchableList.noResultsAlternative"
                      : onSkip
                        ? "BankAccountCountrySearchableList.noResults"
                        : "BankAccountCountrySearchableList.noResultsPortal"
                  }
                  components={[
                    <Button
                      key="button"
                      type="button"
                      variant="link"
                      onClick={onSkip}
                    >
                      foo
                    </Button>,
                  ]}
                />
              </Alert>
            )}
            {countries.some(
              (item) =>
                item["alpha-3"] === countryField && item.systemId === "SALTEDGE"
            ) && (
              <CardV2
                title={t(
                  "BankAccountCountrySearchableList.alternativeProviders"
                )}
              >
                <ListItemLarge
                  variant="transparent"
                  more={{
                    type: "button",
                    onClick: async () => {
                      trackEvent({
                        category: "connections",
                        name: "bank-list",
                        action: "alternative-clicked",
                        customFields: {
                          name: platforms.Saltedge.name,
                          category: platforms.Saltedge.category,
                          country: countryField || "",
                        },
                      })
                      await handleOpenAuthorizationProvider(platforms.Saltedge)
                    },
                  }}
                  icon={<img src={SaltedgeLogo} alt="Salt Edge" />}
                  title="Salt Edge"
                />
              </CardV2>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default BankAccountCountrySearchableList
