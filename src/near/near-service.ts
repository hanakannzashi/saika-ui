import {Near, keyStores} from "near-api-js";
import {MultiActionWalletConnection} from "./multi-action-wallet";
import {RedPacketContract} from "./red-packet-contract";
import {nearConfig} from "../config/near-config";
import {redPacketContractConfig} from "../config/contract-config";
import {walletConfig} from "../config/wallet-config";


export interface NearService {
  keyStore: keyStores.BrowserLocalStorageKeyStore,
  near: Near,
  wallet: MultiActionWalletConnection,
  redPacketContract: RedPacketContract
}

export function initNearService(): NearService {
  const keyStore = new keyStores.BrowserLocalStorageKeyStore();
  const near = new Near({...nearConfig, keyStore});
  const wallet = new MultiActionWalletConnection(near, walletConfig.appKeyPrefix);
  const redPacketContract  = new RedPacketContract(
    wallet.account(),
    redPacketContractConfig.contractId,
    redPacketContractConfig.methods
  );
  return {keyStore ,near, wallet, redPacketContract};
}
