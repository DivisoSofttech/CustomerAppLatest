/* tslint:disable */
import { About } from './about';
import { Sort } from './sort';
export interface PageOfAbout {
  content?: Array<About>;
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
