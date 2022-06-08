import {Contract} from "near-api-js";
import {
  Amount,
  ContractCallOptions
} from "../types/near-types";
import {
  StorageBalanceBoundsArgs,
  StorageBalanceOfArgs,
  StorageDepositArgs,
  StorageUnregisterArgs,
  StorageWithdrawArgs,
  StorageBalance,
  StorageBalanceBounds
} from "../types/storage-management";


// just mark, no specific implementation
export class FungibleTokenContract extends Contract {
  // // ------------------------------------------ view methods ------------------------------------------

  // @ts-ignore
  async ft_balance_of(_args: FtBalanceOfArgs): Promise<string> {}
  // @ts-ignore
  async ft_total_supply(_args: FtTotalSupplyArgs): Promise<string> {}
  // @ts-ignore
  async ft_metadata(_args: FtMetaDataArgs): Promise<FungibleTokenMetadata> {}
  // @ts-ignore
  async storage_balance_of(_args: StorageBalanceOfArgs): Promise<StorageBalance | null> {}
  // @ts-ignore
  async storage_balance_bounds(_args: StorageBalanceBoundsArgs): Promise<StorageBalanceBounds> {}

  // // ------------------------------------------ change methods -----------------------------------------

  // @ts-ignore
  async ft_transfer(_options: ContractCallOptions<FtTransferArgs>): Promise<void> {}
  // @ts-ignore
  async ft_transfer_call(_options: ContractCallOptions<FtTransferCallArgs>): Promise<string> {}
  // @ts-ignore
  async storage_deposit(_options: ContractCallOptions<StorageDepositArgs>): Promise<StorageBalance> {}
  // @ts-ignore
  async storage_withdraw(_options: ContractCallOptions<StorageWithdrawArgs>): Promise<StorageBalance> {}
  // @ts-ignore
  async storage_unregister(_options: ContractCallOptions<StorageUnregisterArgs>): Promise<boolean> {}
}

export interface FtBalanceOfArgs {
  account_id: string
}

export interface FtTotalSupplyArgs {}

export interface FtMetaDataArgs {}

export interface FtTransferArgs {
  receiver_id: string,
  amount: Amount,
  memo?: string
}

export interface FtTransferCallArgs extends FtTransferArgs {
  msg: string
}

export interface FungibleTokenMetadata {
  spec: string,
  name: string,
  symbol: string,
  icon?: string,
  decimals: number,
  reference: string | null,
  reference_hash: string| null
}