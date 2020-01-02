/* tslint:disable */
import { Banner } from './banner';
import { DeliveryInfo } from './delivery-info';
import { PreOrderSettings } from './pre-order-settings';
import { StoreAddress } from './store-address';
import { StoreSettings } from './store-settings';
import { StoreType } from './store-type';
import { UserRatingReview } from './user-rating-review';
export interface Store {
  banners?: Array<Banner>;
  closingTime?: string;
  contactNo?: number;
  deliveryInfos?: Array<DeliveryInfo>;
  email?: string;
  id?: number;
  imageLink?: string;
  info?: string;
  location?: string;
  locationName?: string;
  maxDeliveryTime?: string;
  minAmount?: number;
  name?: string;
  openingTime?: string;
  preOrderSettings?: PreOrderSettings;
  regNo?: string;
  storeAddress?: StoreAddress;
  storeSettings?: StoreSettings;
  storeTypes?: Array<StoreType>;
  storeUniqueId?: string;
  totalRating?: number;
  userRatingReviews?: Array<UserRatingReview>;
}
