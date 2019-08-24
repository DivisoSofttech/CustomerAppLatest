/* tslint:disable */
import { OrderLine } from './order-line';
export interface AuxilaryOrderLine {
  id?: number;
  orderLine?: OrderLine;
  pricePerUnit?: number;
  productId?: number;
  quantity?: number;
  total?: number;
}
