/* tslint:disable */
import { Review } from './review';
import { UserRatingReview } from './user-rating-review';
export interface Reply {
  id?: number;
  repliedDate?: string;
  reply?: string;
  review?: Review;
  userName?: string;
  userRatingReview?: UserRatingReview;
}
