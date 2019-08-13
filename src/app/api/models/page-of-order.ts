/* tslint:disable */
import { Order } from './order';
import { Sort } from './sort';
export interface PageOfOrder {
  content?: Array<Order>;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  sort?: Sort;
  totalElements?: number;
  totalPages?: number;
}
