/* tslint:disable */
import { Product } from './product';
import { Sort } from './sort';
export interface PageOfProduct {
  content?: Array<Product>;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  sort?: Sort;
  totalElements?: number;
  totalPages?: number;
}
