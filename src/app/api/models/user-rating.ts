/* tslint:disable */
import { Store } from './store';
export interface UserRating {
  id?: number;
  ratedOn?: string;
  rating?: number;
  store?: Store;
  userName?: string;
}
