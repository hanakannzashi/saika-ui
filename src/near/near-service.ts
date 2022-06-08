import {Near, keyStores, WalletConnection, Contract} from "near-api-js";
import {MultiActionWalletConnection} from "./multi-action-wallet";
import {RedPacketContract} from "./red-packet-contract";
import {getNearConfig} from "../config/near-config";
import {getRedPacketContractConfig} from "../config/contract-config";
import {getWalletConfig} from "../config/wallet-config";

const redPacketContractConfig = getRedPacketContractConfig();
const nearConfig = getNearConfig();
const walletConfig = getWalletConfig();

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
