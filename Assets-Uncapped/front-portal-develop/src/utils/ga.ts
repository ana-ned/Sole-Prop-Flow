export const getClientId = (): string | undefined => {
  if (
    globalThis.ga &&
    typeof globalThis.ga === "function" &&
    typeof globalThis.ga.getAll === "function"
  ) {
    return globalThis.ga
      .getAll()
      ?.map((tracker: any) => tracker.get("clientId"))
      .find((it: any) => it !== undefined)
  }
  return undefined
}
