/* tslint:disable */
import { Product } from './product';
export interface StockCurrent {
  iDPcode?: string;
  id?: number;
  notes?: string;
  product?: Product;
  quantity?: number;
  sellPrice?: number;
}
