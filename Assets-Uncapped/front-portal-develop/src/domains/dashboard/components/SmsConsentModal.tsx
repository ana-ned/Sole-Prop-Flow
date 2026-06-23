import { useEffect, useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { differenceInDays } from "date-fns"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import * as yup from "yup"
import Button from "../../../components/Basic/Button"
import FeatureContent from "../../../components/Collections/FeatureContent"
import FormControl from "../../../components/Forms/FormControl"
import Input from "../../../components/Forms/Input"
import Modal from "../../../components/UI/Modal"
import useAuth, { getUserOverviewQueryKey } from "../../../hooks/useAuth"
import useBrowserStorage from "../../../hooks/useBrowserStorage"
import { useTracking } from "../../../hooks/useTracking"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import {
  ChangeUserPhoneRequest,
  UserControllerApi,
} from "../../../services/api/organisation-users"
import CountryService from "../../../services/country"
import PhoneFormat from "../../../utils/validator-rules/phone"
import Image from "../assets/consent.svg"

const schema = yup.object().shape({
  phoneNumber: yup.string().required().test(PhoneFormat()),
})

const SmsConsentModal = () => {
  const auth = useAuth()
  const { t } = useTranslation("dashboard", {
    keyPrefix: "SmsConsentModal",
  })
  const { trackEvent } = useTracking()
  const [isMissingConsent, setIsMissingConsent] = useState(false)
  const [modalClosedAt, setModalClosedAt] = useBrowserStorage<string>(
    auth.user?.sub,
    "sms_consent_at"
  )
  const queryClient = useQueryClient()

  const isOldConsent =
    !modalClosedAt || differenceInDays(new Date(), new Date(modalClosedAt)) > 1

  const isOpen = isMissingConsent && isOldConsent

  useEffect(() => {
    if (isOpen) {
      trackEvent({
        category: "dashboard",
        name: `sms-consent-modal`,
        action: "open",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  useEffect(() => {
    if (
      !auth.userData?.consents?.SMS_NOTIFICATIONS?.status ||
      auth.userData.consents.SMS_NOTIFICATIONS?.status === "REVOKED"
    ) {
      setIsMissingConsent(true)
    } else {
      setIsMissingConsent(false)
    }
  }, [auth.userData?.consents?.SMS_NOTIFICATIONS?.status])

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      phoneNumber: auth.userData?.phone!,
    },
    mode: "onBlur",
  })

  const updateUserPhone = useMutation({
    mutationFn: async (variables: ChangeUserPhoneRequest) => {
      return new UserControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.OrganisationUsers,
        })
      ).updatePhone({
        xXORGID: auth.organisationData?.id!,
        changeUserPhoneRequest: {
          phone: variables.phone,
          smsConsentGranted: variables.smsConsentGranted,
        },
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getUserOverviewQueryKey(auth.organisation?.organisationId!),
      })
    },
  })

  const closeModal = () => {
    setIsMissingConsent(false)
    setModalClosedAt(new Date().toISOString())
  }

  if (!auth.userData?.phone) {
    return null
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsMissingConsent(false)
      }}
    >
      <FeatureContent
        img={Image}
        fluidIcon
        title={t("title")}
        content={
          <p>
            <Trans
              i18nKey="SmsConsentModal.content"
              ns="dashboard"
              components={{
                href: (
                  // eslint-disable-next-line jsx-a11y/anchor-has-content
                  <a
                    href="https://www.weareuncapped.com/privacy-policy"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      textDecoration: "none",
                      fontWeight: "bold",
                      color: "var(--color-brand-600)",
                    }}
                  />
                ),
              }}
            />
          </p>
        }
        footerContent={
          <>
            <form>
              <FormControl>
                <Input
                  renderType="phone"
                  country={
                    CountryService.getByAlpha3(
                      auth.organisationData?.countryCode
                    )?.["alpha-2"]
                  }
                  control={form.control}
                  name="phoneNumber"
                  label={t("label")}
                />
              </FormControl>

              <Button
                fullWidth
                type="button"
                loading={updateUserPhone.isPending}
                disabled={
                  !form.formState.isValid ||
                  updateUserPhone.variables?.smsConsentGranted === true
                }
                onClick={async () => {
                  await updateUserPhone.mutateAsync({
                    phone: form.getValues("phoneNumber"),
                    smsConsentGranted: true,
                  })
                  trackEvent({
                    category: "dashboard",
                    name: `sms-consent-modal`,
                    action: "grant",
                  })
                  closeModal()
                }}
              >
                {t("submit")}
              </Button>
            </form>
            <Button
              fullWidth
              type="button"
              variant="secondary"
              loading={
                updateUserPhone.variables?.smsConsentGranted === false &&
                updateUserPhone.isPending
              }
              disabled={!form.formState.isValid}
              onClick={async () => {
                await updateUserPhone.mutateAsync({
                  phone: form.getValues("phoneNumber"),
                  smsConsentGranted: false,
                })
                trackEvent({
                  category: "dashboard",
                  name: `sms-consent-modal`,
                  action: "revoke",
                })
                closeModal()
              }}
            >
              {t("cancel")}
            </Button>
          </>
        }
      />
    </Modal>
  )
}

export default SmsConsentModal
