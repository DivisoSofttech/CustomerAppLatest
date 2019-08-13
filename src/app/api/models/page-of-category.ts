/* tslint:disable */
import { Category } from './category';
import { Sort } from './sort';
export interface PageOfCategory {
  content?: Array<Category>;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  sort?: Sort;
  totalElements?: number;
  totalPages?: number;
}
