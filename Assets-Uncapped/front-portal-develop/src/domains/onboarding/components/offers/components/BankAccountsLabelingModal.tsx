import { HugeiconsIcon } from "@hugeicons/react"
import { CreditCardSolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../../components/Basic/BoxIcon"
import Button from "../../../../../components/Basic/Button"
import SanitizedHtml from "../../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../../components/Basic/Typography"
import Alert from "../../../../../components/UI/Alert"
import Modal from "../../../../../components/UI/Modal"
import useAuth from "../../../../../hooks/useAuth"
import { useTracking } from "../../../../../hooks/useTracking"
import apiConfig, {
  ApiServicesEnum,
} from "../../../../../services/api/api-config"
import {
  BankAccountLabel,
  BankAccountLabelLabelEnum,
  BankAccountsControllerApi,
  DataVerificationResultTypeEnum,
} from "../../../../../services/api/underwriting"
import useBankAccountsLabels, {
  getQueryKeyForBankAccountLabels,
} from "../../../hooks/useBankAccountsLabels"
import useBankVerification from "../../../hooks/useBankVerification"

const BankAccountsLabelingModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const auth = useAuth()
  const bankVerification = useBankVerification()
  const { t } = useTranslation("onboarding", {
    keyPrefix: "banking.modals.BankAccountsLabelingModal",
  })
  const queryClient = useQueryClient()
  const bankAccountsLabels = useBankAccountsLabels({
    enabled: bankVerification.data.some(
      (item) => item.type === DataVerificationResultTypeEnum.MissingBankAccounts
    ),
  })
  const { trackEvent } = useTracking()

  const mutation = useMutation({
    mutationFn: async (bankAccountLabel: BankAccountLabel[]) => {
      return new BankAccountsControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Underwriting,
        })
      ).setBankAccountsLabels({
        xXORGID: auth.organisation?.organisationId!,
        bankAccountLabel,
      })
    },
    onMutate(variables) {
      queryClient.setQueryData(
        getQueryKeyForBankAccountLabels(),
        (old: BankAccountLabel[]) => {
          trackEvent({
            category: "onboarding",
            name: "missing-bank-accounts-modal",
            action: "labelled",
            customFields: {
              value: variables[0].label?.toLowerCase() ?? "cleared",
            },
          })
          const current = Array.isArray(old) ? old : []
          const mask = variables[0].mask
          const label = variables[0].label

          let updated: BankAccountLabel[]
          const index = current.findIndex((item) => item.mask === mask)

          if (label === undefined) {
            updated = current.filter((item) => item.mask !== mask)
          } else if (index === -1) {
            updated = [
              ...current,
              {
                ...variables[0],
              },
            ]
          } else {
            updated = current.map((item, i) =>
              i === index ? { ...item, label: label } : item
            )
          }

          return updated
        }
      )
    },
  })

  const accounts = bankVerification.data.find(
    (item) => item.type === DataVerificationResultTypeEnum.MissingBankAccounts
  )?.details?.missingAccounts

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onClose={() => {
        trackEvent({
          category: "onboarding",
          name: "missing-bank-accounts-modal",
          action: "close",
        })
        onClose()
      }}
    >
      <div className="space-y-4">
        <Typography type="h5" color="neutral-900" className="text-center">
          {t("title")}
        </Typography>

        <Alert type="danger">
          <SanitizedHtml as="span" content={t("content")} />
        </Alert>

        <div className="space-y-2">
          {accounts?.map((item) => (
            <div
              className="shadow-light-sm border-card flex flex-col items-center gap-2 rounded-lg bg-white p-2 md:flex-row"
              key={item}
            >
              <div className="flex w-full grow items-center gap-2 text-sm">
                <BoxIcon
                  severity="accent-5"
                  icon={<HugeiconsIcon icon={CreditCardSolidStandard} />}
                />
                <SanitizedHtml
                  as="p"
                  content={t("itemTitle", { lastFourDigits: item.slice(-4) })}
                />
              </div>

              <div className="flex w-full gap-2 md:w-auto">
                <Button
                  variant={
                    bankAccountsLabels.data?.find((el) => el.mask === item)
                      ?.label === BankAccountLabelLabelEnum.Personal
                      ? "primary"
                      : "secondary"
                  }
                  type="button"
                  onClick={() => {
                    mutation.mutate([
                      {
                        mask: item,
                        label:
                          bankAccountsLabels.data?.find(
                            (el) => el.mask === item
                          )?.label === BankAccountLabelLabelEnum.Personal
                            ? undefined
                            : BankAccountLabelLabelEnum.Personal,
                      },
                    ])
                  }}
                >
                  {t("actions.personal")}
                </Button>
                <Button
                  variant={
                    bankAccountsLabels.data?.find((el) => el.mask === item)
                      ?.label === BankAccountLabelLabelEnum.Unrecognised
                      ? "primary"
                      : "secondary"
                  }
                  type="button"
                  onClick={() => {
                    mutation.mutate([
                      {
                        mask: item,
                        label:
                          bankAccountsLabels.data?.find(
                            (el) => el.mask === item
                          )?.label === BankAccountLabelLabelEnum.Unrecognised
                            ? undefined
                            : BankAccountLabelLabelEnum.Unrecognised,
                      },
                    ])
                  }}
                >
                  {t("actions.unrecognized")}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          onClick={() => {
            trackEvent({
              category: "onboarding",
              name: "missing-bank-accounts-modal",
              action: "submit",
            })
            onClose()
          }}
        >
          {t("submit")}
        </Button>
      </div>
    </Modal>
  )
}

export default BankAccountsLabelingModal
