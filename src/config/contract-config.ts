import {NETWORK_ID} from "./common-config";

export function getRedPacketContractConfig() {
  const methods = {
    viewMethods: [
      'storage_balance_of',
      'get_pks_by_owner_id',
      'get_red_packets_by_owner_id',
      'get_red_packet_by_pk'
    ],
    changeMethods: [
      'create_near_red_packet',
      'claim_red_packet',
      'refund',
      'remove_history',
      'clear_history',
      'storage_deposit',
      'storage_withdraw',
      'storage_unregister'
    ]
  }

  switch (NETWORK_ID) {
    case 'mainnet':
      return {
        contractId: 'saikaredpacket.near',
        methods
      }

    case 'testnet':
      return {
        contractId: 'saikaredpacket.testnet',
        methods
      }

    default: throw new Error(`network id '${NETWORK_ID}' is invalid`)
  }
}