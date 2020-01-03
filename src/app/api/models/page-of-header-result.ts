/* tslint:disable */
import { HeaderResult } from './header-result';
import { Sort } from './sort';
export interface PageOfHeaderResult {
  content?: Array<HeaderResult>;
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
