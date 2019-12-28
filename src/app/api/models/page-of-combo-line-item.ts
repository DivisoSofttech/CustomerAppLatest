/* tslint:disable */
import { ComboLineItem } from './combo-line-item';
import { Sort } from './sort';
export interface PageOfComboLineItem {
  content?: Array<ComboLineItem>;
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
