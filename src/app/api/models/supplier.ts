/* tslint:disable */
import { Address } from './address';
import { Contact } from './contact';
export interface Supplier {
  address?: Address;
  companyName?: string;
  contact?: Contact;
  creditLimit?: number;
  currentDebt?: number;
  debtDate?: string;
  iDPcode?: string;
  id?: number;
  idpcode?: string;
  visible?: boolean;
}
