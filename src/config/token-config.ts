import {NETWORK_ID} from "./common-config";
import {TokenMetadata} from "../types/near-types";
import defaultTokenIcon from "../assets/default-token-icon.svg"
import nearIcon from "../assets/near-icon.svg"

export const DEFAULT_TOKEN_ICON = defaultTokenIcon
export const DEFAULT_MAX_VIEW_FRAC_DIGITS = 4

export const nearMetaData: TokenMetadata = {
  id: 'NEAR',
  name: 'NEAR Protocol',
  symbol: 'NEAR',
  icon: nearIcon,
  decimals: 24
}

export function getTokenIdList():string[] {
  switch (NETWORK_ID) {
    case 'mainnet':
      return [
        'NEAR',
        'wrap.near'
      ]

    case 'testnet':
      return [
        'NEAR',
        'wrap.testnet',
        'oct.fakes.testnet',
        'dai.fakes.testnet'
      ]

    default: throw new Error(`network id '${NETWORK_ID}' is invalid` );
  }
}

export function getMaxViewFracDigitsMapping() {
  switch (NETWORK_ID) {
    case 'mainnet':
      return {

      }

    case 'testnet':
      return {

      }

    default:
      throw new Error(`network id '${NETWORK_ID}' is invalid`);
  }
}

export function getMaxViewFracDigits(tokenId: string) {
  return getMaxViewFracDigitsMapping()[tokenId] ?? DEFAULT_MAX_VIEW_FRAC_DIGITS
}