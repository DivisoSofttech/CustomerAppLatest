/* tslint:disable */
import { Customer } from './customer';
export interface Address {
  houseNoOrBuildingName?: string;
  addressLine1?: string;
  addressType?: string;
  alternatePhone?: number;
  city?: string;
  cityOrTown?: string;
  country?: string;
  customer?: Customer;
  customerId?: string;
  addressLine2?: string;
  id?: number;
  landmark?: string;
  name?: string;
  phone?: number;
  pincode?: number;
  postCode?: string;
  roadNameAreaOrStreet?: string;
  state?: string;
  zipcode?: string;
}
