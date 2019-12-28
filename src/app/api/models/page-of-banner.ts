/* tslint:disable */
import { Banner } from './banner';
import { Sort } from './sort';
export interface PageOfBanner {
  content?: Array<Banner>;
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
