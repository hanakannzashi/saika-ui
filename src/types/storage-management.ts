import {Amount} from "./near-types";


export interface StorageDepositArgs {
  account_id?: string,
  registration_only?: boolean
}

export interface StorageWithdrawArgs {
  amount?: Amount
}

export interface StorageUnregisterArgs {
  force?: boolean
}

export interface StorageBalanceBoundsArgs {}

export interface StorageBalanceOfArgs {
  account_id: string
}

export interface StorageBalance {
  total: string,
  available: string
}

export interface StorageBalanceBounds {
  min: string,
  max: string | null
}