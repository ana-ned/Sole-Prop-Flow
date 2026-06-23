import { useEffect, useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router"
import { toast } from "react-toastify"
import * as yup from "yup"
import Button from "../../../../../components/Basic/Button"
import ButtonGroup from "../../../../../components/Basic/ButtonGroup"
import Typography from "../../../../../components/Basic/Typography"
import ListItemContainer from "../../../../../components/Collections/ListItemContainer"
import PageLoader from "../../../../../components/Collections/PageLoader"
import DateMonthYearInput from "../../../../../components/Forms/DateMonthYearInput"
import FormControl from "../../../../../components/Forms/FormControl"
import Input from "../../../../../components/Forms/Input"
import MoneyFields from "../../../../../components/Forms/MoneyFields"
import MultipleRadio from "../../../../../components/Forms/MultipleRadio"
import Select from "../../../../../components/Forms/Select"
import { StepProps } from "../../../../../components/Headless/MultistepForm"
import CheckList from "../../../../../components/UI/CheckList"
import Confirmation from "../../../../../components/UI/Confirmation"
import FormLayout from "../../../../../components/UI/FormLayout/FormLayout"
import Modal from "../../../../../components/UI/Modal"
import PageBar from "../../../../../components/UI/PageBar"
import useAuth from "../../../../../hooks/useAuth"
import useDeal from "../../../../../hooks/useDeal"
import useDevice from "../../../../../hooks/useDevice"
import { useTracking } from "../../../../../hooks/useTracking"
import i18n from "../../../../../inits/i18next"
import apiConfig, {
  ApiServicesEnum,
} from "../../../../../services/api/api-config"
import { DealDetailsResponseTierEnum } from "../../../../../services/api/hubspot"
import {
  OutstandingDebtDocumentControllerApi,
  OutstandingDebtDocumentRequest,
  OutstandingDebtDocumentRequestRepaymentTypeEnum,
  OutstandingDebtDocumentRequestSecurityTypeEnum,
} from "../../../../../services/api/organisation-users"
import { OutstandingDebtDocumentControllerApi as PartnersOutstandingDebtDocumentControllerApi } from "../../../../../services/api/partners"
import { ReactComponent as PlusIcon } from "../../../../../svgs/plus.svg"
import DateFormat from "../../../../../utils/validator-rules/date-format"
import DateFuture from "../../../../../utils/validator-rules/date-future"
import useApplicationDetails from "../../../../partner-application/hooks/useApplicationDetails"
import useOutstandingDebt, {
  DEBT_LIST_QUERY_KEY,
} from "../../../hooks/useOutstandingDebt"
import OnboardingLayout from "../../OnboardingLayout"
import { DocumentsDebtStepProps } from "./documents-debt.model"
import DocumentsDebtListItem from "./DocumentsDebtListItem"

const DocumentsDebt = ({
  data,
  onBack,
  setCustomSubmit,
  setStep,
}: StepProps<DocumentsDebtStepProps>) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "documents.outstandingDebt",
  })
  const queryClient = useQueryClient()
  const { id } = useParams<{ id?: string }>()
  const auth = useAuth()
  const { trackEvent } = useTracking()
  const uploadedDocumentDebtId = data?.uploadedDocumentDebtId
  const { debtList } = useOutstandingDebt({ id })
  const { isDesktop } = useDevice()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const partnerApplicationDetails = useApplicationDetails(id)
  const deal = useDeal()

  const requiresSecurityType =
    deal.data?.tier === DealDetailsResponseTierEnum.Big || !!auth.partnerId

  const uploadDebtMutation = useMutation({
    mutationFn: async (
      outstandingDebtDocumentRequest: OutstandingDebtDocumentRequest
    ) => {
      return auth.partnerId
        ? new PartnersOutstandingDebtDocumentControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.Partners,
            })
          ).uploadOutstandingDebt({
            applicationId: id!,
            xXPARTNERID: auth.partnerId,
            outstandingDebtDocumentRequest,
          })
        : new OutstandingDebtDocumentControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.OrganisationUsers,
            })
          ).uploadOutstandingDebt({
            xXORGID: auth.organisation?.organisationId!,
            outstandingDebtDocumentRequest,
          })
    },
    onSuccess: async () => {
      toast.success(t("added"))
      await queryClient.invalidateQueries({ queryKey: [DEBT_LIST_QUERY_KEY] })
      setCustomSubmit?.({ uploadedDocumentDebtId: undefined }, 2)
      reset({})
    },
    onError: () => {
      toast.error(i18n.t("common:defaultErrorMessage"))
    },
  })

  const updateDebtMutation = useMutation({
    mutationFn: async ({
      outstandingDebtDocumentRequest,
      uploadedDocumentId,
    }: {
      outstandingDebtDocumentRequest: OutstandingDebtDocumentRequest
      uploadedDocumentId: string
    }) => {
      return auth.partnerId
        ? new PartnersOutstandingDebtDocumentControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.Partners,
            })
          ).updateOutstandingDebt({
            applicationId: id!,
            xXPARTNERID: auth.partnerId,
            uploadedDocumentId,
            outstandingDebtDocumentRequest,
          })
        : new OutstandingDebtDocumentControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.OrganisationUsers,
            })
          ).updateOutstandingDebt({
            uploadedDocumentId,
            xXORGID: auth.organisation?.organisationId!,
            outstandingDebtDocumentRequest,
          })
    },
    onSuccess: async () => {
      toast.success(t("updated"))
      await queryClient.invalidateQueries({ queryKey: [DEBT_LIST_QUERY_KEY] })
      onBack?.()
    },
    onError: () => {
      toast.error(i18n.t("common:defaultErrorMessage"))
    },
  })

  const deleteDebtMutation = useMutation({
    mutationFn: async (uploadedOutstandingDebtId: string) =>
      auth.partnerId
        ? new PartnersOutstandingDebtDocumentControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.Partners,
            })
          ).deleteOutstandingDebt({
            applicationId: id!,
            xXPARTNERID: auth.partnerId,
            uploadedDocumentId: uploadedOutstandingDebtId,
          })
        : new OutstandingDebtDocumentControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.OrganisationUsers,
            })
          ).deleteOutstandingDebt({
            xXORGID: auth.organisation?.organisationId!,
            uploadedDocumentId: uploadedOutstandingDebtId,
          }),
    onSuccess: async () => {
      toast.success(t("deleted"))
      await queryClient.invalidateQueries({ queryKey: [DEBT_LIST_QUERY_KEY] })
      onBack?.()
    },
    onError: () => {
      toast.error(i18n.t("common:defaultErrorMessage"))
    },
  })

  const { control, formState, handleSubmit, reset, watch, setValue, trigger } =
    useForm({
      resolver: yupResolver(
        yup.object().shape({
          loanProvider: yup.string().required(),
          remainingBalance: yup.object({
            amount: yup
              .number()
              .typeError(({ path }) =>
                t("DocumentsDebt.remainingBalanceError", { field: path })
              )
              .min(1)
              .required(),
            currency: yup.string().required(),
          }),
          repaymentType: yup
            .string()
            .oneOf([
              ...Object.values(OutstandingDebtDocumentRequestRepaymentTypeEnum),
              "other",
            ])
            .required(),
          securityType: yup
            .string()
            .oneOf(
              Object.values(OutstandingDebtDocumentRequestSecurityTypeEnum)
            )
            .when([], {
              is: () => requiresSecurityType,
              then: (s) => s.required(),
            }),
          finalRepayment: yup
            .string()
            .test(DateFormat())
            .test(DateFuture())
            .required(),
          revenueShare: yup
            .number()
            .typeError(({ path }) =>
              t("DocumentsDebt.remainingBalanceError", { field: path })
            )
            .when("repaymentType", {
              is: (
                repaymentType: OutstandingDebtDocumentRequestRepaymentTypeEnum
              ) =>
                repaymentType ===
                OutstandingDebtDocumentRequestRepaymentTypeEnum.RevenueBasedFinancingMca,
              then: (s) => s.min(1).required(),
              otherwise: (s) =>
                s
                  .transform((value) => {
                    if (value === "" || value === null || value === undefined) {
                      return null
                    }
                    const num = Number(value)
                    return Number.isNaN(num) ? null : num
                  })
                  .nullable(),
            }),
          maximumLimit: yup
            .object({
              currency: yup.string(),
              amount: yup.mixed(),
            })
            .when("repaymentType", {
              is: (
                repaymentType: OutstandingDebtDocumentRequestRepaymentTypeEnum
              ) =>
                repaymentType ===
                OutstandingDebtDocumentRequestRepaymentTypeEnum.RevolvingLineOfCredit,
              then: (schema) =>
                schema.shape({
                  currency: yup.string().required(),
                  amount: yup
                    .number()
                    .typeError(({ path }) =>
                      t("DocumentsDebt.remainingBalanceError", { field: path })
                    )
                    .min(1)
                    .required(),
                }),
            }),
          payMethod: yup
            .string()
            .oneOf(["yes", "no"])
            .when("repaymentType", {
              is: (repaymentType: string) => repaymentType === "other",
              then: (s) => s.required(),
            }),
        })
      ),
      mode: "onBlur",
    })

  const repaymentTypeValue = watch("repaymentType")
  const currency = watch("remainingBalance.currency")

  useEffect(() => {
    if (!currency) {
      setValue(
        "remainingBalance.currency",
        auth.organisation?.currencyCode ||
          partnerApplicationDetails.data?.offerDetailsResponse?.currency!
      )
      // @ts-expect-error need to reset it
      setValue("remainingBalance.amount", "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, partnerApplicationDetails.data?.offerDetailsResponse?.currency])

  useEffect(() => {
    if (
      !watch("maximumLimit.currency") &&
      repaymentTypeValue ===
        OutstandingDebtDocumentRequestRepaymentTypeEnum.RevolvingLineOfCredit
    ) {
      setValue("maximumLimit.currency", auth.organisation?.currencyCode)
      setValue("maximumLimit.amount", "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repaymentTypeValue])

  useEffect(() => {
    if (
      uploadedDocumentDebtId &&
      debtList.data?.outstandingDebts?.length &&
      debtList.data.outstandingDebts.some(
        (el) => el.id === uploadedDocumentDebtId
      )
    ) {
      const debt = debtList.data.outstandingDebts.find(
        (el) => el.id === uploadedDocumentDebtId
      )!
      const [repaymentDate] = debt.finalRepayment!.toISOString().split("T")
      reset({
        ...debt,
        finalRepayment: repaymentDate,
        remainingBalance: {
          amount: debt.remainingBalance,
          currency: debt.currency,
        },
        maximumLimit: {
          amount: debt.maximumLimit,
          currency: debt.currency,
        },
      })
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      trigger()
    }
    // This is on purpose - so that re-render toggles at right time!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedDocumentDebtId, reset])

  if (debtList.isLoading || deleteDebtMutation.isPending) {
    return <PageLoader />
  }

  return (
    <OnboardingLayout
      menu={false}
      sidebar={
        isDesktop &&
        !uploadedDocumentDebtId && (
          <OnboardingLayout.Child
            autoHeight
            desktopTitle={
              (debtList.data?.outstandingDebts?.length || 0) > 0
                ? t("DocumentsDebtList.title")
                : undefined
            }
          >
            {(debtList.data?.outstandingDebts?.length || 0) > 0 ? (
              <ListItemContainer className="mt-4">
                {debtList.data?.outstandingDebts?.map((debt) => {
                  return (
                    <DocumentsDebtListItem
                      editable={false}
                      key={debt.id}
                      debt={debt}
                      onClick={(selectedDebt) => {
                        setCustomSubmit?.(
                          { uploadedDocumentDebtId: selectedDebt.id },
                          2
                        )
                      }}
                    />
                  )
                })}
              </ListItemContainer>
            ) : (
              <>
                <Typography type="bodyTitle">
                  {t("DocumentsDebt.why.title")}
                </Typography>
                <CheckList
                  items={t("DocumentsDebt.why.points", { returnObjects: true })}
                  className="mt-6"
                />
              </>
            )}
          </OnboardingLayout.Child>
        )
      }
    >
      <OnboardingLayout.Parent
        pageBar={
          <PageBar
            title={
              uploadedDocumentDebtId
                ? t("DocumentsDebt.headerUpdate")
                : t("DocumentsDebt.header")
            }
            onClickBack={() => {
              trackEvent({
                category: "onboarding",
                name: "documents-debt-form",
                action: "back",
              })
              setStep?.(1)
            }}
            withChat
            desktopHeaderType="h4"
          />
        }
      >
        <FormLayout>
          <form
            onSubmit={handleSubmit((formData) => {
              let repaymentType =
                formData.repaymentType as OutstandingDebtDocumentRequestRepaymentTypeEnum

              if (
                formData.repaymentType === "other" &&
                formData.payMethod === "yes"
              ) {
                repaymentType =
                  OutstandingDebtDocumentRequestRepaymentTypeEnum.Bullet
              }

              if (
                formData.repaymentType === "other" &&
                formData.payMethod === "no"
              ) {
                repaymentType =
                  OutstandingDebtDocumentRequestRepaymentTypeEnum.Amortising
              }

              if (uploadedDocumentDebtId) {
                updateDebtMutation.mutate({
                  outstandingDebtDocumentRequest: {
                    ...formData,
                    remainingBalance: formData.remainingBalance.amount,
                    currency: formData.remainingBalance.currency,
                    maximumLimit: formData.maximumLimit.amount,
                    repaymentType,
                    finalRepayment: new Date(formData.finalRepayment),
                  },
                  uploadedDocumentId: uploadedDocumentDebtId,
                })
              } else {
                uploadDebtMutation.mutate({
                  ...formData,
                  remainingBalance: formData.remainingBalance.amount,
                  currency: formData.remainingBalance.currency,
                  maximumLimit: formData.maximumLimit.amount,
                  repaymentType,
                  finalRepayment: new Date(formData.finalRepayment),
                })
              }

              trackEvent({
                category: "onboarding",
                name: "documents-debt-form",
                action: "form-add-submit",
              })
            })}
          >
            <FormLayout.Content>
              <FormControl>
                <Input
                  control={control}
                  type="text"
                  name="loanProvider"
                  label={t("DocumentsDebt.loanProvider")}
                />
              </FormControl>
              <FormControl>
                <Select
                  label={t("DocumentsDebt.repaymentType")}
                  name="repaymentType"
                  searchable
                  options={[
                    {
                      value:
                        OutstandingDebtDocumentRequestRepaymentTypeEnum.Amortising,
                      label: t(
                        "DocumentsDebt.repaymentTypeOptions.amortising.title"
                      ),
                      sub: t(
                        "DocumentsDebt.repaymentTypeOptions.amortising.description"
                      ),
                    },
                    {
                      value:
                        OutstandingDebtDocumentRequestRepaymentTypeEnum.Bullet,
                      label: t(
                        "DocumentsDebt.repaymentTypeOptions.bullet.title"
                      ),
                      sub: t(
                        "DocumentsDebt.repaymentTypeOptions.bullet.description"
                      ),
                    },
                    {
                      value:
                        OutstandingDebtDocumentRequestRepaymentTypeEnum.RevolvingLineOfCredit,
                      label: t(
                        "DocumentsDebt.repaymentTypeOptions.revolving.title"
                      ),
                      sub: t(
                        "DocumentsDebt.repaymentTypeOptions.revolving.description"
                      ),
                    },
                    {
                      value:
                        OutstandingDebtDocumentRequestRepaymentTypeEnum.ConvertibleLoan,
                      label: t(
                        "DocumentsDebt.repaymentTypeOptions.convertible.title"
                      ),
                      sub: t(
                        "DocumentsDebt.repaymentTypeOptions.convertible.description"
                      ),
                    },
                    {
                      value:
                        OutstandingDebtDocumentRequestRepaymentTypeEnum.RevenueBasedFinancingMca,
                      label: t(
                        "DocumentsDebt.repaymentTypeOptions.revenueBasedFinancing.title"
                      ),
                      sub: t(
                        "DocumentsDebt.repaymentTypeOptions.revenueBasedFinancing.description"
                      ),
                    },
                    {
                      value: "other",
                      label: t(
                        "DocumentsDebt.repaymentTypeOptions.other.title"
                      ),
                      sub: t(
                        "DocumentsDebt.repaymentTypeOptions.other.description"
                      ),
                    },
                  ]}
                  control={control}
                />
              </FormControl>
              <FormControl>
                <MoneyFields
                  order={1}
                  control={control}
                  prefix="remainingBalance"
                  label={t("DocumentsDebt.remainingBalance")}
                  watch={watch}
                />
              </FormControl>
              {repaymentTypeValue === "other" && (
                <FormControl>
                  <MultipleRadio
                    label={t("DocumentsDebt.payMethod")}
                    name="payMethod"
                    options={[
                      {
                        value: "yes",
                        label: t("DocumentsDebt.payMethodYes"),
                      },
                      {
                        value: "no",
                        label: t("DocumentsDebt.payMethodNo"),
                      },
                    ]}
                    control={control}
                  />
                </FormControl>
              )}
              {repaymentTypeValue ===
                OutstandingDebtDocumentRequestRepaymentTypeEnum.RevolvingLineOfCredit && (
                <FormControl>
                  <MoneyFields
                    order={2}
                    control={control}
                    prefix="maximumLimit"
                    label={t("DocumentsDebt.maximumLimit")}
                    watch={watch}
                  />
                </FormControl>
              )}
              {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
              {repaymentTypeValue && (
                <FormControl>
                  <DateMonthYearInput
                    control={control}
                    name="finalRepayment"
                    label={(() => {
                      switch (repaymentTypeValue) {
                        case OutstandingDebtDocumentRequestRepaymentTypeEnum.RevenueBasedFinancingMca: {
                          return t("DocumentsDebt.expectedFinalRepayment")
                        }
                        case OutstandingDebtDocumentRequestRepaymentTypeEnum.ConvertibleLoan: {
                          return t("DocumentsDebt.expectedMaturity")
                        }
                        case OutstandingDebtDocumentRequestRepaymentTypeEnum.RevolvingLineOfCredit: {
                          return t("DocumentsDebt.renewalDate")
                        }
                        default: {
                          return t("DocumentsDebt.finalRepayment")
                        }
                      }
                    })()}
                  />
                </FormControl>
              )}
              {repaymentTypeValue ===
                OutstandingDebtDocumentRequestRepaymentTypeEnum.RevenueBasedFinancingMca && (
                <FormControl>
                  <Input
                    control={control}
                    type="number"
                    name="revenueShare"
                    label={t("DocumentsDebt.revenueShare")}
                  />
                </FormControl>
              )}
              {requiresSecurityType && (
                <FormControl>
                  <MultipleRadio
                    label={t("DocumentsDebt.securityType")}
                    name="securityType"
                    options={[
                      {
                        value:
                          OutstandingDebtDocumentRequestSecurityTypeEnum.Secured,
                        label: t("DocumentsDebt.securityTypeOptions.secured"),
                        sub: t(
                          "DocumentsDebt.securityTypeOptions.secured_description"
                        ),
                      },
                      {
                        value:
                          OutstandingDebtDocumentRequestSecurityTypeEnum.Unsecured,
                        label: t("DocumentsDebt.securityTypeOptions.unsecured"),
                        sub: t(
                          "DocumentsDebt.securityTypeOptions.unsecured_description"
                        ),
                      },
                    ]}
                    control={control}
                  />
                </FormControl>
              )}
            </FormLayout.Content>
            <FormLayout.Footer>
              <ButtonGroup>
                <Button
                  loading={
                    uploadDebtMutation.isPending ||
                    updateDebtMutation.isPending ||
                    deleteDebtMutation.isPending
                  }
                  type="submit"
                  disabled={!formState.isValid}
                >
                  {uploadedDocumentDebtId ? null : <PlusIcon />}
                  {uploadedDocumentDebtId
                    ? t("DocumentsDebt.submitUpdate")
                    : t("DocumentsDebt.submit")}
                </Button>
                {!!uploadedDocumentDebtId && (
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => {
                        setDeleteModalVisible(true)
                      }}
                    >
                      {t("DocumentsDebt.delete")}
                    </Button>
                  </div>
                )}

                {!uploadedDocumentDebtId &&
                  !!debtList.data?.outstandingDebts?.length && (
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => {
                          onBack?.()
                        }}
                      >
                        {t("DocumentsDebt.finish")}
                      </Button>
                    </div>
                  )}
              </ButtonGroup>
            </FormLayout.Footer>
          </form>
        </FormLayout>
      </OnboardingLayout.Parent>
      <Modal isOpen={deleteModalVisible}>
        <Confirmation
          type="warning"
          title={t("DocumentsDebt.deleteModal.title")}
        >
          <Button
            type="button"
            onClick={() => {
              setDeleteModalVisible(false)
            }}
            variant="secondary"
          >
            {t("DocumentsDebt.deleteModal.no")}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              deleteDebtMutation.mutate(uploadedDocumentDebtId!)
            }}
          >
            {t("DocumentsDebt.deleteModal.yes")}
          </Button>
        </Confirmation>
      </Modal>
    </OnboardingLayout>
  )
}

export default DocumentsDebt
