import {NETWORK_ID} from "./common-config";
import defaultTokenIcon from "../assets/default-token-icon.svg"
import nearIcon from "../assets/near-icon.svg"
import wnearIcon from "../assets/wnear-icon.png";

export const DEFAULT_TOKEN_ICON = defaultTokenIcon
export const DEFAULT_MAX_VIEW_FRAC_DIGITS = 5

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
        'usdn.testnet',
        'wrap.testnet',
        'stnear.fakes.testnet',
        'oct.fakes.testnet',
        'usdt.fakes.testnet',
        'dai.fakes.testnet'
      ]

    default: throw new Error(`network id '${NETWORK_ID}' is invalid` );
  }
}

function getMaxViewFracDigitsMapping() {
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

function getCustomTokenIconMapping() {
  switch (NETWORK_ID) {
    case 'mainnet':
      return {
        'wrap.near': wnearIcon
      }

    case 'testnet':
      return {
        'wrap.testnet': wnearIcon
      }

    default:
      throw new Error(`network id '${NETWORK_ID}' is invalid`);
  }
}
