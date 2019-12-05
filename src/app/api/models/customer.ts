/* tslint:disable */
import { Contact } from './contact';
import { FavouriteProduct } from './favourite-product';
import { FavouriteStore } from './favourite-store';
export interface Customer {
  contact?: Contact;
  customerUniqueId?: string;
  favouriteproducts?: Array<FavouriteProduct>;
  favouritestores?: Array<FavouriteStore>;
  id?: number;
  idpCode?: string;
  idpSub?: string;
  image?: string;
  imageContentType?: string;
  imageLink?: string;
  name?: string;
}
