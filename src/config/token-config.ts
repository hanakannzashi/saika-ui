import {NETWORK_ID} from "./common-config";
import defaultTokenIcon from "../assets/default-token-icon.svg"
import nearIcon from "../assets/near-icon.svg"
import wnearIcon from "../assets/wnear-icon.png";
import wethIcon from "../assets/weth-icon.png";

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
        'wrap.near',
        'usn',
        'f5cfbc74057c610c8ef151a439252680ac68c6dc.factory.bridge.near',
        'aaaaaa20d9e0e2461697782ef11675f668207961.factory.bridge.near',
        'token.v2.ref-finance.near',
        'token.paras.near',
        'token.skyward.near',
        'meta-pool.near',
        'linear-protocol.near',
        'aurora',
        'c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.factory.bridge.near',
        '2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near',
        'dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near',
        'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near',
        '6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near'
      ]

    case 'testnet':
      return [
        'NEAR',
        'wrap.testnet',
        'usdn.testnet',
        'oct.fakes.testnet',
        'aurora.fakes.testnet',
        'ref.fakes.testnet',
        'paras.fakes.testnet',
        'skyward.fakes.testnet',
        'stnear.fakes.testnet',
        'linear-protocol.testnet',
        'aurora',
        'weth.fakes.testnet',
        'wbtc.fakes.testnet',
        'usdt.fakes.testnet',
        'usdc.fakes.testnet',
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
        'wrap.near': wnearIcon,
        'c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.factory.bridge.near': wethIcon
      }

    case 'testnet':
      return {
        'wrap.testnet': wnearIcon,
        'weth.fakes.testnet': wethIcon
      }

    default:
      throw new Error(`network id '${NETWORK_ID}' is invalid`);
  }
}
