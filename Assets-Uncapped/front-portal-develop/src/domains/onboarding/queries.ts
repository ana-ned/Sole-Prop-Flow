import { OfferResponse } from "../../services/api/agreements"

export const documentQueryKeys = {
  _: ["organisation-users-documents-"] as const,
  required: () => [...documentQueryKeys._, "required"] as const,
  uploaded: (type: string) =>
    [...documentQueryKeys._, "uploaded", type] as const,
  v2: () => [...documentQueryKeys._, "v2"] as const,
}

export const signingQueryKeys = {
  _: ["ageemeents-signing-"] as const,
  status: (offer?: OfferResponse) =>
    [...documentQueryKeys._, "status", offer?.id] as const,
}
