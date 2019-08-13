/* tslint:disable */
import { Address } from './address';
import { Store } from './store';
import { Type } from './type';
export interface DeliveryInfo {
  deliveryAddress?: Address;
  deliveryCharge?: number;
  deliveryType?: string;
  endTime?: string;
  expectedDelivery?: string;
  id?: number;
  startingTime?: string;
  store?: Store;
  type?: Type;
}
