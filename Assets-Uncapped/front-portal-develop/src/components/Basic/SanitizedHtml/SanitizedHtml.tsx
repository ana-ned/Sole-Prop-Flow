import React from "react"
import { sanitize } from "dompurify"

const SanitizedHtml = ({
  as: CustomTag,
  content,
  className = "",
}: {
  as: React.ElementType
  content: string
  className?: string
}) => {
  return (
    <CustomTag
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitize(content) }}
    />
  )
}

export default SanitizedHtml
