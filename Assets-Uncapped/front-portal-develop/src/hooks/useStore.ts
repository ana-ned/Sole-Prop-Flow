import { create } from "zustand"
import { OfferResponse, SelectOfferRequest } from "../services/api/agreements"

export type TOfferCustomizations = Record<string, SelectOfferRequest>

interface TOfferSelectedDeferredRepayment {
  deferredRepaymentPeriod: number
  deferredRepaymentAdditionalFee: number
}

interface TDocumentsReferer {
  origin: "TOPUP_REQUEST" | "DRAW_REQUEST"
  id?: string
}

interface Store {
  customNextOnboardingPath?: string
  setCustomNextOnboardingPath: (path?: string) => void
  offerCustomizations: TOfferCustomizations
  offerSelectedDeferredRepayment?: TOfferSelectedDeferredRepayment
  setOfferSelectedDeferredRepayment: (
    params?: TOfferSelectedDeferredRepayment
  ) => void
  setOfferCustomizations: (
    offer: OfferResponse,
    params: SelectOfferRequest
  ) => void
  lastOnboardingPath?: string
  setLastOnboardingPath: (path?: string) => void

  documentsReferer?: TDocumentsReferer
  setDocumentsReferer: (documenteReferer?: TDocumentsReferer) => void
}

const useStore = create<Store>((set) => ({
  setCustomNextOnboardingPath: (path?: string) => {
    set({ customNextOnboardingPath: path })
  },
  offerSelectedDefferedRepayment: undefined,
  setOfferSelectedDeferredRepayment: (
    params?: TOfferSelectedDeferredRepayment
  ) => {
    set({ offerSelectedDeferredRepayment: params })
  },
  offerCustomizations: {},
  setOfferCustomizations: (
    offer: OfferResponse,
    params: SelectOfferRequest
  ) => {
    set((state) => ({
      offerCustomizations: {
        ...state.offerCustomizations,
        [offer.id!]: params,
      },
    }))
  },

  setLastOnboardingPath: (path?: string) => {
    set({ lastOnboardingPath: path })
  },

  setDocumentsReferer: (documentsReferer?: TDocumentsReferer) => {
    set({ documentsReferer })
  },
}))

export default useStore
