/* eslint-disable jsx-a11y/anchor-has-content */
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import * as yup from "yup"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import FormControl from "../../../../components/Forms/FormControl"
import Input from "../../../../components/Forms/Input"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import Layout from "../../../../components/UI/Layout"
import PageBar from "../../../../components/UI/PageBar"
import useAuth from "../../../../hooks/useAuth"
import useDevice from "../../../../hooks/useDevice"
import useHubSpotChat from "../../../../hooks/useHubSpotChat"
import i18n from "../../../../inits/i18next"
import apiConfig, { ApiServicesEnum } from "../../../../services/api/api-config"
import { KlarnaConnectionControllerApi } from "../../../../services/api/connections"
import Instructions from "../../components/Instructions"
import { CONNECTIONS_QUERY_KEY } from "../../hooks/useConnections"

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
})

const ManualConnectionKlarna = () => {
  const { t } = useTranslation("connections", { keyPrefix: "manual" })
  const { organisation, getToken } = useAuth()
  const queryClient = useQueryClient()
  const { openChat } = useHubSpotChat()
  const { isDesktop } = useDevice()

  const { control, formState, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  })

  const submitMutation = useMutation({
    mutationFn: async (formData: yup.InferType<typeof schema>) =>
      new KlarnaConnectionControllerApi(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.Connections,
        })
      ).addKlarnaConnection({
        xXORGID: organisation?.organisationId!,
        username: formData.username,
        password: formData.password,
      }),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [CONNECTIONS_QUERY_KEY],
      })
    },
    onError: () => {
      openChat()
      toast.error(i18n.t("common:defaultErrorMessage"))
    },
  })

  return (
    <Layout
      menu={false}
      sidebar={
        isDesktop && (
          <Layout.Child autoHeight>
            <Instructions>
              <ol>
                {t("klarna.instructions", {
                  returnObjects: true,
                }).map((item) => (
                  <li key={item}>
                    <span>
                      <Trans
                        // @ts-expect-error dynamic translation
                        i18nKey={item}
                        components={{
                          bold: <strong />,
                          href: (
                            <a
                              href="https://www.klarna.com/"
                              target="_blank"
                              rel="noreferrer"
                            />
                          ),
                        }}
                      />
                    </span>
                  </li>
                ))}
              </ol>
            </Instructions>
          </Layout.Child>
        )
      }
    >
      <Layout.Parent>
        <PageBar
          title={t("klarna.header")}
          onClickBack={() => {
            globalThis.history.back()
          }}
          withChat
        />
        <form
          onSubmit={handleSubmit(async (formData) => {
            await submitMutation.mutateAsync(formData)
          })}
        >
          <FormLayout>
            <FormLayout.Content>
              <FormControl>
                <Input name="username" label="Username" control={control} />
              </FormControl>
              <FormControl>
                <Input name="password" label="Password" control={control} />
              </FormControl>
            </FormLayout.Content>

            <FormLayout.Footer>
              <ButtonGroup>
                <Button
                  type="submit"
                  disabled={!formState.isValid}
                  loading={submitMutation.isPending}
                >
                  {t("klarna.cta")}
                </Button>
              </ButtonGroup>
            </FormLayout.Footer>
          </FormLayout>
        </form>
      </Layout.Parent>
    </Layout>
  )
}

export default ManualConnectionKlarna
