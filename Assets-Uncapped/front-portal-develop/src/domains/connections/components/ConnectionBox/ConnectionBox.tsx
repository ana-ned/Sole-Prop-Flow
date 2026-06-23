import { useState } from "react"
import { ChevronRight } from "@material-ui/icons"
import clsx from "clsx"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router"
import { twMerge } from "tailwind-merge"
import { buttonVariants } from "../../../../components/Basic/Button/Button"
import Typography from "../../../../components/Basic/Typography"
import Chip from "../../../../components/UI/Chip"
import ListItemLarge from "../../../../components/UI/ListItemLarge"
import useAuth from "../../../../hooks/useAuth"
import useBrowserStorage from "../../../../hooks/useBrowserStorage"
import useDeal from "../../../../hooks/useDeal"
import countries from "../../../../models/countries"
import {
  ConnectionResponse,
  ConnectionResponseStatusEnum,
} from "../../../../services/api/connections"
import { ReactComponent as MoreHorizIcon } from "../../../../svgs/more-horiz.svg"
import { titleCase } from "../../../../utils/string"
import {
  ONBOARDING_BASE_PATH,
  OnboardingMenuPaths,
} from "../../../onboarding/constants"
import useConnections, { isBankConnection } from "../../hooks/useConnections"
import platforms from "../../models/platforms"
import ConnectionDeleteModal from "../Modals/ConnectionDelete"
import { getAmazonShopId } from "./ConnectionBox.utils"
import ConnectionDetailsModal from "./ConnectionDetailsModal"
import ConnectionErrorModal from "./ConnectionErrorModal"

enum ModalType {
  ActionMenu,
  ConnectionDelete,
}

const StatusChip = ({
  connection,
  isAnalyzing,
}: {
  connection: ConnectionResponse
  isAnalyzing: boolean
}) => {
  const { t } = useTranslation("connections", {
    keyPrefix: "components.ConnectionBox",
  })

  const getChipLabel = (connection: ConnectionResponse) => {
    if (connection.systemId === platforms.AmazonV2.systemId) {
      return `${connection.displayName?.slice(0, connection.displayName.lastIndexOf(" "))} ${t("status.connected")}`
    }

    if (connection.systemId === platforms.WalmartV2.systemId) {
      // @ts-expect-error swagger mapping [key: string]
      return `${countries.find((el) => el["alpha-2"] == connection.data.countryCode)?.name} ${t("status.connected")}`
    }

    return t("status.connected")
  }

  if (isAnalyzing) {
    return <Chip label={t("status.analyzing")} color="default" />
  }

  if (
    connection.status === ConnectionResponseStatusEnum.Connecting ||
    connection.status === ConnectionResponseStatusEnum.Connected
  ) {
    return <Chip label={getChipLabel(connection)} color="success" />
  }

  if (connection.status === ConnectionResponseStatusEnum.Error) {
    return <Chip label={t("status.error")} color="danger" />
  }

  return <Chip label={titleCase(connection.status)} color="default" />
}

const ConnectionBox = ({
  connection,
  isAnalyzing,
  dense,
}: {
  connection: ConnectionResponse
  isAnalyzing?: boolean
  dense?: boolean
}) => {
  const { handleDeleteConnection } = useConnections()
  const auth = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [modal, setModal] = useState<ModalType | null>(null)
  const { t } = useTranslation("connections", {
    keyPrefix: "components.ConnectionBox",
  })
  const [cachedConnections, setConnectionsCache] = useBrowserStorage<
    ConnectionResponse[]
  >(auth.organisation?.organisationId, "connections_v3")
  const deal = useDeal()

  const model = Object.values(platforms).find(
    ({ systemId }) => systemId === connection.systemId
  )

  const isError = connection.status === ConnectionResponseStatusEnum.Error
  const afterTitle =
    connection.systemId === platforms.AmazonV2.systemId
      ? getAmazonShopId(connection.displayName)
      : connection.displayName

  return (
    <>
      <ListItemLarge
        variant="transparent"
        className={clsx({ "!min-h-0 !p-2": dense })}
        error={isError}
        title={
          <>
            <b>{connection.title}</b>
            {!!connection.title && !!afterTitle ? " - " : ""}
            <span>{afterTitle}</span>
          </>
        }
        subtitle={
          <StatusChip connection={connection} isAnalyzing={!!isAnalyzing} />
        }
        initialIcon={connection.title || "X"}
        icon={
          model && "iconUrl" in model ? (
            <img src={model.iconUrl} alt={model.name} />
          ) : undefined
        }
        more={{
          type: "element",
          element: isError ? (
            dense ? (
              <span
                className={twMerge(
                  buttonVariants({ variant: "primary" }),
                  "min-w-[120px]"
                )}
              >
                {t("resolve")}
              </span>
            ) : (
              <Typography type="smallTitle" color="error-600">
                {t("resolve")}
              </Typography>
            )
          ) : isBankConnection(connection) ? (
            <ChevronRight />
          ) : (
            <MoreHorizIcon />
          ),
          onClick: () => {
            setModal(ModalType.ActionMenu)
          },
        }}
      />

      <ConnectionErrorModal
        isOpen={isError && modal === ModalType.ActionMenu}
        onClose={() => {
          setModal(null)
        }}
        onDelete={() => {
          setModal(ModalType.ConnectionDelete)
        }}
        connection={connection}
      />

      <ConnectionDetailsModal
        isOpen={!isError && modal === ModalType.ActionMenu}
        onClose={() => {
          setModal(null)
        }}
        onDelete={() => {
          setModal(ModalType.ConnectionDelete)
        }}
        connection={connection}
      />

      <ConnectionDeleteModal
        isOpen={modal === ModalType.ConnectionDelete}
        onClose={() => {
          setModal(null)
        }}
        onSubmit={async () => {
          handleDeleteConnection.mutate(connection.id!)
          setConnectionsCache(
            cachedConnections?.filter((c) => c.id !== connection.id)
          )
          setModal(null)

          if (
            model &&
            !("automatic" in model) &&
            location.pathname.includes(ONBOARDING_BASE_PATH)
          ) {
            if (
              connection.type === "ACCOUNTING" &&
              !location.pathname.includes(OnboardingMenuPaths.Accounting)
            ) {
              await navigate(OnboardingMenuPaths.Accounting, {
                state: {
                  nextPath: location.pathname,
                },
              })
            } else if (connection.type === "SALES") {
              if (
                deal.isAmazonSeller &&
                connection.systemId === platforms.AmazonV2.systemId &&
                !location.pathname.includes(OnboardingMenuPaths.SalesAmazon)
              ) {
                await navigate(OnboardingMenuPaths.SalesAmazon, {
                  state: {
                    nextPath: location.pathname,
                  },
                })
              } else if (
                !location.pathname.includes(OnboardingMenuPaths.Sales)
              ) {
                await navigate(OnboardingMenuPaths.Sales, {
                  state: {
                    nextPath: location.pathname,
                  },
                })
              }
            } else if (
              connection.type === "BANK" &&
              !location.pathname.includes(OnboardingMenuPaths.Banking)
            ) {
              await navigate(OnboardingMenuPaths.Banking, {
                state: {
                  nextPath: location.pathname,
                },
              })
            }
          } else if (
            model &&
            !("automatic" in model) &&
            auth.organisationData?.onboardingFinished &&
            auth.organisation?.activated &&
            !location.pathname.includes("/connections")
          ) {
            await navigate("/connections")
          }
        }}
      />
    </>
  )
}

export default ConnectionBox
