/* tslint:disable */
import { Product } from './product';
export interface AuxilaryLineItem {
  auxilaryItem?: Product;
  description?: string;
  id?: number;
  product?: Product;
  quantity?: number;
}
