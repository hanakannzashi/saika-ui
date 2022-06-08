import BN from "bn.js";


export function tGas(t: number) {
  const ONE_T_GAS = new BN('1000000000000')
  return ONE_T_GAS.muln(t)
}