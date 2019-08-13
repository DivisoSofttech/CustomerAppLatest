/* tslint:disable */
import { Reply } from './reply';
import { Store } from './store';
export interface Review {
  id?: number;
  replies?: Array<Reply>;
  review?: string;
  reviewedDate?: string;
  store?: Store;
  userName?: string;
}
