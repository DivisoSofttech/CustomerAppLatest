/* tslint:disable */
import { Address } from './address';
import { Sort } from './sort';
export interface PageOfAddress {
  content?: Array<Address>;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  sort?: Sort;
  totalElements?: number;
  totalPages?: number;
}
