/* tslint:disable */
import { UserRating } from './user-rating';
import { Sort } from './sort';
export interface PageOfUserRating {
  content?: Array<UserRating>;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  sort?: Sort;
  totalElements?: number;
  totalPages?: number;
}
