/* tslint:disable */
import { Term } from './term';
import { Sort } from './sort';
export interface PageOfTerm {
  content?: Array<Term>;
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
