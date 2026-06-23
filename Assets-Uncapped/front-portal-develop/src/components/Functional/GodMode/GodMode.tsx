import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Building03SolidStandard,
  Cancel01SolidStandard,
  Copy01SolidStandard,
  Settings02SolidStandard,
  ShieldUserSolidStandard,
  UserSwitchSolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { useForm } from "react-hook-form"
import useAuth from "../../../hooks/useAuth"
import useTheme from "../../../hooks/useTheme"
import { saveToClipboard } from "../../../utils/clipboard"
import { getThemePrimaryId, isValidTheme, THEMES } from "../../../utils/themes"
import Button from "../../Basic/Button"
import SiteOverlay from "../../Basic/SiteOverlay"
import Typography from "../../Basic/Typography"
import CardV2 from "../../UI/CardV2"
import Chip from "../../UI/Chip"
import Select from "../../Forms/Select"
import OrganisationSelector from "./GodMode/OrganisationSelector"
import PartnerSelector from "./GodMode/PartnerSelector"

const GodMode = () => {
  const [active, setActive] = useState<boolean>(false)
  const { organisation, impersonateAsPartner, isGod, canImpersonateAsPartner } =
    useAuth()
  const [theme, setTheme] = useTheme()

  const themeForm = useForm({
    defaultValues: {
      theme: theme,
    },
  })

  if (!isGod) {
    return null
  }

  const currentId =
    impersonateAsPartner?.id || organisation?.organisationId || "—"
  const currentName =
    impersonateAsPartner?.name || organisation?.organisationName || "Unknown"
  const entityType = impersonateAsPartner ? "Partner" : "Organisation"

  const handleCopyId = () => {
    if (currentId !== "—") {
      void saveToClipboard(currentId)
    }
  }

  return (
    <div className="fixed top-[env(safe-area-inset-top,0)] right-0 z-(--overlay-z-index)">
      <button
        type="button"
        onClick={() => setActive(!active)}
        className="border-brand-700 bg-brand-600 hover:bg-brand-700 flex items-center gap-2 rounded-bl-lg border border-t-0 border-r-0 border-solid px-3 py-2 text-white shadow-lg transition-all"
        data-testid="god-mode-button"
      >
        <HugeiconsIcon
          icon={ShieldUserSolidStandard}
          size={16}
          className="shrink-0"
        />
        <span className="max-w-48 truncate font-mono text-xs">{currentId}</span>
      </button>

      <SiteOverlay isOpen={active}>
        <div className="container mt-4 lg:mt-13">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-brand-600 flex size-10 items-center justify-center rounded-lg">
                <HugeiconsIcon
                  icon={ShieldUserSolidStandard}
                  size={20}
                  color="white"
                />
              </div>
              <Typography type="h5">God Mode</Typography>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setActive(false)}
              ariaLabel="Close God Mode"
            >
              <HugeiconsIcon icon={Cancel01SolidStandard} />
            </Button>
          </div>

          <div className="mt-6 space-y-6 lg:mt-8">
            <CardV2
              title="Current Identity"
              icon={<HugeiconsIcon icon={Building03SolidStandard} />}
              severity="accent-brand"
              actions={
                <Chip
                  label={entityType}
                  color={impersonateAsPartner ? "warning" : "success"}
                />
              }
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Typography type="bodyTitle">{currentName}</Typography>
                  <code className="mt-1 inline-block rounded bg-neutral-100 px-2 py-0.5 font-mono text-xs text-neutral-600">
                    {currentId}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="text-brand-600 flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-solid border-neutral-200 bg-white px-2.5 py-1.5 text-xs transition-colors hover:bg-neutral-50"
                >
                  <HugeiconsIcon icon={Copy01SolidStandard} size={14} />
                  Copy ID
                </button>
              </div>
            </CardV2>

            <CardV2
              title="Switch Identity"
              icon={<HugeiconsIcon icon={UserSwitchSolidStandard} />}
              severity="accent-3"
            >
              <div className="space-y-4">
                <OrganisationSelector />
                {canImpersonateAsPartner && <PartnerSelector />}
              </div>
            </CardV2>

            <CardV2
              title="Theme"
              icon={<HugeiconsIcon icon={Settings02SolidStandard} />}
              severity="accent-5"
            >
              <Select
                name="theme"
                control={themeForm.control}
                options={THEMES.map((themeConfig) => ({
                  value: getThemePrimaryId(themeConfig.id),
                  label: themeConfig.label,
                }))}
                onChange={(selected) => {
                  const themeValue = selected.value
                  if (isValidTheme(themeValue)) {
                    setTheme(themeValue)
                    setActive(false)
                  }
                }}
              />
            </CardV2>
          </div>
        </div>
      </SiteOverlay>
    </div>
  )
}

export default GodMode
