export const getAmazonShopId = (displayName?: string) => {
  const id = displayName?.split(" ").pop()

  if (!id) {
    return undefined
  }

  return id
}
