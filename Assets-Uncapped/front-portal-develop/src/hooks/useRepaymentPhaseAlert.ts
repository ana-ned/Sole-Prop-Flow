import { isPast } from "date-fns"
import { useTranslation } from "react-i18next"
import {
  DetailedAgreementDTO,
  DetailedAgreementDTOProductTypeEnum,
  DetailedAgreementDTOStatusEnum,
  RepaymentScheduleResponse,
  RepaymentScheduleResponseRepaymentPhaseTypeEnum,
  RepaymentScheduleResponseRepaymentStatusEnum,
} from "../services/api/agreements"
import { OrganisationOverviewOrganisationSourceEnum } from "../services/api/organisation-users"
import { differenceInDays } from "../utils/date"
import useAgreements from "./useAgreements"
import useAuth from "./useAuth"
import useRepaymentsSearch from "./useRepaymentsSearch"

export interface RepaymentPhaseAlertData {
  isLoading: boolean
  activeAgreement: DetailedAgreementDTO | undefined
  repayments: RepaymentScheduleResponse[]
  firstRepaymentPhase: RepaymentScheduleResponse | undefined
  futureRepayments: RepaymentScheduleResponse[]
  futureRepayment: RepaymentScheduleResponse | undefined
  difference: number
  faqUrl: string | null
  partnershipName: string | null
  isVisible: boolean
}

const useRepaymentPhaseAlert = (): RepaymentPhaseAlertData => {
  const auth = useAuth()
  const repaymentsQuery = useRepaymentsSearch()
  const agreements = useAgreements()
  const { t } = useTranslation("dashboard", {
    keyPrefix: "notifications.repaymentPhase",
  })

  const activeAgreement = agreements.data?.find(
    (el) =>
      el.status === DetailedAgreementDTOStatusEnum.Active &&
      el.productType === DetailedAgreementDTOProductTypeEnum.InterestRate
  )

  const repayments = repaymentsQuery.data
    ?.filter(
      (el) =>
        el.repaymentPhaseType ===
          RepaymentScheduleResponseRepaymentPhaseTypeEnum.RepaymentPhase &&
        el.agreementId === activeAgreement?.id &&
        el.repaymentStatus !==
          RepaymentScheduleResponseRepaymentStatusEnum.Cancelled
    )
    .toSorted((a, b) => a.scheduledDate!.getTime() - b.scheduledDate!.getTime())

  const firstRepaymentPhase = repayments?.[0]

  const futureRepayments = (repayments || []).filter(
    (el) => !isPast(el.scheduledDate!)
  )

  const futureRepayment =
    futureRepayments.length > 0 ? futureRepayments[0] : undefined

  const difference = firstRepaymentPhase
    ? differenceInDays(new Date(), firstRepaymentPhase.scheduledDate!)
    : 0

  const getPartnershipName = () => {
    if (
      auth.organisationData?.organisationSource ===
      OrganisationOverviewOrganisationSourceEnum.Marcus
    ) {
      return t("goldmanSachs")
    }

    if (
      auth.organisationData?.organisationSource ===
      OrganisationOverviewOrganisationSourceEnum.Sellersfi
    ) {
      return t("sellersfi")
    }

    return null
  }

  const getFaqUrl = () => {
    if (
      auth.organisationData?.organisationSource ===
      OrganisationOverviewOrganisationSourceEnum.Marcus
    ) {
      return "https://www.weareuncapped.com/goldman-sachs-faqs"
    }

    if (
      auth.organisationData?.organisationSource ===
      OrganisationOverviewOrganisationSourceEnum.Sellersfi
    ) {
      return "https://www.weareuncapped.com/sellersfi-faqs"
    }

    return null
  }

  const isVisible = !(
    repaymentsQuery.isLoading ||
    agreements.isLoading ||
    !activeAgreement ||
    (repayments || []).length === 0 ||
    !firstRepaymentPhase ||
    auth.organisationData?.organisationSource !==
      OrganisationOverviewOrganisationSourceEnum.Marcus ||
    difference < -90 ||
    difference >= 90
  )

  return {
    isLoading: repaymentsQuery.isLoading || agreements.isLoading,
    activeAgreement,
    repayments: repayments || [],
    firstRepaymentPhase,
    futureRepayments,
    futureRepayment,
    difference,
    faqUrl: getFaqUrl(),
    partnershipName: getPartnershipName(),
    isVisible,
  }
}

export default useRepaymentPhaseAlert
