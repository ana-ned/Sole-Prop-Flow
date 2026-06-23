import { useCallback, useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Pen01SolidRounded } from "@hugeicons-pro/core-solid-rounded"
import { useQueryClient } from "@tanstack/react-query"
import clsx from "clsx"
import { useTranslation } from "react-i18next"
import useHelloSign from "../../../domains/onboarding/hooks/useHelloSign"
import useMarkAsSigned from "../../../domains/onboarding/hooks/useMarkAsSigned"
import useSigningUrl, {
  SIGNING_QUERY_KEY,
} from "../../../domains/onboarding/hooks/useSigningUrl"
import useDeal from "../../../hooks/useDeal"
import { DOCUMENT_STATUS_QUERY_KEY } from "../../../hooks/useDocumentStatuses"
import {
  DocumentDetails,
  DocumentDetailsSignedDocumentTypeEnum,
  DocumentDetailsSigningStatusEnum,
} from "../../../services/api/agreements"
import { ReactComponent as CheckIcon } from "../../../svgs/check.svg"
import { ReactComponent as LockIcon } from "../../../svgs/lock.svg"
import BoxIcon from "../../Basic/BoxIcon"
import Button from "../../Basic/Button"
import ListItemContainer from "../../Collections/ListItemContainer"
import Chip from "../../UI/Chip"
import ListItemLarge from "../../UI/ListItemLarge"
import Widget from "../../UI/Widget"

const isAgreement = (documentType: DocumentDetailsSignedDocumentTypeEnum) => {
  return (
    documentType.startsWith("FIXED_TERM_CONTRACT") ||
    documentType.startsWith("RBF_CONTRACT") ||
    documentType === DocumentDetailsSignedDocumentTypeEnum.DailyPayoutContract
  )
}

const isDisclosure = (documentType: DocumentDetailsSignedDocumentTypeEnum) => {
  return documentType.includes("DISCLOSURE")
}

const isFramework = (documentType: DocumentDetailsSignedDocumentTypeEnum) => {
  return (
    documentType.startsWith("LOC_FRAMEWORK") ||
    documentType.startsWith("LOC_20_FRAMEWORK")
  )
}

