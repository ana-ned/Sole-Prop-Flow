import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import useAuth from "../../../hooks/useAuth"
import useLogin from "../../../hooks/useLogin"
import { useTracking } from "../../../hooks/useTracking"
import i18n from "../../../inits/i18next"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import {
  InvitationControllerV2Api as ControllerOrganisationUsers,
  UserInvitationRegistrationRequest,
  UserInvitationResponseStatusEnum,
} from "../../../services/api/organisation-users"
import {
  InvitationControllerApi as ControllerPartners,
  UserInvitationResponseStatusEnum as PartnerInvitationResponseStatusEnum,
} from "../../../services/api/partners"

const INVITATIONS_QUERY_KEY = "INVITATIONS_QUERY"

export interface CommonInvitationDTO {
  id: string
  firstName: string
  lastName: string
  email: string
  status: UserInvitationResponseStatusEnum & PartnerInvitationResponseStatusEnum
}

const useInvitations = (invitationCode?: string) => {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { trackEvent } = useTracking()
  const { login } = useLogin()

  const invitationData = useQuery({
    queryKey: ["INVITATION_DATA", invitationCode],
    queryFn: async () => {
      return globalThis.location.pathname.includes("partner")
        ? new ControllerPartners(
            apiConfig({ service: ApiServicesEnum.Partners })
          ).getInvitationJoiningInfo({
            xXPARTNERID: "",
            invitationCode: invitationCode!,
          })
        : new ControllerOrganisationUsers(
            apiConfig({ service: ApiServicesEnum.OrganisationUsers })
          ).getInvitationJoiningInfo({
            xXORGID: "",
            invitationCode: invitationCode!,
          })
    },
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!invitationCode,
  })

  const invitationsQuery = useQuery({
    queryKey: [INVITATIONS_QUERY_KEY],
    queryFn: async () => {
      if (auth.partnerId) {
        const res = await new ControllerPartners(
          apiConfig({
            token: await auth.getToken(),
            service: ApiServicesEnum.Partners,
          })
        ).listInvitations({ xXPARTNERID: auth.partnerId })

        return res.map<CommonInvitationDTO>((item) => ({
          id: item.id!,
          firstName: item.firstName!,
          lastName: item.lastName!,
          email: item.email!,
          status: item.status as CommonInvitationDTO["status"],
        }))
      }

      const res = await new ControllerOrganisationUsers(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.OrganisationUsers,
        })
      ).listInvitations({ xXORGID: auth.organisation?.organisationId! })

      return res.map<CommonInvitationDTO>((item) => ({
        id: item.invitationId,
        firstName: item.name,
        lastName: item.surname,
        email: item.email,
        status: item.status as CommonInvitationDTO["status"],
      }))
    },
    enabled: auth.partnerId
      ? auth.isAuthenticated && !!auth.partnerId
      : auth.isAuthenticated && !!auth.organisation?.organisationId,
  })

  const invitationDeleteMutation = useMutation({
    mutationFn: async ({
      id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setDeleted,
    }: {
      id: string
      setDeleted: (value: boolean) => void
    }) =>
      auth.partnerId
        ? new ControllerPartners(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.Partners,
            })
          ).deleteInvitation({ xXPARTNERID: auth.partnerId, invitationId: id })
        : new ControllerOrganisationUsers(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.OrganisationUsers,
            })
          ).deleteInvitation({
            xXORGID: auth.organisation?.organisationId!,
            invitationId: id,
          }),
    onSuccess: async (resp, variables) => {
      await queryClient.invalidateQueries({ queryKey: [INVITATIONS_QUERY_KEY] })
      variables.setDeleted(true)
    },
  })

  const invitationResendMutation = useMutation({
    mutationFn: async ({
      id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setResent,
    }: {
      id: string
      setResent: (value: boolean) => void
    }) =>
      auth.partnerId
        ? new ControllerPartners(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.Partners,
            })
          ).resendInvitation({ xXPARTNERID: auth.partnerId, invitationId: id })
        : new ControllerOrganisationUsers(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.OrganisationUsers,
            })
          ).resendInvitation({
            xXORGID: auth.organisation?.organisationId!,
            invitationId: id,
          }),
    onSuccess: (resp, variables) => {
      variables.setResent(true)
    },
  })

  const inviteMutation = useMutation({
    mutationFn: async ({
      formData,
    }: {
      formData: { firstName: string; email: string; lastName: string }
    }) =>
      auth.partnerId
        ? new ControllerPartners(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.Partners,
            })
          ).inviteTeamMember({
            xXPARTNERID: auth.partnerId,
            userInvitationRequest: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
            },
          })
        : new ControllerOrganisationUsers(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.OrganisationUsers,
            })
          ).inviteTeamMember({
            xXORGID: auth.organisation?.organisationId!,
            teamMemberInvitationCreationRequest: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              invitationMessageDetails: {},
            },
          }),
    onSuccess: async () => {
      trackEvent({
        category: "invitations",
        name: "invite",
        action: "sent",
      })
      await queryClient.invalidateQueries({ queryKey: [INVITATIONS_QUERY_KEY] })
    },
  })

  const invitationAcceptMutation = useMutation({
    mutationFn: ({
      code,
      userInvitationRegistrationRequest,
    }: {
      code: string
      userInvitationRegistrationRequest: UserInvitationRegistrationRequest
    }) => {
      return globalThis.location.pathname.includes("partner")
        ? new ControllerPartners(
            apiConfig({ service: ApiServicesEnum.Partners })
          ).acceptInvitation({
            invitationCode: code,
            xXPARTNERID: "",
            userInvitationRegistrationRequest,
          })
        : new ControllerOrganisationUsers(
            apiConfig({ service: ApiServicesEnum.OrganisationUsers })
          ).acceptInvitation({
            invitationCode: code,
            xXORGID: "",
            userInvitationRegistrationRequest,
          })
    },
    onSuccess: (res, args) => {
      login(res.email, args.userInvitationRegistrationRequest.password!, "/")
    },
    onError: () => {
      toast.error(i18n.t("common:defaultErrorMessage"))
    },
  })

  return {
    invitationsQuery,
    invitationDeleteMutation,
    invitationResendMutation,
    inviteMutation,
    invitationAcceptMutation,
    invitationData,
  }
}

export default useInvitations
