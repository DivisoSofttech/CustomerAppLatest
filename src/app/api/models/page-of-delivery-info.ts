/* tslint:disable */
import { DeliveryInfo } from './delivery-info';
import { Sort } from './sort';
export interface PageOfDeliveryInfo {
  content?: Array<DeliveryInfo>;
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
