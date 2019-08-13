/* tslint:disable */
import { Tax } from './tax';
export interface TaxCategory {
  description?: string;
  iDPcode?: string;
  id?: number;
  idpcode?: string;
  name?: string;
  taxes?: Array<Tax>;
}
