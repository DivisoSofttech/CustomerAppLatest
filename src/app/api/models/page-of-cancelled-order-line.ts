/* tslint:disable */
import { CancelledOrderLine } from './cancelled-order-line';
import { Sort } from './sort';
export interface PageOfCancelledOrderLine {
  content?: Array<CancelledOrderLine>;
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
