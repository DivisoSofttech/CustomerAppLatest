/* tslint:disable */
import { AuxilaryOrderLine } from './auxilary-order-line';
import { Sort } from './sort';
export interface PageOfAuxilaryOrderLine {
  content?: Array<AuxilaryOrderLine>;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  sort?: Sort;
  totalElements?: number;
  totalPages?: number;
}
