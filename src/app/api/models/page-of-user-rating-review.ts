/* tslint:disable */
import { UserRatingReview } from './user-rating-review';
import { Sort } from './sort';
export interface PageOfUserRatingReview {
  content?: Array<UserRatingReview>;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  sort?: Sort;
  totalElements?: number;
  totalPages?: number;
}
