/* tslint:disable */
import { Address } from './address';
import { Contact } from './contact';
import { Note } from './note';
export interface Customer {
  maxDebt?: number;
  addresses?: Array<Address>;
  contact?: Contact;
  curDebt?: number;
  debtDate?: string;
  discount?: number;
  id?: number;
  card?: string;
  name?: string;
  notes?: Array<Note>;
  photo?: string;
  photoContentType?: string;
  reference?: string;
  searchKey?: string;
  visible?: boolean;
}
