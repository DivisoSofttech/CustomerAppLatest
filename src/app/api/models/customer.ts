/* tslint:disable */
import { Address } from './address';
import { Contact } from './contact';
import { Note } from './note';
export interface Customer {
  addresses?: Array<Address>;
  card?: string;
  contact?: Contact;
  curDebt?: number;
  debtDate?: string;
  discount?: number;
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
