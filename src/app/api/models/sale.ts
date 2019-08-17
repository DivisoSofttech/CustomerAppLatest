/* tslint:disable */
import { Amount } from './amount';
export interface Sale {
  amount?: Amount;
  create_time?: string;
  id?: string;
  parent_payment?: string;
  payment_mode?: string;
  reasonCode?: string;
  receiptId?: string;
  state?: string;
  update_time?: string;
}
