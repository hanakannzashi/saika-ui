import BN from "bn.js";
import {trimLeadingZeros, trimZeros} from "./common-utils";
import {Amount, YoctoAmount} from "../types/near-types";

export const NO_DEPOSIT: YoctoAmount = new BN('0')
export const ONE_YOCTO: YoctoAmount = new BN('1')
export const ONE_NEAR: YoctoAmount = parseYoctoAmount('1')


export function formatYoctoAmount(amount: YoctoAmount, maxFracDigits: number = 24): string {
  return formatAmount(amount.toString(), 24, maxFracDigits)
}

export function parseYoctoAmount(readable: string): YoctoAmount {
  return new BN(parseAmount(readable, 24))
}

export function formatAmount(amount: Amount, decimals: number, maxFracDigits: number = decimals): string {
  if (amount.length <= decimals) {
    amount = '0'.repeat(decimals + 1 - amount.length) + amount
  }
  const readable = amount.substring(0, amount.length - decimals) + '.' +
    amount.substring(amount.length - decimals, amount.length - decimals + maxFracDigits)
  return trimZeros(readable)
}

export function parseAmount(readable: string, decimals: number): Amount {
  if (readable.indexOf('.') === -1) {
    readable = readable + '.'
  }
  if (readable.length - 1 - readable.indexOf('.') < decimals) {
    readable = readable + '0'.repeat(decimals - (readable.length - 1 - readable.indexOf('.')))
  }
  const amount = readable.substring(0, readable.indexOf('.')) +
    readable.substring(readable.indexOf('.') + 1, readable.indexOf('.') + 1 + decimals)
  return trimLeadingZeros(amount)
}
