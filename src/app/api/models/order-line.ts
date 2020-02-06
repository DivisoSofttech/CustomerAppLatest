/* tslint:disable */
import { AuxilaryOrderLine } from './auxilary-order-line';
export interface OrderLine {
  id?: number;
  pricePerUnit?: number;
  productId?: number;
  quantity?: number;
  requiedAuxilaries?: Array<AuxilaryOrderLine>;
  state?: string;
  total?: number;
}
