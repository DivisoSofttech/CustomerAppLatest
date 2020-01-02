/* tslint:disable */
import { Store } from './store';
export interface Banner {
  cost?: number;
  expiryDate?: string;
  id?: number;
  imageLink?: string;
  startDate?: string;
  store?: Store;
  storeId?: string;
}
