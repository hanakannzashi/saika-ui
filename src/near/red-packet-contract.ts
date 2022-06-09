import {Contract} from "near-api-js";
import {ContractCallOptions} from "../types/near-types";
import {
  StorageBalanceOfArgs,
  StorageDepositArgs,
  StorageUnregisterArgs,
  StorageWithdrawArgs,
  StorageBalance
} from "../types/storage-management";


// just mark, no specific implementation
export class RedPacketContract extends Contract {
  // // ------------------------------------------ view methods ------------------------------------------

  // @ts-ignore
  async storage_balance_of(_args: StorageBalanceOfArgs): Promise<StorageBalance | null> {}
  // @ts-ignore
  async get_pks_by_owner_id(_args: GetPksByOwnerIdArgs): Promise<string[]> {}
  // @ts-ignore
  async get_red_packets_by_owner_id(_args: GetRedPacketsByOwnerIdArgs): Promise<RedPacketView[]> {}
  // @ts-ignore
  async get_red_packet_by_pk(_args: GetRedPacketByPkArgs): Promise<RedPacketView> {}


  // // ------------------------------------------ change methods -----------------------------------------

  // @ts-ignore
  async create_near_red_packet(_options: ContractCallOptions<CreateNearRedPacketArgs>): Promise<void> {}
  // @ts-ignore
  async claim_red_packet(_options: ContractCallOptions<ClaimRedPacketArgs>): Promise<string>{}
  // @ts-ignore
  async refund(_options: ContractCallOptions<RefundArgs>): Promise<string> {}
  // @ts-ignore
  async remove_history(_options: ContractCallOptions<RemoveHistoryArgs>): Promise<void> {}
  // @ts-ignore
  async clear_history(_options: ContractCallOptions<ClearHistoryArgs>): Promise<void> {}
  // @ts-ignore
  async storage_deposit(_options: ContractCallOptions<StorageDepositArgs>): Promise<StorageBalance> {}
  // @ts-ignore
  async storage_withdraw(_options: ContractCallOptions<StorageWithdrawArgs>): Promise<StorageBalance> {}
  // @ts-ignore
  async storage_unregister(_options: ContractCallOptions<StorageUnregisterArgs>): Promise<boolean> {}
}


export interface GetPksByOwnerIdArgs {
  account_id: string
}

export interface GetRedPacketsByOwnerIdArgs {
  owner_id: string
}

export interface GetRedPacketByPkArgs {
  public_key: string
}

export interface CreateNearRedPacketArgs {
  public_key: string,
  split: number,
  split_mod: string,
  msg?: string,
  white_list?: string[],
}

export interface ClaimRedPacketArgs {
  claimer_id: string
}

export interface RefundArgs {
  public_key: string
}

export interface RemoveHistoryArgs {
  public_key: string
}

export interface ClearHistoryArgs {}

export interface RedPacketView {
  public_key: string,
  token: string,
  token_id: string | null,
  owner_id: string,
  init_balance: string,
  current_balance: string,
  refunded_balance: string,
  init_split: number,
  current_split: number,
  split_mod: string,
  msg: string | null,
  white_list: string[] | null,
  claimers: Record<string, string>[],
  failed_claimers: Record<string, string>[],
  create_timestamp: string,
  run_out_timestamp: string | null,
  is_run_out: boolean
}