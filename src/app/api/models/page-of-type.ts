/* tslint:disable */
import { Type } from './type';
import { Sort } from './sort';
export interface PageOfType {
  content?: Array<Type>;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  sort?: Sort;
  totalElements?: number;
  totalPages?: number;
}
