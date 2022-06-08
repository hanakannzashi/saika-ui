import {ContractMethods} from "near-api-js/lib/contract";
import {ContractCallOptions} from "../types/near-types";
import {
  FtBalanceOfArgs, FtMetaDataArgs,
  FtTotalSupplyArgs, FtTransferArgs,
  FtTransferCallArgs,
  FungibleTokenContract, FungibleTokenMetadata
} from "../near/fungible-token-contract";
import {Account} from "near-api-js";
import {
  StorageBalance, StorageBalanceBounds,
  StorageBalanceBoundsArgs,
  StorageDepositArgs,
  StorageUnregisterArgs,
  StorageWithdrawArgs
} from "../types/storage-management";

export class FungibleTokenUtils {

  static fungibleTokenContractMethods: ContractMethods = {
    viewMethods: [
      'ft_balance_of',
      'ft_total_supply',
      'ft_metadata',
      'storage_balance_of'
    ],
    changeMethods: [
      'ft_transfer',
      'ft_transfer_call',
      'storage_deposit',
      'storage_withdraw',
      'storage_unregister'
    ]
  }

  static ftBalanceOf(
    account: Account,
    tokenId: string,
    args: FtBalanceOfArgs
  ): Promise<string> {
    return new FungibleTokenContract(
      account,
      tokenId,
      FungibleTokenUtils.fungibleTokenContractMethods
    ).ft_balance_of(args)
  }

  static ftTotalSupply(
    account: Account,
    tokenId: string,
    args: FtTotalSupplyArgs
  ): Promise<string> {
    return new FungibleTokenContract(
      account,
      tokenId,
      FungibleTokenUtils.fungibleTokenContractMethods
    ).ft_total_supply(args)
  }

  static ftMetadata(
    account: Account,
    tokenId: string,
    args: FtMetaDataArgs
  ): Promise<FungibleTokenMetadata> {
    return new FungibleTokenContract(
      account,
      tokenId,
      FungibleTokenUtils.fungibleTokenContractMethods
    ).ft_metadata(args)
  }

  static ftTransfer(
    account: Account,
    tokenId: string,
    options: ContractCallOptions<FtTransferArgs>
  ): Promise<void> {
    return new FungibleTokenContract(
      account,
      tokenId,
      FungibleTokenUtils.fungibleTokenContractMethods
    ).ft_transfer(options)
  }

  static ftTransferCall(
    account: Account,
    tokenId: string,
    options: ContractCallOptions<FtTransferCallArgs>
  ): Promise<string> {
    return new FungibleTokenContract(
      account,
      tokenId,
      FungibleTokenUtils.fungibleTokenContractMethods
    ).ft_transfer_call(options)
  }

  static storageBalanceOf(
    account: Account,
    tokenId: string,
    args: FtBalanceOfArgs
  ): Promise<StorageBalance | null> {
    return new FungibleTokenContract(
      account,
      tokenId,
      FungibleTokenUtils.fungibleTokenContractMethods
    ).storage_balance_of(args)
  }

  static storageBalanceBounds(
    account: Account,
    tokenId: string,
    args: StorageBalanceBoundsArgs
  ): Promise<StorageBalanceBounds> {
    return new FungibleTokenContract(
      account,
      tokenId,
      FungibleTokenUtils.fungibleTokenContractMethods
    ).storage_balance_bounds(args)
  }

  static storageDeposit(
    account: Account,
    tokenId: string,
    options: ContractCallOptions<StorageDepositArgs>
  ): Promise<StorageBalance> {
    return new FungibleTokenContract(
      account,
      tokenId,
      FungibleTokenUtils.fungibleTokenContractMethods
    ).storage_deposit(options)
  }

  static storageWithdraw(
    account: Account,
    tokenId: string,
    options: ContractCallOptions<StorageWithdrawArgs>
  ): Promise<StorageBalance> {
    return new FungibleTokenContract(
      account,
      tokenId,
      FungibleTokenUtils.fungibleTokenContractMethods
    ).storage_withdraw(options)
  }

  static storageUnregister(
    account: Account,
    tokenId: string,
    options: ContractCallOptions<StorageUnregisterArgs>
  ): Promise<boolean> {
    return new FungibleTokenContract(
      account,
      tokenId,
      FungibleTokenUtils.fungibleTokenContractMethods
    ).storage_unregister(options)
  }
}
