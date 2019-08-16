/* tslint:disable */
import { Payer } from './payer';
import { Link } from './link';
import { Transaction } from './transaction';
export interface PaymentInitiateRequest {
  id?: string;
  intent?: string;
  note_to_payer?: string;
  payer?: Payer;
  redirect_urls?: Link;
  state?: string;
  transactions?: Array<Transaction>;
}
