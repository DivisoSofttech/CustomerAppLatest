/* tslint:disable */
import { Review } from './review';
export interface Reply {
  id?: number;
  repliedDate?: string;
  reply?: string;
  review?: Review;
  userName?: string;
}
