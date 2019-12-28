/* tslint:disable */
import { AuxilaryLineItem } from './auxilary-line-item';
import { Sort } from './sort';
export interface PageOfAuxilaryLineItem {
  content?: Array<AuxilaryLineItem>;
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
