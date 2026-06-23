import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import { useTracking } from "../../../hooks/useTracking"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import {
  AdditionalInfo,
  DocumentAdditionalDataRequest,
  DocumentControllerApi,
  MissingDocumentResponse,
} from "../../../services/api/organisation-users"
import { DocumentControllerApi as DocumentControllerApiPartners } from "../../../services/api/partners"
import { titleCase } from "../../../utils/string"
import { documentQueryKeys } from "../queries"

const useDocumentUpload = ({
  slug,
  dealId,
}: {
  slug: string
  dealId?: string
}) => {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { trackEvent } = useTracking()

  const query = useQuery({
    queryKey: documentQueryKeys.uploaded(slug),
    queryFn: async () =>
      auth.partnerId
        ? new DocumentControllerApiPartners(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.Partners,
            })
          ).getUploadedDocuments({
            xXPARTNERID: auth.partnerId,
            documentType: slug,
            applicationId: dealId!,
          })
        : new DocumentControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.OrganisationUsers,
            })
          ).getUploadedDocuments1({
            xXORGID: String(auth.organisation?.organisationId),
            documentType: slug,
          }),
    // FIXME: API should be covering this, but apparently for some
    // organisations it returns UPPER_CASE_ENUM_NAME, so we need to
    // convert it to title case
    select: (
      data
    ): {
      uploadedDocuments?: typeof data.uploadedDocuments
      requiredDocument: MissingDocumentResponse & {
        additionalInfo?: AdditionalInfo
      }
    } => ({
      ...data,
      requiredDocument: {
        ...data.requiredDocument,
        title: data.requiredDocument?.title?.includes("_")
          ? titleCase(data.requiredDocument.title)
          : data.requiredDocument?.title,
      },
    }),
    enabled: auth.partnerId
      ? auth.isAuthenticated && !!auth.partnerId && !!dealId
      : auth.isAuthenticated && !!auth.organisation?.organisationId && !dealId,
  })

  const fileUpload = useMutation({
    mutationFn: async (args: { document: Blob; customSlug?: string }) =>
      auth.partnerId
        ? new DocumentControllerApiPartners(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.Partners,
            })
          ).uploadDocument({
            xXPARTNERID: auth.partnerId,
            type: args.customSlug ?? slug,
            document: args.document,
            applicationId: dealId!,
          })
        : new DocumentControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.OrganisationUsers,
            })
          ).uploadDocument2({
            xXORGID: String(auth.organisation?.organisationId),
            type: args.customSlug ?? slug,
            document: args.document,
          }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: documentQueryKeys.uploaded(slug),
      })
      await queryClient.invalidateQueries({
        queryKey: documentQueryKeys.required(),
      })
      await queryClient.invalidateQueries({ queryKey: documentQueryKeys.v2() })
    },
  })

  const handleFilesUpload = async (files: File[]) => {
    for (const file of files) {
      await fileUpload.mutateAsync({ document: file })
    }
  }

  const fileDelete = useMutation({
    mutationFn: async (fileId: string) =>
      auth.partnerId
        ? new DocumentControllerApiPartners(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.Partners,
            })
          ).deleteDocument({
            xXPARTNERID: auth.partnerId,
            fileId,
            applicationId: dealId!,
          })
        : new DocumentControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.OrganisationUsers,
            })
          ).deleteDocument1({
            xXORGID: String(auth.organisation?.organisationId),
            fileId,
          }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: documentQueryKeys.uploaded(slug),
      })
      await queryClient.invalidateQueries({
        queryKey: documentQueryKeys.required(),
      })
    },
  })

  const fileUploadLock = useMutation({
    mutationFn: async (
      documentAdditionalDataRequest?: DocumentAdditionalDataRequest
    ) =>
      auth.partnerId
        ? new DocumentControllerApiPartners(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.Partners,
            })
          ).lockDocumentType({
            xXPARTNERID: auth.partnerId,
            documentType: slug,
            applicationId: dealId!,
          })
        : new DocumentControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.OrganisationUsers,
            })
          ).lockDocumentType1({
            xXORGID: String(auth.organisation?.organisationId),
            documentType: slug,
            documentAdditionalDataRequest,
          }),
    onSuccess: async () => {
      trackEvent({
        category: "onboarding",
        name: "documents",
        action: "lock",
        customFields: {
          documentType: slug,
        },
      })
      await queryClient.invalidateQueries({
        queryKey: documentQueryKeys.required(),
        type: "all",
      })
      await queryClient.invalidateQueries({ queryKey: documentQueryKeys.v2() })
    },
  })

  return {
    query,
    fileUpload,
    fileDelete,
    fileUploadLock,
    handleFilesUpload,
  }
}

export default useDocumentUpload
