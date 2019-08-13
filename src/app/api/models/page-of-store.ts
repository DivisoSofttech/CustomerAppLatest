/* tslint:disable */
import { Store } from './store';
import { Sort } from './sort';
export interface PageOfStore {
  content?: Array<Store>;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  sort?: Sort;
  totalElements?: number;
  totalPages?: number;
}
