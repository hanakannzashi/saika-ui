import create, {SetState} from "zustand";
import {NearService} from "../near/near-service";


interface NearServiceStore {
  nearService: NearService | null,
  setNearService: (nearService: NearService) => void
}

export const useNearServiceStore = create((set: SetState<NearServiceStore>): NearServiceStore => {
  return {
    nearService: null,
    setNearService: (nearService): void => {
      set({nearService})
    }
  }
})

interface WalletSignedInStore {
  isSignedIn: boolean
  setWalletSignedIn: (isSigned: boolean) => void
}

export const useWalletSignedInStore = create((set: SetState<WalletSignedInStore>): WalletSignedInStore => {
  return {
    isSignedIn: false,
    setWalletSignedIn: (isSignedIn: boolean) => {
      set({isSignedIn})
    }
  }
})

