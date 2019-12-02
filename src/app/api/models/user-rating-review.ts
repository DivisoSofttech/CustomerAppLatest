/* tslint:disable */
import { Reply } from './reply';
import { Store } from './store';
export interface UserRatingReview {
  date?: string;
  id?: number;
  rating?: number;
  replies?: Array<Reply>;
  review?: string;
  store?: Store;
  userName?: string;
}
