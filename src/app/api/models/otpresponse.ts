/* tslint:disable */
import { Message } from './message';
import { MessageRecipient } from './message-recipient';
export interface OTPResponse {
  balance?: number;
  batch_id?: number;
  cost?: number;
  custom?: string;
  message?: Message;
  messages?: Array<MessageRecipient>;
  num_messages?: number;
  receipt_url?: string;
  status?: string;
}
