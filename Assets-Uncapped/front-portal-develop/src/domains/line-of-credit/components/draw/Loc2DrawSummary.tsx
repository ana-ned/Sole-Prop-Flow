import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { MoneyReceive02SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import Button from "../../../../components/Basic/Button"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import Alert from "../../../../components/UI/Alert"
import Card from "../../../../components/UI/Card"
import Chip from "../../../../components/UI/Chip"
import Confirmation from "../../../../components/UI/Confirmation"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import Layout from "../../../../components/UI/Layout"
import Loader from "../../../../components/UI/Loader/Loader"
import Modal from "../../../../components/UI/Modal"
import PageBar from "../../../../components/UI/PageBar"
import PortalMenu from "../../../../components/UI/PortalMenu"
import Widget from "../../../../components/UI/Widget"
import useAllTransactions from "../../../../hooks/useAllTransactions"
import useBankAccounts from "../../../../hooks/useBankAccounts"
import useDeal from "../../../../hooks/useDeal"
import {
  GetAllTransactionsExecutionTypesEnum,
  TransactionTypeEnum,
} from "../../../../services/api/agreements"
import { formatDate } from "../../../../utils/date"
import { format, formatAsPercentage } from "../../../../utils/money"
import useLedgerBalance from "../../../agreements/hooks/useLedgerBalance"
import { ReactComponent as DrawRequestedImg } from "../../assets/draw-requested.svg"
import useRequestDraw from "../../hooks/useRequestDraw"

const Loc2DrawSummary = ({ data }: StepProps) => {
  const { t } = useTranslation("line-of-credit", {
    keyPrefix: "Loc2DrawSummary",
  })
  const navigate = useNavigate()
  const deal = useDeal()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const requestDrawMutation = useRequestDraw({
    lineOfCredit: data.lineOfCredit,
    setModalVisible: setIsModalVisible,
  })

  const ledgerBalanceQuery = useLedgerBalance({
    agreementId: data.lineOfCredit.agreementId.id!,
  })

  const nextRepayment = useAllTransactions({
    params: {
      size: 1,
      transactionTypes: new Set([TransactionTypeEnum.Repayment]),
      executionTypes: new Set([GetAllTransactionsExecutionTypesEnum.Scheduled]),
    },
  })

  const bankAccountsQuery = useBankAccounts()
  const verifiedBankAccount = bankAccountsQuery.data?.find(
    (account) => account.verifiedForPayments
  )

  const drawAmount = Number(data.amount) || 0
  const currentPrincipalBalance = ledgerBalanceQuery.data?.currentPrincipal || 0
  const principalBalanceAfterDraw = currentPrincipalBalance + drawAmount
  const currency = data.lineOfCredit?.limit?.currency
  const interestRate = data.lineOfCredit?.fees?.interestRate || 0
  const repaymentRatio =
    data.lineOfCredit?.repaymentTerms?.principalToRepaymentRatioInDrawTerm || 0
  const nextRepaymentAmount = principalBalanceAfterDraw * repaymentRatio
  const nextRepaymentDate =
    nextRepayment.data?.content?.[0]?.operationScheduledDate

  return (
    <Layout menu={<PortalMenu menuOnMobile={false} />}>
      <Layout.Parent>
        <FormLayout>
          <FormLayout.Content className="flex flex-col gap-4">
            <PageBar
              title={t("title")}
              onClickBack={async () => {
                await navigate(data.backUrl)
              }}
              desktopHeaderType="h4"
            />
            <Widget
              icon={
                <BoxIcon
                  severity="accent-1"
                  icon={<HugeiconsIcon icon={MoneyReceive02SolidStandard} />}
                />
              }
              title={t("widgetTitle")}
            >
              <div className="flex flex-col gap-4">
                <Card className="flex flex-col gap-2 !p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Typography type="bodyTitle">
                      {t("principalBalanceAfterDraw")}
                    </Typography>
                    <Typography type="smallTitle">
                      {format(principalBalanceAfterDraw, currency)}
                    </Typography>
                  </div>

                  <div className="flex items-center justify-between gap-2 pl-8">
                    <Typography>{t("thisDraw")}</Typography>
                    <Typography type="smallCopy">
                      {format(drawAmount, currency)}
                    </Typography>
                  </div>

                  <div className="flex items-center justify-between gap-2 pl-8">
                    <Typography>{t("currentPrincipalBalance")}</Typography>
                    <Typography type="smallCopy">
                      {format(currentPrincipalBalance, currency)}
                    </Typography>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <Typography type="bodyTitle">
                      {t("annualInterestRate")}
                    </Typography>
                    <Typography type="smallTitle">
                      {formatAsPercentage(interestRate * 100, 2, {
                        removeTrailingZeros: true,
                      })}
                    </Typography>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <Typography type="bodyTitle">
                      {t("nextRepaymentDueDate")}
                    </Typography>
                    <Typography type="smallTitle">
                      {nextRepaymentDate
                        ? formatDate(nextRepaymentDate, {
                            customFormat: "MMM dd yyyy",
                          })
                        : "--"}
                    </Typography>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <Typography type="bodyTitle">
                      {t("nextRepayment", {
                        percentage: formatAsPercentage(repaymentRatio * 100, 0),
                        amount: format(principalBalanceAfterDraw, currency),
                      })}
                    </Typography>
                    <Typography type="smallTitle">
                      {format(nextRepaymentAmount, currency)}
                    </Typography>
                  </div>
                </Card>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-col">
                    <Typography type="bodyTitle">
                      {t("bankAccountSection.title")}
                    </Typography>
                    <Typography type="body">
                      <SanitizedHtml
                        as="span"
                        content={t(
                          deal.hasAmazonPartnerOffer
                            ? "bankAccountSection.descriptionAmazon"
                            : "bankAccountSection.description"
                        )}
                      />
                    </Typography>
                  </div>

                  <Card className="!p-3">
                    {bankAccountsQuery.isLoading ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader size="sm" />
                      </div>
                    ) : verifiedBankAccount ? (
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Typography type="bodyTitle">
                            {verifiedBankAccount.bankName}
                          </Typography>
                          {deal.hasAmazonPartnerOffer && (
                            <Chip
                              label={t("bankAccountSection.verifiedWithAmazon")}
                              color="success"
                            />
                          )}
                        </div>
                        <Typography type="smallTitle">
                          {`****${verifiedBankAccount.mask || verifiedBankAccount.number?.slice(-4)}`}
                        </Typography>
                      </div>
                    ) : null}
                  </Card>

                  {!bankAccountsQuery.isLoading && !verifiedBankAccount && (
                    <Alert type="warning">
                      <Typography type="body">
                        {t("bankAccountSection.noVerifiedAccount")}
                      </Typography>
                    </Alert>
                  )}
                </div>
              </div>
            </Widget>
            <Button
              type="button"
              onClick={() => {
                if (verifiedBankAccount?.id) {
                  requestDrawMutation.mutate({
                    amount: drawAmount,
                    cashTransferAccountId: verifiedBankAccount.id,
                  })
                }
              }}
              disabled={
                bankAccountsQuery.isLoading ||
                !verifiedBankAccount ||
                requestDrawMutation.isPending
              }
              loading={requestDrawMutation.isPending}
            >
              {t("cta")}
            </Button>
          </FormLayout.Content>
        </FormLayout>
      </Layout.Parent>
      <Modal
        isOpen={isModalVisible}
        onClose={async () => {
          await navigate("/")
        }}
        className={"max-w-sm md:!pb-12"}
      >
        <Confirmation
          title={t("drawRequestSubmitted")}
          fluidIcon
          subtitle={t("pleaseAllowUpTo2BusinessDays")}
          type="custom"
          iconComponent={<DrawRequestedImg />}
        >
          <Button href="/">{t("gotIt")}</Button>
        </Confirmation>
      </Modal>
    </Layout>
  )
}

export default Loc2DrawSummary
