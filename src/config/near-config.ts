import {NETWORK_ID} from "./common-config";

export const nearConfig = getNearConfig()

function getNearConfig() {
  switch (NETWORK_ID) {
    case 'mainnet':
      return {
        headers: {},
        networkId: 'mainnet',
        nodeUrl: 'https://public-rpc.blockpi.io/http/near',
        walletUrl: 'https://wallet.mainnet.near.org',
        helperUrl: 'https://helper.mainnet.near.org'
      };

    case 'testnet':
      return {
        headers: {},
        networkId: 'testnet',
        nodeUrl: 'https://public-rpc.blockpi.io/http/near-testnet',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
      };

    default: throw new Error(`network id '${NETWORK_ID}' is invalid`);
  }
}
