const partnerApplicationQueryKeys = {
  all: () => ["partners-applications"] as const,
  detail: (id?: string) =>
    [...partnerApplicationQueryKeys.all(), "detail", id] as const,
  company: (id?: string) =>
    [...partnerApplicationQueryKeys.all(), "company", id] as const,
}

export default partnerApplicationQueryKeys
