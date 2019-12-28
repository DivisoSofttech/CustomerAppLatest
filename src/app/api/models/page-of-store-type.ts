/* tslint:disable */
import { StoreType } from './store-type';
import { Sort } from './sort';
export interface PageOfStoreType {
  content?: Array<StoreType>;
  empty?: boolean;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  sort?: Sort;
  totalElements?: number;
  totalPages?: number;
}
