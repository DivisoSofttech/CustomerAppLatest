/* tslint:disable */
import { StockCurrent } from './stock-current';
import { Sort } from './sort';
export interface PageOfStockCurrent {
  content?: Array<StockCurrent>;
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
