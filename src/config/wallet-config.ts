import {NETWORK_ID} from "./common-config";


export const walletConfig = getWalletConfig()

function getWalletConfig() {
  switch (NETWORK_ID) {
    case 'mainnet':
      return {
        appKeyPrefix: 'saika-mainnet',
        signInOptions: {
          contractId: 'saikaredpacket.near',
          methodNames: [],
          successUrl: "",
          failureUrl: ""
        }
      }

    case 'testnet':
      return {
        appKeyPrefix: 'saika-testnet',
        signInOptions: {
          contractId: 'saikaredpacket.testnet',
          methodNames: [],
          successUrl: "",
          failureUrl: ""
        }
      }

    default: throw new Error(`network id '${NETWORK_ID}' is invalid`);
  }
}