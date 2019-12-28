/* tslint:disable */
import { Store } from './store';
export interface Banner {
  cost?: number;
  expiryDate?: string;
  file?: string;
  fileContentType?: string;
  id?: number;
  imageLink?: string;
  startDate?: string;
  store?: Store;
  storeId?: string;
}
