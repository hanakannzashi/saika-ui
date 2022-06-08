import {ConnectedWalletAccount, WalletConnection} from 'near-api-js';
import { Action} from 'near-api-js/lib/transaction';
import {FinalExecutionOutcome} from "near-api-js/lib/providers";


export class MultiActionWalletConnection extends WalletConnection {
  account(): ConnectedMultiActionWalletAccount {
    if (!this._connectedAccount) {
      this._connectedAccount = new ConnectedMultiActionWalletAccount(this, this._near.connection, this._authData.accountId);
    }
    return this._connectedAccount as ConnectedMultiActionWalletAccount;
  }
}

class ConnectedMultiActionWalletAccount extends ConnectedWalletAccount {
  async signAndSendTransactionWithMultiAction(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome> {
    return this.signAndSendTransaction(receiverId, actions);
  }
}