const DocumentSigningList = ({
  documentStatuses,
  isLoc,
}: {
  documentStatuses: DocumentDetails[]
  isLoc: boolean
}) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("common", {
    keyPrefix: "DocumentsSigningList",
  })
  const { openHelloSignDocument, helloSignClient } = useHelloSign()
  const [currentDocument, setCurrentDocument] = useState<string>()
  const deal = useDeal()
  const markAsSigned = useMarkAsSigned()

  const onSign = async () => {
    await markAsSigned.mutateAsync({ documentId: currentDocument! })
    await queryClient.invalidateQueries({
      queryKey: DOCUMENT_STATUS_QUERY_KEY,
    })
  }

  useEffect(() => {
    helloSignClient.on("sign", onSign)

    return () => {
      helloSignClient.off("sign", onSign)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDocument])

  const signingUrl = useSigningUrl({ documentId: currentDocument })

  useEffect(() => {
    if (signingUrl.data) {
      openHelloSignDocument(signingUrl.data.signUrl!)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signingUrl.data])

  const handleSign = useCallback(
    async (documentId: string) => {
      if (currentDocument === documentId) {
        await queryClient.invalidateQueries({
          queryKey: SIGNING_QUERY_KEY(documentId),
        })
      } else {
        setCurrentDocument(documentId)
      }
    },
    [currentDocument, queryClient]
  )

  const getDocumentTitle = (name: DocumentDetailsSignedDocumentTypeEnum) => {
    if (isDisclosure(name)) return t("document.disclosure")

    const agreementTitle = isLoc
      ? t("document.drawAgreement")
      : t("document.loanAgreement")

    const frameworkTitle = t("lineOfCreditAgreement")
    const documentTypes: Partial<
      Record<DocumentDetailsSignedDocumentTypeEnum, string>
    > = {
      // Fixed Term Contracts
      [DocumentDetailsSignedDocumentTypeEnum.FixedTermContract]: agreementTitle,
      [DocumentDetailsSignedDocumentTypeEnum.FixedTermContractUsd]:
        agreementTitle,
      [DocumentDetailsSignedDocumentTypeEnum.FixedTermContractSecuredUsd]:
        agreementTitle,
      [DocumentDetailsSignedDocumentTypeEnum.FixedTermContractAprEarlySecuredUsd]:
        agreementTitle,
      [DocumentDetailsSignedDocumentTypeEnum.FixedTermContractAprEarlyUsd]:
        agreementTitle,
      [DocumentDetailsSignedDocumentTypeEnum.FixedTermContractUkPlus]:
        agreementTitle,
      [DocumentDetailsSignedDocumentTypeEnum.FixedTermContractDeu]:
        agreementTitle,
      [DocumentDetailsSignedDocumentTypeEnum.FixedTermContractCanadaUnsecured]:
        agreementTitle,
      [DocumentDetailsSignedDocumentTypeEnum.FixedTermContractCanadaSecured]:
        agreementTitle,
      [DocumentDetailsSignedDocumentTypeEnum.FixedTermContractBespokeUnsecured]:
        agreementTitle,
      [DocumentDetailsSignedDocumentTypeEnum.FixedTermContractBespokeSecured]:
        agreementTitle,
      [DocumentDetailsSignedDocumentTypeEnum.Fixed]: agreementTitle,
      [DocumentDetailsSignedDocumentTypeEnum.FixedCustomizable]: agreementTitle,
      [DocumentDetailsSignedDocumentTypeEnum.LocDraw]: agreementTitle,
      [DocumentDetailsSignedDocumentTypeEnum.RbfContractUsa]: t(
        "document.rbfAgreement"
      ),
      [DocumentDetailsSignedDocumentTypeEnum.RbfContractUk]: t(
        "document.rbfAgreement"
      ),
      [DocumentDetailsSignedDocumentTypeEnum.RbfContractCanada]: t(
        "document.rbfAgreement"
      ),
      [DocumentDetailsSignedDocumentTypeEnum.DailyPayoutContract]: t(
        "document.dailyPayoutAgreement"
      ),

      // LOC Frameworks
      [DocumentDetailsSignedDocumentTypeEnum.LocFrameworkUsUnsecured]:
        frameworkTitle,
      [DocumentDetailsSignedDocumentTypeEnum.LocFrameworkUsSecured]:
        frameworkTitle,
      [DocumentDetailsSignedDocumentTypeEnum.LocFrameworkUk]: frameworkTitle,
      [DocumentDetailsSignedDocumentTypeEnum.Loc20FrameworkUsSecured]:
        frameworkTitle,
      [DocumentDetailsSignedDocumentTypeEnum.LineOfCredit]: frameworkTitle,

      // Other Documents
      [DocumentDetailsSignedDocumentTypeEnum.UniformCommercialCode]: t(
        "document.uniformCommercialCode"
      ),
      [DocumentDetailsSignedDocumentTypeEnum.PersonalGuarantee]: t(
        "document.personalGuarantee"
      ),
      [DocumentDetailsSignedDocumentTypeEnum.Debenture]:
        t("document.debenture"),
      [DocumentDetailsSignedDocumentTypeEnum.DeedsOfPriority]: t(
        "document.deedsOfPriority"
      ),
      [DocumentDetailsSignedDocumentTypeEnum.CrossCorporateSingleGuarantee]: t(
        "document.crossCorporateSingle"
      ),
      [DocumentDetailsSignedDocumentTypeEnum.CrossCorporateMultipleGuarantee]:
        t("document.crossCorporateMultiple"),
      [DocumentDetailsSignedDocumentTypeEnum.PersonalPropertySecurityAct]:
        t("document.document"),
      [DocumentDetailsSignedDocumentTypeEnum.Unknown]: t("document.document"),
    }

    return documentTypes[name]
  }

  const getDocumentStatus = (status: DocumentDetailsSigningStatusEnum) => {
    const statusMap: Record<DocumentDetailsSigningStatusEnum, string> = {
      [DocumentDetailsSigningStatusEnum.Pending]: t("documentStatus.pending"),
      [DocumentDetailsSigningStatusEnum.Completed]: t(
        "documentStatus.completed"
      ),
      [DocumentDetailsSigningStatusEnum.Failed]: t("documentStatus.failed"),
    }

    return statusMap[status]
  }

  const isLocV2 = documentStatuses.some((el) =>
    el.signedDocumentType?.startsWith("LOC_20_FRAMEWORK")
  )

  const getDisabledMessage = (
    documentType: DocumentDetailsSignedDocumentTypeEnum
  ) => {
    if (isDisclosure(documentType)) {
      return deal.isAmazonPartnership
        ? t("availableAfterFlexibleCreditLimit")
        : t("availableAfterLineOfCredit")
    }

    if (isFramework(documentType) && isLocV2) {
      return t("availableAfterDisclosureSigned")
    }

    if (isAgreement(documentType)) {
      return documentStatuses.some(
        (el) =>
          isDisclosure(el.signedDocumentType!) &&
          el.signingStatus !== DocumentDetailsSigningStatusEnum.Completed
      )
        ? t("availableAfterDisclosureSigned")
        : deal.isAmazonPartnership
          ? t("availableAfterFlexibleCreditLimit")
          : t("availableAfterLineOfCredit")
    }

    return t("disabled")
  }

  const isDocumentDisabled = (
    documentType: DocumentDetailsSignedDocumentTypeEnum
  ) => {
    if (isAgreement(documentType)) {
      return documentStatuses.some(
        (el) =>
          (isDisclosure(el.signedDocumentType!) ||
            isFramework(el.signedDocumentType!)) &&
          el.signingStatus !== DocumentDetailsSigningStatusEnum.Completed
      )
    }

    if (isFramework(documentType) && isLocV2) {
      return documentStatuses.some(
        (el) =>
          isDisclosure(el.signedDocumentType!) &&
          el.signingStatus !== DocumentDetailsSigningStatusEnum.Completed
      )
    }

    if (isDisclosure(documentType) && !isLocV2) {
      return documentStatuses.some(
        (el) =>
          isFramework(el.signedDocumentType!) &&
          el.signingStatus !== DocumentDetailsSigningStatusEnum.Completed
      )
    }

    return false
  }

  const disclosures = documentStatuses.filter((el) =>
    isDisclosure(el.signedDocumentType!)
  )

  const frameworks = documentStatuses.filter((el) =>
    isFramework(el.signedDocumentType!)
  )

  const agreements = documentStatuses.filter((el) =>
    isAgreement(el.signedDocumentType!)
  )

  const sortedDocuments = isLocV2
    ? [...disclosures, ...frameworks, ...agreements]
    : [...frameworks, ...disclosures, ...agreements]

  const documentItems = sortedDocuments.map((document) => {
    const documentType = document.signedDocumentType!
    const isDisabled = isDocumentDisabled(documentType)
    const isCompleted =
      document.signingStatus === DocumentDetailsSigningStatusEnum.Completed

    const chipLabel = isDisabled
      ? getDisabledMessage(documentType)
      : getDocumentStatus(document.signingStatus!)

    const chipColor = isCompleted
      ? ("success" as const)
      : isDisabled
        ? ("disabled" as const)
        : ("default" as const)

    const isActionable = !isDisabled && !isCompleted
    const isSigning =
      signingUrl.isFetching && currentDocument === document.documentId

    const moreElement = isDisabled ? (
      <LockIcon />
    ) : isCompleted ? (
      <CheckIcon />
    ) : document.documentId ? (
      <Button
        variant="primary"
        size="sm"
        type="button"
        disabled={isSigning}
        onClick={() => handleSign(document.documentId!)}
      >
        {t("signCta")}
      </Button>
    ) : null

    return {
      document,
      documentType,
      isDisabled,
      isCompleted,
      isActionable,
      chipLabel,
      chipColor,
      moreElement,
    }
  })

  return (
    <Widget
      title={t("toSign")}
      icon={
        <BoxIcon
          severity="accent-1"
          icon={<HugeiconsIcon icon={Pen01SolidRounded} />}
        />
      }
    >
      <ListItemContainer size="sm">
        {documentItems.map(
          ({
            document,
            documentType,
            isDisabled,
            isCompleted,
            chipLabel,
            chipColor,
            moreElement,
          }) => (
            <ListItemLarge
              key={document.documentId}
              className={clsx({
                "hover:cursor-default hover:bg-white":
                  isDisabled || isCompleted,
                "[&_svg]:fill-neutral-700": isDisabled,
              })}
              title={getDocumentTitle(documentType)}
              subtitle={<Chip label={chipLabel} color={chipColor} />}
              {...(moreElement
                ? { more: { type: "link", element: moreElement } }
                : {})}
            />
          )
        )}
      </ListItemContainer>
    </Widget>
  )
}

export default DocumentSigningList
