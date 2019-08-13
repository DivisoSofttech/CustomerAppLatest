/* tslint:disable */
import { TaxCategory } from './tax-category';
export interface Tax {
  description?: string;
  id?: number;
  name?: string;
  rate?: number;
  taxCategory?: TaxCategory;
}
