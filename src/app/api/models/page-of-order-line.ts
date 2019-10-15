/* tslint:disable */
import { OrderLine } from './order-line';
import { Sort } from './sort';
export interface PageOfOrderLine {
  content?: Array<OrderLine>;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  sort?: Sort;
  totalElements?: number;
  totalPages?: number;
}
