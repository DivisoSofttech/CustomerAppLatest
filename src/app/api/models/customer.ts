/* tslint:disable */
import { Address } from './address';
import { Contact } from './contact';
import { FavouriteProduct } from './favourite-product';
import { FavouriteStore } from './favourite-store';
import { Note } from './note';
export interface Customer {
  addresses?: Array<Address>;
  card?: string;
  contact?: Contact;
  curDebt?: number;
  customerUniqueId?: string;
  debtDate?: string;
  discount?: number;
  favouriteproducts?: Array<FavouriteProduct>;
  favouritestores?: Array<FavouriteStore>;
  id?: number;
  maxDebt?: number;
  name?: string;
  notes?: Array<Note>;
  photo?: string;
  photoContentType?: string;
  reference?: string;
  searchKey?: string;
  visible?: boolean;
}
