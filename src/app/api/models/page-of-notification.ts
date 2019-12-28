/* tslint:disable */
import { Notification } from './notification';
import { Sort } from './sort';
export interface PageOfNotification {
  content?: Array<Notification>;
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
