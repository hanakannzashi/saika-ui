import {NETWORK_ID} from "./common-config";
import defaultTokenIcon from "../assets/default-token-icon.svg"
import nearIcon from "../assets/near-icon.svg"

export const DEFAULT_TOKEN_ICON = defaultTokenIcon
export const DEFAULT_MAX_VIEW_FRAC_DIGITS = 4

export const nearMetaData = {
  id: 'NEAR',
  name: 'NEAR Protocol',
  symbol: 'NEAR',
  icon: nearIcon,
  decimals: 24
}

export const tokenIdList = getTokenIdList()
export const maxViewFracDigitsMapping = getMaxViewFracDigitsMapping()
export const customTokenIconMapping = getCustomTokenIconMapping()

function getTokenIdList() {
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

function getMaxViewFracDigitsMapping() {
  switch (NETWORK_ID) {
    case 'mainnet':
      return {
        'NEAR': 2
      }

    case 'testnet':
      return {
        'NEAR': 2
      }

    default:
      throw new Error(`network id '${NETWORK_ID}' is invalid`);
  }
}

function getCustomTokenIconMapping() {
  switch (NETWORK_ID) {
    case 'mainnet':
      return {
        'wrap.near': 'https://i.postimg.cc/4xx2KRxt/wNEAR.png'
      }

    case 'testnet':
      return {
        'wrap.testnet': 'https://i.postimg.cc/4xx2KRxt/wNEAR.png'
      }

    default:
      throw new Error(`network id '${NETWORK_ID}' is invalid`);
  }
}
