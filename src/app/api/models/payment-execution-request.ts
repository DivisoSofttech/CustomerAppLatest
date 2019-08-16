/* tslint:disable */
import { Transaction } from './transaction';
export interface PaymentExecutionRequest {
  payer_id?: string;
  transactions?: Array<Transaction>;
}
