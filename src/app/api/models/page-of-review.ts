/* tslint:disable */
import { Review } from './review';
import { Sort } from './sort';
export interface PageOfReview {
  content?: Array<Review>;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  sort?: Sort;
  totalElements?: number;
  totalPages?: number;
}
