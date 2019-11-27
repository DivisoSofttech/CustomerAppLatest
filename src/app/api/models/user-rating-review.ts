/* tslint:disable */
import { Store } from './store';
export interface UserRatingReview {
  date?: string;
  id?: number;
  rating?: number;
  review?: string;
  store?: Store;
  userName?: string;
}
