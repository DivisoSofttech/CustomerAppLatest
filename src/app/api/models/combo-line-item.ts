/* tslint:disable */
import { Product } from './product';
export interface ComboLineItem {
  comboItem?: Product;
  description?: string;
  id?: number;
  product?: Product;
  quantity?: number;
}
