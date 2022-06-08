import {parseYoctoAmount} from "../utils/amount-utils";

export const NETWORK_ID: string = process.env.REACT_APP_NETWORK_ID!
console.log(`current network: '${NETWORK_ID}'`)

export const MAX_RED_PACKET_NUM = 100
export const RED_PACKET_CONTRACT_STORAGE_DEPOSIT = parseYoctoAmount('0.1')

export const RED_PACKET_PK_PREFIX = 'red-packet-pk:'
export const RED_PACKET_CONTRACT_REGISTERED_FLAG_PREFIX = 'red-packet-contract-registered:'
export const TOKEN_REGISTERED_FLAG_PREFIX = 'token-registered:'
export const TOKEN_METADATA_LIST_PREFIX = 'token-metadata:'