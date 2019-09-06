/* tslint:disable */
import { Banner } from './banner';
import { DeliveryInfo } from './delivery-info';
import { Propreitor } from './propreitor';
import { Review } from './review';
import { StoreAddress } from './store-address';
import { StoreSettings } from './store-settings';
import { StoreType } from './store-type';
import { UserRating } from './user-rating';
export interface Store {
  banners?: Array<Banner>;
  closingTime?: string;
  contactNo?: number;
  deliveryInfos?: Array<DeliveryInfo>;
  email?: string;
  id?: number;
  image?: string;
  imageContentType?: string;
  info?: string;
  location?: string;
  locationName?: string;
  maxDeliveryTime?: string;
  minAmount?: number;
  name?: string;
  openingTime?: string;
  propreitor?: Propreitor;
  regNo?: string;
  reviews?: Array<Review>;
  storeAddress?: StoreAddress;
  storeSettings?: StoreSettings;
  storeTypes?: Array<StoreType>;
  totalRating?: number;
  userRatings?: Array<UserRating>;
}
