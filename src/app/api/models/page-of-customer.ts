/* tslint:disable */
import { Customer } from './customer';
import { Sort } from './sort';
export interface PageOfCustomer {
  content?: Array<Customer>;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  sort?: Sort;
  totalElements?: number;
  totalPages?: number;
}
