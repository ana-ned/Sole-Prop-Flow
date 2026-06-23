import { useNavigate } from "react-router"
import { MissingDocumentResponse } from "../../../services/api/organisation-users"
import ListItemContainer from "../../Collections/ListItemContainer"
import ListItemLarge from "../../UI/ListItemLarge"

const DocumentsList = ({
  data,
  path,
  category,
  locationState,
}: {
  data?: MissingDocumentResponse[]
  path: string
  category: string
  locationState?: { backUrl: string }
}) => {
  const navigate = useNavigate()

  return (
    <>
      <ListItemContainer className="mt-4">
        {data?.map((document) => {
          const uploadDocumentHref = `${path}/type/${document.documentType}`
          return (
            <ListItemLarge
              key={document.documentType}
              title={document.title}
              titleClassName="!font-semibold"
              subtitle={document.subtitle}
              href={uploadDocumentHref}
              hrefState={locationState}
              more={{
                type: document.connectionType ? "button" : "link",
                onClick: async () => {
                  await navigate(uploadDocumentHref, {
                    state: locationState,
                  })
                },
              }}
              eventTracker={{
                category,
                name: "documents-list-item",
                action: "click",
                customFields: {
                  documentType: document.documentType!,
                  connectionType: document.connectionType!,
                },
              }}
            />
          )
        })}
      </ListItemContainer>
    </>
  )
}

export default DocumentsList
