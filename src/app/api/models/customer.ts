/* tslint:disable */
import { Address } from './address';
import { Contact } from './contact';
import { FavouriteProduct } from './favourite-product';
import { FavouriteStore } from './favourite-store';
import { Note } from './note';
export interface Customer {
  id?: number;
  addresses?: Array<Address>;
  contact?: Contact;
  curDebt?: number;
  debtDate?: string;
  discount?: number;
  favouriteproducts?: Array<FavouriteProduct>;
  favouritestores?: Array<FavouriteStore>;
  card?: string;
  maxDebt?: number;
  name?: string;
  notes?: Array<Note>;
  photo?: string;
  photoContentType?: string;
  reference?: string;
  searchKey?: string;
  visible?: boolean;
}
