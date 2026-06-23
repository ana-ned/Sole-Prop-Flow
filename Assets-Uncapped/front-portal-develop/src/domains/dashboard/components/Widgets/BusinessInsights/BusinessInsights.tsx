import { useFlag } from "@unleash/proxy-client-react"
import { HugeiconsIcon } from "@hugeicons/react"
import { BarChartSolidRounded } from "@hugeicons-pro/core-solid-rounded"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../../components/Basic/BoxIcon"
import Button from "../../../../../components/Basic/Button"
import Typography from "../../../../../components/Basic/Typography"
import Chip from "../../../../../components/UI/Chip"
import Widget from "../../../../../components/UI/Widget"
import useAuth, { getUserOverviewQueryKey } from "../../../../../hooks/useAuth"
import useTrackExperiment, {
  useTrackExperimentViewed,
} from "../../../../../hooks/useTrackExperiment"
import chart1 from "./chart-1.svg"
import chart2 from "./chart-2.svg"
import { UserPreferencesControllerApi } from "../../../../../services/api/organisation-users"
import apiConfig, {
  ApiServicesEnum,
} from "../../../../../services/api/api-config"

const EXPERIMENT_NAME = "ROME-1689-Insights-Fake-Door"

const BusinessInsights = () => {
  const { t } = useTranslation("dashboard", {
    keyPrefix: "widgets.businessInsights",
  })
  const auth = useAuth()
  const queryClient = useQueryClient()

  const isVariantB = useFlag(EXPERIMENT_NAME)
  const { trackExperimentConverted } = useTrackExperiment()

  const variant = isVariantB ? "B" : "A"
  const title = isVariantB ? t("titleVariant") : t("title")

  useTrackExperimentViewed({
    name: EXPERIMENT_NAME,
    variant,
    fallbackOnTimeout: true,
  })

  const join = useMutation({
    mutationFn: async () =>
      new UserPreferencesControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.OrganisationUsers,
        })
      ).saveUserPreferences({
        xXORGID: auth.organisation?.organisationId!,
        userPreferencesDto: {
          insightsJoinedWaitlistAt: new Date().toISOString(),
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUserOverviewQueryKey(auth.organisation?.organisationId!),
      })
      trackExperimentConverted(EXPERIMENT_NAME, variant)
    },
  })

  const hasJoined =
    auth.userData?.preferences?.insightsJoinedWaitlistAt !== undefined

  return (
    <Widget
      icon={
        <BoxIcon
          severity="accent-brand"
          icon={<HugeiconsIcon icon={BarChartSolidRounded} />}
        />
      }
      title={
        <div className="flex items-center gap-x-2">
          <Typography type="bodyTitle">{title}</Typography>
          <Chip
            color={hasJoined ? "success" : "warning"}
            label={hasJoined ? t("onWaitlist") : t("comingSoon")}
          />
        </div>
      }
      actionComponent={
        hasJoined ? null : (
          <Button
            type="button"
            size="sm"
            loading={join.isPending}
            onClick={() => join.mutate()}
          >
            <span className="sm:hidden">{t("joinShort")}</span>
            <span className="hidden sm:inline">{t("join")}</span>
          </Button>
        )
      }
    >
      <Typography type="smallCopy">
        {hasJoined
          ? t("joinedDescription", { title })
          : isVariantB
            ? t("descriptionVariant")
            : t("description")}
      </Typography>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[chart1, chart2].map((src) => (
          <div
            key={src}
            className="shadow-light-sm bg-surface-default rounded-card-md border-card overflow-hidden"
          >
            <img src={src} alt="" className="h-auto w-full" />
          </div>
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-white via-white/40 to-transparent"
      />
    </Widget>
  )
}

export default BusinessInsights
