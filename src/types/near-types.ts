import BN from "bn.js";

export type YoctoAmount = BN    // amount used for yocto NEAR
export type Amount = string     // amount used for function call args

export type Gas = BN

export interface ContractCallOptions<Args> {
    args: Args,
    amount?: YoctoAmount,
    gas?: Gas
}

export interface TokenMetadata {
  id: string,
  name: string,
  symbol: string,
  icon?: string,
  decimals: number,
}

export type RedPacketType = 'Average' | 'Random'