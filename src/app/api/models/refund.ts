/* tslint:disable */
import { Amount } from './amount';
export interface Refund {
  amount?: Amount;
  create_time?: string;
  description?: string;
  id?: string;
  invoice_number?: string;
  parent_payment?: string;
  reason?: string;
  sale_id?: string;
  state?: string;
  update_time?: string;
}
