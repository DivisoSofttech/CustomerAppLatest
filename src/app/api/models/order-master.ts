/* tslint:disable */
import { OrderLine } from './order-line';
export interface OrderMaster {
  orderAcceptedAt?: string;
  addressType?: string;
  city?: string;
  customerId?: string;
  customersOrder?: number;
  deliveryCharge?: number;
  dueDate?: string;
  dueTime?: string;
  houseNoOrBuildingName?: string;
  landmark?: string;
  methodOfOrder?: string;
  name?: string;
  notes?: string;
  alternatePhone?: number;
  orderFromCustomer?: number;
  orderLines?: Array<OrderLine>;
  orderNumber?: string;
  orderPlaceAt?: string;
  orderStatus?: string;
  phone?: number;
  pincode?: number;
  roadNameAreaOrStreet?: string;
  serviceCharge?: number;
  state?: string;
  storeName?: string;
  storePhone?: number;
  totalDue?: number;
}
