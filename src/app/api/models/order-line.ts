/* tslint:disable */
import { Order } from './order';
import { AuxilaryOrderLine } from './auxilary-order-line';
export interface OrderLine {
  id?: number;
  pricePerUnit?: number;
  productId?: number;
  quantity?: number;
  requiedAuxilaries?: Array<AuxilaryOrderLine>;
  total?: number;
}
