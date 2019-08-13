/* tslint:disable */
import { RatingReview } from './rating-review';
import { Sort } from './sort';
export interface PageOfRatingReview {
  content?: Array<RatingReview>;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  sort?: Sort;
  totalElements?: number;
  totalPages?: number;
}
