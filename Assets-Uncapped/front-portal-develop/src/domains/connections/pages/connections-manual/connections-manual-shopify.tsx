import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import * as yup from "yup"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import FormControl from "../../../../components/Forms/FormControl"
import Input from "../../../../components/Forms/Input"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import Layout from "../../../../components/UI/Layout"
import PageBar from "../../../../components/UI/PageBar"
import useDevice from "../../../../hooks/useDevice"
import Instructions from "../../components/Instructions"
import useConnections from "../../hooks/useConnections"
import platforms from "../../models/platforms"

const schema = yup.object().shape({
  institutionId: yup.string().required(),
})

export const parseShopifyId = (id: string) => {
  // eslint-disable-next-line sonarjs/duplicates-in-character-class
  const matches = /(?:https?:\/\/)?(?:www\.)?([\w-_]+)(?:.myshopify.com)?/.exec(
    id
  )

  return matches?.[1] || id
}

const ManualConnectionShopify = () => {
  const { t } = useTranslation("connections", { keyPrefix: "manual.shopify" })
  const navigate = useNavigate()
  const { isDesktop } = useDevice()
  const { createAndRedirectToProvider } = useConnections()

  const { control, formState, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  })

  return (
    <Layout
      menu={false}
      sidebar={
        isDesktop && (
          <Layout.Child autoHeight>
            <Instructions>
              <ol>
                {t("instructions", {
                  returnObjects: true,
                }).map((item) => (
                  <li key={item}>
                    <span>
                      <Trans
                        // @ts-expect-error dynamic translation
                        i18nKey={item}
                        components={{
                          b: <b />,
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
          title={t("header")}
          onClickBack={async () => {
            await navigate(-1)
          }}
          withChat
        />

        <form
          onSubmit={handleSubmit((formData) => {
            createAndRedirectToProvider.mutate({
              platform: platforms.ShopifyV2,
              institutionId: parseShopifyId(formData.institutionId),
            })
          })}
        >
          <FormLayout>
            <FormLayout.Content>
              <FormControl>
                <Input name="institutionId" label="Shop ID" control={control} />
              </FormControl>
            </FormLayout.Content>

            <FormLayout.Footer>
              <ButtonGroup>
                <Button
                  type="submit"
                  disabled={!formState.isValid}
                  loading={createAndRedirectToProvider.isPending}
                >
                  {t("cta")}
                </Button>
              </ButtonGroup>
            </FormLayout.Footer>
          </FormLayout>
        </form>
      </Layout.Parent>
    </Layout>
  )
}

export default ManualConnectionShopify
